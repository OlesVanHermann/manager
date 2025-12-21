// ============================================================
// MODAL: Créer une variable d'environnement
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

type EnvVarType = "string" | "password";

/** Modal de création de variable d'environnement. */
export function CreateEnvvarModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");

  // ---------- STATE ----------
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<EnvVarType>("string");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // ---------- VALIDATION ----------
  const validateKey = (k: string): string | null => {
    if (!k.trim()) return t("createEnvvar.errorKeyRequired");
    if (!/^[A-Z][A-Z0-9_]*$/.test(k)) return t("createEnvvar.errorKeyFormat");
    if (k.length > 255) return t("createEnvvar.errorKeyMax");
    return null;
  };

  // ---------- HANDLERS ----------
  const handleClose = () => {
    setKey("");
    setValue("");
    setType("string");
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    const keyError = validateKey(key);
    if (keyError) {
      setError(keyError);
      return;
    }
    if (!value.trim()) {
      setError(t("createEnvvar.errorValueRequired"));
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
      handleClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("createEnvvar.title")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label>{t("createEnvvar.keyLabel")}</label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              placeholder="MY_VARIABLE"
              className="form-input font-mono"
              autoFocus
            />
            <span className="form-hint">{t("createEnvvar.keyHint")}</span>
          </div>

          <div className="form-group">
            <label>{t("createEnvvar.valueLabel")}</label>
            <input
              type={type === "password" ? "password" : "text"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="valeur"
              className="form-input font-mono"
            />
          </div>

          <div className="form-group">
            <label>{t("createEnvvar.typeLabel")}</label>
            <div className="radio-group">
              <label className="radio-item">
                <input
                  type="radio"
                  name="envType"
                  checked={type === "string"}
                  onChange={() => setType("string")}
                />
                <span className="radio-label">{t("createEnvvar.typeString")}</span>
              </label>
              <label className="radio-item">
                <input
                  type="radio"
                  name="envType"
                  checked={type === "password"}
                  onChange={() => setType("password")}
                />
                <span className="radio-label">{t("createEnvvar.typePassword")}</span>
              </label>
            </div>
            <span className="form-hint">{t("createEnvvar.typeHint")}</span>
          </div>
        </div>

        <div className="modal-footer">
          <div></div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={handleClose} disabled={loading}>
              {t("createEnvvar.cancel")}
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? t("createEnvvar.creating") : t("createEnvvar.confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateEnvvarModal;
