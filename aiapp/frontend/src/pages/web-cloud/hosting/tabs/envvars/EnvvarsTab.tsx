// ============================================================
// ENVVARS TAB - Variables d'environnement
// Conforme au pattern NAV3 standard
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { envvarsService } from "./EnvvarsTab.service";
import type { EnvVar } from "../../hosting.types";
import { CreateEnvvarModal, EditEnvvarModal } from "./modals";
import "./EnvvarsTab.css";

// ============================================================
// TYPES
// ============================================================

interface Props {
  serviceName: string;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function EnvvarsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.envvars");

  const [envvars, setEnvvars] = useState<EnvVar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editEnvvar, setEditEnvvar] = useState<EnvVar | null>(null);

  // ---------- LOAD ----------
  const loadEnvvars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const keys = await envvarsService.listEnvVars(serviceName);
      const data = await Promise.all(keys.map(k => envvarsService.getEnvVar(serviceName, k)));
      setEnvvars(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadEnvvars(); }, [loadEnvvars]);

  // ---------- ACTIONS ----------
  const handleDelete = async (key: string) => {
    if (!confirm(t("modal.delete.confirm", { key }))) return;
    try {
      await envvarsService.deleteEnvVar(serviceName, key);
      loadEnvvars();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleMenuAction = (action: string, env: EnvVar) => {
    setOpenMenuKey(null);
    switch (action) {
      case "edit": setEditEnvvar(env); break;
      case "delete": handleDelete(env.key); break;
    }
  };

  // ---------- FILTERING & PAGINATION ----------
  const filteredEnvvars = useMemo(() => {
    if (!searchTerm) return envvars;
    const term = searchTerm.toLowerCase();
    return envvars.filter(e => e.key.toLowerCase().includes(term));
  }, [envvars, searchTerm]);

  const totalItems = filteredEnvvars.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedEnvvars = filteredEnvvars.slice(startIndex, endIndex);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="envvars-tab">
        <div className="envvars-skeleton" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="envvars-tab">
        <div className="envvars-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="envvars-tab">
      {/* === TOOLBAR === */}
      <div className="envvars-toolbar">
        <button className="envvars-btn-primary" onClick={() => setShowCreateModal(true)}>
          + {t("toolbar.add")}
        </button>
        <div className="envvars-toolbar-spacer" />
        <input
          type="text"
          className="envvars-search"
          placeholder={t("toolbar.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* === TABLE === */}
      {paginatedEnvvars.length === 0 ? (
        <div className="envvars-empty">
          <div className="envvars-empty-icon">🔧</div>
          <p>{searchTerm ? t("table.noResults") : t("table.noEnvvars")}</p>
          {!searchTerm && (
            <button className="envvars-btn-primary" onClick={() => setShowCreateModal(true)}>
              {t("toolbar.addFirst")}
            </button>
          )}
        </div>
      ) : (
        <div className="envvars-table-container">
          <table className="envvars-table">
            <thead>
              <tr>
                <th>{t("table.key")}</th>
                <th>{t("table.value")}</th>
                <th>{t("table.type")}</th>
                <th>{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEnvvars.map(env => (
                <tr key={env.key}>
                  <td><code className="envvars-key">{env.key}</code></td>
                  <td><code className="envvars-value">{env.value || "***"}</code></td>
                  <td><span className="envvars-badge">{env.type || "string"}</span></td>
                  <td className="envvars-actions-cell">
                    <button
                      className="envvars-actions-btn"
                      onClick={() => setOpenMenuKey(openMenuKey === env.key ? null : env.key)}
                    >
                      ⋮
                    </button>
                    {openMenuKey === env.key && (
                      <div className="envvars-actions-menu">
                        <button onClick={() => handleMenuAction("edit", env)}>{t("actions.edit")}</button>
                        <button className="envvars-action-danger" onClick={() => handleMenuAction("delete", env)}>{t("actions.delete")}</button>
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
      <div className="envvars-pagination">
        <span className="envvars-pagination-info">
          {t("pagination.showing")} {startIndex + 1}-{endIndex} {t("pagination.of")} {totalItems}
        </span>
        <div className="envvars-pagination-controls">
          <span className="envvars-pagination-label">{t("pagination.perPage")}</span>
          <select
            className="envvars-pagination-select"
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <div className="envvars-pagination-buttons">
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
      <CreateEnvvarModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadEnvvars}
      />

      {editEnvvar && (
        <EditEnvvarModal
          serviceName={serviceName}
          envvar={editEnvvar}
          isOpen={!!editEnvvar}
          onClose={() => setEditEnvvar(null)}
          onSuccess={loadEnvvars}
        />
      )}
    </div>
  );
}

export default EnvvarsTab;
