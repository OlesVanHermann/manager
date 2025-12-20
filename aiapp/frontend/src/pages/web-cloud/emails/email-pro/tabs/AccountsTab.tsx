// ============================================================
// EMAIL PRO TAB: ACCOUNTS (style Hosting)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { emailProService, EmailProAccount } from "../../../../../services/web-cloud.email-pro";

interface Props { serviceName: string; }

/** Onglet Comptes Email Pro. */
export function AccountsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/email-pro/index");
  const [accounts, setAccounts] = useState<EmailProAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const emails = await emailProService.listAccounts(serviceName);
        const data: EmailProAccount[] = [];
        for (let i = 0; i < emails.length; i += 5) {
          const batch = emails.slice(i, i + 5);
          const results = await Promise.all(batch.map(e => emailProService.getAccount(serviceName, e)));
          data.push(...results);
          setAccounts([...data]);
        }
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  const formatSize = (bytes: number | null) => bytes ? `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB` : '-';
  const getUsagePercent = (used: number | null, quota: number) => used && quota > 0 ? Math.round((used / quota) * 100) : 0;
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  if (loading && accounts.length === 0) return <div className="tab-loading"><div className="skeleton-block" /><div className="skeleton-block" /></div>;

  return (
    <div className="accounts-tab">
      <div className="tab-header">
        <div><h3>{t("accounts.title")}</h3><p className="tab-description">{t("accounts.description")}</p></div>
        <span className="records-count">{accounts.length} {t("accounts.count")}</span>
      </div>

      <div className="email-stats">
        <div className="stat-card"><div className="stat-value">{accounts.length}</div><div className="stat-label">Total</div></div>
        <div className="stat-card"><div className="stat-value">{accounts.filter(a => a.state === 'ok').length}</div><div className="stat-label">Actifs</div></div>
        <div className="stat-card"><div className="stat-value">{accounts.filter(a => a.configured).length}</div><div className="stat-label">Configurés</div></div>
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
                  <h4>{a.primaryEmailAddress}</h4>
                  <span className={`badge ${a.state === 'ok' ? 'success' : 'warning'}`}>{a.state}</span>
                </div>
                <div className="account-name">{a.displayName || `${a.firstName} ${a.lastName}`}</div>
                <div className="account-quota">
                  <div className="quota-bar"><div className="quota-fill" style={{ width: `${percent}%` }} /></div>
                  <div className="quota-text"><span>{formatSize(a.currentUsage)}</span><span>{formatSize(a.quota)}</span></div>
                </div>
                <div className="account-meta">
                  <span className={`badge ${a.configured ? 'success' : 'inactive'}`}>{a.configured ? '✓ Configuré' : 'Non configuré'}</span>
                  {a.spamDetected && <span className="badge error">⚠ Spam détecté</span>}
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
