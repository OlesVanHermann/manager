// ============================================================
// GROUPS TAB - Liste des groupes de ressources IAM
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as iamService from "../../../services/iam.service";
import { useCredentials, useFormatDate, FolderIcon } from "../utils";

// ============ COMPOSANT ============

/** Affiche la liste des groupes de ressources IAM. */
export function GroupsTab() {
  const { t } = useTranslation('iam/index');
  const { t: tCommon } = useTranslation('common');
  const credentials = useCredentials();
  const formatDate = useFormatDate();

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<iamService.IamResourceGroup[]>([]);

  // ---------- EFFECTS ----------
  useEffect(() => { loadGroups(); }, []);

  // ---------- LOADERS ----------
  const loadGroups = async () => {
    if (!credentials) { setError(t('errors.notAuthenticated')); setLoading(false); return; }
    try {
      const data = await iamService.getResourceGroups(credentials);
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>{t('groups.loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-panel"><div className="error-banner"><span>{error}</span><button onClick={loadGroups} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
  }

  return (
    <div className="tab-panel groups-tab">
      <div className="section-intro">
        <h2>{t('groups.title')}</h2>
        <p>{t('groups.description')}</p>
      </div>

      <div className="toolbar">
        <span className="result-count">{t('groups.count', { count: groups.length })}</span>
        <button className="btn btn-primary btn-sm">{t('groups.createButton')}</button>
      </div>

      {groups.length === 0 ? (
        <div className="empty-state">
          <FolderIcon />
          <h3>{t('groups.empty.title')}</h3>
          <p>{t('groups.empty.description')}</p>
          <button className="btn btn-primary">{t('groups.createButton')}</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('groups.columns.name')}</th>
                <th>{t('groups.columns.owner')}</th>
                <th>{t('groups.columns.resources')}</th>
                <th>{t('groups.columns.createdAt')}</th>
                <th>{t('groups.columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id}>
                  <td>
                    <strong>{group.name}</strong>
                    {group.readOnly && <span className="badge badge-neutral" style={{ marginLeft: "0.5rem" }}>{t('common.readOnly')}</span>}
                  </td>
                  <td>{group.owner}</td>
                  <td>{group.resources?.length || 0}</td>
                  <td>{formatDate(group.createdAt)}</td>
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
