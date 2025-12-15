// ============================================================
// LOGS TAB - Journal des accès IAM
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as iamService from "../../../services/iam.service";
import { useCredentials, useFormatDate, LogIcon } from "../utils";

// ============ COMPOSANT ============

/** Affiche le journal des accès IAM avec filtrage par résultat (allowed/denied). */
export function LogsTab() {
  const { t } = useTranslation('iam/index');
  const { t: tCommon } = useTranslation('common');
  const credentials = useCredentials();
  const formatDate = useFormatDate();

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<iamService.IamLog[]>([]);
  const [filter, setFilter] = useState<"all" | "allowed" | "denied">("all");

  // ---------- EFFECTS ----------
  useEffect(() => { loadLogs(); }, []);

  // ---------- LOADERS ----------
  const loadLogs = async () => {
    if (!credentials) { setError(t('errors.notAuthenticated')); setLoading(false); return; }
    try {
      const data = await iamService.getLogs(credentials);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- COMPUTED ----------
  const filteredLogs = logs.filter(log => {
    if (filter === "all") return true;
    if (filter === "allowed") return log.allowed;
    if (filter === "denied") return !log.allowed;
    return true;
  });

  // ---------- RENDER ----------
  if (loading) {
    return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>{t('logs.loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-panel"><div className="error-banner"><span>{error}</span><button onClick={loadLogs} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
  }

  return (
    <div className="tab-panel logs-tab">
      <div className="section-intro">
        <h2>{t('logs.title')}</h2>
        <p>{t('logs.description')}</p>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value as "all" | "allowed" | "denied")}>
            <option value="all">{t('logs.filters.all')}</option>
            <option value="allowed">{t('logs.filters.allowed')}</option>
            <option value="denied">{t('logs.filters.denied')}</option>
          </select>
          <span className="result-count">{t('logs.count', { count: filteredLogs.length })}</span>
        </div>
        <button className="btn btn-outline btn-sm" onClick={loadLogs}>{tCommon('actions.refresh')}</button>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="empty-state">
          <LogIcon />
          <h3>{t('logs.empty.title')}</h3>
          <p>{t('logs.empty.description')}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('logs.columns.date')}</th>
                <th>{t('logs.columns.identity')}</th>
                <th>{t('logs.columns.action')}</th>
                <th>{t('logs.columns.resource')}</th>
                <th>{t('logs.columns.result')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={idx}>
                  <td>{formatDate(log.createdAt, true)}</td>
                  <td className="urn-cell" title={log.identityUrn}>{log.identityUrn.split("/").pop()}</td>
                  <td>{log.action}</td>
                  <td className="urn-cell" title={log.resourceUrn}>{log.resourceUrn.split("/").pop()}</td>
                  <td>
                    <span className={`badge ${log.allowed ? "badge-success" : "badge-error"}`}>
                      {log.allowed ? t('logs.result.allowed') : t('logs.result.denied')}
                    </span>
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
