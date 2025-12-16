// ============================================================
// POLICIES TAB - Liste des policies IAM
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as iamService from "../../../services/iam";
import { useCredentials, useFormatDate, ShieldIcon } from "../utils";

// ============ COMPOSANT ============

/** Affiche la liste des policies IAM avec leurs permissions. */
export function PoliciesTab() {
  const { t } = useTranslation('iam/index');
  const { t: tCommon } = useTranslation('common');
  const credentials = useCredentials();
  const formatDate = useFormatDate();

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [policies, setPolicies] = useState<iamService.IamPolicy[]>([]);

  // ---------- EFFECTS ----------
  useEffect(() => { loadPolicies(); }, []);

  // ---------- LOADERS ----------
  const loadPolicies = async () => {
    if (!credentials) { setError(t('errors.notAuthenticated')); setLoading(false); return; }
    try {
      const data = await iamService.getPolicies(credentials);
      setPolicies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>{t('policies.loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-panel"><div className="error-banner"><span>{error}</span><button onClick={loadPolicies} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
  }

  return (
    <div className="tab-panel policies-tab">
      <div className="section-intro">
        <h2>{t('policies.title')}</h2>
        <p>{t('policies.description')}</p>
      </div>

      <div className="toolbar">
        <span className="result-count">{t('policies.count', { count: policies.length })}</span>
        <button className="btn btn-primary btn-sm">{t('policies.createButton')}</button>
      </div>

      {policies.length === 0 ? (
        <div className="empty-state">
          <ShieldIcon />
          <h3>{t('policies.empty.title')}</h3>
          <p>{t('policies.empty.description')}</p>
          <button className="btn btn-primary">{t('policies.createButton')}</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('policies.columns.name')}</th>
                <th>{t('policies.columns.description')}</th>
                <th>{t('policies.columns.identities')}</th>
                <th>{t('policies.columns.resources')}</th>
                <th>{t('policies.columns.createdAt')}</th>
                <th>{t('policies.columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id}>
                  <td>
                    <strong>{policy.name}</strong>
                    {policy.readOnly && <span className="badge badge-neutral" style={{ marginLeft: "0.5rem" }}>{t('common.readOnly')}</span>}
                  </td>
                  <td>{policy.description || "-"}</td>
                  <td>{policy.identities?.length || 0}</td>
                  <td>{policy.resources?.length || 0}</td>
                  <td>{formatDate(policy.createdAt)}</td>
                  <td className="actions-cell">
                    <button className="btn btn-outline btn-sm">{t('actions.edit')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
