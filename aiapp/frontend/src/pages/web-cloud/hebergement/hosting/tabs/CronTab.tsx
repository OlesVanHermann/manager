// ============================================================
// HOSTING TAB: CRON - Tâches planifiées
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Cron } from "../../../../../services/web-cloud.hosting";
import { CreateCronModal, EditCronModal } from "../components";

interface Props { serviceName: string; }

const PAGE_SIZE = 10;

export function CronTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [crons, setCrons] = useState<Cron[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCron, setEditCron] = useState<Cron | null>(null);

  const loadCrons = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await hostingService.listCrons(serviceName);
      const data = await Promise.all(ids.map(id => hostingService.getCron(serviceName, id)));
      setCrons(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadCrons(); }, [loadCrons]);

  const handleDelete = async (id: number) => {
    if (!confirm(t("cron.confirmDelete"))) return;
    try {
      await hostingService.deleteCron(serviceName, id);
      loadCrons();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleToggleStatus = async (cron: Cron) => {
    try {
      await hostingService.updateCron(serviceName, cron.id, {
        status: cron.status === "enabled" ? "disabled" : "enabled"
      });
      loadCrons();
    } catch (err) {
      alert(String(err));
    }
  };

  // --- FILTERING ---
  const filteredCrons = useMemo(() => {
    if (!searchTerm) return crons;
    const term = searchTerm.toLowerCase();
    return crons.filter(c => 
      c.command.toLowerCase().includes(term) || 
      (c.description || "").toLowerCase().includes(term)
    );
  }, [crons, searchTerm]);

  const totalPages = Math.ceil(filteredCrons.length / PAGE_SIZE);
  const paginatedCrons = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCrons.slice(start, start + PAGE_SIZE);
  }, [filteredCrons, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" style={{ height: "400px" }} /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="cron-tab">
      {/* Header */}
      <div className="tab-header">
        <div>
          <h3>{t("cron.title")}</h3>
          <p className="tab-description">
            {t("cron.description")} 
            <a href="https://help.ovhcloud.com/csm/fr-web-hosting-cron" target="_blank" rel="noopener noreferrer" className="link-action" style={{ marginLeft: "0.5rem" }}>
              Consulter le guide ↗
            </a>
          </p>
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

      {/* Table */}
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
                <th>Description</th>
                <th>{t("cron.frequency")}</th>
                <th>{t("cron.language")}</th>
                <th>{t("cron.status")}</th>
                <th>{t("cron.email")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCrons.map(cron => (
                <tr key={cron.id}>
                  <td><code className="command-cell">{cron.command}</code></td>
                  <td>{cron.description || "-"}</td>
                  <td>{cron.frequency || "-"}</td>
                  <td>{cron.language || "PHP"}</td>
                  <td>
                    <button 
                      className={`badge-toggle ${cron.status === "enabled" ? "active" : ""}`}
                      onClick={() => handleToggleStatus(cron)}
                      title={t("cron.toggleStatus")}
                    >
                      {cron.status === "enabled" ? "Actif" : "Désactivé"}
                    </button>
                  </td>
                  <td>{cron.email ? "Oui" : "Non"}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        onClick={() => setEditCron(cron)}
                        title={t("cron.edit")}
                      >✏️</button>
                      <button 
                        className="btn-icon btn-danger-icon" 
                        onClick={() => handleDelete(cron.id)}
                        title={t("cron.delete")}
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
      <CreateCronModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadCrons}
      />

      {editCron && (
        <EditCronModal
          serviceName={serviceName}
          cron={editCron}
          isOpen={!!editCron}
          onClose={() => setEditCron(null)}
          onSuccess={loadCrons}
        />
      )}
    </div>
  );
}

export default CronTab;
