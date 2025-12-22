// ============================================================
// MODAL: Edit Runtime
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Runtime } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  runtime: Runtime | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const APP_ENVS = [
  { value: "development", label: "Développement" },
  { value: "production", label: "Production" },
];

/** Modal pour modifier un runtime. */
export function EditRuntimeModal({ serviceName, runtime, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [name, setName] = useState("");
  const [publicDir, setPublicDir] = useState("");
  const [appEnv, setAppEnv] = useState("production");
  const [appBootstrap, setAppBootstrap] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- INIT ----------
  useEffect(() => {
    if (runtime && isOpen) {
      setName(runtime.name || "");
      setPublicDir(runtime.publicDir || "");
      setAppEnv(runtime.appEnv || "production");
      setAppBootstrap(runtime.appBootstrap || "");
    }
  }, [runtime, isOpen]);

  // ---------- HANDLERS ----------
  const handleSubmit = async () => {
    if (!runtime) return;
    setLoading(true);
    setError(null);
    try {
      await hostingService.updateRuntime(serviceName, runtime.id, {
        name: name.trim() || undefined,
        publicDir: publicDir.trim() || undefined,
        appEnv,
        appBootstrap: appBootstrap.trim() || undefined
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !runtime) return null;

  // ---------- RENDER ----------
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("runtimes.edit")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>{t("runtimes.type")}</label>
            <input
              type="text"
              value={runtime.type || "-"}
              disabled
              className="input-disabled"
            />
          </div>

          <div className="form-group">
            <label>{t("runtimes.name")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom du runtime"
            />
          </div>

          <div className="form-group">
            <label>{t("runtimes.publicDir")}</label>
            <input
              type="text"
              value={publicDir}
              onChange={(e) => setPublicDir(e.target.value)}
              placeholder="public/"
            />
            <small className="field-hint">Dossier public relatif au chemin du runtime</small>
          </div>

          <div className="form-group">
            <label>{t("runtimes.appEnv")}</label>
            <select value={appEnv} onChange={(e) => setAppEnv(e.target.value)}>
              {APP_ENVS.map(env => (
                <option key={env.value} value={env.value}>{env.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Bootstrap (Node.js)</label>
            <input
              type="text"
              value={appBootstrap}
              onChange={(e) => setAppBootstrap(e.target.value)}
              placeholder="server.js"
            />
            <small className="field-hint">Fichier de démarrage pour les runtimes Node.js</small>
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

export default EditRuntimeModal;
