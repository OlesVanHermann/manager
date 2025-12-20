// ============================================================
// ZIMBRA TAB: ACCOUNTS (style Hosting)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { zimbraService, ZimbraAccount } from "../../../../../services/web-cloud.zimbra";

interface Props { serviceId: string; }

/** Onglet Comptes Zimbra. */
export function AccountsTab({ serviceId }: Props) {
  const { t } = useTranslation("web-cloud/zimbra/index");
  const [accounts, setAccounts] = useState<ZimbraAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await zimbraService.listAccounts(serviceId);
        const data = await Promise.all(ids.map(id => zimbraService.getAccount(serviceId, id)));
        setAccounts(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceId]);

  const formatSize = (bytes: number) => `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  const getUsagePercent = (used: number, available: number) => available > 0 ? Math.round((used / available) * 100) : 0;
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /><div className="skeleton-block" /></div>;

  return (
    <div className="accounts-tab">
      <div className="tab-header">
        <div><h3>{t("accounts.title")}</h3><p className="tab-description">{t("accounts.description")}</p></div>
        <span className="records-count">{accounts.length}</span>
      </div>

      <div className="email-stats">
        <div className="stat-card zimbra"><div className="stat-value">{accounts.length}</div><div className="stat-label">Total</div></div>
        <div className="stat-card zimbra"><div className="stat-value">{accounts.filter(a => a.status === 'ok').length}</div><div className="stat-label">Actifs</div></div>
      </div>

      {accounts.length === 0 ? (
        <div className="empty-state"><p>{t("accounts.empty")}</p></div>
      ) : (
        <div className="account-cards">
          {accounts.map(a => {
            const percent = a.quota ? getUsagePercent(a.quota.used, a.quota.available) : 0;
            return (
              <div key={a.id} className={`account-card ${a.status !== 'ok' ? 'suspended' : ''}`}>
                <div className="account-header">
                  <div className="account-avatar">{getInitials(a.displayName || a.email)}</div>
                  <div className="account-identity">
                    <h4>{a.displayName || `${a.firstName} ${a.lastName}`}</h4>
                    <p>{a.email}</p>
                  </div>
                </div>
                {a.quota && (
                  <div className="account-quota">
                    <div className="quota-bar"><div className="quota-fill" style={{ width: `${percent}%` }} /></div>
                    <div className="quota-text"><span>{formatSize(a.quota.used)}</span><span>{formatSize(a.quota.available)}</span></div>
                  </div>
                )}
                <div className="account-meta">
                  <span className={`badge ${a.status === 'ok' ? 'success' : 'warning'}`}>{a.status}</span>
                  <span className="badge info">{a.offer}</span>
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
