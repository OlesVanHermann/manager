// ============================================================
// IDENTITIES TAB - Liste des utilisateurs IAM (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as identitiesService from "./IdentitiesTab";
import type { IamUser } from "../../iam.types";
import "./IdentitiesTab.css";

// ============================================================
// ICONS (défactorisés)
// ============================================================

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="identities-empty-icon">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

// ============================================================
// COMPOSANT
// ============================================================

/** Affiche la liste des utilisateurs IAM avec leur statut. */
export default function IdentitiesTab() {
  const { t } = useTranslation("iam/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<IamUser[]>([]);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadUsers();
  }, []);

  // ---------- LOADERS ----------
  const loadUsers = async () => {
    const credentials = identitiesService.getCredentials();
    if (!credentials) {
      setError(t("errors.notAuthenticated"));
      setLoading(false);
      return;
    }
    try {
      const data = await identitiesService.getUsers(credentials);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.loadError"));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      OK: { label: t("identities.status.active"), className: "identities-badge-success" },
      DISABLED: { label: t("identities.status.disabled"), className: "identities-badge-error" },
      PASSWORD_CHANGE_REQUIRED: { label: t("identities.status.passwordChange"), className: "identities-badge-warning" },
    };
    return statusMap[status] || { label: status, className: "identities-badge-neutral" };
  };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="identities-tab">
        <div className="identities-loading-state">
          <div className="identities-spinner"></div>
          <p>{t("identities.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="identities-tab">
        <div className="identities-error-banner">
          <span>{error}</span>
          <button onClick={loadUsers} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="identities-tab">
      <div className="identities-section-intro">
        <h2>{t("identities.title")}</h2>
        <p>{t("identities.description")}</p>
      </div>

      <div className="identities-toolbar">
        <span className="identities-result-count">{t("identities.count", { count: users.length })}</span>
        <button className="btn btn-primary btn-sm">{t("identities.addButton")}</button>
      </div>

      {users.length === 0 ? (
        <div className="identities-empty-state">
          <UserIcon />
          <h3>{t("identities.empty.title")}</h3>
          <p>{t("identities.empty.description")}</p>
          <button className="btn btn-primary">{t("identities.addButton")}</button>
        </div>
      ) : (
        <div className="identities-table-container">
          <table className="identities-table">
            <thead>
              <tr>
                <th>{t("identities.columns.login")}</th>
                <th>{t("identities.columns.email")}</th>
                <th>{t("identities.columns.group")}</th>
                <th>{t("identities.columns.status")}</th>
                <th>{t("identities.columns.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const status = getStatusBadge(user.status);
                return (
                  <tr key={user.login}>
                    <td><strong>{user.login}</strong></td>
                    <td>{user.email}</td>
                    <td>{user.group || "-"}</td>
                    <td>
                      <span className={`identities-badge ${status.className}`}>{status.label}</span>
                    </td>
                    <td className="identities-actions-cell">
                      <button className="btn btn-outline btn-sm">{t("actions.edit")}</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
