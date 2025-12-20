// ============================================================
// EMAIL DOMAIN TAB: ACCOUNTS (style Hosting)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { emailDomainService, EmailAccount } from "../../../../../services/web-cloud.email-domain";

interface Props { domain: string; }

/** Onglet Comptes email MX Plan. */
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
  const getInitials = (email: string) => email.split('@')[0].substring(0, 2).toUpperCase();

  if (loading && accounts.length === 0) return <div className="tab-loading"><div className="skeleton-block" /><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="accounts-tab">
      <div className="tab-header">
        <div>
          <h3>{t("accounts.title")}</h3>
          <p className="tab-description">{t("accounts.description")}</p>
        </div>
        <span className="records-count">{accounts.length} {t("accounts.count")}</span>
      </div>

      {/* Stats */}
      <div className="email-stats">
        <div className="stat-card"><div className="stat-value">{accounts.length}</div><div className="stat-label">{t("accounts.total")}</div></div>
        <div className="stat-card"><div className="stat-value">{accounts.filter(a => !a.isBlocked).length}</div><div className="stat-label">{t("accounts.active")}</div></div>
        <div className="stat-card"><div className="stat-value">{accounts.filter(a => a.isBlocked).length}</div><div className="stat-label">{t("accounts.blocked")}</div></div>
      </div>

      {accounts.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
          <p>{t("accounts.empty")}</p>
        </div>
      ) : (
        <div className="account-cards">
          {accounts.map(a => {
            const percent = getUsagePercent(a.size, a.quota);
            return (
              <div key={a.accountName} className={`account-card ${a.isBlocked ? 'blocked' : ''}`}>
                <div className="account-avatar">{getInitials(a.email)}</div>
                <div className="account-info">
                  <h4>{a.email}</h4>
                  <p>{a.description || '-'}</p>
                  <div className="account-quota">
                    <div className="usage-bar"><div className={`usage-fill ${percent > 90 ? 'danger' : percent > 70 ? 'warning' : ''}`} style={{ width: `${percent}%` }} /></div>
                    <div className="usage-text">{formatSize(a.size)} / {formatSize(a.quota)} ({percent}%)</div>
                  </div>
                  <div className="account-meta">
                    <span className={`badge ${a.isBlocked ? 'error' : 'success'}`}>{a.isBlocked ? '✗ Bloqué' : '✓ Actif'}</span>
                  </div>
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
