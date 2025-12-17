// ============================================================
// LIVE TAIL - Affichage des logs en temps réel
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import * as logsService from "../../../../services/iam.logs";
import type { LogType, LogEntry } from "../../../../services/iam.logs";

const POLL_INTERVAL = 5000;
const MAX_LOGS = 500;

interface LiveTailProps {
  logType: LogType;
  kind: string;
  description: string;
  onGoToDataStreams: () => void;
}

const LOG_LEVEL_CLASSES: Record<string, string> = {
  error: "log-error", warn: "log-warn", warning: "log-warn", info: "log-info", debug: "log-debug",
};

export function LiveTail({ logType, kind, description, onGoToDataStreams }: LiveTailProps) {
  const { t } = useTranslation("iam/logs");
  const { t: tc } = useTranslation("common");

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [logUrl, setLogUrl] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initLogUrl = useCallback(async () => {
    try {
      const result = await logsService.getLogUrl(logType, kind);
      if (result?.url) { setLogUrl(result.url); return result.url; }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.loadError"));
      return null;
    }
  }, [logType, kind, t]);

  const fetchLogs = useCallback(async (url: string) => {
    try {
      const newLogs = await logsService.fetchLogsFromUrl(url);
      if (newLogs.length > 0) {
        setLogs((prev) => [...prev, ...newLogs].slice(-MAX_LOGS));
      }
      setError(null);
    } catch (err) { console.error("Error fetching logs:", err); }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const url = await initLogUrl();
      if (url) await fetchLogs(url);
      setLoading(false);
    })();
  }, [initLogUrl, fetchLogs]);

  useEffect(() => {
    if (!isPolling || !logUrl) return;
    intervalRef.current = setInterval(() => fetchLogs(logUrl), POLL_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPolling, logUrl, fetchLogs]);

  useEffect(() => {
    if (autoScroll && bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [logs, autoScroll]);

  const togglePolling = () => setIsPolling((p) => !p);
  const clearLogs = () => setLogs([]);
  const refresh = async () => {
    setLoading(true);
    const url = await initLogUrl();
    if (url) { setLogs([]); await fetchLogs(url); }
    setLoading(false);
  };

  const filteredLogs = filter ? logs.filter((l) => (l.message || JSON.stringify(l)).toLowerCase().includes(filter.toLowerCase())) : logs;

  const renderLog = (log: LogEntry, idx: number) => {
    const level = log.level || "info";
    const cls = LOG_LEVEL_CLASSES[level.toLowerCase()] || "log-info";
    const time = log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "";
    return (
      <div key={idx} className={`log-entry ${cls}`}>
        <span className="log-time">{time}</span>
        <span className={`log-level ${cls}`}>{level.toUpperCase()}</span>
        <span className="log-message">{log.message || JSON.stringify(log)}</span>
      </div>
    );
  };

  return (
    <div className="live-tail">
      <div className="live-tail-header">
        <p className="live-tail-description">{description}</p>
        <div className="live-tail-actions">
          <button className="btn btn-secondary btn-sm" onClick={onGoToDataStreams}>{t("liveTail.dataStreams")}</button>
        </div>
      </div>
      <div className="live-tail-toolbar">
        <div className="toolbar-left">
          <button className={`btn btn-sm ${isPolling ? "btn-success" : "btn-secondary"}`} onClick={togglePolling}>
            {t(isPolling ? "liveTail.pause" : "liveTail.resume")}
          </button>
          <button className="btn btn-outline btn-sm" onClick={refresh}>{tc("actions.refresh")}</button>
          <button className="btn btn-outline btn-sm" onClick={clearLogs}>{t("liveTail.clear")}</button>
          <label className="checkbox-label">
            <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} />
            {t("liveTail.autoScroll")}
          </label>
        </div>
        <div className="toolbar-right">
          <input type="text" className="filter-input" placeholder={t("liveTail.filterPlaceholder")} value={filter} onChange={(e) => setFilter(e.target.value)} />
          <span className="log-count">{filteredLogs.length} logs</span>
        </div>
      </div>
      {loading && logs.length === 0 ? (
        <div className="loading-state"><div className="spinner"></div><p>{t("liveTail.loading")}</p></div>
      ) : error ? (
        <div className="error-banner"><span>{error}</span><button onClick={refresh} className="btn btn-sm btn-secondary">{tc("actions.retry")}</button></div>
      ) : (
        <div className="log-container">
          {filteredLogs.length === 0 ? <div className="empty-logs"><p>{t("liveTail.noLogs")}</p></div> : (
            <>{filteredLogs.map(renderLog)}<div ref={bottomRef}></div></>
          )}
        </div>
      )}
      {isPolling && <div className="polling-indicator"><span className="pulse"></span>{t("liveTail.polling")}</div>}
    </div>
  );
}
