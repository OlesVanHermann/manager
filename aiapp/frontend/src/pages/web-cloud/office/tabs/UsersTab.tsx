import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { officeService, OfficeUser } from "../../../../services/web-cloud.office";

interface Props { serviceName: string; }

export function UsersTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/office/index");
  const [users, setUsers] = useState<OfficeUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await officeService.listUsers(serviceName);
        const data = await Promise.all(ids.map(id => officeService.getUser(serviceName, id)));
        setUsers(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="users-tab">
      <div className="tab-header"><h3>{t("users.title")}</h3><span className="records-count">{users.length}</span></div>
      {users.length === 0 ? (<div className="empty-state"><p>{t("users.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("users.login")}</th><th>{t("users.name")}</th><th>{t("users.email")}</th><th>{t("users.licenses")}</th><th>{t("users.status")}</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="font-mono">{u.login}</td>
                <td>{u.firstName} {u.lastName}</td>
                <td className="font-mono">{u.activationEmail}</td>
                <td>{u.licenses?.length || 0}</td>
                <td><span className={`badge ${u.status === 'ok' ? 'success' : 'warning'}`}>{u.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default UsersTab;
