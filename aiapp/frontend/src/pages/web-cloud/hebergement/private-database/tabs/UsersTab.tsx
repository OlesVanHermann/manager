// ============================================================
// PRIVATE DB TAB: USERS
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService, PrivateDatabaseUser } from "../../../../../services/web-cloud.private-database";

interface Props { serviceName: string; }

export function UsersTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [users, setUsers] = useState<PrivateDatabaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await privateDatabaseService.listUsers(serviceName);
        const data = await Promise.all(names.map(n => privateDatabaseService.getUser(serviceName, n)));
        setUsers(data);
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="users-tab">
      <div className="tab-header"><h3>{t("users.title")}</h3><p className="tab-description">{t("users.description")}</p></div>
      {users.length === 0 ? (
        <div className="empty-state"><p>{t("users.empty")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("users.name")}</th><th>{t("users.created")}</th><th>{t("users.databases")}</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.userName}>
                <td className="font-mono">{u.userName}</td>
                <td>{new Date(u.creationDate).toLocaleDateString()}</td>
                <td>{u.databases?.map(d => <span key={d.databaseName} className="db-badge">{d.databaseName}</span>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UsersTab;
