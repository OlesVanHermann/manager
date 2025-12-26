// ============================================================
// EMAIL-PRO/ACCOUNTS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listAccounts, getAccount, formatSize, getUsagePercent } from "./AccountsTab.service";
import type { EmailProAccount } from "../../email-pro.types";
import "./AccountsTab.css";

interface Props { serviceName: string; }

export function AccountsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/email-pro/index");
  const [accounts, setAccounts] = useState<EmailProAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const emails = await listAccounts(serviceName);
        const data: EmailProAccount[] = [];
        for (let i = 0; i < emails.length; i += 5) {
          const batch = emails.slice(i, i + 5);
          const results = await Promise.all(batch.map(e => getAccount(serviceName, e)));
          data.push(...results);
          setAccounts([...data]);
        }
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading && accounts.length === 0) return <div className="emailpro-accounts-loading"><div className="emailpro-accounts-skeleton" /><div className="emailpro-accounts-skeleton" /></div>;

  return (
    <div className="emailpro-accounts-tab">
      <div className="emailpro-accounts-tab-header">
        <div><h3>{t("accounts.title")}</h3><p className="emailpro-accounts-tab-description">{t("accounts.description")}</p></div>
        <span className="emailpro-accounts-records-count">{accounts.length} {t("accounts.count")}</span>
      </div>

      <div className="emailpro-accounts-stats">
        <div className="emailpro-accounts-stat-card"><div className="emailpro-accounts-stat-value">{accounts.length}</div><div className="emailpro-accounts-stat-label">Total</div></div>
        <div className="emailpro-accounts-stat-card"><div className="emailpro-accounts-stat-value">{accounts.filter(a => a.state === 'ok').length}</div><div className="emailpro-accounts-stat-label">Actifs</div></div>
        <div className="emailpro-accounts-stat-card"><div className="emailpro-accounts-stat-value">{accounts.filter(a => a.configured).length}</div><div className="emailpro-accounts-stat-label">Configurés</div></div>
      </div>

      {accounts.length === 0 ? (
        <div className="emailpro-accounts-empty"><p>{t("accounts.empty")}</p></div>
      ) : (
        <div className="emailpro-accounts-cards">
          {accounts.map(a => {
            const percent = getUsagePercent(a.currentUsage, a.quota);
            return (
              <div key={a.primaryEmailAddress} className={`emailpro-accounts-card ${a.state !== 'ok' ? 'suspended' : ''}`}>
                <div className="emailpro-accounts-header">
                  <h4>{a.primaryEmailAddress}</h4>
                  <span className={`emailpro-accounts-badge ${a.state === 'ok' ? 'success' : 'warning'}`}>{a.state}</span>
                </div>
                <div className="emailpro-accounts-name">{a.displayName || `${a.firstName} ${a.lastName}`}</div>
                <div className="emailpro-accounts-quota">
                  <div className="emailpro-accounts-quota-bar"><div className="emailpro-accounts-quota-fill" style={{ width: `${percent}%` }} /></div>
                  <div className="emailpro-accounts-quota-text"><span>{formatSize(a.currentUsage)}</span><span>{formatSize(a.quota)}</span></div>
                </div>
                <div className="emailpro-accounts-meta">
                  <span className={`emailpro-accounts-badge ${a.configured ? 'success' : 'inactive'}`}>{a.configured ? '✓ Configuré' : 'Non configuré'}</span>
                  {a.spamDetected && <span className="emailpro-accounts-badge error">⚠ Spam détecté</span>}
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
