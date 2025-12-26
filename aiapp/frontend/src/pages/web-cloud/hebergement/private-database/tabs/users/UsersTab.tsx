// ============================================================
// PRIVATE DATABASE TAB: USERS - Gestion des utilisateurs
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { usersService } from "./UsersTab.service";
import type { PdbUser } from "../../private-database.types";
import { CreatePdbUserModal } from "./modals/CreatePdbUserModal";
import { ManageGrantsModal } from "./modals/ManageGrantsModal";
import "./UsersTab.css";

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
      const names = await usersService.listUsers(serviceName);
      const data = await Promise.all(names.map(n => usersService.getUser(serviceName, n)));
      setUsers(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleDelete = async (userName: string) => {
    if (!confirm(t("users.confirmDelete", { name: userName }))) return;
    try {
      await usersService.deleteUser(serviceName, userName);
      loadUsers();
    } catch (err) { alert(String(err)); }
  };

  const handleChangePassword = async (userName: string) => {
    const newPassword = prompt(t("users.enterNewPassword"));
    if (!newPassword) return;
    try {
      await usersService.changeUserPassword(serviceName, userName, newPassword);
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

  if (loading) return <div className="privdb-users-loading"><div className="privdb-users-skeleton" /></div>;
  if (error) return <div className="privdb-users-error">{error}</div>;

  return (
    <div className="users-tab">
      <div className="users-header">
        <div>
          <h3>{t("users.title")}</h3>
          <p className="users-description">{t("users.description")}</p>
        </div>
        <div className="users-actions">
          <span className="users-count">{users.length} {t("users.count")}</span>
          <button className="privdb-users-btn-primary-sm" onClick={() => setShowCreateModal(true)}>
            + {t("users.create")}
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="users-empty">
          <p>{t("users.empty")}</p>
          <button className="privdb-users-btn-primary" onClick={() => setShowCreateModal(true)}>
            {t("users.createFirst")}
          </button>
        </div>
      ) : (
        <table className="users-table">
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
                <td className="privdb-users-font-mono">{user.userName}</td>
                <td>
                  {user.databases && user.databases.length > 0 ? (
                    <div className="users-grants-list">
                      {user.databases.slice(0, 3).map(db => {
                        const grant = getGrantBadge(db.grantType);
                        return (
                          <span key={db.databaseName} className={`users-grant-badge ${grant.class}`} title={db.databaseName}>
                            {db.databaseName}: {grant.label}
                          </span>
                        );
                      })}
                      {user.databases.length > 3 && (
                        <span className="privdb-users-badge inactive">+{user.databases.length - 3}</span>
                      )}
                    </div>
                  ) : (
                    <span className="users-text-muted">{t("users.noGrants")}</span>
                  )}
                </td>
                <td>{user.creationDate ? new Date(user.creationDate).toLocaleDateString() : '-'}</td>
                <td>
                  <div className="users-action-buttons">
                    <button 
                      className="privdb-users-btn-secondary-sm" 
                      onClick={() => setSelectedUser(user)}
                    >
                      {t("users.manageGrants")}
                    </button>
                    <button 
                      className="privdb-users-btn-secondary-sm" 
                      onClick={() => handleChangePassword(user.userName)}
                    >
                      {t("users.changePassword")}
                    </button>
                    <button 
                      className="privdb-users-btn-icon-danger" 
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
