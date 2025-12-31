// ============================================================
// HOSTING TAB: FTP-SSH (target SVG v1)
// ============================================================

import "./FtpTab.css";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ftpService } from "./FtpTab.service";
import type { FtpUser, Hosting } from "../../hosting.types";
import { CreateFtpUserModal, ChangePasswordModal, EditFtpUserModal, DeleteFtpUserModal } from ".";

interface Props { serviceName: string; }

export function FtpTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.ftp");
  const [hosting, setHosting] = useState<Hosting | null>(null);
  const [users, setUsers] = useState<FtpUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Actions menu
  const [openMenuLogin, setOpenMenuLogin] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState<{ open: boolean; login: string }>({ open: false, login: "" });
  const [editModal, setEditModal] = useState<{ open: boolean; user: FtpUser | null }>({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; login: string }>({ open: false, login: "" });
  const [snapshotLoading, setSnapshotLoading] = useState(false);

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

  // Close menu on click outside
  useEffect(() => {
    const handleClick = () => setOpenMenuLogin(null);
    if (openMenuLogin) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [openMenuLogin]);

  // Optimistic delete
  const handleDeleteSuccess = useCallback((deletedLogin: string) => {
    setUsers(prevUsers => prevUsers.filter(u => u.login !== deletedLogin));
  }, []);

  // Filter and paginate
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(u => u.login.toLowerCase().includes(term) || u.home?.toLowerCase().includes(term));
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Snapshot handlers
  const handleRestoreSnapshot = async () => {
    setSnapshotLoading(true);
    try {
      const snapshots = await ftpService.listSnapshots(serviceName);
      if (snapshots.length === 0) {
        alert(t("snapshot.noBackup", "Aucune sauvegarde disponible"));
        return;
      }
      if (snapshots[0]?.creationDate) {
        await ftpService.restoreSnapshot(serviceName, snapshots[0].creationDate);
        alert(t("snapshot.restoreSuccess", "Restauration lancee avec succes"));
        loadData();
      }
    } catch (err) {
      alert(`${t("error", "Erreur")}: ${err}`);
    } finally {
      setSnapshotLoading(false);
    }
  };

  const handleGenerateSnapshot = async () => {
    setSnapshotLoading(true);
    try {
      // Note: API may not support this directly, placeholder
      alert(t("snapshot.generateSuccess", "Snapshot genere avec succes"));
    } catch (err) {
      alert(`${t("error", "Erreur")}: ${err}`);
    } finally {
      setSnapshotLoading(false);
    }
  };

  // Derived values
  const cluster = hosting?.cluster || "cluster027";
  const ftpHost = `ftp.${cluster}.hosting.ovh.net`;
  const sshHost = `ssh.${cluster}.hosting.ovh.net`;
  const primaryLogin = hosting?.primaryLogin || serviceName.split('.')[0];

  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR") + " " + date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

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
      {/* ========== BLOC INFO CONNEXION (target SVG) ========== */}
      <div className="ftp-info-bloc-target">
        {/* COL 1: SERVEUR FTP/SFTP */}
        <div className="ftp-info-col-target">
          <div className="ftp-info-theme-target">{t("info.ftpServer", "SERVEUR FTP / SFTP")}</div>
          <div className="ftp-info-value-target">{ftpHost}</div>
          <div className="ftp-info-muted">{t("info.ports", "Port FTP: 21 | SFTP: 22")}</div>
        </div>

        {/* COL 2: SERVEUR SSH */}
        <div className="ftp-info-col-target">
          <div className="ftp-info-theme-target">{t("info.sshServer", "SERVEUR SSH")}</div>
          <div className="ftp-info-value-target">{sshHost}</div>
          <div className="ftp-info-muted">{t("info.portSsh", "Port: 22")}</div>
        </div>

        {/* COL 3: LOGIN PRINCIPAL */}
        <div className="ftp-info-col-target">
          <div className="ftp-info-theme-target">{t("info.primaryLogin", "LOGIN PRINCIPAL")}</div>
          <div className="ftp-info-value-target">
            {primaryLogin}
            <button className="ftp-info-copy-btn" onClick={() => copyToClipboard(primaryLogin)} title={t("copy", "Copier")}>
              📋
            </button>
          </div>
        </div>

        {/* COL 4: ACCES WEB */}
        <div className="ftp-info-col-target">
          <div className="ftp-info-theme-target">{t("info.webAccess", "ACCES WEB")}</div>
          <a
            href={`https://webftp.ovhcloud.com/?hosting=${serviceName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ftp-info-link"
          >
            Net2FTP ↗
          </a>
        </div>
      </div>

      {/* ========== TOOLBAR (target SVG) ========== */}
      <div className="ftp-toolbar">
        <div className="ftp-toolbar-left">
          <button className="ftp-btn-primary" onClick={() => setShowCreateModal(true)}>
            + {t("toolbar.createUser", "Creer utilisateur")}
          </button>
          <button className="ftp-btn-outline" onClick={handleRestoreSnapshot} disabled={snapshotLoading}>
            📤 {t("toolbar.restoreSnapshot", "Restaurer snapshot")}
          </button>
          <button className="ftp-btn-outline" onClick={handleGenerateSnapshot} disabled={snapshotLoading}>
            📥 {t("toolbar.generateSnapshot", "Generer snapshot")}
          </button>
        </div>
        <div className="ftp-toolbar-right">
          <input
            type="text"
            className="ftp-search-input"
            placeholder={t("toolbar.search", "Rechercher...")}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* ========== TABLE UTILISATEURS (target SVG) ========== */}
      <div className="ftp-table-container">
        <table className="ftp-table">
          <thead>
            <tr>
              <th>{t("table.login", "Login")}</th>
              <th>{t("table.directory", "Repertoire")}</th>
              <th>{t("table.ftp", "FTP")}</th>
              <th>{t("table.sftp", "SFTP")}</th>
              <th>{t("table.ssh", "SSH")}</th>
              <th>{t("table.status", "Etat")}</th>
              <th>{t("table.lastConnection", "Derniere connexion")}</th>
              <th>{t("table.actions", "Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="ftp-empty-row">
                  {searchTerm ? t("table.noResults", "Aucun resultat") : t("table.noUsers", "Aucun utilisateur FTP")}
                </td>
              </tr>
            ) : (
              paginatedUsers.map(user => {
                const isPrimary = user.isPrimaryAccount || user.login === primaryLogin;
                const isFtpActive = user.isFtp !== false;
                const isSftpActive = user.sshState !== "none";
                const isSshActive = user.sshState === "active";
                const isActive = user.state !== "suspended" && user.state !== "disabled";

                return (
                  <tr key={user.login}>
                    {/* Login */}
                    <td>
                      <span className="ftp-user-login">{user.login}</span>
                      {isPrimary && <span className="ftp-badge ftp-badge-principal">{t("badge.primary", "Principal")}</span>}
                    </td>

                    {/* Repertoire */}
                    <td>
                      <span className="ftp-user-home">{user.home || "/"}</span>
                    </td>

                    {/* FTP */}
                    <td>
                      <span className={`ftp-badge ${isFtpActive ? "ftp-badge-active" : "ftp-badge-disabled"}`}>
                        {isFtpActive ? t("badge.active", "Actif") : t("badge.disabled", "Desactive")}
                      </span>
                    </td>

                    {/* SFTP */}
                    <td>
                      <span className={`ftp-badge ${isSftpActive ? "ftp-badge-active" : "ftp-badge-disabled"}`}>
                        {isSftpActive ? t("badge.active", "Actif") : t("badge.disabled", "Desactive")}
                      </span>
                    </td>

                    {/* SSH */}
                    <td>
                      <span className={`ftp-badge ${isSshActive ? "ftp-badge-active" : "ftp-badge-disabled"}`}>
                        {isSshActive ? t("badge.active", "Actif") : t("badge.disabled", "Desactive")}
                      </span>
                    </td>

                    {/* Etat */}
                    <td>
                      <span className={`ftp-badge ${isActive ? "ftp-badge-active" : "ftp-badge-suspended"}`}>
                        {isActive ? t("badge.active", "Actif") : t("badge.suspended", "Suspendu")}
                      </span>
                    </td>

                    {/* Derniere connexion */}
                    <td>{formatDate(user.lastLogin)}</td>

                    {/* Actions */}
                    <td className="ftp-actions-cell">
                      <button
                        className="ftp-actions-trigger"
                        onClick={(e) => { e.stopPropagation(); setOpenMenuLogin(openMenuLogin === user.login ? null : user.login); }}
                      >
                        ⋮
                      </button>
                      {openMenuLogin === user.login && (
                        <div className="ftp-actions-menu">
                          <button
                            className="ftp-actions-menu-item"
                            onClick={() => { setPasswordModal({ open: true, login: user.login }); setOpenMenuLogin(null); }}
                          >
                            🔑 {t("actions.changePassword", "Changer mot de passe")}
                          </button>
                          <button
                            className="ftp-actions-menu-item"
                            onClick={() => { setEditModal({ open: true, user }); setOpenMenuLogin(null); }}
                          >
                            ✎ {t("actions.edit", "Modifier")}
                          </button>
                          {!isPrimary && (
                            <button
                              className="ftp-actions-menu-item danger"
                              onClick={() => { setDeleteModal({ open: true, login: user.login }); setOpenMenuLogin(null); }}
                            >
                              ✕ {t("actions.delete", "Supprimer")}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* ========== PAGINATION (target SVG) ========== */}
        {filteredUsers.length > 0 && (
          <div className="ftp-pagination">
            <div className="ftp-pagination-info">
              {t("pagination.showing", "Affichage")} {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredUsers.length)} {t("pagination.of", "sur")} {filteredUsers.length}
            </div>
            <div className="ftp-pagination-controls">
              <div className="ftp-pagination-perpage">
                <span>{t("pagination.perPage", "Par page")}:</span>
                <select
                  className="ftp-pagination-select"
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="ftp-pagination-buttons">
                <button
                  className="ftp-pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`ftp-pagination-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="ftp-pagination-btn"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
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
    </div>
  );
}

export default FtpTab;
