// ============================================================
// MODULES TAB - 8 colonnes avec menu ⋮ - TARGET STRICT
// Conforme target_.web-cloud.hosting.modules.svg
// ============================================================

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { modulesService } from "./ModulesTab.service";
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
  database?: string;
  creationDate?: string;
}

// Modules disponibles (selon SVG)
const AVAILABLE_MODULES = [
  { id: "wordpress", name: "WordPress", color: "#21759B", letter: "W", desc: "CMS le plus populaire" },
  { id: "prestashop", name: "PrestaShop", color: "#DF0067", letter: "P", desc: "E-commerce" },
  { id: "joomla", name: "Joomla!", color: "#5091CD", letter: "J", desc: "CMS flexible" },
  { id: "drupal", name: "Drupal", color: "#0678BE", letter: "D", desc: "CMS enterprise" },
  { id: "spip", name: "SPIP", color: "#9F1E1E", letter: "S", desc: "Publication web" },
];

// ============================================================
// HELPERS
// ============================================================

function getModuleName(mod: Module): string {
  if (mod.moduleId === 1 || mod.path?.toLowerCase().includes("wordpress")) return "WordPress";
  if (mod.moduleId === 2 || mod.path?.toLowerCase().includes("prestashop")) return "PrestaShop";
  if (mod.moduleId === 3 || mod.path?.toLowerCase().includes("joomla")) return "Joomla!";
  if (mod.moduleId === 4 || mod.path?.toLowerCase().includes("drupal")) return "Drupal";
  if (mod.moduleId === 5 || mod.path?.toLowerCase().includes("spip")) return "SPIP";
  return "Module";
}

function getModuleColor(name: string): string {
  const found = AVAILABLE_MODULES.find(m => m.name.toLowerCase() === name.toLowerCase().replace("!", ""));
  return found?.color || "#6B7280";
}

function getModuleLetter(name: string): string {
  return name.charAt(0).toUpperCase();
}

function formatDate(d?: string): string {
  if (!d) return "-";
  try { return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }); }
  catch { return d; }
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function Badge({ status }: { status: "active" | "disabled" }) {
  return (
    <span className={`modules-badge modules-badge-${status}`}>
      {status === "active" ? "Actif" : "Inactif"}
    </span>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function ModulesTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.modules");

  // ---------- STATE ----------
  const [modules, setModules] = useState<ModuleWithName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
      const withNames: ModuleWithName[] = data.map(m => ({
        ...m,
        name: getModuleName(m),
        database: `${serviceName.replace(/\./g, "")}_db${m.id}`,
        creationDate: (m as any).creationDate || undefined,
      }));
      setModules(withNames);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadModules(); }, [loadModules]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------- HANDLERS ----------
  const handleMenuAction = (action: string, mod: ModuleWithName) => {
    setOpenMenuId(null);
    const base = mod.targetUrl?.startsWith("http") ? mod.targetUrl : `https://${mod.targetUrl}`;
    const adminPath = mod.adminFolder || (mod.name === "WordPress" ? "/wp-admin" : "/admin");

    switch (action) {
      case "openSite": window.open(base, "_blank"); break;
      case "openAdmin": window.open(`${base}${adminPath}`, "_blank"); break;
      case "changePassword": setPasswordModal({ open: true, moduleId: mod.id, moduleName: mod.name }); break;
      case "delete": setDeleteModal({ open: true, moduleId: mod.id, moduleName: mod.name }); break;
    }
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
      (m.path || "").toLowerCase().includes(term)
    );
  }, [modules, searchTerm]);

  const totalItems = filteredModules.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedModules = filteredModules.slice(startIndex, endIndex);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="modules-tab">
        <div className="modules-skeleton" />
      </div>
    );
  }

  if (error) return <div className="modules-error">{error}</div>;

  return (
    <div className="modules-tab">
      {/* === TOOLBAR === */}
      <div className="modules-toolbar">
        <button className="modules-btn-primary" onClick={() => setShowInstallModal(true)}>
          + {t("toolbar.addModule")}
        </button>
        <div className="modules-toolbar-spacer" />
        <input
          type="text"
          className="modules-search"
          placeholder={t("toolbar.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* === TABLE MODULES INSTALLÉS === */}
      {paginatedModules.length === 0 ? (
        <div className="modules-empty">
          <p>{searchTerm ? t("table.noResults") : t("table.noModules")}</p>
        </div>
      ) : (
        <div className="modules-table-container">
          <table className="modules-table">
            <thead>
              <tr>
                <th>{t("table.module")}</th>
                <th>{t("table.version")}</th>
                <th>{t("table.path")}</th>
                <th>{t("table.adminLogin")}</th>
                <th>{t("table.database")}</th>
                <th>{t("table.installation")}</th>
                <th>{t("table.status")}</th>
                <th>{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedModules.map(mod => (
                <tr key={mod.id}>
                  <td>
                    <div className="modules-module-cell">
                      <div className="modules-module-icon" style={{ backgroundColor: getModuleColor(mod.name) }}>
                        {getModuleLetter(mod.name)}
                      </div>
                      <span className="modules-module-name">{mod.name}</span>
                    </div>
                  </td>
                  <td>{mod.version || "-"}</td>
                  <td>{mod.path || "/www"}</td>
                  <td>{mod.adminName || "admin"}</td>
                  <td>{mod.database || "-"}</td>
                  <td>{formatDate(mod.creationDate)}</td>
                  <td><Badge status="active" /></td>
                  <td className="modules-actions-cell">
                    <button
                      className="modules-actions-btn"
                      onClick={() => setOpenMenuId(openMenuId === mod.id ? null : mod.id)}
                    >
                      ⋮
                    </button>
                    {openMenuId === mod.id && (
                      <div className="modules-actions-menu" ref={menuRef}>
                        <button onClick={() => handleMenuAction("openSite", mod)}>{t("actions.openSite")}</button>
                        <button onClick={() => handleMenuAction("openAdmin", mod)}>{t("actions.openAdmin")}</button>
                        <button onClick={() => handleMenuAction("changePassword", mod)}>{t("actions.changePassword")}</button>
                        <button className="modules-action-danger" onClick={() => handleMenuAction("delete", mod)}>{t("actions.delete")}</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* === PAGINATION === */}
      <div className="modules-pagination">
        <span className="modules-pagination-info">
          {t("pagination.showing")} {startIndex + 1}-{endIndex} {t("pagination.of")} {totalItems}
        </span>
        <div className="modules-pagination-controls">
          <span className="modules-pagination-label">{t("pagination.perPage")}</span>
          <select
            className="modules-pagination-select"
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <div className="modules-pagination-buttons">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={currentPage === page ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
          </div>
        </div>
      </div>

      {/* === MODULES DISPONIBLES === */}
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
                <span className="modules-card-desc">{mod.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === MODALS === */}
      <InstallModuleModal serviceName={serviceName} isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} onSuccess={loadModules} />
      <ChangePasswordModal serviceName={serviceName} login={passwordModal.moduleName} type="module" moduleId={passwordModal.moduleId} isOpen={passwordModal.open} onClose={() => setPasswordModal({ open: false, moduleId: 0, moduleName: "" })} onSuccess={loadModules} />
      <DeleteModuleModal moduleName={deleteModal.moduleName} isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, moduleId: 0, moduleName: "" })} onConfirm={handleDeleteConfirm} />
    </div>
  );
}

export default ModulesTab;
