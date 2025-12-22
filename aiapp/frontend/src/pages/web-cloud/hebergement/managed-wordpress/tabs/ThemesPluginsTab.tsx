// ============================================================
// MANAGED WORDPRESS TAB: THEMES & PLUGINS
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { managedWordPressService } from "../../../../../services/web-cloud.managed-wordpress";

interface Props { serviceName: string; }

interface Theme {
  name: string;
  version: string;
  active: boolean;
  updateAvailable?: boolean;
}

interface Plugin {
  name: string;
  version: string;
  active: boolean;
  updateAvailable?: boolean;
}

/** Onglet Thèmes et Extensions WordPress. */
export function ThemesPluginsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/managed-wordpress/index");
  const [themes, setThemes] = useState<Theme[]>([]);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  // ---------- LOAD ----------
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [themesData, pluginsData] = await Promise.all([
        managedWordPressService.listThemes(serviceName),
        managedWordPressService.listPlugins(serviceName),
      ]);
      setThemes(themesData || []);
      setPlugins(pluginsData || []);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadData(); }, [loadData]);

  // ---------- HANDLERS ----------
  const handleUpdateTheme = async (themeName: string) => {
    setUpdating(`theme-${themeName}`);
    try {
      await managedWordPressService.updateTheme(serviceName, themeName);
      alert(t("themes.updateStarted"));
      loadData();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdatePlugin = async (pluginName: string) => {
    setUpdating(`plugin-${pluginName}`);
    try {
      await managedWordPressService.updatePlugin(serviceName, pluginName);
      alert(t("plugins.updateStarted"));
      loadData();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setUpdating(null);
    }
  };

  const handleTogglePlugin = async (plugin: Plugin) => {
    setUpdating(`toggle-${plugin.name}`);
    try {
      if (plugin.active) {
        await managedWordPressService.deactivatePlugin(serviceName, plugin.name);
      } else {
        await managedWordPressService.activatePlugin(serviceName, plugin.name);
      }
      loadData();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdateAll = async () => {
    if (!confirm(t("common.confirmUpdateAll"))) return;
    setUpdating("all");
    try {
      await managedWordPressService.updateAllPlugins(serviceName);
      alert(t("plugins.allUpdatesStarted"));
      loadData();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setUpdating(null);
    }
  };

  const pluginsWithUpdates = plugins.filter(p => p.updateAvailable);

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

  // ---------- RENDER ----------
  return (
    <div className="wp-themes-tab">
      {/* Thèmes */}
      <section className="themes-section">
        <div className="section-header">
          <h4>{t("themes.title")}</h4>
          <span className="count-badge">{themes.length}</span>
        </div>

        {themes.length === 0 ? (
          <div className="empty-state-mini">{t("themes.empty")}</div>
        ) : (
          <div className="themes-grid">
            {themes.map(theme => (
              <div key={theme.name} className={`theme-card ${theme.active ? "active" : ""}`}>
                <div className="theme-icon">🎨</div>
                <div className="theme-info">
                  <h5>{theme.name}</h5>
                  <span className="theme-version">v{theme.version}</span>
                  {theme.active && <span className="badge success">Actif</span>}
                </div>
                {theme.updateAvailable && (
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleUpdateTheme(theme.name)}
                    disabled={updating === `theme-${theme.name}`}
                  >
                    {updating === `theme-${theme.name}` ? "..." : "⬆️"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Extensions */}
      <section className="plugins-section">
        <div className="section-header">
          <h4>{t("plugins.title")}</h4>
          <span className="count-badge">{plugins.length}</span>
          {pluginsWithUpdates.length > 0 && (
            <button
              className="btn btn-sm btn-warning"
              onClick={handleUpdateAll}
              disabled={updating === "all"}
            >
              {updating === "all" ? "..." : `⬆️ ${t("plugins.updateAll")} (${pluginsWithUpdates.length})`}
            </button>
          )}
        </div>

        {plugins.length === 0 ? (
          <div className="empty-state-mini">{t("plugins.empty")}</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("plugins.name")}</th>
                <th>{t("plugins.version")}</th>
                <th>{t("plugins.status")}</th>
                <th>{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {plugins.map(plugin => (
                <tr key={plugin.name}>
                  <td>
                    <span className="plugin-name">{plugin.name}</span>
                    {plugin.updateAvailable && (
                      <span className="badge warning" title="Mise à jour disponible">⬆️</span>
                    )}
                  </td>
                  <td><code>{plugin.version}</code></td>
                  <td>
                    <span className={`badge ${plugin.active ? "success" : "inactive"}`}>
                      {plugin.active ? t("plugins.active") : t("plugins.inactive")}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className={`btn btn-xs ${plugin.active ? "btn-warning" : "btn-success"}`}
                        onClick={() => handleTogglePlugin(plugin)}
                        disabled={updating === `toggle-${plugin.name}`}
                        title={plugin.active ? t("plugins.deactivate") : t("plugins.activate")}
                      >
                        {updating === `toggle-${plugin.name}` ? "..." : plugin.active ? "⏸️" : "▶️"}
                      </button>
                      {plugin.updateAvailable && (
                        <button
                          className="btn btn-xs btn-primary"
                          onClick={() => handleUpdatePlugin(plugin.name)}
                          disabled={updating === `plugin-${plugin.name}`}
                          title={t("plugins.update")}
                        >
                          {updating === `plugin-${plugin.name}` ? "..." : "⬆️"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default ThemesPluginsTab;
