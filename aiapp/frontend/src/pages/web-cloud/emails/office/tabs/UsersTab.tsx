// ============================================================
// OFFICE TAB: USERS (style Hosting)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { officeService, OfficeUser } from "../../../../../services/web-cloud.office";

interface Props { tenantId: string; }

/** Onglet Utilisateurs Office 365. */
export function UsersTab({ tenantId }: Props) {
  const { t } = useTranslation("web-cloud/office/index");
  const [users, setUsers] = useState<OfficeUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await officeService.listUsers(tenantId);
        const data = await Promise.all(ids.map(id => officeService.getUser(tenantId, id)));
        setUsers(data);
      } finally { setLoading(false); }
    };
    load();
  }, [tenantId]);

  const getInitials = (first: string, last: string) => `${first[0] || ''}${last[0] || ''}`.toUpperCase();
  const getLicenseType = (licenses: string[]) => {
    if (licenses.some(l => l.toLowerCase().includes('enterprise'))) return 'enterprise';
    if (licenses.some(l => l.toLowerCase().includes('business'))) return 'business';
    return 'other';
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /><div className="skeleton-block" /></div>;

  return (
    <div className="users-tab">
      <div className="tab-header">
        <div><h3>{t("users.title")}</h3><p className="tab-description">{t("users.description")}</p></div>
        <span className="records-count">{users.length}</span>
      </div>

      <div className="email-stats">
        <div className="stat-card office"><div className="stat-value">{users.length}</div><div className="stat-label">Utilisateurs</div></div>
        <div className="stat-card office"><div className="stat-value">{users.filter(u => u.status === 'ok').length}</div><div className="stat-label">Actifs</div></div>
      </div>

      {users.length === 0 ? (
        <div className="empty-state"><p>{t("users.empty")}</p></div>
      ) : (
        <div className="user-cards">
          {users.map(u => (
            <div key={u.id} className={`user-card ${u.status !== 'ok' ? 'suspended' : ''}`}>
              <div className="user-header">
                <div className="user-avatar">{getInitials(u.firstName, u.lastName)}</div>
                <div className="user-identity">
                  <h4>{u.firstName} {u.lastName}</h4>
                  <p>{u.login}</p>
                </div>
              </div>
              <div className="user-licenses">
                {u.licenses.map((lic, i) => (
                  <span key={i} className={`license-badge ${getLicenseType([lic])}`}>{lic}</span>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-2)' }}>
                <span className={`badge ${u.status === 'ok' ? 'success' : 'warning'}`}>{u.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UsersTab;
