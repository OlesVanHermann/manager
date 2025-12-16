// ============================================================
// PRIVATE DB TAB: DATABASES
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService, PrivateDatabaseDb } from "../../../../services/private-database.service";

interface Props { serviceName: string; }

export function DatabasesTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [dbs, setDbs] = useState<PrivateDatabaseDb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await privateDatabaseService.listDbs(serviceName);
        const data = await Promise.all(names.map(n => privateDatabaseService.getDb(serviceName, n)));
        setDbs(data);
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="databases-tab">
      <div className="tab-header"><h3>{t("databases.title")}</h3><p className="tab-description">{t("databases.description")}</p></div>
      {dbs.length === 0 ? (
        <div className="empty-state"><p>{t("databases.empty")}</p></div>
      ) : (
        <div className="db-cards">
          {dbs.map(db => (
            <div key={db.databaseName} className="db-card">
              <h4 className="font-mono">{db.databaseName}</h4>
              <div className="db-meta"><span>{db.quotaUsed?.value || 0} {db.quotaUsed?.unit || 'MB'}</span><span>{new Date(db.creationDate).toLocaleDateString()}</span></div>
              <div className="db-users">{db.users?.map(u => <span key={u.userName} className="user-badge">{u.userName} ({u.grantType})</span>)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DatabasesTab;
