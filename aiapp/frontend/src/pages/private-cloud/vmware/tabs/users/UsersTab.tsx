import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usersService } from "./UsersTab.service";
import type { User } from "../../vmware.types";
import "./UsersTab.css";
export default function UsersTab({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { loadData(); }, [serviceId]);
  const loadData = async () => { try { setLoading(true); setError(null); setUsers(await usersService.getUsers(serviceId)); } catch (e) { setError(e instanceof Error ? e.message : "Erreur"); } finally { setLoading(false); } };
  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadData}>{tCommon("actions.retry")}</button></div>;
  if (!users.length) return <div className="users-empty"><h2>{t("users.empty.title")}</h2></div>;
  return (
    <div className="users-tab">
      <div className="users-toolbar"><h2>{t("users.title")}</h2><button className="btn btn-primary">{t("users.add")}</button></div>
      <table className="users-table"><thead><tr><th>{t("users.columns.login")}</th><th>{t("users.columns.name")}</th><th>{t("users.columns.email")}</th><th>{t("users.columns.permissions")}</th><th>{t("users.columns.actions")}</th></tr></thead>
        <tbody>{users.map((u) => <tr key={u.userId}><td><strong>{u.login}</strong></td><td>{u.name}</td><td>{u.email||"-"}</td><td>{u.canManageNetwork&&"🌐 "}{u.canManageIpFailOvers&&"🔀"}</td><td><button className="btn btn-sm btn-outline">{tCommon("actions.edit")}</button></td></tr>)}</tbody>
      </table>
    </div>
  );
}
