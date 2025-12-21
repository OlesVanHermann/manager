// ============================================================
// MODAL: Créer un runtime (Cloud Web)
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

type RuntimeType = "phpfpm" | "nodejs" | "python" | "ruby";

const RUNTIME_TYPES = [
  { value: "phpfpm", label: "PHP-FPM", icon: "🐘" },
  { value: "nodejs", label: "Node.js", icon: "🟢" },
  { value: "python", label: "Python", icon: "🐍" },
  { value: "ruby", label: "Ruby", icon: "💎" },
];

/** Modal de création de runtime pour Cloud Web. */
export function CreateRuntimeModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");

  // ---------- STATE ----------
  const [name, setName] = useState("");
  const [type, setType] = useState<RuntimeType>("phpfpm");
  const [publicDir, setPublicDir] = useState("public");
  const [appEnv, setAppEnv] = useState("production");
  const [appBootstrap, setAppBootstrap] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // ---------- HANDLERS ----------
  const handleClose = () => {
    setName("");
    setType("phpfpm");
    setPublicDir("public");
    setAppEnv("production");
    setAppBootstrap("");
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError(t("createRuntime.errorNameRequired"));
      return;
    }
    if (!publicDir.trim()) {
      setError(t("createRuntime.errorPublicDirRequired"));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await hostingService.createRuntime(serviceName, {
        name: name.trim(),
        type,
        publicDir: publicDir.trim(),
        appEnv: appEnv.trim() || undefined,
        appBootstrap: appBootstrap.trim() || undefined,
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
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("createRuntime.title")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label>{t("createRuntime.nameLabel")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mon Runtime"
              className="form-input"
              autoFocus
            />
            <span className="form-hint">{t("createRuntime.nameHint")}</span>
          </div>

          <div className="form-group">
            <label>{t("createRuntime.typeLabel")}</label>
            <div className="runtime-type-selector">
              {RUNTIME_TYPES.map((rt) => (
                <button
                  key={rt.value}
                  type="button"
                  className={`runtime-type-btn ${type === rt.value ? "active" : ""}`}
                  onClick={() => setType(rt.value as RuntimeType)}
                >
                  <span className="runtime-icon">{rt.icon}</span>
                  <span className="runtime-label">{rt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>{t("createRuntime.publicDirLabel")}</label>
            <input
              type="text"
              value={publicDir}
              onChange={(e) => setPublicDir(e.target.value)}
              placeholder="public"
              className="form-input font-mono"
            />
            <span className="form-hint">{t("createRuntime.publicDirHint")}</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t("createRuntime.appEnvLabel")}</label>
              <select
                value={appEnv}
                onChange={(e) => setAppEnv(e.target.value)}
                className="form-select"
              >
                <option value="production">production</option>
                <option value="development">development</option>
                <option value="staging">staging</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t("createRuntime.bootstrapLabel")}</label>
              <input
                type="text"
                value={appBootstrap}
                onChange={(e) => setAppBootstrap(e.target.value)}
                placeholder="app.js / main.py"
                className="form-input font-mono"
              />
              <span className="form-hint">{t("createRuntime.bootstrapHint")}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div></div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={handleClose} disabled={loading}>
              {t("createRuntime.cancel")}
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? t("createRuntime.creating") : t("createRuntime.confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRuntimeModal;
