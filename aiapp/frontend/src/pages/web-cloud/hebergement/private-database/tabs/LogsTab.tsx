// ============================================================
// PRIVATE DATABASE TAB: LOGS - Logs serveur
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService } from "../../../../../services/web-cloud.private-database";

interface Props { serviceName: string; }

type LogLevel = "all" | "error" | "warning" | "info";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "error" | "warning" | "info";
  message: string;
  details?: string;
}

/** Onglet Logs avec streaming et filtres. */
export function LogsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<LogLevel>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // ---------- LOAD ----------
  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await privateDatabaseService.getLogs(serviceName);
      setLogs(data || []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  // Streaming simulation (polling)
  useEffect(() => {
    if (!streaming) return;
    const interval = setInterval(() => {
      loadLogs();
    }, 5000);
    return () => clearInterval(interval);
  }, [streaming, loadLogs]);

  // ---------- FILTERING ----------
  const filteredLogs = logs.filter(log => {
    if (filter !== "all" && log.level !== filter) return false;
    if (searchTerm && !log.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // ---------- HELPERS ----------
  const getLevelBadge = (level: string) => {
    const map: Record<string, { class: string; label: string }> = {
      error: { class: "error", label: "ERROR" },
      warning: { class: "warning", label: "WARN" },
      info: { class: "info", label: "INFO" },
    };
    const s = map[level] || { class: "inactive", label: level.toUpperCase() };
    return <span className={`log-level ${s.class}`}>{s.label}</span>;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleExport = () => {
    const content = filteredLogs.map(log => 
      `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`
    ).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs_${serviceName}_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setLogs([]);
  };

  if (loading && logs.length === 0) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
      </div>
    );
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  // ---------- RENDER ----------
  return (
    <div className="logs-tab">
      <div className="tab-header">
        <div>
          <h3>{t("logs.title")}</h3>
          <p className="tab-description">{t("logs.description")}</p>
        </div>
        <div className="tab-actions">
          <button 
            className={`btn btn-sm ${streaming ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setStreaming(!streaming)}
          >
            {streaming ? "⏸ Pause" : "▶ Stream"}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={loadLogs}>
            ↻ {t("logs.refresh")}
          </button>
        </div>
      </div>

      {/* Beta banner */}
      <div className="info-banner warning">
        <span className="info-icon">⚠</span>
        <span>{t("logs.betaWarning")}</span>
      </div>

      {/* Toolbar */}
      <div className="logs-toolbar">
        <div className="toolbar-left">
          <input
            type="text"
            className="form-input"
            placeholder={t("logs.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value as LogLevel)}
          >
            <option value="all">{t("logs.allLevels")}</option>
            <option value="error">{t("logs.errorOnly")}</option>
            <option value="warning">{t("logs.warningOnly")}</option>
            <option value="info">{t("logs.infoOnly")}</option>
          </select>
        </div>
        <div className="toolbar-right">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
            />
            {t("logs.autoScroll")}
          </label>
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>
            📥 {t("logs.export")}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleClear}>
            🗑 {t("logs.clear")}
          </button>
        </div>
      </div>

      {/* Logs container */}
      <div className="logs-container">
        {filteredLogs.length === 0 ? (
          <div className="empty-logs">
            <span className="empty-icon">📋</span>
            <p>{t("logs.empty")}</p>
          </div>
        ) : (
          <div className="logs-list">
            {filteredLogs.map((log) => (
              <div key={log.id} className={`log-entry ${log.level}`}>
                <span className="log-time">{formatTime(log.timestamp)}</span>
                {getLevelBadge(log.level)}
                <span className="log-message">{log.message}</span>
                {log.details && (
                  <details className="log-details">
                    <summary>Détails</summary>
                    <pre>{log.details}</pre>
                  </details>
                )}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="logs-stats">
        <span>{filteredLogs.length} {t("logs.entries")}</span>
        <span className="stat-error">{logs.filter(l => l.level === "error").length} erreurs</span>
        <span className="stat-warning">{logs.filter(l => l.level === "warning").length} warnings</span>
      </div>
    </div>
  );
}

export default LogsTab;
