// ============================================================
// ZIMBRA/ACCOUNTS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listAccounts, getAccount, formatSize, getUsagePercent, getInitials } from "./AccountsTab.ts";
import type { ZimbraAccount } from "../../zimbra.types";
import "./AccountsTab.css";

interface Props { serviceId: string; }

export function AccountsTab({ serviceId }: Props) {
  const { t } = useTranslation("web-cloud/zimbra/index");
  const [accounts, setAccounts] = useState<ZimbraAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await listAccounts(serviceId);
        const data = await Promise.all(ids.map(id => getAccount(serviceId, id)));
        setAccounts(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceId]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /><div className="skeleton-block" /></div>;

  return (
    <div className="zimbra-accounts-tab">
      <div className="zimbra-accounts-tab-header">
        <div><h3>{t("accounts.title")}</h3><p className="zimbra-accounts-tab-description">{t("accounts.description")}</p></div>
        <span className="zimbra-accounts-records-count">{accounts.length}</span>
      </div>

      <div className="zimbra-accounts-stats">
        <div className="zimbra-accounts-stat-card"><div className="zimbra-accounts-stat-value">{accounts.length}</div><div className="zimbra-accounts-stat-label">Total</div></div>
        <div className="zimbra-accounts-stat-card"><div className="zimbra-accounts-stat-value">{accounts.filter(a => a.status === 'ok').length}</div><div className="zimbra-accounts-stat-label">Actifs</div></div>
      </div>

      {accounts.length === 0 ? (
        <div className="zimbra-accounts-empty"><p>{t("accounts.empty")}</p></div>
      ) : (
        <div className="zimbra-accounts-cards">
          {accounts.map(a => {
            const percent = a.quota ? getUsagePercent(a.quota.used, a.quota.available) : 0;
            return (
              <div key={a.id} className={`zimbra-accounts-card ${a.status !== 'ok' ? 'suspended' : ''}`}>
                <div className="zimbra-accounts-header">
                  <div className="zimbra-accounts-avatar">{getInitials(a.displayName || a.email)}</div>
                  <div className="zimbra-accounts-identity">
                    <h4>{a.displayName || `${a.firstName} ${a.lastName}`}</h4>
                    <p>{a.email}</p>
                  </div>
                </div>
                {a.quota && (
                  <div className="zimbra-accounts-quota">
                    <div className="zimbra-accounts-quota-bar"><div className="zimbra-accounts-quota-fill" style={{ width: `${percent}%` }} /></div>
                    <div className="zimbra-accounts-quota-text"><span>{formatSize(a.quota.used)}</span><span>{formatSize(a.quota.available)}</span></div>
                  </div>
                )}
                <div className="zimbra-accounts-meta">
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
