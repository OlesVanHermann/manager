// ============================================================
// PRIVATE DATABASE TAB: USERS - Gestion des utilisateurs
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService, PdbUser } from "../../../../../services/web-cloud.private-database";
import { CreatePdbUserModal } from "../components/CreatePdbUserModal";
import { ManageGrantsModal } from "../components/ManageGrantsModal";

interface Props { serviceName: string; }

/** Onglet Utilisateurs CloudDB. */
export function UsersTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [users, setUsers] = useState<PdbUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PdbUser | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const names = await privateDatabaseService.listUsers(serviceName);
      const data = await Promise.all(names.map(n => privateDatabaseService.getUser(serviceName, n)));
      setUsers(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleDelete = async (userName: string) => {
    if (!confirm(t("users.confirmDelete", { name: userName }))) return;
    try {
      await privateDatabaseService.deleteUser(serviceName, userName);
      loadUsers();
    } catch (err) { alert(String(err)); }
  };

  const handleChangePassword = async (userName: string) => {
    const newPassword = prompt(t("users.enterNewPassword"));
    if (!newPassword) return;
    try {
      await privateDatabaseService.changeUserPassword(serviceName, userName, newPassword);
      alert(t("users.passwordChanged"));
    } catch (err) { alert(String(err)); }
  };

  const getGrantBadge = (grant: string) => {
    const map: Record<string, { class: string; label: string }> = {
      admin: { class: 'admin', label: 'Admin' },
      rw: { class: 'rw', label: 'Lecture/Écriture' },
      ro: { class: 'ro', label: 'Lecture seule' },
      none: { class: 'none', label: 'Aucun' },
    };
    return map[grant] || map.none;
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="pdb-users-tab">
      <div className="tab-header">
        <div>
          <h3>{t("users.title")}</h3>
          <p className="tab-description">{t("users.description")}</p>
        </div>
        <div className="tab-actions">
          <span className="records-count">{users.length} {t("users.count")}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            + {t("users.create")}
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <p>{t("users.empty")}</p>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            {t("users.createFirst")}
          </button>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("users.name")}</th>
              <th>{t("users.grants")}</th>
              <th>{t("users.creationDate")}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.userName}>
                <td className="font-mono">{user.userName}</td>
                <td>
                  {user.databases && user.databases.length > 0 ? (
                    <div className="grants-list">
                      {user.databases.slice(0, 3).map(db => {
                        const grant = getGrantBadge(db.grantType);
                        return (
                          <span key={db.databaseName} className={`grant-badge ${grant.class}`} title={db.databaseName}>
                            {db.databaseName}: {grant.label}
                          </span>
                        );
                      })}
                      {user.databases.length > 3 && (
                        <span className="badge inactive">+{user.databases.length - 3}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted">{t("users.noGrants")}</span>
                  )}
                </td>
                <td>{user.creationDate ? new Date(user.creationDate).toLocaleDateString() : '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => setSelectedUser(user)}
                    >
                      {t("users.manageGrants")}
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => handleChangePassword(user.userName)}
                    >
                      {t("users.changePassword")}
                    </button>
                    <button 
                      className="btn-icon btn-danger-icon" 
                      onClick={() => handleDelete(user.userName)}
                      title={t("users.delete")}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <CreatePdbUserModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadUsers}
      />

      {selectedUser && (
        <ManageGrantsModal
          serviceName={serviceName}
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={loadUsers}
        />
      )}
    </div>
  );
}

export default UsersTab;
