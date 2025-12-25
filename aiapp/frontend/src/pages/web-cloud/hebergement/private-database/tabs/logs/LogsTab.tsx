import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { logsService } from "./LogsTab";
import type { PdbLogEntry } from "../../private-database.types";
import "./LogsTab.css";

interface Props { serviceName: string; }
type LogLevel = "all" | "error" | "warning" | "info";

export function LogsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [logs, setLogs] = useState<PdbLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<LogLevel>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const data = await logsService.getLogs(serviceName);
      setLogs(data || []);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadLogs(); }, [loadLogs]);
  useEffect(() => { if (autoScroll && logsEndRef.current) logsEndRef.current.scrollIntoView({ behavior: "smooth" }); }, [logs, autoScroll]);
  useEffect(() => { if (!streaming) return; const i = setInterval(() => loadLogs(), 5000); return () => clearInterval(i); }, [streaming, loadLogs]);

  const filteredLogs = logs.filter(log => {
    if (filter !== "all" && log.level !== filter) return false;
    if (searchTerm && !log.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getLevelBadge = (level: string) => {
    const map: Record<string, string> = { error: "error", warning: "warning", info: "info" };
    return <span className={`logs-level ${map[level] || "info"}`}>{level.toUpperCase()}</span>;
  };

  const formatTime = (ts: string) => new Date(ts).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const handleExport = () => {
    const content = filteredLogs.map(l => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `logs_${serviceName}_${new Date().toISOString().slice(0,10)}.txt`; a.click();
  };

  if (loading && logs.length === 0) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="logs-tab">
      <div className="logs-header">
        <div><h3>{t("logs.title")}</h3><p className="logs-description">{t("logs.description")}</p></div>
        <div className="logs-actions">
          <button className={`btn btn-sm ${streaming ? "btn-primary" : "btn-secondary"}`} onClick={() => setStreaming(!streaming)}>
            {streaming ? "⏸ Pause" : "▶ Stream"}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={loadLogs}>↻ {t("logs.refresh")}</button>
        </div>
      </div>

      <div className="logs-info-banner"><span>⚠</span><span>{t("logs.betaWarning")}</span></div>

      <div className="logs-toolbar">
        <div className="logs-toolbar-left">
          <input type="text" className="form-input" placeholder={t("logs.search")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value as LogLevel)}>
            <option value="all">{t("logs.allLevels")}</option>
            <option value="error">{t("logs.errorOnly")}</option>
            <option value="warning">{t("logs.warningOnly")}</option>
            <option value="info">{t("logs.infoOnly")}</option>
          </select>
        </div>
        <div className="logs-toolbar-right">
          <label className="logs-checkbox-label"><input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} /> {t("logs.autoScroll")}</label>
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>📥 {t("logs.export")}</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setLogs([])}>🗑 {t("logs.clear")}</button>
        </div>
      </div>

      <div className="logs-container">
        {filteredLogs.length === 0 ? (
          <div className="logs-empty"><span>📋</span><p>{t("logs.empty")}</p></div>
        ) : (
          <div className="logs-list">
            {filteredLogs.map((log) => (
              <div key={log.id} className={`logs-entry ${log.level}`}>
                <span className="logs-time">{formatTime(log.timestamp)}</span>
                {getLevelBadge(log.level)}
                <span className="logs-message">{log.message}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      <div className="logs-stats">
        <span>{filteredLogs.length} {t("logs.entries")}</span>
        <span className="logs-stat-error">{logs.filter(l => l.level === "error").length} erreurs</span>
        <span className="logs-stat-warning">{logs.filter(l => l.level === "warning").length} warnings</span>
      </div>
    </div>
  );
}

export default LogsTab;
