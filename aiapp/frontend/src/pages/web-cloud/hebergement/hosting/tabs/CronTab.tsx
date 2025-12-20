// ============================================================
// HOSTING TAB: CRON - Taches planifiees
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, CronJob } from "../../../../../services/web-cloud.hosting";

interface Props { serviceName: string; }

/** Onglet Taches planifiees (Cron). */
export function CronTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [crons, setCrons] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await hostingService.listCronJobs(serviceName);
        const data = await Promise.all(ids.map(id => hostingService.getCronJob(serviceName, id)));
        setCrons(data);
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="cron-tab">
      <div className="tab-header">
        <div>
          <h3>{t("cron.title")}</h3>
          <p className="tab-description">{t("cron.description")}</p>
        </div>
      </div>

      {crons.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p>{t("cron.empty")}</p>
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
            </tr>
          </thead>
          <tbody>
            {crons.map(c => (
              <tr key={c.id}>
                <td className="font-mono command-cell">{c.command}</td>
                <td className="font-mono">{c.frequency}</td>
                <td><span className="badge info">{c.language}</span></td>
                <td>{c.email || '-'}</td>
                <td><span className={`badge ${c.status === 'enabled' ? 'success' : c.status === 'disabled' ? 'inactive' : 'warning'}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CronTab;
