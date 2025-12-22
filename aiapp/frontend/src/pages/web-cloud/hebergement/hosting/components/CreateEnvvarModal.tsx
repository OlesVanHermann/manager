// ============================================================
// CREATE ENVVAR MODAL - Créer une variable d'environnement
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Modal pour créer une variable d'environnement. */
export function CreateEnvvarModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("string");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateKey = (k: string) => /^[A-Z0-9_]+$/.test(k);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setError("La clé est obligatoire");
      return;
    }
    if (!validateKey(key)) {
      setError("La clé doit contenir uniquement des majuscules, chiffres et underscores");
      return;
    }
    if (!value.trim()) {
      setError("La valeur est obligatoire");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await hostingService.createEnvVar(serviceName, {
        key: key.trim(),
        value: value.trim(),
        type,
      });
      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setKey("");
    setValue("");
    setType("string");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleKeyChange = (val: string) => {
    setKey(val.toUpperCase().replace(/[^A-Z0-9_]/g, ''));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("envvars.create")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="info-banner" style={{ marginBottom: 'var(--space-4)' }}>
              <span className="info-icon">ℹ</span>
              <p>Les variables d'environnement sont accessibles dans vos scripts via $_ENV ou getenv().</p>
            </div>

            <div className="form-group">
              <label className="form-label required">Clé</label>
              <input
                type="text"
                className="form-input font-mono"
                value={key}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="MY_API_KEY"
                maxLength={255}
                required
              />
              <span className="form-hint">Majuscules, chiffres et underscores uniquement</span>
            </div>

            <div className="form-group">
              <label className="form-label required">Valeur</label>
              <input
                type={type === "password" ? "password" : "text"}
                className="form-input font-mono"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="sk_live_xxxxx"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Type</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="type"
                    value="string"
                    checked={type === "string"}
                    onChange={(e) => setType(e.target.value)}
                  />
                  Texte (visible)
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="type"
                    value="password"
                    checked={type === "password"}
                    onChange={(e) => setType(e.target.value)}
                  />
                  Masqué (mot de passe, clé API)
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Création..." : "Créer la variable"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEnvvarModal;
