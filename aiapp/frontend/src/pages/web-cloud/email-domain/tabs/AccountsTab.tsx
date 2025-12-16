// ============================================================
// EMAIL DOMAIN TAB: ACCOUNTS - Comptes email
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { emailDomainService, EmailAccount } from "../../../../services/email-domain.service";

interface Props { domain: string; }

export function AccountsTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/email-domain/index");
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await emailDomainService.listAccounts(domain);
        const data: EmailAccount[] = [];
        for (let i = 0; i < names.length; i += 10) {
          const batch = names.slice(i, i + 10);
          const results = await Promise.all(batch.map(n => emailDomainService.getAccount(domain, n)));
          data.push(...results);
          setAccounts([...data]);
        }
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [domain]);

  const formatSize = (bytes: number) => bytes > 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} GB` : `${(bytes / 1024).toFixed(0)} MB`;
  const getUsagePercent = (used: number, quota: number) => quota > 0 ? Math.round((used / quota) * 100) : 0;

  if (loading && accounts.length === 0) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="accounts-tab">
      <div className="tab-header"><h3>{t("accounts.title")}</h3><p className="tab-description">{t("accounts.description")}</p><span className="records-count">{accounts.length} {t("accounts.count")}</span></div>
      {accounts.length === 0 ? (
        <div className="empty-state"><p>{t("accounts.empty")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("accounts.email")}</th><th>{t("accounts.description")}</th><th>{t("accounts.usage")}</th><th>{t("accounts.status")}</th></tr></thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a.accountName}>
                <td className="font-mono">{a.email}</td>
                <td>{a.description || '-'}</td>
                <td>
                  <div className="usage-cell">
                    <div className="usage-bar"><div className="usage-fill" style={{ width: `${getUsagePercent(a.size, a.quota)}%` }} /></div>
                    <span>{formatSize(a.size)} / {formatSize(a.quota)}</span>
                  </div>
                </td>
                <td><span className={`badge ${a.isBlocked ? 'error' : 'success'}`}>{a.isBlocked ? t("accounts.blocked") : t("accounts.active")}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AccountsTab;
