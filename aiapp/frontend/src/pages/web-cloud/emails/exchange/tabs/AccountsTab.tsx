// ============================================================
// EXCHANGE TAB: ACCOUNTS (style Hosting)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { exchangeService, ExchangeAccount } from "../../../../../services/web-cloud.exchange";

interface Props { org: string; service: string; }

/** Onglet Comptes Exchange. */
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
  const getUsagePercent = (used: number, quota: number) => quota > 0 ? Math.round((used / quota) * 100) : 0;
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  if (loading && accounts.length === 0) return <div className="tab-loading"><div className="skeleton-block" /><div className="skeleton-block" /></div>;

  return (
    <div className="accounts-tab">
      <div className="tab-header">
        <div><h3>{t("accounts.title")}</h3></div>
        <span className="records-count">{accounts.length}</span>
      </div>

      <div className="email-stats">
        <div className="stat-card exchange"><div className="stat-value">{accounts.length}</div><div className="stat-label">Total</div></div>
        <div className="stat-card exchange"><div className="stat-value">{accounts.filter(a => a.state === 'ok').length}</div><div className="stat-label">Actifs</div></div>
        <div className="stat-card exchange"><div className="stat-value">{accounts.filter(a => a.outlookLicense).length}</div><div className="stat-label">Outlook</div></div>
      </div>

      {accounts.length === 0 ? (
        <div className="empty-state"><p>{t("accounts.empty")}</p></div>
      ) : (
        <div className="account-cards">
          {accounts.map(a => {
            const percent = getUsagePercent(a.currentUsage, a.quota);
            return (
              <div key={a.primaryEmailAddress} className={`account-card ${a.state !== 'ok' ? 'suspended' : ''}`}>
                <div className="account-header">
                  <div className="account-avatar">{getInitials(a.displayName || a.login)}</div>
                  <div className="account-identity">
                    <h4>{a.displayName || `${a.firstName} ${a.lastName}`}</h4>
                    <p>{a.primaryEmailAddress}</p>
                  </div>
                </div>
                <div className="account-quota">
                  <div className="quota-bar"><div className={`quota-fill ${percent > 90 ? 'warning' : ''}`} style={{ width: `${percent}%` }} /></div>
                  <div className="quota-text"><span>{formatSize(a.currentUsage)}</span><span>{formatSize(a.quota)}</span></div>
                </div>
                <div className="account-features">
                  <span className={`feature-badge ${a.outlookLicense ? 'active' : ''}`}>Outlook {a.outlookLicense ? '✓' : '✗'}</span>
                  {a.litigation && <span className="feature-badge active">Litigation Hold</span>}
                  {a.hiddenFromGAL && <span className="feature-badge">Masqué GAL</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AccountsTab;
