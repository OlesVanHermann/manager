// ============================================================
import "./modules.css";
// HOSTING TAB: MODULES - Modules en 1 clic
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Module } from "../../../../../../services/web-cloud.hosting";
import { InstallModuleModal, ChangePasswordModal } from "./modals";

interface Props { serviceName: string; }

const PAGE_SIZE = 10;

export function ModulesTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.modules");
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState<{ open: boolean; moduleId: number; moduleName: string }>({ open: false, moduleId: 0, moduleName: "" });

  const loadModules = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await hostingService.listModules(serviceName);
      const data = await Promise.all(ids.map(id => hostingService.getModule(serviceName, id)));
      setModules(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadModules(); }, [loadModules]);

  const handleDelete = async (moduleId: number, name: string) => {
    if (!confirm(t("modules.confirmDelete", { name }))) return;
    try {
      await hostingService.deleteModule(serviceName, moduleId);
      loadModules();
    } catch (err) {
      alert(String(err));
    }
  };

  // --- FILTERING ---
  const filteredModules = useMemo(() => {
    if (!searchTerm) return modules;
    const term = searchTerm.toLowerCase();
    return modules.filter(m => 
      m.name.toLowerCase().includes(term) || 
      (m.targetUrl || "").toLowerCase().includes(term)
    );
  }, [modules, searchTerm]);

  const totalPages = Math.ceil(filteredModules.length / PAGE_SIZE);
  const paginatedModules = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredModules.slice(start, start + PAGE_SIZE);
  }, [filteredModules, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" style={{ height: "400px" }} /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="modules-tab">
      {/* Header */}
      <div className="tab-header">
        <div>
          <h3>{t("modules.title")}</h3>
          <p className="tab-description">
            {t("modules.description")}
          </p>
        </div>
        <div className="tab-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setShowInstallModal(true)}>
            + {t("modules.install")}
          </button>
        </div>
      </div>

      {/* Guides link */}
      <div className="guides-hint" style={{ marginBottom: "1rem" }}>
        <span>{t("modules.guidesHelp")}</span>
        <a href="https://help.ovhcloud.com/csm/fr-web-hosting-modules" target="_blank" rel="noopener noreferrer" className="link-action">
          Consulter le guide ↗
        </a>
      </div>

      {/* Search */}
      <div className="table-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder={t("common.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="records-count">{modules.length} {t("modules.count")}</span>
      </div>

      {/* Table */}
      {paginatedModules.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>{searchTerm ? t("common.noResult") : t("modules.empty")}</p>
          <p className="empty-hint">{t("modules.emptyHint")}</p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={() => setShowInstallModal(true)}>
              {t("modules.installFirst")}
            </button>
          )}
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("modules.name")}</th>
                <th>{t("modules.path")}</th>
                <th>{t("modules.version")}</th>
                <th>{t("modules.login")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedModules.map(mod => (
                <tr key={mod.id}>
                  <td className="font-medium">{mod.name}</td>
                  <td>
                    <a 
                      href={mod.targetUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="domain-link"
                    >
                      {mod.targetUrl || "-"}
                    </a>
                  </td>
                  <td>{mod.version || "-"}</td>
                  <td className="font-mono">{mod.adminName || "-"}</td>
                  <td>
                    <div className="action-buttons">
                      {mod.adminFolder && (
                        <a 
                          href={`${mod.targetUrl}${mod.adminFolder}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-icon"
                          title="Accéder à l'admin"
                        >🔗</a>
                      )}
                      <button 
                        className="btn-icon" 
                        onClick={() => setPasswordModal({ open: true, moduleId: mod.id, moduleName: mod.name })}
                        title={t("modules.changePassword")}
                      >🔑</button>
                      <button 
                        className="btn-icon btn-danger-icon" 
                        onClick={() => handleDelete(mod.id, mod.name)}
                        title={t("modules.delete")}
                      >🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>←</button>
              <span className="pagination-info">{t("common.page")} {currentPage} / {totalPages}</span>
              <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>→</button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <InstallModuleModal
        serviceName={serviceName}
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onSuccess={loadModules}
      />

      <ChangePasswordModal
        serviceName={serviceName}
        login={passwordModal.moduleName}
        type="module"
        moduleId={passwordModal.moduleId}
        isOpen={passwordModal.open}
        onClose={() => setPasswordModal({ open: false, moduleId: 0, moduleName: "" })}
        onSuccess={loadModules}
      />
    </div>
  );
}

export default ModulesTab;
