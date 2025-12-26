// ============================================================
// EXCHANGE/ACCOUNTS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listAccounts, getAccount, formatSize, getUsagePercent, getInitials } from "./AccountsTab.service";
import type { ExchangeAccount } from "../../exchange.types";
import "./AccountsTab.css";

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
        const emails = await listAccounts(org, service);
        const data: ExchangeAccount[] = [];
        for (let i = 0; i < emails.length; i += 5) {
          const batch = emails.slice(i, i + 5);
          const results = await Promise.all(batch.map(e => getAccount(org, service, e)));
          data.push(...results);
          setAccounts([...data]);
        }
      } finally { setLoading(false); }
    };
    load();
  }, [org, service]);

  if (loading && accounts.length === 0) return <div className="exchange-accounts-loading"><div className="exchange-accounts-skeleton" /><div className="exchange-accounts-skeleton" /></div>;

  return (
    <div className="exchange-accounts-tab">
      <div className="exchange-accounts-tab-header">
        <div><h3>{t("accounts.title")}</h3></div>
        <span className="exchange-accounts-records-count">{accounts.length}</span>
      </div>

      <div className="exchange-accounts-stats">
        <div className="exchange-accounts-stat-card"><div className="exchange-accounts-stat-value">{accounts.length}</div><div className="exchange-accounts-stat-label">Total</div></div>
        <div className="exchange-accounts-stat-card"><div className="exchange-accounts-stat-value">{accounts.filter(a => a.state === 'ok').length}</div><div className="exchange-accounts-stat-label">Actifs</div></div>
        <div className="exchange-accounts-stat-card"><div className="exchange-accounts-stat-value">{accounts.filter(a => a.outlookLicense).length}</div><div className="exchange-accounts-stat-label">Outlook</div></div>
      </div>

      {accounts.length === 0 ? (
        <div className="exchange-accounts-empty"><p>{t("accounts.empty")}</p></div>
      ) : (
        <div className="exchange-accounts-cards">
          {accounts.map(a => {
            const percent = getUsagePercent(a.currentUsage, a.quota);
            return (
              <div key={a.primaryEmailAddress} className={`exchange-accounts-card ${a.state !== 'ok' ? 'suspended' : ''}`}>
                <div className="exchange-accounts-header">
                  <div className="exchange-accounts-avatar">{getInitials(a.displayName || a.login)}</div>
                  <div className="exchange-accounts-identity">
                    <h4>{a.displayName || `${a.firstName} ${a.lastName}`}</h4>
                    <p>{a.primaryEmailAddress}</p>
                  </div>
                </div>
                <div className="exchange-accounts-quota">
                  <div className="exchange-accounts-quota-bar"><div className={`exchange-accounts-quota-fill ${percent > 90 ? 'warning' : ''}`} style={{ width: `${percent}%` }} /></div>
                  <div className="exchange-accounts-quota-text"><span>{formatSize(a.currentUsage)}</span><span>{formatSize(a.quota)}</span></div>
                </div>
                <div className="exchange-accounts-features">
                  <span className={`exchange-accounts-feature-badge ${a.outlookLicense ? 'active' : ''}`}>Outlook {a.outlookLicense ? '✓' : '✗'}</span>
                  {a.litigation && <span className="exchange-accounts-feature-badge active">Litigation Hold</span>}
                  {a.hiddenFromGAL && <span className="exchange-accounts-feature-badge">Masqué GAL</span>}
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
