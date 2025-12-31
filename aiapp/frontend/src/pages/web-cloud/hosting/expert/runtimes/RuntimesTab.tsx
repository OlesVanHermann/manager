// ============================================================
// RUNTIMES TAB - Runtimes PHP
// Conforme au pattern NAV3 standard
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { runtimesService } from "./RuntimesTab.service";
import type { Runtime } from "../../hosting.types";
import { CreateRuntimeModal, EditRuntimeModal } from ".";
import "./RuntimesTab.css";

// ============================================================
// TYPES
// ============================================================

interface Props {
  serviceName: string;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function RuntimesTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.runtimes");

  const [runtimes, setRuntimes] = useState<Runtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editRuntime, setEditRuntime] = useState<Runtime | null>(null);

  // ---------- LOAD ----------
  const loadRuntimes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const ids = await runtimesService.listRuntimes(serviceName);
      const data = await Promise.all(ids.map(id => runtimesService.getRuntime(serviceName, id)));
      setRuntimes(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadRuntimes(); }, [loadRuntimes]);

  // ---------- ACTIONS ----------
  const handleDelete = async (runtime: Runtime) => {
    if (runtime.isDefault) {
      alert(t("actions.cannotDeleteDefault"));
      return;
    }
    if (!confirm(t("modal.delete.confirm", { name: runtime.name || runtime.id }))) return;
    try {
      await runtimesService.deleteRuntime(serviceName, runtime.id);
      loadRuntimes();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleSetDefault = async (runtime: Runtime) => {
    try {
      await runtimesService.setDefaultRuntime(serviceName, runtime.id);
      loadRuntimes();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleMenuAction = (action: string, runtime: Runtime) => {
    setOpenMenuId(null);
    switch (action) {
      case "setDefault": handleSetDefault(runtime); break;
      case "edit": setEditRuntime(runtime); break;
      case "delete": handleDelete(runtime); break;
    }
  };

  // ---------- FILTERING & PAGINATION ----------
  const filteredRuntimes = useMemo(() => {
    if (!searchTerm) return runtimes;
    const term = searchTerm.toLowerCase();
    return runtimes.filter(r =>
      (r.name || "").toLowerCase().includes(term) ||
      (r.phpVersion || "").toLowerCase().includes(term)
    );
  }, [runtimes, searchTerm]);

  const totalItems = filteredRuntimes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedRuntimes = filteredRuntimes.slice(startIndex, endIndex);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="runtimes-tab">
        <div className="runtimes-skeleton" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="runtimes-tab">
        <div className="runtimes-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="runtimes-tab">
      {/* === TOOLBAR === */}
      <div className="runtimes-toolbar">
        <button className="runtimes-btn-primary" onClick={() => setShowCreateModal(true)}>
          + {t("toolbar.add")}
        </button>
        <div className="runtimes-toolbar-spacer" />
        <input
          type="text"
          className="runtimes-search"
          placeholder={t("toolbar.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* === INFO BANNER === */}
      <div className="runtimes-info-banner">
        <span className="runtimes-info-icon">ℹ</span>
        <span>{t("info.description")}</span>
      </div>

      {/* === TABLE === */}
      {paginatedRuntimes.length === 0 ? (
        <div className="runtimes-empty">
          <div className="runtimes-empty-icon">⚙️</div>
          <p>{searchTerm ? t("table.noResults") : t("table.noRuntimes")}</p>
          {!searchTerm && (
            <button className="runtimes-btn-primary" onClick={() => setShowCreateModal(true)}>
              {t("toolbar.addFirst")}
            </button>
          )}
        </div>
      ) : (
        <div className="runtimes-table-container">
          <table className="runtimes-table">
            <thead>
              <tr>
                <th>{t("table.name")}</th>
                <th>{t("table.type")}</th>
                <th>{t("table.phpVersion")}</th>
                <th>{t("table.publicDir")}</th>
                <th>{t("table.status")}</th>
                <th>{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRuntimes.map(runtime => (
                <tr key={runtime.id}>
                  <td>
                    <span className="runtimes-name">{runtime.name || `runtime-${runtime.id}`}</span>
                    {runtime.isDefault && (
                      <span className="runtimes-badge runtimes-badge-primary">{t("badge.default")}</span>
                    )}
                  </td>
                  <td>{runtime.type || "PHP"}</td>
                  <td>
                    <code className="runtimes-code">{runtime.phpVersion || "-"}</code>
                    {runtime.phpVersion && parseFloat(runtime.phpVersion) < 8.0 && (
                      <span className="runtimes-badge runtimes-badge-warning">!</span>
                    )}
                  </td>
                  <td><code className="runtimes-code">{runtime.publicDir || "/public"}</code></td>
                  <td>
                    <span className={`runtimes-badge ${runtime.status === "ok" ? "runtimes-badge-success" : "runtimes-badge-warning"}`}>
                      {runtime.status === "ok" ? t("badge.active") : runtime.status}
                    </span>
                  </td>
                  <td className="runtimes-actions-cell">
                    <button
                      className="runtimes-actions-btn"
                      onClick={() => setOpenMenuId(openMenuId === runtime.id ? null : runtime.id)}
                    >
                      ⋮
                    </button>
                    {openMenuId === runtime.id && (
                      <div className="runtimes-actions-menu">
                        {!runtime.isDefault && (
                          <button onClick={() => handleMenuAction("setDefault", runtime)}>{t("actions.setDefault")}</button>
                        )}
                        <button onClick={() => handleMenuAction("edit", runtime)}>{t("actions.edit")}</button>
                        <button
                          className={runtime.isDefault ? "runtimes-action-disabled" : "runtimes-action-danger"}
                          onClick={() => handleMenuAction("delete", runtime)}
                          disabled={runtime.isDefault}
                        >
                          {t("actions.delete")}
                        </button>
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
      <div className="runtimes-pagination">
        <span className="runtimes-pagination-info">
          {t("pagination.showing")} {startIndex + 1}-{endIndex} {t("pagination.of")} {totalItems}
        </span>
        <div className="runtimes-pagination-controls">
          <span className="runtimes-pagination-label">{t("pagination.perPage")}</span>
          <select
            className="runtimes-pagination-select"
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <div className="runtimes-pagination-buttons">
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

      {/* === MODALS === */}
      <CreateRuntimeModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadRuntimes}
      />

      {editRuntime && (
        <EditRuntimeModal
          serviceName={serviceName}
          runtime={editRuntime}
          isOpen={!!editRuntime}
          onClose={() => setEditRuntime(null)}
          onSuccess={loadRuntimes}
        />
      )}
    </div>
  );
}

export default RuntimesTab;
