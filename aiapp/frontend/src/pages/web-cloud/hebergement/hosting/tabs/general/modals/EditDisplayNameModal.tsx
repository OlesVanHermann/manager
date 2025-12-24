// ============================================================
// EDIT DISPLAY NAME MODAL - Conforme OLD Manager
// Modal simple pour modifier le nom d'affichage
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  currentName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditDisplayNameModal({ serviceName, currentName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.general");
  
  const [displayName, setDisplayName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDisplayName(currentName);
      setError(null);
    }
  }, [isOpen, currentName]);

  const handleSubmit = async () => {
    if (!displayName.trim()) {
      setError(t("general.displayName.required", "Le nom est requis"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await hostingService.updateHostingInfo(serviceName, { displayName });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || t("common.error", "Une erreur est survenue"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("general.displayName.title", "Modifier le nom d'affichage")}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            {t("general.displayName.description", "Ce nom sera affiché dans votre espace client pour identifier cet hébergement.")}
          </p>

          <div className="form-group">
            <label htmlFor="displayName">{t("general.displayName.label", "Nom d'affichage")}</label>
            <input
              type="text"
              id="displayName"
              className={`form-input ${error ? 'error' : ''}`}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={serviceName}
              maxLength={50}
            />
            <p className="form-hint">
              {t("general.displayName.hint", "50 caractères maximum")}
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">❌</span>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            {t("common.cancel", "Annuler")}
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="spinner-small" /> {t("common.saving", "Enregistrement...")}</> : t("common.save", "Enregistrer")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditDisplayNameModal;
