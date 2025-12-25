import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { configurationService } from "./ConfigurationTab";
import type { PrivateDatabase, PdbConfigParam } from "../../private-database.types";
import "./ConfigurationTab.css";

interface Props { serviceName: string; details: PrivateDatabase; }

export function ConfigurationTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [config, setConfig] = useState<PdbConfigParam[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modified, setModified] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const loadConfig = useCallback(async () => {
    try { setLoading(true); setError(null); const data = await configurationService.getConfiguration(serviceName); setConfig(data || []); }
    catch (err) { setError(String(err)); } finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadConfig(); }, [loadConfig]);

  const handleChange = (key: string, value: string) => setModified(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (Object.keys(modified).length === 0) return;
    if (!confirm(`Modifier ${Object.keys(modified).length} paramètre(s) ? Le serveur sera redémarré.`)) return;
    try { setSaving(true); await configurationService.updateConfiguration(serviceName, modified); alert(t("configuration.saveSuccess")); setModified({}); loadConfig(); }
    catch (err) { alert(`Erreur: ${err}`); } finally { setSaving(false); }
  };

  const handleReset = (key: string) => { const p = config.find(x => x.key === key); if (p) setModified(prev => ({ ...prev, [key]: p.defaultValue })); };
  const getValue = (p: PdbConfigParam) => modified[p.key] !== undefined ? modified[p.key] : p.value;
  const isModified = (key: string) => modified[key] !== undefined;

  const renderInput = (param: PdbConfigParam) => {
    const value = getValue(param);
    const cls = `form-${param.type === "enum" || param.type === "boolean" ? "select" : "input"} ${isModified(param.key) ? "modified" : ""}`;
    if (param.type === "boolean") return <select className={cls} value={value} onChange={(e) => handleChange(param.key, e.target.value)}><option value="true">Oui</option><option value="false">Non</option></select>;
    if (param.type === "enum") return <select className={cls} value={value} onChange={(e) => handleChange(param.key, e.target.value)}>{param.options?.map(o => <option key={o} value={o}>{o}</option>)}</select>;
    if (param.type === "number") return <div className="configuration-input-unit"><input type="number" className={cls} value={value} min={param.min} max={param.max} onChange={(e) => handleChange(param.key, e.target.value)} />{param.unit && <span className="configuration-unit">{param.unit}</span>}</div>;
    return <input type="text" className={cls} value={value} onChange={(e) => handleChange(param.key, e.target.value)} />;
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  const basicParams = config.filter(p => !p.key.startsWith("innodb_") && !p.key.startsWith("tmp_"));
  const advancedParams = config.filter(p => p.key.startsWith("innodb_") || p.key.startsWith("tmp_"));
  const hasModifications = Object.keys(modified).length > 0;

  return (
    <div className="configuration-tab">
      <div className="configuration-header">
        <div><h3>{t("configuration.title")}</h3><p className="configuration-description">{t("configuration.description")}</p></div>
        <div className="configuration-actions">
          {hasModifications && (<><button className="btn btn-secondary btn-sm" onClick={() => setModified({})}>Annuler</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>{saving ? "Sauvegarde..." : `Appliquer (${Object.keys(modified).length})`}</button></>)}
        </div>
      </div>

      <div className="configuration-server-info">
        <span><strong>Type:</strong> {details.type}</span>
        <span><strong>Version:</strong> {details.version}</span>
        <span><strong>RAM:</strong> {details.ram?.value} {details.ram?.unit}</span>
        <span><strong>Infrastructure:</strong> {details.infrastructure || "docker"}</span>
      </div>

      <div className="configuration-info-banner"><span>⚠</span><p>{t("configuration.warning")}</p></div>

      <section className="configuration-section">
        <h4>{t("configuration.basicParams")}</h4>
        <div className="configuration-grid">
          {basicParams.map(param => (
            <div key={param.key} className={`configuration-item ${isModified(param.key) ? "modified" : ""}`}>
              <div className="configuration-item-header">
                <label>{param.key}</label>
                {isModified(param.key) && <button className="configuration-btn-reset" onClick={() => handleReset(param.key)} title="Réinitialiser">↺</button>}
              </div>
              {renderInput(param)}
              <p className="configuration-desc">{param.description}</p>
              <span className="configuration-default">Défaut: {param.defaultValue} {param.unit || ""}</span>
            </div>
          ))}
        </div>
      </section>

      {advancedParams.length > 0 && (
        <section className="configuration-section">
          <div className="configuration-section-toggle">
            <h4>{t("configuration.advancedParams")}</h4>
            <button className="btn btn-link" onClick={() => setShowAdvanced(!showAdvanced)}>{showAdvanced ? "Masquer ▲" : "Afficher ▼"}</button>
          </div>
          {showAdvanced && (
            <div className="configuration-grid">
              {advancedParams.map(param => (
                <div key={param.key} className={`configuration-item ${isModified(param.key) ? "modified" : ""}`}>
                  <div className="configuration-item-header">
                    <label>{param.key}</label>
                    {isModified(param.key) && <button className="configuration-btn-reset" onClick={() => handleReset(param.key)} title="Réinitialiser">↺</button>}
                  </div>
                  {renderInput(param)}
                  <p className="configuration-desc">{param.description}</p>
                  <span className="configuration-default">Défaut: {param.defaultValue} {param.unit || ""}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="configuration-footer">
        <button className="btn btn-danger btn-sm" onClick={() => { if(confirm(t("configuration.confirmResetAll"))) { const d: Record<string,string> = {}; config.forEach(p => d[p.key] = p.defaultValue); setModified(d); } }}>
          ↺ {t("configuration.resetAll")}
        </button>
      </div>
    </div>
  );
}

export default ConfigurationTab;
