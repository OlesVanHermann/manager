import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { exchangeService, ExchangeAccount } from "../../../../services/web-cloud.exchange";

interface Props { org: string; service: string; }

export function AccountsTab({ org, service }: Props) {
  const { t } = useTranslation("web-cloud/exchange/index");
  const [accounts, setAccounts] = useState<ExchangeAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const emails = await exchangeService.listAccounts(org, service);
        const data: ExchangeAccount[] = [];
        for (let i = 0; i < emails.length; i += 5) {
          const batch = emails.slice(i, i + 5);
          const results = await Promise.all(batch.map(e => exchangeService.getAccount(org, service, e)));
          data.push(...results);
          setAccounts([...data]);
        }
      } finally { setLoading(false); }
    };
    load();
  }, [org, service]);

  const formatSize = (bytes: number) => `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;

  if (loading && accounts.length === 0) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="accounts-tab">
      <div className="tab-header"><h3>{t("accounts.title")}</h3><span className="records-count">{accounts.length}</span></div>
      {accounts.length === 0 ? (<div className="empty-state"><p>{t("accounts.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("accounts.email")}</th><th>{t("accounts.name")}</th><th>{t("accounts.usage")}</th><th>Outlook</th><th>{t("accounts.status")}</th></tr></thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a.primaryEmailAddress}>
                <td className="font-mono">{a.primaryEmailAddress}</td>
                <td>{a.displayName}</td>
                <td>{formatSize(a.currentUsage)} / {formatSize(a.quota)}</td>
                <td><span className={`badge ${a.outlookLicense ? 'success' : 'inactive'}`}>{a.outlookLicense ? '✓' : '✗'}</span></td>
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
