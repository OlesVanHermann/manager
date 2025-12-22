// ============================================================
// MODAL: Dump Database (Sauvegarde)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  databaseName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Modal pour créer une sauvegarde de base de données. */
export function DumpDatabaseModal({ serviceName, databaseName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [sendEmail, setSendEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- HANDLERS ----------
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await hostingService.createDatabaseDump(serviceName, databaseName, { sendEmail });
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // ---------- RENDER ----------
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("database.dump")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <p className="modal-info">
            Créer une sauvegarde de la base <strong>{databaseName}</strong>
          </p>

          <div className="info-box">
            <p>La sauvegarde sera disponible dans la liste des dumps et pourra être téléchargée ou restaurée.</p>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
              />
              <span>Recevoir un email quand la sauvegarde est prête</span>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Création..." : "Créer la sauvegarde"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DumpDatabaseModal;
