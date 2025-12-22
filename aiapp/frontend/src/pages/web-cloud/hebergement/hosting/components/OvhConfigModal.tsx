// ============================================================
// MODAL: OVH Config (.ovhconfig management)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../services/web-cloud.hosting";

interface OvhConfig {
  engineName: string;
  engineVersion: string;
  environment: string;
  httpFirewall: string;
  container: string;
}

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function OvhConfigModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [config, setConfig] = useState<OvhConfig>({
    engineName: "php",
    engineVersion: "8.2",
    environment: "production",
    httpFirewall: "none",
    container: "stable64"
  });
  const [availableVersions, setAvailableVersions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    Promise.all([
      hostingService.getOvhConfig(serviceName),
      hostingService.getAvailablePhpVersions(serviceName)
    ])
      .then(([cfg, versions]) => {
        if (cfg) setConfig(cfg);
        setAvailableVersions(versions || ["7.4", "8.0", "8.1", "8.2", "8.3"]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [serviceName, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      await hostingService.updateOvhConfig(serviceName, config);
      alert("Configuration mise à jour. Les changements seront appliqués sous quelques minutes.");
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const environments = [
    { value: "production", label: "Production" },
    { value: "development", label: "Développement" }
  ];

  const firewalls = [
    { value: "none", label: "Aucun" },
    { value: "security", label: "Sécurité" }
  ];

  const containers = [
    { value: "stable64", label: "Stable 64-bit" },
    { value: "jessie.i386", label: "Jessie 32-bit (legacy)" },
    { value: "legacy", label: "Legacy" }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>⚙️ Configuration .ovhconfig</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && <div className="error-banner">{error}</div>}

          <div className="info-banner">
            <span className="info-icon">ℹ</span>
            <p>Le fichier .ovhconfig définit la configuration PHP de votre hébergement.</p>
          </div>

          {loading ? (
            <div className="skeleton-block" style={{ height: "300px" }} />
          ) : (
            <div className="config-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Moteur</label>
                  <select 
                    className="form-select" 
                    value={config.engineName}
                    onChange={e => setConfig({ ...config, engineName: e.target.value })}
                  >
                    <option value="php">PHP</option>
                    <option value="phpcgi">PHP CGI</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Version PHP</label>
                  <select 
                    className="form-select" 
                    value={config.engineVersion}
                    onChange={e => setConfig({ ...config, engineVersion: e.target.value })}
                  >
                    {availableVersions.map(v => (
                      <option key={v} value={v}>PHP {v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Environnement</label>
                  <select 
                    className="form-select" 
                    value={config.environment}
                    onChange={e => setConfig({ ...config, environment: e.target.value })}
                  >
                    {environments.map(env => (
                      <option key={env.value} value={env.value}>{env.label}</option>
                    ))}
                  </select>
                  <span className="form-hint">
                    Production : erreurs masquées. Développement : erreurs affichées.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Firewall HTTP</label>
                  <select 
                    className="form-select" 
                    value={config.httpFirewall}
                    onChange={e => setConfig({ ...config, httpFirewall: e.target.value })}
                  >
                    {firewalls.map(fw => (
                      <option key={fw.value} value={fw.value}>{fw.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Container</label>
                <select 
                  className="form-select" 
                  value={config.container}
                  onChange={e => setConfig({ ...config, container: e.target.value })}
                >
                  {containers.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="config-preview">
                <h4>Aperçu .ovhconfig</h4>
                <pre className="code-block">{`app.engine=${config.engineName}
app.engine.version=${config.engineVersion}
environment=${config.environment}
http.firewall=${config.httpFirewall}
container.image=${config.container}`}</pre>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OvhConfigModal;
