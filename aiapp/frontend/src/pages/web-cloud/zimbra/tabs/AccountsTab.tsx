import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { zimbraService, ZimbraAccount } from "../../../../services/web-cloud.zimbra";

interface Props { serviceId: string; }

export function AccountsTab({ serviceId }: Props) {
  const { t } = useTranslation("web-cloud/zimbra/index");
  const [accounts, setAccounts] = useState<ZimbraAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await zimbraService.listAccounts(serviceId);
        const data: ZimbraAccount[] = [];
        for (let i = 0; i < ids.length; i += 5) {
          const batch = ids.slice(i, i + 5);
          const results = await Promise.all(batch.map(id => zimbraService.getAccount(serviceId, id)));
          data.push(...results);
          setAccounts([...data]);
        }
      } finally { setLoading(false); }
    };
    load();
  }, [serviceId]);

  const formatQuota = (q: { used: number; available: number }) => `${(q.used / 1024 / 1024 / 1024).toFixed(2)} / ${(q.available / 1024 / 1024 / 1024).toFixed(0)} GB`;

  if (loading && accounts.length === 0) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="accounts-tab">
      <div className="tab-header"><h3>{t("accounts.title")}</h3><span className="records-count">{accounts.length}</span></div>
      {accounts.length === 0 ? (<div className="empty-state"><p>{t("accounts.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("accounts.email")}</th><th>{t("accounts.name")}</th><th>{t("accounts.offer")}</th><th>{t("accounts.quota")}</th><th>{t("accounts.lastLogin")}</th><th>{t("accounts.status")}</th></tr></thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a.id}>
                <td className="font-mono">{a.email}</td>
                <td>{a.displayName || `${a.firstName} ${a.lastName}`}</td>
                <td><span className="badge info">{a.offer}</span></td>
                <td>{formatQuota(a.quota)}</td>
                <td>{a.lastLogonDate ? new Date(a.lastLogonDate).toLocaleDateString() : '-'}</td>
                <td><span className={`badge ${a.status === 'ok' ? 'success' : 'warning'}`}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default AccountsTab;
