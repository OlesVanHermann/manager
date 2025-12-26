// ============================================================
// LOGS TAB - Liste des logs IAM (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as logsService from "./LogsTab.service";
import type { IamLogEntry } from "./LogsTab.service";
import "./LogsTab.css";

// ============================================================
// ICONS (défactorisés)
// ============================================================

function LogsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="logs-empty-icon">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

// ============================================================
// COMPOSANT
// ============================================================

type FilterType = "all" | "allowed" | "denied";

/** Affiche la liste des logs IAM avec filtrage. */
export default function LogsTab() {
  const { t, i18n } = useTranslation("iam/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<IamLogEntry[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadLogs();
  }, [filter]);

  // ---------- LOADERS ----------
  const loadLogs = async () => {
    const credentials = logsService.getCredentials();
    if (!credentials) {
      setError(t("errors.notAuthenticated"));
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await logsService.getLogs(credentials, filter);
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.loadError"));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const formatDate = (dateStr: string) => {
    const locale = i18n.language === "fr" ? "fr-FR" : "en-US";
    return logsService.formatDate(dateStr, locale, true);
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    return log.result === filter;
  });

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="logs-tab">
        <div className="logs-loading-state">
          <div className="logs-spinner"></div>
          <p>{t("logs.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="logs-tab">
        <div className="logs-error-banner">
          <span>{error}</span>
          <button onClick={loadLogs} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="logs-tab">
      <div className="logs-section-intro">
        <h2>{t("logs.title")}</h2>
        <p>{t("logs.description")}</p>
      </div>

      <div className="logs-toolbar">
        <span className="logs-result-count">{t("logs.count", { count: filteredLogs.length })}</span>
        <div className="logs-filters">
          <button
            className={`logs-filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            {t("logs.filters.all")}
          </button>
          <button
            className={`logs-filter-btn ${filter === "allowed" ? "active" : ""}`}
            onClick={() => setFilter("allowed")}
          >
            {t("logs.filters.allowed")}
          </button>
          <button
            className={`logs-filter-btn ${filter === "denied" ? "active" : ""}`}
            onClick={() => setFilter("denied")}
          >
            {t("logs.filters.denied")}
          </button>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="logs-empty-state">
          <LogsIcon />
          <h3>{t("logs.empty.title")}</h3>
          <p>{t("logs.empty.description")}</p>
        </div>
      ) : (
        <div className="logs-table-container">
          <table className="logs-table">
            <thead>
              <tr>
                <th>{t("logs.columns.date")}</th>
                <th>{t("logs.columns.identity")}</th>
                <th>{t("logs.columns.action")}</th>
                <th>{t("logs.columns.resource")}</th>
                <th>{t("logs.columns.result")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr key={`${log.date}-${index}`}>
                  <td>{formatDate(log.date)}</td>
                  <td>{log.identity}</td>
                  <td><code className="logs-action-code">{log.action}</code></td>
                  <td className="logs-resource-cell">{log.resource}</td>
                  <td>
                    <span className={`logs-badge logs-badge-${log.result}`}>
                      {t(`logs.result.${log.result}`)}
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
