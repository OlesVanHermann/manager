// ============================================================
// PRIVATE DATABASE TAB: CONFIGURATION - Paramètres serveur
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService, PrivateDatabase } from "../../../../../services/web-cloud.private-database";

interface Props { 
  serviceName: string;
  details: PrivateDatabase;
}

interface ConfigParam {
  key: string;
  value: string;
  defaultValue: string;
  description: string;
  type: "number" | "boolean" | "string" | "enum";
  min?: number;
  max?: number;
  options?: string[];
  unit?: string;
}

/** Onglet Configuration avec paramètres modifiables. */
export function ConfigurationTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [config, setConfig] = useState<ConfigParam[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modified, setModified] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ---------- LOAD ----------
  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await privateDatabaseService.getConfiguration(serviceName);
      setConfig(data || []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadConfig(); }, [loadConfig]);

  // ---------- HANDLERS ----------
  const handleChange = (key: string, value: string) => {
    setModified(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (Object.keys(modified).length === 0) return;
    
    const confirmMsg = `Modifier ${Object.keys(modified).length} paramètre(s) ? Le serveur sera redémarré.`;
    if (!confirm(confirmMsg)) return;

    try {
      setSaving(true);
      await privateDatabaseService.updateConfiguration(serviceName, modified);
      alert(t("configuration.saveSuccess"));
      setModified({});
      loadConfig();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = (key: string) => {
    const param = config.find(p => p.key === key);
    if (param) {
      setModified(prev => ({ ...prev, [key]: param.defaultValue }));
    }
  };

  const handleResetAll = () => {
    if (!confirm(t("configuration.confirmResetAll"))) return;
    const defaults: Record<string, string> = {};
    config.forEach(p => { defaults[p.key] = p.defaultValue; });
    setModified(defaults);
  };

  const getValue = (param: ConfigParam) => {
    return modified[param.key] !== undefined ? modified[param.key] : param.value;
  };

  const isModified = (key: string) => modified[key] !== undefined;

  // ---------- RENDER INPUT ----------
  const renderInput = (param: ConfigParam) => {
    const value = getValue(param);
    
    switch (param.type) {
      case "boolean":
        return (
          <select
            className={`form-select ${isModified(param.key) ? "modified" : ""}`}
            value={value}
            onChange={(e) => handleChange(param.key, e.target.value)}
          >
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        );
      
      case "enum":
        return (
          <select
            className={`form-select ${isModified(param.key) ? "modified" : ""}`}
            value={value}
            onChange={(e) => handleChange(param.key, e.target.value)}
          >
            {param.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      
      case "number":
        return (
          <div className="input-with-unit">
            <input
              type="number"
              className={`form-input ${isModified(param.key) ? "modified" : ""}`}
              value={value}
              min={param.min}
              max={param.max}
              onChange={(e) => handleChange(param.key, e.target.value)}
            />
            {param.unit && <span className="input-unit">{param.unit}</span>}
          </div>
        );
      
      default:
        return (
          <input
            type="text"
            className={`form-input ${isModified(param.key) ? "modified" : ""}`}
            value={value}
            onChange={(e) => handleChange(param.key, e.target.value)}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  const basicParams = config.filter(p => !p.key.startsWith("innodb_") && !p.key.startsWith("tmp_"));
  const advancedParams = config.filter(p => p.key.startsWith("innodb_") || p.key.startsWith("tmp_"));
  const hasModifications = Object.keys(modified).length > 0;

  // ---------- RENDER ----------
  return (
    <div className="configuration-tab">
      <div className="tab-header">
        <div>
          <h3>{t("configuration.title")}</h3>
          <p className="tab-description">{t("configuration.description")}</p>
        </div>
        <div className="tab-actions">
          {hasModifications && (
            <>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setModified({})}
              >
                Annuler
              </button>
              <button 
                className="btn btn-primary btn-sm" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Sauvegarde..." : `Appliquer (${Object.keys(modified).length})`}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Info serveur */}
      <div className="server-info-bar">
        <span><strong>Type:</strong> {details.type}</span>
        <span><strong>Version:</strong> {details.version}</span>
        <span><strong>RAM:</strong> {details.ram?.value} {details.ram?.unit}</span>
        <span><strong>Infrastructure:</strong> {details.infrastructure || "docker"}</span>
      </div>

      {/* Warning */}
      <div className="info-banner warning">
        <span className="info-icon">⚠</span>
        <div>
          <p>{t("configuration.warning")}</p>
        </div>
      </div>

      {/* Paramètres de base */}
      <section className="config-section">
        <h4>{t("configuration.basicParams")}</h4>
        <div className="config-grid">
          {basicParams.map(param => (
            <div key={param.key} className={`config-item ${isModified(param.key) ? "modified" : ""}`}>
              <div className="config-header">
                <label>{param.key}</label>
                {isModified(param.key) && (
                  <button 
                    className="btn-reset" 
                    onClick={() => handleReset(param.key)}
                    title="Réinitialiser"
                  >
                    ↺
                  </button>
                )}
              </div>
              {renderInput(param)}
              <p className="config-desc">{param.description}</p>
              <span className="config-default">
                Défaut: {param.defaultValue} {param.unit || ""}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Paramètres avancés */}
      {advancedParams.length > 0 && (
        <section className="config-section">
          <div className="section-header-toggle">
            <h4>{t("configuration.advancedParams")}</h4>
            <button 
              className="btn btn-link"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Masquer ▲" : "Afficher ▼"}
            </button>
          </div>
          
          {showAdvanced && (
            <div className="config-grid">
              {advancedParams.map(param => (
                <div key={param.key} className={`config-item ${isModified(param.key) ? "modified" : ""}`}>
                  <div className="config-header">
                    <label>{param.key}</label>
                    {isModified(param.key) && (
                      <button 
                        className="btn-reset" 
                        onClick={() => handleReset(param.key)}
                        title="Réinitialiser"
                      >
                        ↺
                      </button>
                    )}
                  </div>
                  {renderInput(param)}
                  <p className="config-desc">{param.description}</p>
                  <span className="config-default">
                    Défaut: {param.defaultValue} {param.unit || ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Actions globales */}
      <div className="config-actions">
        <button className="btn btn-danger btn-sm" onClick={handleResetAll}>
          ↺ {t("configuration.resetAll")}
        </button>
      </div>
    </div>
  );
}

export default ConfigurationTab;
