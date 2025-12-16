// ============================================================
// IDENTITIES TAB - Liste des utilisateurs IAM
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as iamService from "../../../services/iam";
import { useCredentials, UserIcon } from "../utils";

// ============ COMPOSANT ============

/** Affiche la liste des utilisateurs IAM avec leur statut. */
export function IdentitiesTab() {
  const { t } = useTranslation('iam/index');
  const { t: tCommon } = useTranslation('common');
  const credentials = useCredentials();

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<iamService.IamUser[]>([]);

  // ---------- EFFECTS ----------
  useEffect(() => { loadUsers(); }, []);

  // ---------- LOADERS ----------
  const loadUsers = async () => {
    if (!credentials) { setError(t('errors.notAuthenticated')); setLoading(false); return; }
    try {
      const data = await iamService.getUsers(credentials);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      OK: { label: t('identities.status.active'), className: "badge-success" },
      DISABLED: { label: t('identities.status.disabled'), className: "badge-error" },
      PASSWORD_CHANGE_REQUIRED: { label: t('identities.status.passwordChange'), className: "badge-warning" },
    };
    return statusMap[status] || { label: status, className: "badge-neutral" };
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>{t('identities.loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-panel"><div className="error-banner"><span>{error}</span><button onClick={loadUsers} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
  }

  return (
    <div className="tab-panel identities-tab">
      <div className="section-intro">
        <h2>{t('identities.title')}</h2>
        <p>{t('identities.description')}</p>
      </div>

      <div className="toolbar">
        <span className="result-count">{t('identities.count', { count: users.length })}</span>
        <button className="btn btn-primary btn-sm">{t('identities.addButton')}</button>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <UserIcon />
          <h3>{t('identities.empty.title')}</h3>
          <p>{t('identities.empty.description')}</p>
          <button className="btn btn-primary">{t('identities.addButton')}</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('identities.columns.login')}</th>
                <th>{t('identities.columns.email')}</th>
                <th>{t('identities.columns.group')}</th>
                <th>{t('identities.columns.status')}</th>
                <th>{t('identities.columns.actions')}</th>
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
                    <td><span className={`badge ${status.className}`}>{status.label}</span></td>
                    <td className="actions-cell">
                      <button className="btn btn-outline btn-sm">{t('actions.edit')}</button>
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
