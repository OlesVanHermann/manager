// ============================================================
// HOSTING TAB: DATABASE - Bases de donnees
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Database } from "../../../../services/web-cloud.hosting";

interface Props { serviceName: string; }

/** Onglet Bases de donnees. */
export function DatabaseTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [databases, setDatabases] = useState<Database[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await hostingService.listDatabases(serviceName);
        const data = await Promise.all(names.map(n => hostingService.getDatabase(serviceName, n)));
        setDatabases(data);
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  const formatQuota = (q: { value: number; unit: string }) => q.unit === 'MB' ? `${q.value} MB` : `${q.value} ${q.unit}`;
  const getQuotaPercent = (used: { value: number }, size: { value: number }) => Math.round((used.value / size.value) * 100);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="database-tab">
      <div className="tab-header">
        <div>
          <h3>{t("database.title")}</h3>
          <p className="tab-description">{t("database.description")}</p>
        </div>
        <span className="records-count">{databases.length} {t("database.count")}</span>
      </div>

      {databases.length === 0 ? (
        <div className="empty-state"><p>{t("database.empty")}</p></div>
      ) : (
        <div className="database-cards">
          {databases.map(db => (
            <div key={db.name} className="database-card">
              <div className="db-header">
                <span className={`db-type type-${db.type}`}>{db.type}</span>
                <span className={`badge ${db.state === 'activated' ? 'success' : 'warning'}`}>{db.state}</span>
              </div>
              <h4 className="font-mono">{db.name}</h4>
              <div className="db-info">
                <div><label>{t("database.server")}</label><span className="font-mono">{db.server}:{db.port}</span></div>
                <div><label>{t("database.user")}</label><span className="font-mono">{db.user}</span></div>
                <div><label>{t("database.version")}</label><span>{db.version}</span></div>
              </div>
              <div className="quota-mini">
                <div className="quota-bar"><div className="quota-fill" style={{ width: `${getQuotaPercent(db.quotaUsed, db.quotaSize)}%` }} /></div>
                <span>{formatQuota(db.quotaUsed)} / {formatQuota(db.quotaSize)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DatabaseTab;
