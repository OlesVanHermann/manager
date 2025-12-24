// ============================================================
// HOSTING TAB: FTP-SSH
// ============================================================

import "./ftp.css";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ftpService } from "./FtpTab";
import type { FtpUser, Hosting } from "../../hosting.types";
import { CreateFtpUserModal, ChangePasswordModal, EditFtpUserModal, DeleteFtpUserModal } from "./modals";

interface Props { serviceName: string; }

export function FtpTab({ serviceName }: Props) {
  const [hosting, setHosting] = useState<Hosting | null>(null);
  const [users, setUsers] = useState<FtpUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState<{ open: boolean; login: string }>({ open: false, login: "" });
  const [editModal, setEditModal] = useState<{ open: boolean; user: FtpUser | null }>({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; login: string }>({ open: false, login: "" });
  const [restoreModal, setRestoreModal] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [hostingData, userLogins] = await Promise.all([
        ftpService.getHosting(serviceName),
        ftpService.listFtpUsers(serviceName)
      ]);
      setHosting(hostingData);
      const usersData = await Promise.all(userLogins.map(login => ftpService.getFtpUser(serviceName, login)));
      setUsers(usersData);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadData(); }, [loadData]);

  // === MISE À JOUR OPTIMISTE APRÈS SUPPRESSION ===
  const handleDeleteSuccess = useCallback((deletedLogin: string) => {
    // Retirer immédiatement l'utilisateur de l'état local
    setUsers(prevUsers => prevUsers.filter(u => u.login !== deletedLogin));
    // Pas de refresh - la mise à jour optimiste suffit
  }, []);

  // Filter users
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(u => u.login.toLowerCase().includes(term) || u.home?.toLowerCase().includes(term));
  }, [users, searchTerm]);

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Restore handler
  const handleRestore = async () => {
    setRestoreLoading(true);
    try {
      const snapshots = await ftpService.listSnapshots(serviceName);
      if (snapshots.length === 0) {
        alert("Aucune sauvegarde disponible");
        setRestoreModal(false);
        return;
      }
      if (snapshots[0]?.creationDate) {
        await ftpService.restoreSnapshot(serviceName, snapshots[0].creationDate);
        alert("Restauration lancée avec succès");
        loadData();
      }
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setRestoreLoading(false);
      setRestoreModal(false);
    }
  };

  // Derived values
  const ftpHost = hosting?.serviceManagementAccess?.ftp?.url || `ftp.${serviceName}`;
  const sshHost = hosting?.serviceManagementAccess?.ssh?.url || ftpHost;
  const primaryLogin = hosting?.primaryLogin || serviceName.split('.')[0];

  if (loading) {
    return (
      <div className="ftp-tab">
        <div className="ftp-skeleton-toolbar" />
        <div className="ftp-skeleton-info" />
        <div className="ftp-skeleton-table" />
      </div>
    );
  }

  if (error) return <div className="ftp-error-state">{error}</div>;

  return (
    <div className="ftp-tab">
      {/* ========== TOOLBAR ========== */}
      <div className="ftp-toolbar">
        <button className="ftp-toolbar-refresh" onClick={loadData} title="Actualiser">↻</button>
        <div className="ftp-search-box">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="ftp-btn-add" onClick={() => setShowCreateModal(true)}>
          + Ajouter un utilisateur
        </button>
      </div>

      {/* ========== INFO BLOC 4 COLONNES ========== */}
      <div className="ftp-info-bloc">
        {/* COL 1: SERVEUR FTP */}
        <div className="ftp-info-col">
          <div className="ftp-info-theme">SERVEUR FTP</div>
          <div className="ftp-info-row">
            <span className="ftp-info-label">Nom du Serveur FTP</span>
            <div className="ftp-copybox" onClick={() => copyToClipboard(ftpHost)}>
              <span>{ftpHost}</span>
              <span className="ftp-copy-icon">📋</span>
            </div>
          </div>
          <div className="ftp-info-row">
            <span className="ftp-info-label">Port</span>
            <span className="ftp-info-value">21 <span className="ftp-status-on">● ON</span></span>
          </div>
        </div>

        <div className="ftp-info-divider" />

        {/* COL 2: SERVEUR SSH/SFTP */}
        <div className="ftp-info-col">
          <div className="ftp-info-theme">SERVEUR SSH/SFTP</div>
          <div className="ftp-info-row">
            <span className="ftp-info-label">Nom du Serveur SFTP/SSH</span>
            <div className="ftp-copybox" onClick={() => copyToClipboard(sshHost)}>
              <span>{sshHost}</span>
              <span className="ftp-copy-icon">📋</span>
            </div>
          </div>
          <div className="ftp-info-row">
            <span className="ftp-info-label">Port</span>
            <span className="ftp-info-value">22 <span className="ftp-status-on">● ON</span></span>
          </div>
        </div>

        <div className="ftp-info-divider" />

        {/* COL 3: SERVEUR REMOTE */}
        <div className="ftp-info-col">
          <div className="ftp-info-theme">SERVEUR REMOTE</div>
          <div className="ftp-info-row">
            <span className="ftp-info-label">Login principal</span>
            <div className="ftp-copybox" onClick={() => copyToClipboard(primaryLogin)}>
              <span>{primaryLogin}</span>
              <span className="ftp-copy-icon">📋</span>
            </div>
          </div>
          <div className="ftp-info-row">
            <span className="ftp-info-label">Chemin du répertoire home</span>
            <div className="ftp-copybox" onClick={() => copyToClipboard(`/home/${primaryLogin}`)}>
              <span>/home/{primaryLogin}</span>
              <span className="ftp-copy-icon">📋</span>
            </div>
          </div>
        </div>

        <div className="ftp-info-divider" />

        {/* COL 4: OUTILS */}
        <div className="ftp-info-col">
          <div className="ftp-info-theme">OUTILS</div>
          <div className="ftp-info-row">
            <span className="ftp-info-label">FTP Explorer</span>
            <a href={`https://webftp.ovhcloud.com/?hosting=${serviceName}`} target="_blank" rel="noopener noreferrer" className="ftp-link-action">
              Ouvrir ↗
            </a>
          </div>
          <div className="ftp-info-row">
            <span className="ftp-info-label">Backup</span>
            <button className="ftp-btn-restore" onClick={() => setRestoreModal(true)}>
              Restaurer
            </button>
          </div>
        </div>
      </div>

      {/* ========== TABLE UTILISATEURS ========== */}
      <div className="ftp-table-container">
        <table className="ftp-table">
          <thead>
            <tr>
              <th>Login</th>
              <th>Répertoire cible</th>
              <th>FTP (lien direct)</th>
              <th>SFTP (lien direct)</th>
              <th>SSH (lien direct)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="ftp-empty-row">
                  {searchTerm ? "Aucun résultat" : "Aucun utilisateur FTP"}
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => {
                const isPrimary = user.isPrimaryAccount || user.login === primaryLogin;
                const ftpLink = `ftp://${user.login}@${ftpHost}`;
                const sftpLink = `sftp://${user.login}@${sshHost}`;
                const sshLink = user.sshState === "active" ? `ssh://${user.login}@${sshHost}` : null;

                return (
                  <tr key={user.login}>
                    {/* Login */}
                    <td>
                      <span className="ftp-user-login">
                        {user.login}
                        {isPrimary && <span className="ftp-badge-primary">(principal)</span>}
                      </span>
                      <button 
                        className="ftp-btn-icon" 
                        onClick={() => setPasswordModal({ open: true, login: user.login })}
                        title="Changer le mot de passe"
                      >
                        🔑
                      </button>
                    </td>

                    {/* Répertoire */}
                    <td>
                      <span className="ftp-user-home">{user.home || "/"}</span>
                      <button 
                        className="ftp-btn-icon" 
                        onClick={() => setEditModal({ open: true, user })}
                        title="Modifier"
                      >
                        ✎
                      </button>
                    </td>

                    {/* FTP link */}
                    <td>
                      <div className="ftp-linkbox" onClick={() => copyToClipboard(ftpLink)}>
                        <span className="ftp-linkbox-text">{ftpLink}</span>
                        <span className="ftp-linkbox-copy">C</span>
                      </div>
                    </td>

                    {/* SFTP link */}
                    <td>
                      {user.sshState !== "none" ? (
                        <div className="ftp-linkbox" onClick={() => copyToClipboard(sftpLink)}>
                          <span className="ftp-linkbox-text">{sftpLink}</span>
                          <span className="ftp-linkbox-copy">C</span>
                        </div>
                      ) : (
                        <span className="ftp-cell-muted">non disponible</span>
                      )}
                    </td>

                    {/* SSH link */}
                    <td>
                      {sshLink ? (
                        <div className="ftp-linkbox" onClick={() => copyToClipboard(sshLink)}>
                          <span className="ftp-linkbox-text">{sshLink}</span>
                          <span className="ftp-linkbox-copy">C</span>
                        </div>
                      ) : (
                        <span className="ftp-cell-muted">non disponible</span>
                      )}
                    </td>

                    {/* Delete */}
                    <td>
                      {!isPrimary && (
                        <button 
                          className="ftp-btn-delete"
                          onClick={() => setDeleteModal({ open: true, login: user.login })}
                          title="Supprimer"
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ========== BANNER INFO ========== */}
      <div className="ftp-banner-info">
        <span className="ftp-banner-icon">ℹ️</span>
        <span>Pour vous connecter en FTP, utilisez votre login complet (ex: {primaryLogin}) et le mot de passe associé.</span>
      </div>

      {/* ========== MODALS ========== */}
      <CreateFtpUserModal
        serviceName={serviceName}
        primaryLogin={primaryLogin}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadData}
      />

      <ChangePasswordModal
        serviceName={serviceName}
        login={passwordModal.login}
        isOpen={passwordModal.open}
        onClose={() => setPasswordModal({ open: false, login: "" })}
        onSuccess={loadData}
      />

      <EditFtpUserModal
        serviceName={serviceName}
        user={editModal.user!}
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, user: null })}
        onSuccess={loadData}
      />

      <DeleteFtpUserModal
        serviceName={serviceName}
        login={deleteModal.login}
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, login: "" })}
        onSuccess={handleDeleteSuccess}
      />

      {/* Modal Restore */}
      {restoreModal && (
        <div className="ftp-modal-overlay" onClick={() => setRestoreModal(false)}>
          <div className="ftp-modal" onClick={e => e.stopPropagation()}>
            <div className="ftp-modal-header">
              <h3>Restaurer une sauvegarde</h3>
              <button className="ftp-modal-close" onClick={() => setRestoreModal(false)}>✕</button>
            </div>
            <div className="ftp-modal-body">
              <p>Voulez-vous restaurer la dernière sauvegarde disponible ?</p>
              <p className="ftp-modal-warning">⚠️ Les fichiers actuels seront remplacés par la sauvegarde.</p>
            </div>
            <div className="ftp-modal-footer">
              <button className="ftp-btn-cancel" onClick={() => setRestoreModal(false)}>Annuler</button>
              <button className="ftp-btn-confirm" onClick={handleRestore} disabled={restoreLoading}>
                {restoreLoading ? "Restauration..." : "Restaurer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FtpTab;
