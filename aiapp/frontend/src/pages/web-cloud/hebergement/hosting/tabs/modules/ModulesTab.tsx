// ============================================================
// HOSTING TAB: MODULES - Modules en 1 clic (selon SVG cible)
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { modulesService } from "./ModulesTab";
import type { Module } from "../../hosting.types";
import { InstallModuleModal, ChangePasswordModal, DeleteModuleModal } from "./modals";
import "./ModulesTab.css";

// ============================================================
// TYPES
// ============================================================

interface Props {
  serviceName: string;
}

interface ModuleWithName extends Module {
  name: string;
}

// Couleurs officielles des CMS
const MODULE_COLORS: Record<string, string> = {
  wordpress: "#21759B",
  prestashop: "#DF0067",
  joomla: "#5091CD",
  drupal: "#0678BE",
  default: "#6B7280",
};

// Modules disponibles (selon SVG)
const AVAILABLE_MODULES = [
  { id: "wordpress", name: "WordPress", color: "#21759B", letter: "W", desc: "CMS le plus populaire" },
  { id: "prestashop", name: "PrestaShop", color: "#DF0067", letter: "P", desc: "E-commerce" },
  { id: "joomla", name: "Joomla!", color: "#5091CD", letter: "J", desc: "CMS flexible" },
  { id: "drupal", name: "Drupal", color: "#0678BE", letter: "D", desc: "CMS enterprise" },
];

const PAGE_SIZE = 10;

// ============================================================
// HELPERS
// ============================================================

function getModuleName(mod: Module): string {
  if (mod.moduleId === 1 || mod.path?.toLowerCase().includes("wordpress")) return "WordPress";
  if (mod.moduleId === 2 || mod.path?.toLowerCase().includes("prestashop")) return "PrestaShop";
  if (mod.moduleId === 3 || mod.path?.toLowerCase().includes("joomla")) return "Joomla!";
  if (mod.moduleId === 4 || mod.path?.toLowerCase().includes("drupal")) return "Drupal";
  return "Module";
}

function getModuleColor(name: string): string {
  const key = name.toLowerCase().replace("!", "");
  return MODULE_COLORS[key] || MODULE_COLORS.default;
}

function getModuleLetter(name: string): string {
  return name.charAt(0).toUpperCase();
}

function extractDomain(targetUrl?: string): string {
  if (!targetUrl) return "-";
  try {
    const url = new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`);
    return url.hostname;
  } catch {
    return targetUrl;
  }
}

function extractFolder(path?: string): string {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export function ModulesTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.modules");

  // ---------- STATE ----------
  const [modules, setModules] = useState<ModuleWithName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState<{ open: boolean; moduleId: number; moduleName: string }>({ open: false, moduleId: 0, moduleName: "" });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; moduleId: number; moduleName: string }>({ open: false, moduleId: 0, moduleName: "" });

  // ---------- LOAD ----------
  const loadModules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const ids = await modulesService.listModules(serviceName);
      const data = await Promise.all(ids.map(id => modulesService.getModule(serviceName, id)));
      const withNames: ModuleWithName[] = data.map(m => ({ ...m, name: getModuleName(m) }));
      setModules(withNames);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadModules(); }, [loadModules]);

  // ---------- HANDLERS ----------
  const handleRefresh = () => loadModules();

  const handleOpenSite = (targetUrl?: string) => {
    if (targetUrl) window.open(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`, "_blank");
  };

  const handleOpenAdmin = (mod: ModuleWithName) => {
    const base = mod.targetUrl?.startsWith("http") ? mod.targetUrl : `https://${mod.targetUrl}`;
    const adminPath = mod.adminFolder || (mod.name === "WordPress" ? "/wp-admin" : "/admin");
    window.open(`${base}${adminPath}`, "_blank");
  };

  const handleDeleteConfirm = async () => {
    try {
      await modulesService.deleteModule(serviceName, deleteModal.moduleId);
      setDeleteModal({ open: false, moduleId: 0, moduleName: "" });
      loadModules();
    } catch (err) {
      alert(String(err));
    }
  };

  // ---------- FILTERING & PAGINATION ----------
  const filteredModules = useMemo(() => {
    if (!searchTerm) return modules;
    const term = searchTerm.toLowerCase();
    return modules.filter(m =>
      m.name.toLowerCase().includes(term) ||
      (m.targetUrl || "").toLowerCase().includes(term) ||
      (m.path || "").toLowerCase().includes(term)
    );
  }, [modules, searchTerm]);

  const totalPages = Math.ceil(filteredModules.length / PAGE_SIZE);
  const paginatedModules = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredModules.slice(start, start + PAGE_SIZE);
  }, [filteredModules, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="modules-tab">
        <div className="modules-toolbar">
          <div className="modules-skeleton-btn" style={{ width: 36, height: 36 }} />
          <div className="modules-skeleton-input" style={{ width: 220, height: 36 }} />
          <div className="modules-skeleton-btn" style={{ width: 180, height: 36 }} />
        </div>
        <div className="modules-skeleton-table" style={{ height: 300 }} />
      </div>
    );
  }

  // ---------- RENDER ERROR ----------
  if (error) {
    return (
      <div className="modules-tab">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={handleRefresh}>Réessayer</button>
        </div>
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="modules-tab">
      {/* Toolbar: Refresh + Search + Install */}
      <div className="modules-toolbar">
        <button className="modules-toolbar-btn refresh-btn" onClick={handleRefresh} title={t("toolbar.refresh")}>
          ↻
        </button>
        <div className="modules-toolbar-search">
          <input
            type="text"
            placeholder={t("toolbar.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <button className="btn btn-primary" onClick={() => setShowInstallModal(true)}>
          + {t("toolbar.install")}
        </button>
      </div>

      {/* Table des modules installés */}
      {paginatedModules.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>{searchTerm ? t("table.noResult") : t("table.empty")}</p>
          <p className="empty-hint">{t("table.emptyHint")}</p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={() => setShowInstallModal(true)}>
              {t("toolbar.installFirst")}
            </button>
          )}
        </div>
      ) : (
        <div className="modules-table-container">
          <table className="modules-table">
            <thead>
              <tr>
                <th>{t("table.module")}</th>
                <th>{t("table.domain")}</th>
                <th>{t("table.folder")}</th>
                <th>{t("table.version")}</th>
                <th>{t("table.admin")}</th>
                <th>{t("table.status")}</th>
                <th>{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedModules.map(mod => (
                <tr key={mod.id}>
                  {/* Module (icône + nom) */}
                  <td>
                    <div className="modules-module-cell">
                      <div className="modules-module-icon" style={{ backgroundColor: getModuleColor(mod.name) }}>
                        {getModuleLetter(mod.name)}
                      </div>
                      <span className="modules-module-name">{mod.name}</span>
                    </div>
                  </td>
                  {/* Domaine */}
                  <td>
                    <a href={mod.targetUrl} target="_blank" rel="noopener noreferrer" className="modules-domain-link">
                      {extractDomain(mod.targetUrl)}
                    </a>
                  </td>
                  {/* Dossier */}
                  <td className="modules-folder-cell">{extractFolder(mod.path)}</td>
                  {/* Version */}
                  <td>{mod.version || "-"}</td>
                  {/* Admin */}
                  <td>
                    <span className="modules-admin-link" onClick={() => handleOpenAdmin(mod)}>
                      {mod.adminName || "admin"}
                    </span>
                  </td>
                  {/* État */}
                  <td>
                    <span className="modules-status-badge status-installed">{t("table.statusInstalled")}</span>
                  </td>
                  {/* Actions */}
                  <td>
                    <div className="modules-actions-cell">
                      <button className="modules-action-btn" onClick={() => handleOpenSite(mod.targetUrl)} title={t("actions.openSite")}>
                        🌐
                      </button>
                      <button className="modules-action-btn" onClick={() => handleOpenAdmin(mod)} title={t("actions.openAdmin")}>
                        👤
                      </button>
                      <button className="modules-action-btn" onClick={() => setPasswordModal({ open: true, moduleId: mod.id, moduleName: mod.name })} title={t("actions.changePassword")}>
                        🔑
                      </button>
                      <button className="modules-action-btn action-danger" onClick={() => setDeleteModal({ open: true, moduleId: mod.id, moduleName: mod.name })} title={t("actions.delete")}>
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="modules-table-pagination">
              <button className="modules-pagination-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>←</button>
              <span className="modules-pagination-info">{t("common.page")} {currentPage} / {totalPages}</span>
              <button className="modules-pagination-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>→</button>
            </div>
          )}
        </div>
      )}

      {/* Section: Modules disponibles */}
      <div className="modules-available-section">
        <h3 className="modules-section-title">{t("available.title")}</h3>
        <div className="modules-available-grid">
          {AVAILABLE_MODULES.map(mod => (
            <div key={mod.id} className="modules-available-card" onClick={() => setShowInstallModal(true)}>
              <div className="modules-card-icon" style={{ backgroundColor: mod.color }}>
                {mod.letter}
              </div>
              <div className="modules-card-info">
                <span className="modules-card-name">{mod.name}</span>
                <span className="modules-card-desc">{t(`available.${mod.id}Desc`)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

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

      <DeleteModuleModal
        moduleName={deleteModal.moduleName}
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, moduleId: 0, moduleName: "" })}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default ModulesTab;
