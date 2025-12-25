// ============================================================
// EMAIL-DOMAIN/ACCOUNTS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listAccounts, getAccount, formatSize, getUsagePercent, getInitials } from "./AccountsTab.service";
import type { EmailAccount } from "../../email-domain.types";
import "./AccountsTab.css";

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
        const names = await listAccounts(domain);
        const data: EmailAccount[] = [];
        for (let i = 0; i < names.length; i += 10) {
          const batch = names.slice(i, i + 10);
          const results = await Promise.all(batch.map(n => getAccount(domain, n)));
          data.push(...results);
          setAccounts([...data]);
        }
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [domain]);

  if (loading && accounts.length === 0) return <div className="tab-loading"><div className="skeleton-block" /><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="emaildomain-accounts-tab">
      <div className="emaildomain-accounts-tab-header">
        <div>
          <h3>{t("accounts.title")}</h3>
          <p className="emaildomain-accounts-tab-description">{t("accounts.description")}</p>
        </div>
        <span className="emaildomain-accounts-records-count">{accounts.length} {t("accounts.count")}</span>
      </div>

      <div className="emaildomain-accounts-stats">
        <div className="emaildomain-accounts-stat-card"><div className="emaildomain-accounts-stat-value">{accounts.length}</div><div className="emaildomain-accounts-stat-label">{t("accounts.total")}</div></div>
        <div className="emaildomain-accounts-stat-card"><div className="emaildomain-accounts-stat-value">{accounts.filter(a => !a.isBlocked).length}</div><div className="emaildomain-accounts-stat-label">{t("accounts.active")}</div></div>
        <div className="emaildomain-accounts-stat-card"><div className="emaildomain-accounts-stat-value">{accounts.filter(a => a.isBlocked).length}</div><div className="emaildomain-accounts-stat-label">{t("accounts.blocked")}</div></div>
      </div>

      {accounts.length === 0 ? (
        <div className="emaildomain-accounts-empty">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
          <p>{t("accounts.empty")}</p>
        </div>
      ) : (
        <div className="emaildomain-accounts-cards">
          {accounts.map(a => {
            const percent = getUsagePercent(a.size, a.quota);
            return (
              <div key={a.accountName} className={`emaildomain-accounts-card ${a.isBlocked ? 'blocked' : ''}`}>
                <div className="emaildomain-accounts-avatar">{getInitials(a.email)}</div>
                <div className="emaildomain-accounts-info">
                  <h4>{a.email}</h4>
                  <p>{a.description || '-'}</p>
                  <div className="emaildomain-accounts-quota">
                    <div className="emaildomain-accounts-usage-bar"><div className={`emaildomain-accounts-usage-fill ${percent > 90 ? 'danger' : percent > 70 ? 'warning' : ''}`} style={{ width: `${percent}%` }} /></div>
                    <div className="emaildomain-accounts-usage-text">{formatSize(a.size)} / {formatSize(a.quota)} ({percent}%)</div>
                  </div>
                  <div className="emaildomain-accounts-meta">
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
