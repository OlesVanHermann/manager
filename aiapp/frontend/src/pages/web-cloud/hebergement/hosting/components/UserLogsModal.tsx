// ============================================================
// MODAL: Gestion des utilisateurs logs (ownLogs)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../services/web-cloud.hosting";

interface UserLog {
  login: string;
  creationDate: string;
  description?: string;
}

interface Props {
  serviceName: string;
  ownLogId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function UserLogsModal({ serviceName, ownLogId, isOpen, onClose }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserLog[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newLogin, setNewLogin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    loadUsers();
  }, [isOpen, serviceName, ownLogId]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const logins = await hostingService.listUserLogs(serviceName, ownLogId);
      const details = await Promise.all(
        logins.map((login: string) => hostingService.getUserLog(serviceName, ownLogId, login))
      );
      setUsers(details);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!newLogin || !newPassword) return;
    setCreating(true);
    setError(null);
    try {
      await hostingService.createUserLog(serviceName, ownLogId, newLogin, newPassword, newDescription);
      setShowCreate(false);
      setNewLogin("");
      setNewPassword("");
      setNewDescription("");
      loadUsers();
    } catch (err) {
      setError(String(err));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (login: string) => {
    if (!confirm(t("userLogs.confirmDelete", { login }))) return;
    try {
      await hostingService.deleteUserLog(serviceName, ownLogId, login);
      loadUsers();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleChangePassword = async (login: string) => {
    const password = prompt(t("userLogs.enterNewPassword"));
    if (!password) return;
    try {
      await hostingService.changeUserLogPassword(serviceName, ownLogId, login, password);
      alert(t("userLogs.passwordChanged"));
    } catch (err) {
      alert(String(err));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("userLogs.title")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && (
            <div className="info-banner error">
              <span className="info-icon">❌</span>
              <span>{error}</span>
            </div>
          )}

          <div className="modal-toolbar">
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              {t("userLogs.create")}
            </button>
          </div>

          {showCreate && (
            <div className="inline-form">
              <div className="form-row">
                <div className="form-group">
                  <label>{t("userLogs.login")} *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newLogin}
                    onChange={e => setNewLogin(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>{t("userLogs.password")} *</label>
                  <input
                    type="password"
                    className="form-input"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t("userLogs.description")}</label>
                <input
                  type="text"
                  className="form-input"
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                />
              </div>
              <div className="inline-form-actions">
                <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>
                  {t("common.cancel")}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCreate}
                  disabled={creating || !newLogin || !newPassword}
                >
                  {creating ? t("common.creating") : t("common.create")}
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading-spinner">{t("common.loading")}</div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <p>{t("userLogs.empty")}</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("userLogs.login")}</th>
                  <th>{t("userLogs.description")}</th>
                  <th>{t("userLogs.creationDate")}</th>
                  <th>{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.login}>
                    <td><strong>{user.login}</strong></td>
                    <td>{user.description || "-"}</td>
                    <td>{new Date(user.creationDate).toLocaleDateString("fr-FR")}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm"
                          onClick={() => handleChangePassword(user.login)}
                        >
                          {t("userLogs.changePassword")}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user.login)}
                        >
                          {t("common.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t("common.close")}</button>
        </div>
      </div>
    </div>
  );
}

export default UserLogsModal;
