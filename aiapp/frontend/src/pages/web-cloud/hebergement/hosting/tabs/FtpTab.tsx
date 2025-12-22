// ============================================================
// HOSTING TAB: FTP - Accès FTP et SSH
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Hosting, FtpUser } from "../../../../../services/web-cloud.hosting";
import { CreateFtpUserModal, ChangePasswordModal } from "../components";

interface Props { 
  serviceName: string; 
  details?: Hosting;
}

const PAGE_SIZE = 10;

export function FtpTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [hosting, setHosting] = useState<Hosting | null>(details || null);
  const [users, setUsers] = useState<FtpUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState<{ open: boolean; login: string }>({ open: false, login: "" });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [hostingData, userLogins] = await Promise.all([
        details ? Promise.resolve(details) : hostingService.getHosting(serviceName),
        hostingService.listFtpUsers(serviceName)
      ]);
      setHosting(hostingData);
      const usersData = await Promise.all(userLogins.map(u => hostingService.getFtpUser(serviceName, u)));
      setUsers(usersData);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName, details]);

  useEffect(() => { loadData(); }, [loadData]);

  // --- HANDLERS ---
  const handleDelete = async (login: string, isPrimary: boolean) => {
    if (isPrimary) {
      alert(t("ftp.cannotDeletePrimary"));
      return;
    }
    if (!confirm(t("ftp.confirmDelete", { login }))) return;
    try {
      await hostingService.deleteFtpUser(serviceName, login);
      loadData();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleToggleSsh = async (user: FtpUser) => {
    try {
      await hostingService.updateFtpUser(serviceName, user.login, { 
        sshState: user.sshState === "active" ? "none" : "active" 
      });
      loadData();
    } catch (err) {
      alert(String(err));
    }
  };

  // --- FILTERING ---
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(u => u.login.toLowerCase().includes(term));
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  // --- HELPERS ---
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="ftp-tab">
        <div className="ftp-info-grid">
          <div className="skeleton-block" style={{ height: "180px" }} />
          <div className="skeleton-block" style={{ height: "180px" }} />
        </div>
        <div className="skeleton-block" style={{ height: "300px", marginTop: "1.5rem" }} />
      </div>
    );
  }

  if (error) return <div className="error-state">{error}</div>;

  const ftpServer = hosting?.cluster ? `ftp.${hosting.cluster}.hosting.ovh.net` : "-";
  const sshServer = hosting?.cluster ? `ssh.${hosting.cluster}.hosting.ovh.net` : "-";

  return (
    <div className="ftp-tab">
      {/* Info tiles */}
      <div className="ftp-info-grid">
        {/* Tile 1: Serveur FTP */}
        <div className="info-tile">
          <h4>{t("ftp.server")}</h4>
          <div className="tile-content">
            <div className="info-row">
              <span className="info-label">Adresse du serveur</span>
              <div className="info-value copyable-field">
                <code>{ftpServer}</code>
                <button className="copy-btn" onClick={() => copyToClipboard(ftpServer)} title="Copier">📋</button>
              </div>
            </div>
            <div className="info-row">
              <span className="info-label">{t("ftp.port")}</span>
              <span className="info-value">21</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t("ftp.sftpPort")}</span>
              <span className="info-value">22</span>
            </div>
          </div>
        </div>

        {/* Tile 2: Accès FTP */}
        <div className="info-tile">
          <h4>Accès FTP</h4>
          <div className="tile-content">
            <div className="info-row">
              <span className="info-label">Lien d'accès rapide</span>
              <a 
                href={`ftp://${serviceName}@${ftpServer}`} 
                className="link-action"
              >
                ftp://{serviceName}@{ftpServer.substring(0, 20)}... ↗
              </a>
            </div>
            <div className="info-row">
              <span className="info-label">{t("ftp.home")}</span>
              <code>/home/{serviceName}</code>
            </div>
          </div>
        </div>
      </div>

      {/* Header table */}
      <div className="tab-header" style={{ marginTop: "1.5rem" }}>
        <div>
          <h4>Utilisateurs FTP</h4>
        </div>
        <div className="tab-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            + {t("ftp.create")}
          </button>
        </div>
      </div>

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
                <th>Utilisateur</th>
                <th>{t("ftp.home")}</th>
                <th>{t("ftp.state")}</th>
                <th>{t("ftp.ssh")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => {
                const isPrimary = user.isPrimaryAccount || user.login === serviceName;
                return (
                  <tr key={user.login}>
                    <td>
                      <span className="font-mono">{user.login}</span>
                      {isPrimary && <span className="badge primary" style={{ marginLeft: "0.5rem" }}>{t("ftp.primary")}</span>}
                    </td>
                    <td><code>{user.home || `/home/${user.login}`}</code></td>
                    <td>
                      <span className={`badge ${user.state === "ok" ? "success" : "warning"}`}>
                        {user.state === "ok" ? "Actif" : user.state}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={`badge-toggle ${user.sshState === "active" ? "active" : ""}`}
                        onClick={() => handleToggleSsh(user)}
                        title={user.sshState === "active" ? "Désactiver SSH" : "Activer SSH"}
                      >
                        {user.sshState === "active" ? "Actif" : "Désactivé"}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon" 
                          onClick={() => setPasswordModal({ open: true, login: user.login })}
                          title={t("ftp.changePassword")}
                        >
                          🔑
                        </button>
                        <button 
                          className="btn-icon btn-danger-icon" 
                          onClick={() => handleDelete(user.login, isPrimary)}
                          title={t("ftp.delete")}
                          disabled={isPrimary}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
        onSuccess={loadData}
      />

      <ChangePasswordModal
        serviceName={serviceName}
        login={passwordModal.login}
        type="ftp"
        isOpen={passwordModal.open}
        onClose={() => setPasswordModal({ open: false, login: "" })}
        onSuccess={loadData}
      />
    </div>
  );
}

export default FtpTab;
