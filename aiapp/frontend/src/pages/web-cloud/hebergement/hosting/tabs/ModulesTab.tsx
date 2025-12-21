// ============================================================
// HOSTING TAB: MODULES - Modules en 1 clic avec CRUD
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Module } from "../../../../../services/web-cloud.hosting";
import { InstallModuleModal } from "../components/InstallModuleModal";

interface Props { serviceName: string; }

/** Onglet Modules en 1 clic avec installation et suppression. */
export function ModulesTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const loadModules = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await hostingService.listModules(serviceName);
      const data = await Promise.all(ids.map(id => hostingService.getModule(serviceName, id)));
      setModules(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  const handleDelete = async (id: number) => {
    if (!confirm(t("modules.confirmDelete"))) return;
    try {
      await hostingService.deleteModule(serviceName, id);
      loadModules();
    } catch (err) {
      alert(String(err));
    }
  };

  const getModuleIcon = (name: string): string => {
    const icons: Record<string, string> = {
      wordpress: "📝",
      prestashop: "🛒",
      joomla: "🌐",
      drupal: "💧",
      nextcloud: "☁️",
      dolibarr: "📊",
    };
    const lower = name.toLowerCase();
    for (const [key, icon] of Object.entries(icons)) {
      if (lower.includes(key)) return icon;
    }
    return "📦";
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="modules-tab">
      <div className="tab-header">
        <div>
          <h3>{t("modules.title")}</h3>
          <p className="tab-description">{t("modules.description")}</p>
        </div>
        <div className="tab-actions">
          <span className="records-count">{modules.length} {t("modules.count")}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowInstallModal(true)}>
            + {t("modules.install")}
          </button>
        </div>
      </div>

      {modules.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>
          <p>{t("modules.empty")}</p>
          <span className="empty-hint">{t("modules.emptyHint")}</span>
          <button className="btn btn-primary" onClick={() => setShowInstallModal(true)} style={{ marginTop: 'var(--space-3)' }}>
            {t("modules.installFirst")}
          </button>
        </div>
      ) : (
        <div className="module-cards">
          {modules.map(m => (
            <div key={m.id} className="module-card">
              <div className="module-header">
                <span className="module-card-icon">{getModuleIcon(m.adminName)}</span>
                <span className={`badge ${m.status === 'created' ? 'success' : m.status === 'error' ? 'error' : 'warning'}`}>{m.status}</span>
              </div>
              <h4>{m.adminName}</h4>
              <div className="module-info">
                <div><label>{t("modules.folder")}</label><span className="font-mono">{m.adminFolder}</span></div>
                <div>
                  <label>{t("modules.url")}</label>
                  <a href={m.targetUrl} target="_blank" rel="noopener noreferrer" className="font-mono module-url">{m.targetUrl}</a>
                </div>
                <div><label>{t("modules.language")}</label><span>{m.language}</span></div>
                <div><label>{t("modules.created")}</label><span>{new Date(m.creationDate).toLocaleDateString()}</span></div>
              </div>
              <div className="module-actions">
                <a href={m.targetUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                  {t("modules.open")}
                </a>
                <a href={`${m.targetUrl}/wp-admin`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                  {t("modules.admin")}
                </a>
                <button
                  className="btn-icon btn-danger-icon"
                  onClick={() => handleDelete(m.id)}
                  title={t("modules.delete")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <InstallModuleModal
        serviceName={serviceName}
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onSuccess={loadModules}
      />
    </div>
  );
}

export default ModulesTab;
