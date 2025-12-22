// ============================================================
// HOSTING TAB: ENVVARS - Variables d'environnement
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, EnvVar } from "../../../../../services/web-cloud.hosting";
import { CreateEnvvarModal } from "../components/CreateEnvvarModal";
import { EditEnvvarModal } from "../components/EditEnvvarModal";

interface Props { serviceName: string; }

const PAGE_SIZE = 10;

/** Onglet Variables d'environnement avec CRUD complet. */
export function EnvvarsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [envvars, setEnvvars] = useState<EnvVar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; envvar: EnvVar | null }>({ open: false, envvar: null });

  // ---------- LOAD ----------
  const loadEnvvars = useCallback(async () => {
    try {
      setLoading(true);
      const keys = await hostingService.listEnvVars(serviceName);
      const data = await Promise.all(keys.map(k => hostingService.getEnvVar(serviceName, k)));
      setEnvvars(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadEnvvars(); }, [loadEnvvars]);

  // ---------- HANDLERS ----------
  const handleDelete = async (key: string) => {
    if (!confirm(t("envvars.confirmDelete", { key }))) return;
    try {
      await hostingService.deleteEnvVar(serviceName, key);
      loadEnvvars();
    } catch (err) { alert(String(err)); }
  };

  // ---------- FILTERING ----------
  const filteredEnvvars = useMemo(() => {
    if (!searchTerm) return envvars;
    const term = searchTerm.toLowerCase();
    return envvars.filter(e => e.key.toLowerCase().includes(term));
  }, [envvars, searchTerm]);

  // ---------- PAGINATION ----------
  const totalPages = Math.ceil(filteredEnvvars.length / PAGE_SIZE);
  const paginatedEnvvars = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredEnvvars.slice(start, start + PAGE_SIZE);
  }, [filteredEnvvars, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  // ---------- RENDER ----------
  return (
    <div className="envvars-tab">
      <div className="tab-header">
        <div>
          <h3>{t("envvars.title")}</h3>
          <p className="tab-description">{t("envvars.description")}</p>
        </div>
        <div className="tab-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            + {t("envvars.create")}
          </button>
        </div>
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
        <span className="records-count">{envvars.length} {t("envvars.count")}</span>
      </div>

      {/* Envvars table */}
      {paginatedEnvvars.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? t("common.noResult") : t("envvars.empty")}</p>
          <p className="empty-hint">{t("envvars.emptyHint")}</p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              {t("envvars.createFirst")}
            </button>
          )}
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("envvars.key")}</th>
                <th>{t("envvars.value")}</th>
                <th>{t("envvars.type")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEnvvars.map(e => (
                <tr key={e.key}>
                  <td className="font-mono">{e.key}</td>
                  <td className="font-mono">
                    <span className="value-masked" title={e.value}>
                      {e.value && e.value.length > 30 ? e.value.substring(0, 30) + "..." : e.value || "-"}
                    </span>
                  </td>
                  <td>{e.type || "string"}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        onClick={() => setEditModal({ open: true, envvar: e })}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-icon btn-danger-icon" 
                        onClick={() => handleDelete(e.key)}
                        title={t("envvars.delete")}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ←
              </button>
              <span className="pagination-info">
                {t("common.page")} {currentPage} / {totalPages}
              </span>
              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                →
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CreateEnvvarModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadEnvvars}
      />

      <EditEnvvarModal
        serviceName={serviceName}
        envvar={editModal.envvar}
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, envvar: null })}
        onSuccess={loadEnvvars}
      />
    </div>
  );
}

export default EnvvarsTab;
