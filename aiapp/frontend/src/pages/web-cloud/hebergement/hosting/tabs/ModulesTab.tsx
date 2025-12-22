// ============================================================
// HOSTING TAB: MODULES - Modules en 1 clic
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Module } from "../../../../../services/web-cloud.hosting";
import { InstallModuleModal } from "../components/InstallModuleModal";

interface Props { serviceName: string; }

/** Onglet Modules en 1 clic (WordPress, PrestaShop, etc.). */
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

  useEffect(() => { loadModules(); }, [loadModules]);

  const handleDelete = async (id: number) => {
    if (!confirm(t("modules.confirmDelete"))) return;
    try {
      await hostingService.deleteModule(serviceName, id);
      loadModules();
    } catch (err) { alert(String(err)); }
  };

  const getModuleIcon = (name?: string) => {
    if (!name) return '📦';
    const lower = name.toLowerCase();
    if (lower.includes('wordpress')) return '📝';
    if (lower.includes('prestashop')) return '🛒';
    if (lower.includes('joomla')) return '🌐';
    if (lower.includes('drupal')) return '💧';
    return '📦';
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

      {/* Info aide */}
      <div className="info-banner">
        <span className="info-icon">ℹ</span>
        <span>{t("modules.guidesHelp")}</span>
        <a 
          href="https://help.ovhcloud.com/csm/fr-web-hosting-1-click-modules" 
          target="_blank" 
          rel="noopener noreferrer"
          className="link-primary"
        >
          {t("common.consultGuides")} ↗
        </a>
      </div>

      {modules.length === 0 ? (
        <div className="empty-state">
          <p>{t("modules.empty")}</p>
          <p className="text-muted" style={{ marginBottom: 'var(--space-4)' }}>{t("modules.emptyHint")}</p>
          <button className="btn btn-primary" onClick={() => setShowInstallModal(true)}>
            {t("modules.installFirst")}
          </button>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("modules.module")}</th>
              <th>{t("modules.path")}</th>
              <th>{t("modules.version")}</th>
              <th>{t("modules.login")}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.map(mod => (
              <tr key={mod.id}>
                <td>
                  <div className="module-info">
                    <span className="module-icon">{getModuleIcon(mod.moduleId?.toString())}</span>
                    <span>{mod.moduleId || 'Module'}</span>
                  </div>
                </td>
                <td className="font-mono">{mod.path || '/'}</td>
                <td>{mod.version || '-'}</td>
                <td className="font-mono">{mod.adminName || '-'}</td>
                <td>
                  <div className="action-buttons">
                    {mod.adminFolder && (
                      <a 
                        href={`https://${mod.targetUrl}/${mod.adminFolder}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                      >
                        Admin ↗
                      </a>
                    )}
                    <button 
                      className="btn-icon btn-danger-icon" 
                      onClick={() => handleDelete(mod.id)}
                      title={t("common.actions")}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
