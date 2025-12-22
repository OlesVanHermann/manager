// ============================================================
// HOSTING TAB: CRON - Tâches planifiées
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, CronJob } from "../../../../../services/web-cloud.hosting";
import { CreateCronModal } from "../components/CreateCronModal";
import { EditCronModal } from "../components/EditCronModal";

interface Props { serviceName: string; }

const PAGE_SIZE = 10;

/** Onglet Cron avec gestion complète des tâches planifiées. */
export function CronTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [crons, setCrons] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; cron: CronJob | null }>({ open: false, cron: null });
  const [togglingStatus, setTogglingStatus] = useState<number | null>(null);

  // ---------- LOAD ----------
  const loadCrons = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await hostingService.listCrons(serviceName);
      const data = await Promise.all(ids.map(id => hostingService.getCron(serviceName, id)));
      setCrons(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadCrons(); }, [loadCrons]);

  // ---------- HANDLERS ----------
  const handleDelete = async (id: number) => {
    if (!confirm(t("cron.confirmDelete"))) return;
    try {
      await hostingService.deleteCron(serviceName, id);
      loadCrons();
    } catch (err) { alert(String(err)); }
  };

  const handleToggleStatus = async (cron: CronJob) => {
    const newStatus = cron.status === "enabled" ? "disabled" : "enabled";
    setTogglingStatus(cron.id);
    try {
      await hostingService.updateCron(serviceName, cron.id, { status: newStatus });
      loadCrons();
    } catch (err) {
      alert(String(err));
    } finally {
      setTogglingStatus(null);
    }
  };

  // ---------- FILTERING ----------
  const filteredCrons = useMemo(() => {
    if (!searchTerm) return crons;
    const term = searchTerm.toLowerCase();
    return crons.filter(c => 
      c.command.toLowerCase().includes(term) || 
      (c.description?.toLowerCase().includes(term))
    );
  }, [crons, searchTerm]);

  // ---------- PAGINATION ----------
  const totalPages = Math.ceil(filteredCrons.length / PAGE_SIZE);
  const paginatedCrons = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCrons.slice(start, start + PAGE_SIZE);
  }, [filteredCrons, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  // ---------- RENDER ----------
  return (
    <div className="cron-tab">
      <div className="tab-header">
        <div>
          <h3>{t("cron.title")}</h3>
          <p className="tab-description">{t("cron.description")}</p>
        </div>
        <div className="tab-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            + {t("cron.create")}
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
        <span className="records-count">{crons.length} {t("cron.count")}</span>
      </div>

      {/* Crons table */}
      {paginatedCrons.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? t("common.noResult") : t("cron.empty")}</p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              {t("cron.createFirst")}
            </button>
          )}
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("cron.command")}</th>
                <th>{t("cron.frequency")}</th>
                <th>{t("cron.language")}</th>
                <th>{t("cron.status")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCrons.map(c => (
                <tr key={c.id}>
                  <td className="font-mono">
                    {c.command}
                    {c.description && <small className="text-muted d-block">{c.description}</small>}
                  </td>
                  <td className="font-mono">{c.frequency}</td>
                  <td>{c.language}</td>
                  <td>
                    <button
                      className={`toggle-btn ${c.status === 'enabled' ? 'active' : ''}`}
                      onClick={() => handleToggleStatus(c)}
                      disabled={togglingStatus === c.id}
                      title={t("cron.toggleStatus")}
                    >
                      {togglingStatus === c.id ? '...' : (c.status === 'enabled' ? 'ON' : 'OFF')}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        onClick={() => setEditModal({ open: true, cron: c })}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-icon btn-danger-icon" 
                        onClick={() => handleDelete(c.id)}
                        title={t("cron.delete")}
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
      <CreateCronModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadCrons}
      />

      <EditCronModal
        serviceName={serviceName}
        cron={editModal.cron}
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, cron: null })}
        onSuccess={loadCrons}
      />
    </div>
  );
}

export default CronTab;
