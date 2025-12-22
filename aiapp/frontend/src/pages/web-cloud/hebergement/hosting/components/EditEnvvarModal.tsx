// ============================================================
// MODAL: Edit Environment Variable
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, EnvVar } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  envvar: EnvVar | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Modal pour modifier une variable d'environnement. */
export function EditEnvvarModal({ serviceName, envvar, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- INIT ----------
  useEffect(() => {
    if (envvar && isOpen) {
      setValue(envvar.value || "");
    }
  }, [envvar, isOpen]);

  // ---------- HANDLERS ----------
  const handleSubmit = async () => {
    if (!envvar) return;
    setLoading(true);
    setError(null);
    try {
      await hostingService.updateEnvVar(serviceName, envvar.key, { value });
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !envvar) return null;

  // ---------- RENDER ----------
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("envvars.edit")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>{t("envvars.key")}</label>
            <input
              type="text"
              value={envvar.key}
              disabled
              className="input-disabled"
            />
            <small className="field-hint">La clé ne peut pas être modifiée</small>
          </div>

          <div className="form-group">
            <label>{t("envvars.value")} *</label>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={4}
              placeholder="Valeur de la variable"
            />
          </div>

          <div className="info-box">
            <p>Les modifications seront appliquées après le prochain redéploiement.</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditEnvvarModal;
