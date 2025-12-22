// ============================================================
// HOSTING TAB: FTP - Utilisateurs FTP/SSH
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, FtpUser, Hosting } from "../../../../../services/web-cloud.hosting";
import { CreateFtpUserModal } from "../components/CreateFtpUserModal";
import { ChangePasswordModal } from "../components/ChangePasswordModal";

interface Props { 
  serviceName: string; 
  details?: Hosting;
}

const PAGE_SIZE = 10;

/** Onglet FTP-SSH avec infos connexion et gestion utilisateurs. */
export function FtpTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [users, setUsers] = useState<FtpUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState<{ open: boolean; login: string }>({ open: false, login: "" });
  const [togglingSSH, setTogglingSSH] = useState<string | null>(null);

  // ---------- LOAD ----------
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const logins = await hostingService.listFtpUsers(serviceName);
      const data = await Promise.all(logins.map(l => hostingService.getFtpUser(serviceName, l)));
      setUsers(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // ---------- HANDLERS ----------
  const handleDelete = async (login: string, isPrimary: boolean) => {
    if (isPrimary) {
      alert(t("ftp.cannotDeletePrimary"));
      return;
    }
    if (!confirm(t("ftp.confirmDelete", { login }))) return;
    try {
      await hostingService.deleteFtpUser(serviceName, login);
      loadUsers();
    } catch (err) { alert(String(err)); }
  };

  const handleToggleSSH = async (user: FtpUser) => {
    const newState = user.sshState === "active" ? "none" : "active";
    setTogglingSSH(user.login);
    try {
      await hostingService.updateFtpUser(serviceName, user.login, { sshState: newState });
      loadUsers();
    } catch (err) { 
      alert(String(err)); 
    } finally {
      setTogglingSSH(null);
    }
  };

  // ---------- FILTERING ----------
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(u => u.login.toLowerCase().includes(term));
  }, [users, searchTerm]);

  // ---------- PAGINATION ----------
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  // ---------- CONNECTION INFO ----------
  const cluster = details?.cluster || serviceName.match(/cluster(\d+)/)?.[1] || '0';
  const ftpServer = `ftp.cluster${cluster}.hosting.ovh.net`;
  const sshServer = `ssh.cluster${cluster}.hosting.ovh.net`;
  const primaryLogin = users.find(u => u.isPrimaryAccount)?.login || serviceName.split('.')[0];

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  // ---------- RENDER ----------
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

      {/* Connection Info */}
      <section className="connection-info">
        <h4>Informations de connexion</h4>
        <div className="info-grid-2col">
          <div className="info-item">
            <label>{t("ftp.server")}</label>
            <span className="font-mono copyable">
              {ftpServer}
              <button className="copy-btn" onClick={() => navigator.clipboard.writeText(ftpServer)}>📋</button>
            </span>
          </div>
          <div className="info-item">
            <label>{t("ftp.sshServer")}</label>
            <span className="font-mono copyable">
              {sshServer}
              <button className="copy-btn" onClick={() => navigator.clipboard.writeText(sshServer)}>📋</button>
            </span>
          </div>
          <div className="info-item">
            <label>{t("ftp.port")} / {t("ftp.sftpPort")}</label>
            <span className="font-mono">21 / 22</span>
          </div>
          <div className="info-item">
            <label>{t("ftp.login")}</label>
            <span className="font-mono">{primaryLogin}</span>
          </div>
        </div>

        {/* Quick links */}
        <div className="quick-links">
          <a href={`ftp://${primaryLogin}@${ftpServer}:21/`} className="btn btn-secondary btn-sm">
            Ouvrir FTP ↗
          </a>
          <a 
            href={`https://net2ftp.cluster${cluster}.hosting.ovh.net/`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            FTP Explorer ↗
          </a>
        </div>
      </section>

      {/* Search */}
      <div className="table-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder={t("common.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="records-count">{users.length} utilisateur(s)</span>
      </div>

      {/* Users table */}
      {paginatedUsers.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? t("common.noResult") : t("ftp.empty")}</p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              {t("ftp.createFirst")}
            </button>
          )}
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("ftp.login")}</th>
                <th>{t("ftp.home")}</th>
                <th>{t("ftp.ssh")}</th>
                <th>{t("ftp.state")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(u => (
                <tr key={u.login}>
                  <td className="font-mono">
                    {u.login}
                    {u.isPrimaryAccount && <span className="badge info" style={{ marginLeft: 'var(--space-2)' }}>{t("ftp.primary")}</span>}
                  </td>
                  <td className="font-mono">{u.home || '/'}</td>
                  <td>
                    <button
                      className={`toggle-btn ${u.sshState === 'active' ? 'active' : ''}`}
                      onClick={() => handleToggleSSH(u)}
                      disabled={togglingSSH === u.login}
                      title={u.sshState === 'active' ? 'Désactiver SSH' : 'Activer SSH'}
                    >
                      {togglingSSH === u.login ? '...' : (u.sshState === 'active' ? 'ON' : 'OFF')}
                    </button>
                  </td>
                  <td>
                    <span className={`badge ${u.state === 'ok' ? 'success' : 'warning'}`}>
                      {u.state === 'ok' ? 'Actif' : u.state}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        onClick={() => setPasswordModal({ open: true, login: u.login })}
                        title={t("ftp.changePassword")}
                      >
                        🔑
                      </button>
                      <button 
                        className="btn-icon btn-danger-icon" 
                        onClick={() => handleDelete(u.login, !!u.isPrimaryAccount)}
                        title={t("ftp.delete")}
                        disabled={u.isPrimaryAccount}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ←
              </button>
              <span className="pagination-info">
                {t("common.page")} {currentPage} / {totalPages}
              </span>
              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                →
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CreateFtpUserModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadUsers}
      />

      <ChangePasswordModal
        serviceName={serviceName}
        login={passwordModal.login}
        isOpen={passwordModal.open}
        onClose={() => setPasswordModal({ open: false, login: "" })}
        onSuccess={loadUsers}
      />
    </div>
  );
}

export default FtpTab;
