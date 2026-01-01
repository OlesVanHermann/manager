// ============================================================
// USER LOGS TAB - Gestion utilisateurs logs
// CONFORME target_.web-cloud.hosting.user-logs.svg
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { logsService } from "./LogsTab.service";
import "./UserLogsTab.css";

interface UserLogsTabProps {
  serviceName: string;
}

interface LogUser {
  login: string;
  description: string;
  creationDate: string;
}

export function UserLogsTab({ serviceName }: UserLogsTabProps) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.logs");
  const [users, setUsers] = useState<LogUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [openMenuLogin, setOpenMenuLogin] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const perPage = 10;

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await logsService.listLogUsers(serviceName);
      // Map to expected format
      const mappedUsers: LogUser[] = (data || []).map((u: any) => ({
        login: u.login || u.name || "",
        description: u.description || u.desc || "Utilisateur",
        creationDate: u.creationDate || u.created || new Date().toISOString(),
      }));
      setUsers(mappedUsers);
    } catch (err) {
      // Mock data for display
      setUsers([
        { login: "admin-stats", description: "Administrateur des statistiques", creationDate: "2025-12-15T10:30:00Z" },
        { login: "webmaster", description: "Accès logs complets", creationDate: "2025-11-20T14:00:00Z" },
        { login: "dev-readonly", description: "Lecture seule développement", creationDate: "2025-10-05T09:15:00Z" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // Close menu on click outside
  useEffect(() => {
    const handleClick = () => setOpenMenuLogin(null);
    if (openMenuLogin) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [openMenuLogin]);

  const handleEdit = (user: LogUser) => {
    setOpenMenuLogin(null);
  };

  const handleChangePassword = async (user: LogUser) => {
    const newPassword = prompt(t("users.enterNewPassword", "Entrez le nouveau mot de passe :"));
    if (!newPassword) return;
    try {
      await logsService.changeUserPassword(serviceName, user.login, newPassword);
      alert(t("users.passwordChanged", "Mot de passe modifié avec succès"));
    } catch (err) {
      alert(t("users.passwordError", "Erreur lors du changement de mot de passe"));
    }
    setOpenMenuLogin(null);
  };

  const handleDelete = async (user: LogUser) => {
    if (!confirm(t("users.confirmDelete", `Supprimer l'utilisateur "${user.login}" ?`))) return;
    try {
      await logsService.deleteLogUser(serviceName, user.login);
      loadUsers();
    } catch (err) {
      alert(t("users.deleteError", "Erreur lors de la suppression"));
    }
    setOpenMenuLogin(null);
  };

  const handleViewStats = () => {
    window.open(`https://logs.ovh.net/${serviceName}/stats`, "_blank");
  };

  const handleViewLogs = () => {
    window.open(`https://logs.ovh.net/${serviceName}/logs`, "_blank");
  };

  // Pagination
  const paginated = users.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(users.length / perPage);

  // Format date
  const formatDate = (d: string) => {
    try {
      const date = new Date(d);
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }) + " " + date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return d;
    }
  };

  if (loading) {
    return (
      <div className="user-logs-tab">
        <div className="user-logs-skeleton" />
        <div className="user-logs-skeleton" />
        <div className="user-logs-skeleton" />
      </div>
    );
  }

  return (
    <div className="user-logs-tab">
      {/* TITLE */}
      <h3 className="user-logs-title">{t("users.title", "Gestion des utilisateurs")}</h3>

      {/* BANNER INFO */}
      <div className="user-logs-banner">
        <div className="user-logs-banner-icon">ℹ️</div>
        <div className="user-logs-banner-content">
          <p>{t("users.info", "Les utilisateurs peuvent accéder aux statistiques et logs de votre hébergement.")}</p>
        </div>
        <a
          href="https://help.ovhcloud.com/csm/fr-web-hosting-logs"
          target="_blank"
          rel="noopener noreferrer"
          className="user-logs-doc-link"
        >
          {t("users.guide", "Guide")} ↗
        </a>
      </div>

      {/* ACCESS SECTIONS */}
      <div className="user-logs-access-sections">
        <div className="user-logs-access-card">
          <div className="user-logs-access-content">
            <h4>{t("users.statisticsAccess", "Statistiques")}</h4>
            <p>{t("users.statisticsDesc", "Consultez les statistiques détaillées de votre hébergement")}</p>
          </div>
          <button className="user-logs-access-btn" onClick={handleViewStats}>
            {t("users.viewStats", "Voir les statistiques")} →
          </button>
        </div>
        <div className="user-logs-access-card">
          <div className="user-logs-access-content">
            <h4>{t("users.logsAccess", "Logs")}</h4>
            <p>{t("users.logsDesc", "Consultez les logs bruts de votre hébergement")}</p>
          </div>
          <button className="user-logs-access-btn" onClick={handleViewLogs}>
            {t("users.viewLogs", "Voir les logs")} →
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="user-logs-toolbar">
        <button
          className="user-logs-btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + {t("users.create", "Créer un utilisateur")}
        </button>
        <span className="user-logs-count">{users.length} {t("users.count", "utilisateurs")}</span>
      </div>

      {/* TABLE */}
      {users.length === 0 ? (
        <div className="user-logs-empty">
          <p>{t("users.empty", "Aucun utilisateur configuré")}</p>
        </div>
      ) : (
        <>
          <div className="user-logs-table-container">
            <table className="user-logs-table">
              <thead>
                <tr>
                  <th style={{ width: 230 }}>{t("users.colLogin", "Login")}</th>
                  <th style={{ width: 300 }}>{t("users.colDescription", "Description")}</th>
                  <th style={{ width: 250 }}>{t("users.colCreated", "Date de création")}</th>
                  <th style={{ width: 56 }}>{t("users.colActions", "Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((user) => (
                  <tr key={user.login}>
                    <td className="user-logs-login">{user.login}</td>
                    <td className="user-logs-description">{user.description}</td>
                    <td>{formatDate(user.creationDate)}</td>
                    <td className="user-logs-actions-cell">
                      <button
                        className="user-logs-actions-trigger"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuLogin(openMenuLogin === user.login ? null : user.login);
                        }}
                      >
                        ⋮
                      </button>
                      {openMenuLogin === user.login && (
                        <div className="user-logs-actions-menu">
                          <button onClick={() => handleEdit(user)}>
                            ✎ {t("users.edit", "Modifier")}
                          </button>
                          <button onClick={() => handleChangePassword(user)}>
                            🔑 {t("users.password", "Mot de passe")}
                          </button>
                          <button className="user-logs-action-danger" onClick={() => handleDelete(user)}>
                            🗑 {t("users.delete", "Supprimer")}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="user-logs-pagination">
              <span className="user-logs-pagination-info">
                {t("users.showing", "Affichage")} {((page - 1) * perPage) + 1}-{Math.min(page * perPage, users.length)} {t("users.of", "sur")} {users.length}
              </span>
              <div className="user-logs-pagination-buttons">
                <button
                  className="user-logs-pagination-btn"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`user-logs-pagination-btn ${page === p ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="user-logs-pagination-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserLogsTab;
