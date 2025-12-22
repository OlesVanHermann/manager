// ============================================================
// CREATE RUNTIME MODAL - Créer un environnement d'exécution
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

const RUNTIME_TYPES = [
  { value: "phpfpm", label: "PHP-FPM" },
  { value: "nodejs14", label: "Node.js 14" },
  { value: "nodejs16", label: "Node.js 16" },
  { value: "nodejs18", label: "Node.js 18" },
  { value: "python", label: "Python" },
  { value: "ruby", label: "Ruby" },
];

const APP_ENVS = [
  { value: "production", label: "Production" },
  { value: "development", label: "Développement" },
  { value: "staging", label: "Staging" },
];

/** Modal pour créer un environnement d'exécution. */
export function CreateRuntimeModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [name, setName] = useState("");
  const [type, setType] = useState("phpfpm");
  const [publicDir, setPublicDir] = useState("public");
  const [appEnv, setAppEnv] = useState("production");
  const [appBootstrap, setAppBootstrap] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Le nom est obligatoire");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await hostingService.createRuntime(serviceName, {
        name: name.trim(),
        type,
        publicDir: publicDir.trim() || undefined,
        appEnv,
        appBootstrap: appBootstrap.trim() || undefined,
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
    setName("");
    setType("phpfpm");
    setPublicDir("public");
    setAppEnv("production");
    setAppBootstrap("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("runtimes.create")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="info-banner" style={{ marginBottom: 'var(--space-4)' }}>
              <span className="info-icon">ℹ</span>
              <p>Les runtimes permettent de configurer différents environnements d'exécution pour vos applications.</p>
            </div>

            <div className="form-group">
              <label className="form-label required">Nom</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mon application"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Type</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {RUNTIME_TYPES.map(rt => (
                  <option key={rt.value} value={rt.value}>{rt.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Dossier public</label>
              <input
                type="text"
                className="form-input font-mono"
                value={publicDir}
                onChange={(e) => setPublicDir(e.target.value)}
                placeholder="public"
              />
              <span className="form-hint">Dossier accessible depuis le web (ex: public, www, web)</span>
            </div>

            <div className="form-group">
              <label className="form-label">Environnement</label>
              <select
                className="form-select"
                value={appEnv}
                onChange={(e) => setAppEnv(e.target.value)}
              >
                {APP_ENVS.map(env => (
                  <option key={env.value} value={env.value}>{env.label}</option>
                ))}
              </select>
            </div>

            {type.startsWith("nodejs") && (
              <div className="form-group">
                <label className="form-label">Fichier de démarrage</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  value={appBootstrap}
                  onChange={(e) => setAppBootstrap(e.target.value)}
                  placeholder="app.js"
                />
                <span className="form-hint">Point d'entrée de votre application Node.js</span>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Création..." : "Créer le runtime"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRuntimeModal;
