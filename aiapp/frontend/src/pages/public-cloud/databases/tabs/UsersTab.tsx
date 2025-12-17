import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as dbService from "../../../../services/public-cloud.databases";

interface DbUser { id: string; username: string; status: string; createdAt: string; }
interface UsersTabProps { projectId: string; engine: string; serviceId: string; }

export default function UsersTab({ projectId, engine, serviceId }: UsersTabProps) {
  const { t } = useTranslation("public-cloud/databases/index");
  const { t: tCommon } = useTranslation("common");
  const [users, setUsers] = useState<DbUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadUsers(); }, [projectId, engine, serviceId]);

  const loadUsers = async () => {
    try { setLoading(true); setError(null); const data = await dbService.getUsers(projectId, engine, serviceId); setUsers(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { READY: "badge-success", PENDING: "badge-warning" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadUsers}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="users-tab">
      <div className="tab-toolbar"><h2>{t("users.title")}</h2><button className="btn btn-primary">{t("users.add")}</button></div>
      {users.length === 0 ? (
        <div className="empty-state"><h2>{t("users.empty.title")}</h2></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("users.columns.username")}</th><th>{t("users.columns.status")}</th><th>{t("users.columns.created")}</th><th>{t("users.columns.actions")}</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}><td className="mono">{user.username}</td><td>{getStatusBadge(user.status)}</td><td>{new Date(user.createdAt).toLocaleDateString("fr-FR")}</td><td className="item-actions"><button className="btn btn-sm btn-outline">{t("users.actions.resetPassword")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
