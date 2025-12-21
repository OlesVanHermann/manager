// ============================================================
// HOSTING TAB: FTP - Utilisateurs FTP/SSH avec CRUD
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, FtpUser, Hosting } from "../../../../../services/web-cloud.hosting";
import { CreateFtpUserModal } from "../components/CreateFtpUserModal";

interface Props { serviceName: string; details?: Hosting | null; }

/** Onglet FTP/SSH - Gestion des utilisateurs avec CRUD. */
export function FtpTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [users, setUsers] = useState<FtpUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const logins = await hostingService.listFtpUsers(serviceName);
      const data = await Promise.all(logins.map(l => hostingService.getFtpUser(serviceName, l)));
      setUsers(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async (login: string, isPrimary: boolean) => {
    if (isPrimary) {
      alert(t("ftp.cannotDeletePrimary"));
      return;
    }
    if (!confirm(t("ftp.confirmDelete", { login }))) return;
    try {
      await hostingService.deleteFtpUser(serviceName, login);
      loadUsers();
    } catch (err) {
      alert(String(err));
    }
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="ftp-tab">
      <div className="tab-header">
        <div>
          <h3>{t("ftp.title")}</h3>
          <p className="tab-description">{t("ftp.description")}</p>
        </div>
        <div className="tab-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            + {t("ftp.create")}
          </button>
        </div>
      </div>

      {details && (
        <div className="connection-info">
          <h4>{t("ftp.connectionInfo")}</h4>
          <div className="info-grid">
            <div className="info-item">
              <label>{t("ftp.server")}</label>
              <span className="font-mono">ftp.cluster0{details.cluster}.hosting.ovh.net</span>
            </div>
            <div className="info-item">
              <label>{t("ftp.port")}</label>
              <span className="font-mono">{details.serviceManagementAccess?.ftp?.port || 21}</span>
            </div>
            <div className="info-item">
              <label>{t("ftp.sshPort")}</label>
              <span className="font-mono">{details.serviceManagementAccess?.ssh?.port || 22}</span>
            </div>
          </div>
        </div>
      )}

      {users.length === 0 ? (
        <div className="empty-state">
          <p>{t("ftp.empty")}</p>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            {t("ftp.createFirst")}
          </button>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("ftp.login")}</th>
              <th>{t("ftp.home")}</th>
              <th>{t("ftp.state")}</th>
              <th>{t("ftp.ssh")}</th>
              <th>{t("ftp.primary")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.login}>
                <td className="font-mono">{u.login}</td>
                <td className="font-mono">{u.home}</td>
                <td><span className={`badge ${u.state === 'rw' ? 'success' : u.state === 'read' ? 'info' : 'inactive'}`}>{u.state}</span></td>
                <td><span className={`badge ${u.serviceManagementCredentials?.ssh ? 'success' : 'inactive'}`}>{u.serviceManagementCredentials?.ssh ? '✓' : '✗'}</span></td>
                <td>{u.isPrimaryAccount ? '★' : ''}</td>
                <td>
                  {!u.isPrimaryAccount && (
                    <button
                      className="btn-icon btn-danger-icon"
                      onClick={() => handleDelete(u.login, !!u.isPrimaryAccount)}
                      title={t("ftp.delete")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <CreateFtpUserModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadUsers}
      />
    </div>
  );
}

export default FtpTab;
