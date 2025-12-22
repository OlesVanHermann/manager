// ============================================================
// HOSTING TAB: RUNTIMES - Environnements d'exécution
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Runtime } from "../../../../../services/web-cloud.hosting";
import { CreateRuntimeModal } from "../components/CreateRuntimeModal";
import { EditRuntimeModal } from "../components/EditRuntimeModal";

interface Props { serviceName: string; }

const PAGE_SIZE = 10;

/** Onglet Runtimes avec CRUD complet + gestion du runtime par défaut. */
export function RuntimesTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [runtimes, setRuntimes] = useState<Runtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; runtime: Runtime | null }>({ open: false, runtime: null });
  const [settingDefault, setSettingDefault] = useState<number | null>(null);

  // ---------- LOAD ----------
  const loadRuntimes = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await hostingService.listRuntimes(serviceName);
      const data = await Promise.all(ids.map(id => hostingService.getRuntime(serviceName, id)));
      setRuntimes(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadRuntimes(); }, [loadRuntimes]);

  // ---------- HANDLERS ----------
  const handleDelete = async (id: number, isDefault: boolean) => {
    if (isDefault) {
      alert(t("runtimes.cannotDeleteDefault"));
      return;
    }
    if (!confirm(t("runtimes.confirmDelete"))) return;
    try {
      await hostingService.deleteRuntime(serviceName, id);
      loadRuntimes();
    } catch (err) { alert(String(err)); }
  };

  const handleSetDefault = async (runtime: Runtime) => {
    if (runtime.isDefault) return;
    setSettingDefault(runtime.id);
    try {
      await hostingService.setDefaultRuntime(serviceName, runtime.id);
      loadRuntimes();
    } catch (err) {
      alert(String(err));
    } finally {
      setSettingDefault(null);
    }
  };

  // ---------- FILTERING ----------
  const filteredRuntimes = useMemo(() => {
    if (!searchTerm) return runtimes;
    const term = searchTerm.toLowerCase();
    return runtimes.filter(r => 
      r.name?.toLowerCase().includes(term) || 
      r.type?.toLowerCase().includes(term)
    );
  }, [runtimes, searchTerm]);

  // ---------- PAGINATION ----------
  const totalPages = Math.ceil(filteredRuntimes.length / PAGE_SIZE);
  const paginatedRuntimes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRuntimes.slice(start, start + PAGE_SIZE);
  }, [filteredRuntimes, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  // ---------- RENDER ----------
  return (
    <div className="runtimes-tab">
      <div className="tab-header">
        <div>
          <h3>{t("runtimes.title")}</h3>
          <p className="tab-description">{t("runtimes.description")}</p>
        </div>
        <div className="tab-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            + {t("runtimes.create")}
          </button>
        </div>
      </div>

      {/* Info box for Cloud Web */}
      <div className="info-box">
        <strong>{t("runtimes.info")}</strong>
        <p>{t("runtimes.infoDesc")}</p>
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
        <span className="records-count">{runtimes.length} {t("runtimes.count")}</span>
      </div>

      {/* Runtimes table */}
      {paginatedRuntimes.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? t("common.noResult") : t("runtimes.empty")}</p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              {t("runtimes.createFirst")}
            </button>
          )}
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("runtimes.name")}</th>
                <th>{t("runtimes.type")}</th>
                <th>{t("runtimes.publicDir")}</th>
                <th>{t("runtimes.appEnv")}</th>
                <th>{t("runtimes.default")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRuntimes.map(r => (
                <tr key={r.id}>
                  <td className="font-mono">{r.name || `Runtime #${r.id}`}</td>
                  <td>{r.type || "-"}</td>
                  <td className="font-mono">{r.publicDir || "-"}</td>
                  <td>{r.appEnv || "production"}</td>
                  <td>
                    {r.isDefault ? (
                      <span className="badge success">Par défaut</span>
                    ) : (
                      <button
                        className="btn btn-secondary btn-xs"
                        onClick={() => handleSetDefault(r)}
                        disabled={settingDefault === r.id}
                      >
                        {settingDefault === r.id ? "..." : t("runtimes.setDefault")}
                      </button>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        onClick={() => setEditModal({ open: true, runtime: r })}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-icon btn-danger-icon" 
                        onClick={() => handleDelete(r.id, !!r.isDefault)}
                        title={t("runtimes.delete")}
                        disabled={r.isDefault}
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
      <CreateRuntimeModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadRuntimes}
      />

      <EditRuntimeModal
        serviceName={serviceName}
        runtime={editModal.runtime}
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, runtime: null })}
        onSuccess={loadRuntimes}
      />
    </div>
  );
}

export default RuntimesTab;
