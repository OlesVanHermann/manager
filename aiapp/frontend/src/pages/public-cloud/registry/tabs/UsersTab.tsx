import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as registryService from "../../../../services/public-cloud.registry";

interface RegistryUser { id: string; user: string; email?: string; }
interface UsersTabProps { projectId: string; registryId: string; }

export default function UsersTab({ projectId, registryId }: UsersTabProps) {
  const { t } = useTranslation("public-cloud/registry/index");
  const { t: tCommon } = useTranslation("common");
  const [users, setUsers] = useState<RegistryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadUsers(); }, [projectId, registryId]);

  const loadUsers = async () => {
    try { setLoading(true); setError(null); const data = await registryService.getUsers(projectId, registryId); setUsers(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
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
          <thead><tr><th>{t("users.columns.user")}</th><th>{t("users.columns.email")}</th><th>{t("users.columns.actions")}</th></tr></thead>
          <tbody>
            {users.map((user) => (<tr key={user.id}><td className="mono">{user.user}</td><td>{user.email || "-"}</td><td className="item-actions"><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td></tr>))}
          </tbody>
        </table>
      )}
    </div>
  );
}
