// ============================================================
// MIGRATION MODAL - Migrer domaine ovh.org
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { generalService } from "../GeneralTab";

interface MigrationModalProps {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function MigrationModal({ serviceName, isOpen, onClose, onSuccess }: MigrationModalProps) {
  const { t } = useTranslation("web-cloud/hosting/modals/migration");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hostings, setHostings] = useState<string[]>([]);
  const [destination, setDestination] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const loadHostings = async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await generalService.listHostings();
        // Exclure l'hébergement actuel
        const filtered = list.filter(h => h !== serviceName);
        setHostings(filtered);
        if (filtered.length > 0) {
          setDestination(filtered[0]);
        }
      } catch (err) {
        console.error("[MigrationModal] Error:", err);
        setError(t("loadError"));
      } finally {
        setLoading(false);
      }
    };
    loadHostings();
  }, [isOpen, serviceName, t]);

  const handleSubmit = async () => {
    if (!destination) return;
    try {
      setSubmitting(true);
      await generalService.migrateOvhOrg(serviceName, destination);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("[MigrationModal] Error:", err);
      setError(t("migrateError"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("title")}</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : hostings.length === 0 ? (
            <div className="alert alert-error">{t("noDestination")}</div>
          ) : (
            <div className="form-group">
              <label>{t("destinationLabel")}</label>
              <select 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
              >
                <option value="" disabled>{t("selectPlaceholder")}</option>
                {hostings.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {t("cancel")}
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading || submitting || !destination || hostings.length === 0}
          >
            {submitting ? t("migrating") : t("migrate")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MigrationModal;
