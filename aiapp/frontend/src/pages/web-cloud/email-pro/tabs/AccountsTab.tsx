import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { emailProService, EmailProAccount } from "../../../../services/email-pro.service";

interface Props { service: string; }

export function AccountsTab({ service }: Props) {
  const { t } = useTranslation("web-cloud/email-pro/index");
  const [accounts, setAccounts] = useState<EmailProAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const emails = await emailProService.listAccounts(service);
        const data = await Promise.all(emails.map(e => emailProService.getAccount(service, e)));
        setAccounts(data);
      } finally { setLoading(false); }
    };
    load();
  }, [service]);

  const formatSize = (bytes: number | null) => bytes ? `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB` : '-';

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="accounts-tab">
      <div className="tab-header"><h3>{t("accounts.title")}</h3><span className="records-count">{accounts.length}</span></div>
      {accounts.length === 0 ? (<div className="empty-state"><p>{t("accounts.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("accounts.email")}</th><th>{t("accounts.name")}</th><th>{t("accounts.usage")}</th><th>{t("accounts.lastLogin")}</th><th>{t("accounts.status")}</th></tr></thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a.primaryEmailAddress}>
                <td className="font-mono">{a.primaryEmailAddress}</td>
                <td>{a.displayName}</td>
                <td>{formatSize(a.currentUsage)} / {formatSize(a.quota)}</td>
                <td>{a.lastLogonDate ? new Date(a.lastLogonDate).toLocaleDateString() : '-'}</td>
                <td><span className={`badge ${a.state === 'ok' ? 'success' : 'warning'}`}>{a.state}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default AccountsTab;
