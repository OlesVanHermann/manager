// ============================================================
// HOSTING TAB: CRON - Taches planifiees avec CRUD
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, CronJob } from "../../../../../services/web-cloud.hosting";
import { CreateCronModal } from "../components/CreateCronModal";

interface Props { serviceName: string; }

/** Onglet Taches planifiees avec création et suppression. */
export function CronTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [crons, setCrons] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadCrons = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await hostingService.listCronJobs(serviceName);
      const data = await Promise.all(ids.map(id => hostingService.getCronJob(serviceName, id)));
      setCrons(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => {
    loadCrons();
  }, [loadCrons]);

  const handleDelete = async (id: number) => {
    if (!confirm(t("cron.confirmDelete"))) return;
    try {
      await hostingService.deleteCronJob(serviceName, id);
      loadCrons();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleToggle = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
      await hostingService.updateCronJob(serviceName, id, { status: newStatus });
      loadCrons();
    } catch (err) {
      alert(String(err));
    }
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="cron-tab">
      <div className="tab-header">
        <div>
          <h3>{t("cron.title")}</h3>
          <p className="tab-description">{t("cron.description")}</p>
        </div>
        <div className="tab-actions">
          <span className="records-count">{crons.length} {t("cron.count")}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            + {t("cron.create")}
          </button>
        </div>
      </div>

      {crons.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p>{t("cron.empty")}</p>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            {t("cron.createFirst")}
          </button>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("cron.command")}</th>
              <th>{t("cron.frequency")}</th>
              <th>{t("cron.language")}</th>
              <th>{t("cron.email")}</th>
              <th>{t("cron.status")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {crons.map(c => (
              <tr key={c.id}>
                <td className="font-mono command-cell" title={c.command}>{c.command}</td>
                <td className="font-mono">{c.frequency}</td>
                <td><span className="badge info">{c.language}</span></td>
                <td>{c.email || '-'}</td>
                <td>
                  <button
                    className={`badge-btn ${c.status === 'enabled' ? 'success' : c.status === 'disabled' ? 'inactive' : 'warning'}`}
                    onClick={() => handleToggle(c.id, c.status)}
                    title={t("cron.toggleStatus")}
                  >
                    {c.status}
                  </button>
                </td>
                <td>
                  <button
                    className="btn-icon btn-danger-icon"
                    onClick={() => handleDelete(c.id)}
                    title={t("cron.delete")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <CreateCronModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadCrons}
      />
    </div>
  );
}

export default CronTab;
