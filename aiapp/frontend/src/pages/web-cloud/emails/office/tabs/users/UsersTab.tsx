// ============================================================
// OFFICE/USERS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listUsers, getUser, getInitials, getLicenseType } from "./UsersTab.ts";
import type { OfficeUser } from "../../office.types";
import "./UsersTab.css";

interface Props { tenantId: string; }

export function UsersTab({ tenantId }: Props) {
  const { t } = useTranslation("web-cloud/office/index");
  const [users, setUsers] = useState<OfficeUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await listUsers(tenantId);
        const data = await Promise.all(ids.map(id => getUser(tenantId, id)));
        setUsers(data);
      } finally { setLoading(false); }
    };
    load();
  }, [tenantId]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /><div className="skeleton-block" /></div>;

  return (
    <div className="office-users-tab">
      <div className="office-users-tab-header">
        <div><h3>{t("users.title")}</h3><p className="office-users-tab-description">{t("users.description")}</p></div>
        <span className="office-users-records-count">{users.length}</span>
      </div>

      <div className="office-users-stats">
        <div className="office-users-stat-card"><div className="office-users-stat-value">{users.length}</div><div className="office-users-stat-label">Utilisateurs</div></div>
        <div className="office-users-stat-card"><div className="office-users-stat-value">{users.filter(u => u.status === 'ok').length}</div><div className="office-users-stat-label">Actifs</div></div>
      </div>

      {users.length === 0 ? (
        <div className="office-users-empty"><p>{t("users.empty")}</p></div>
      ) : (
        <div className="office-users-cards">
          {users.map(u => (
            <div key={u.id} className={`office-users-card ${u.status !== 'ok' ? 'suspended' : ''}`}>
              <div className="office-users-header">
                <div className="office-users-avatar">{getInitials(u.firstName, u.lastName)}</div>
                <div className="office-users-identity">
                  <h4>{u.firstName} {u.lastName}</h4>
                  <p>{u.login}</p>
                </div>
              </div>
              <div className="office-users-licenses">
                {u.licenses.map((lic, i) => (
                  <span key={i} className={`office-users-license-badge ${getLicenseType([lic])}`}>{lic}</span>
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
