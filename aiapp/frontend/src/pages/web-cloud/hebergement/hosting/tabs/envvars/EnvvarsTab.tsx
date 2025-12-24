// ============================================================
import "./EnvvarsTab.css";
// HOSTING TAB: ENVVARS - Variables d'environnement
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { envvarsService } from "./EnvvarsTab";
import type { EnvVar } from "../../hosting.types";
import { CreateEnvvarModal, EditEnvvarModal } from "./modals";

interface Props { serviceName: string; }

const PAGE_SIZE = 10;

export function EnvvarsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.envvars");
  const [envvars, setEnvvars] = useState<EnvVar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editEnvvar, setEditEnvvar] = useState<EnvVar | null>(null);

  const loadEnvvars = useCallback(async () => {
    try {
      setLoading(true);
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

  const handleDelete = async (key: string) => {
    if (!confirm(t("envvars.confirmDelete", { key }))) return;
    try {
      await envvarsService.deleteEnvVar(serviceName, key);
      loadEnvvars();
    } catch (err) {
      alert(String(err));
    }
  };

  // --- FILTERING ---
  const filteredEnvvars = useMemo(() => {
    if (!searchTerm) return envvars;
    const term = searchTerm.toLowerCase();
    return envvars.filter(e => e.key.toLowerCase().includes(term));
  }, [envvars, searchTerm]);

  const totalPages = Math.ceil(filteredEnvvars.length / PAGE_SIZE);
  const paginatedEnvvars = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredEnvvars.slice(start, start + PAGE_SIZE);
  }, [filteredEnvvars, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" style={{ height: "400px" }} /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="envvars-tab">
      {/* Header */}
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

      {/* Table */}
      {paginatedEnvvars.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔧</div>
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
              {paginatedEnvvars.map(env => (
                <tr key={env.key}>
                  <td className="font-mono font-medium">{env.key}</td>
                  <td>
                    <code className="value-cell">{env.value || "***"}</code>
                  </td>
                  <td>{env.type || "string"}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        onClick={() => setEditEnvvar(env)}
                        title={t("envvars.edit")}
                      >✏️</button>
                      <button 
                        className="btn-icon btn-danger-icon" 
                        onClick={() => handleDelete(env.key)}
                        title={t("envvars.delete")}
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
