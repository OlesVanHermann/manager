import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { themesPluginsService } from "./ThemesPluginsTab.service";
import type { WordPressTheme, WordPressPlugin } from "../../wordpress.types";
import "./ThemesPluginsTab.css";

interface Props { serviceName: string; }

export function ThemesPluginsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/wordpress/index");
  const [themes, setThemes] = useState<WordPressTheme[]>([]);
  const [plugins, setPlugins] = useState<WordPressPlugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try { setLoading(true); const [t, p] = await Promise.all([themesPluginsService.listThemes(serviceName), themesPluginsService.listPlugins(serviceName)]); setThemes(t || []); setPlugins(p || []); }
    catch (err) { setError(String(err)); } finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleUpdateTheme = async (name: string) => { setUpdating(`theme-${name}`); try { await themesPluginsService.updateTheme(serviceName, name); alert(t("themes.updateStarted")); loadData(); } catch (err) { alert(`Erreur: ${err}`); } finally { setUpdating(null); } };
  const handleUpdatePlugin = async (name: string) => { setUpdating(`plugin-${name}`); try { await themesPluginsService.updatePlugin(serviceName, name); alert(t("plugins.updateStarted")); loadData(); } catch (err) { alert(`Erreur: ${err}`); } finally { setUpdating(null); } };
  const handleTogglePlugin = async (p: WordPressPlugin) => { setUpdating(`toggle-${p.name}`); try { p.active ? await themesPluginsService.deactivatePlugin(serviceName, p.name) : await themesPluginsService.activatePlugin(serviceName, p.name); loadData(); } catch (err) { alert(`Erreur: ${err}`); } finally { setUpdating(null); } };
  const handleUpdateAll = async () => { if (!confirm(t("common.confirmUpdateAll"))) return; setUpdating("all"); try { await themesPluginsService.updateAllPlugins(serviceName); alert(t("plugins.allUpdatesStarted")); loadData(); } catch (err) { alert(`Erreur: ${err}`); } finally { setUpdating(null); } };

  const pluginsWithUpdates = plugins.filter(p => p.updateAvailable);

  if (loading) return <div className="mwp-themes-plugins-loading"><div className="mwp-themes-plugins-skeleton" /><div className="mwp-themes-plugins-skeleton" /></div>;
  if (error) return <div className="mwp-themes-plugins-error">{error}</div>;

  return (
    <div className="themes-plugins-tab">
      <section className="themes-plugins-section">
        <div className="themes-plugins-section-header"><h4>{t("themes.title")}</h4><span className="themes-plugins-count-badge">{themes.length}</span></div>
        {themes.length === 0 ? <div className="themes-plugins-empty">{t("themes.empty")}</div> : (
          <div className="themes-plugins-grid">
            {themes.map(theme => (
              <div key={theme.name} className={`themes-plugins-card ${theme.active ? "active" : ""}`}>
                <div className="themes-plugins-icon">🎨</div>
                <div className="themes-plugins-info"><h5>{theme.name}</h5><span className="themes-plugins-version">v{theme.version}</span>{theme.active && <span className="mwp-themes-plugins-badge success">Actif</span>}</div>
                {theme.updateAvailable && <button className="mwp-themes-plugins-btn-warning-sm" onClick={() => handleUpdateTheme(theme.name)} disabled={updating === `theme-${theme.name}`}>{updating === `theme-${theme.name}` ? "..." : "⬆️"}</button>}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="themes-plugins-section">
        <div className="themes-plugins-section-header"><h4>{t("plugins.title")}</h4><span className="themes-plugins-count-badge">{plugins.length}</span>
          {pluginsWithUpdates.length > 0 && <button className="mwp-themes-plugins-btn-warning-sm" onClick={handleUpdateAll} disabled={updating === "all"}>{updating === "all" ? "..." : `⬆️ ${t("plugins.updateAll")} (${pluginsWithUpdates.length})`}</button>}
        </div>
        {plugins.length === 0 ? <div className="themes-plugins-empty">{t("plugins.empty")}</div> : (
          <table className="themes-plugins-table">
            <thead><tr><th>{t("plugins.name")}</th><th>{t("plugins.version")}</th><th>{t("plugins.status")}</th><th>{t("common.actions")}</th></tr></thead>
            <tbody>
              {plugins.map(plugin => (
                <tr key={plugin.name}>
                  <td><span className="themes-plugins-name">{plugin.name}{plugin.updateAvailable && <span className="mwp-themes-plugins-badge warning" title="Mise à jour disponible">⬆️</span>}</span></td>
                  <td><code>{plugin.version}</code></td>
                  <td><span className={`mwp-themes-plugins-badge ${plugin.active ? "success" : "inactive"}`}>{plugin.active ? t("plugins.active") : t("plugins.inactive")}</span></td>
                  <td><div className="themes-plugins-actions">
                    <button className={`btn btn-xs ${plugin.active ? "btn-warning" : "btn-success"}`} onClick={() => handleTogglePlugin(plugin)} disabled={updating === `toggle-${plugin.name}`} title={plugin.active ? t("plugins.deactivate") : t("plugins.activate")}>{updating === `toggle-${plugin.name}` ? "..." : plugin.active ? "⏸️" : "▶️"}</button>
                    {plugin.updateAvailable && <button className="btn btn-xs btn-primary" onClick={() => handleUpdatePlugin(plugin.name)} disabled={updating === `plugin-${plugin.name}`} title={t("plugins.update")}>{updating === `plugin-${plugin.name}` ? "..." : "⬆️"}</button>}
                  </div></td>
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
