import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as vmwareService from "../../../../services/private-cloud.vmware";

interface User { userId: number; name: string; login: string; email?: string; canManageNetwork: boolean; canManageIpFailOvers: boolean; state: string; }
interface UsersTabProps { serviceId: string; }

export default function UsersTab({ serviceId }: UsersTabProps) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadUsers(); }, [serviceId]);

  const loadUsers = async () => {
    try { setLoading(true); setError(null); const data = await vmwareService.getUsers(serviceId); setUsers(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadUsers}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="users-tab">
      <div className="tab-toolbar"><h2>{t("users.title")}</h2><button className="btn btn-primary">{t("users.add")}</button></div>
      {users.length === 0 ? <div className="empty-state"><h2>{t("users.empty.title")}</h2></div> : (
        <table className="data-table">
          <thead><tr><th>{t("users.columns.login")}</th><th>{t("users.columns.name")}</th><th>{t("users.columns.email")}</th><th>{t("users.columns.permissions")}</th><th>{t("users.columns.actions")}</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td><strong>{user.login}</strong></td>
                <td>{user.name}</td>
                <td>{user.email || "-"}</td>
                <td>{user.canManageNetwork && "🌐 "}{user.canManageIpFailOvers && "🔀"}</td>
                <td className="item-actions"><button className="btn btn-sm btn-outline">{tCommon("actions.edit")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
