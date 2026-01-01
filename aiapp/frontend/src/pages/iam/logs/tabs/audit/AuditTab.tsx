// ============================================================
// AUDIT TAB - Logs d'audit sécurité (DÉFACTORISÉ)
// LiveTail et DataStreams intégrés directement
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import * as auditService from "./AuditTab.service";
import type { LogEntry, LogSubscription } from "../../logs.types";
import "./AuditTab.css";

// ============================================================
// CONSTANTS
// ============================================================

const POLL_INTERVAL = 5000;
const MAX_LOGS = 500;

const LOG_LEVEL_CLASSES: Record<string, string> = {
  error: "logs-audit-log-error",
  warn: "logs-audit-log-warn",
  warning: "logs-audit-log-warn",
  info: "logs-audit-log-info",
  debug: "logs-audit-log-debug",
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export default function AuditTab() {
  const { t } = useTranslation("iam/logs/audit");
  const [kinds, setKinds] = useState<string[]>([]);
  const [selectedKind, setSelectedKind] = useState("default");
  const [view, setView] = useState<"live-tail" | "data-streams">("live-tail");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKinds();
  }, []);

  const loadKinds = async () => {
    try {
      const data = await auditService.getLogKinds();
      setKinds(data);
      if (data.length > 0 && !data.includes(selectedKind)) {
        setSelectedKind(data[0]);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="logs-audit-tab">
        <div className="logs-audit-loading-state"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="logs-audit-tab">
      {kinds.length > 1 && (
        <div className="logs-audit-kind-selector">
          <label>{t("kindSelector.label")}</label>
          <select
            value={selectedKind}
            onChange={(e) => setSelectedKind(e.target.value)}
            className="logs-audit-kind-select"
          >
            {kinds.map((kind) => (
              <option key={kind} value={kind}>{kind}</option>
            ))}
          </select>
        </div>
      )}
      {view === "live-tail" ? (
        <LiveTail
          kind={selectedKind}
          description={t("description")}
          onGoToDataStreams={() => setView("data-streams")}
        />
      ) : (
        <DataStreams
          kind={selectedKind}
          onGoBack={() => setView("live-tail")}
        />
      )}
    </div>
  );
}

// ============================================================
// LIVE TAIL (DÉFACTORISÉ)
// ============================================================

interface LiveTailProps {
  kind: string;
  description: string;
  onGoToDataStreams: () => void;
}

function LiveTail({ kind, description, onGoToDataStreams }: LiveTailProps) {
  const { t } = useTranslation("iam/logs/audit");
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
      const result = await auditService.getLogUrl(kind);
      if (result?.url) {
        setLogUrl(result.url);
        return result.url;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.loadError"));
      return null;
    }
  }, [kind, t]);

  const fetchLogs = useCallback(async (url: string) => {
    try {
      const newLogs = await auditService.fetchLogsFromUrl(url);
      if (newLogs.length > 0) {
        setLogs((prev) => [...prev, ...newLogs].slice(-MAX_LOGS));
      }
      setError(null);
    } catch (err) {
    }
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
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPolling, logUrl, fetchLogs]);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  const togglePolling = () => setIsPolling((p) => !p);
  const clearLogs = () => setLogs([]);
  const refresh = async () => {
    setLoading(true);
    const url = await initLogUrl();
    if (url) {
      setLogs([]);
      await fetchLogs(url);
    }
    setLoading(false);
  };

  const filteredLogs = filter
    ? logs.filter((l) => (l.message || JSON.stringify(l)).toLowerCase().includes(filter.toLowerCase()))
    : logs;

  const renderLog = (log: LogEntry, idx: number) => {
    const level = log.level || "info";
    const cls = LOG_LEVEL_CLASSES[level.toLowerCase()] || "logs-audit-log-info";
    const time = log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "";
    return (
      <div key={idx} className="logs-audit-log-entry">
        <span className="logs-audit-log-time">{time}</span>
        <span className={`audit-log-level ${cls}`}>{level.toUpperCase()}</span>
        <span className="logs-audit-log-message">{log.message || JSON.stringify(log)}</span>
      </div>
    );
  };

  return (
    <div className="logs-audit-live-tail">
      <div className="logs-audit-live-tail-header">
        <p className="logs-audit-live-tail-description">{description}</p>
        <div>
          <button className="btn btn-secondary btn-sm" onClick={onGoToDataStreams}>
            {t("liveTail.dataStreams")}
          </button>
        </div>
      </div>
      <div className="logs-audit-live-tail-toolbar">
        <div className="logs-audit-toolbar-left">
          <button
            className={`btn btn-sm ${isPolling ? "btn-success" : "btn-secondary"}`}
            onClick={togglePolling}
          >
            {t(isPolling ? "liveTail.pause" : "liveTail.resume")}
          </button>
          <button className="btn btn-outline btn-sm" onClick={refresh}>{tc("actions.refresh")}</button>
          <button className="btn btn-outline btn-sm" onClick={clearLogs}>{t("liveTail.clear")}</button>
          <label className="logs-audit-checkbox-label">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
            />
            {t("liveTail.autoScroll")}
          </label>
        </div>
        <div className="logs-audit-toolbar-right">
          <input
            type="text"
            className="logs-audit-filter-input"
            placeholder={t("liveTail.filterPlaceholder")}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <span className="logs-audit-log-count">{filteredLogs.length} logs</span>
        </div>
      </div>
      {loading && logs.length === 0 ? (
        <div className="logs-audit-loading-state">
          <div className="spinner"></div>
          <p>{t("liveTail.loading")}</p>
        </div>
      ) : error ? (
        <div className="logs-audit-error-banner">
          <span>{error}</span>
          <button onClick={refresh} className="btn btn-sm btn-secondary">{tc("actions.retry")}</button>
        </div>
      ) : (
        <div className="logs-audit-log-container">
          {filteredLogs.length === 0 ? (
            <div className="logs-audit-empty-logs"><p>{t("liveTail.noLogs")}</p></div>
          ) : (
            <>
              {filteredLogs.map(renderLog)}
              <div ref={bottomRef}></div>
            </>
          )}
        </div>
      )}
      {isPolling && (
        <div className="logs-audit-polling-indicator">
          <span className="logs-audit-pulse"></span>
          {t("liveTail.polling")}
        </div>
      )}
    </div>
  );
}

// ============================================================
// DATA STREAMS (DÉFACTORISÉ)
// ============================================================

interface DataStreamsProps {
  kind: string;
  onGoBack: () => void;
}

function DataStreams({ kind, onGoBack }: DataStreamsProps) {
  const { t } = useTranslation("iam/logs/audit");
  const { t: tc } = useTranslation("common");

  const [subscriptions, setSubscriptions] = useState<LogSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptions();
  }, [kind]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await auditService.getSubscriptions(kind);
      setSubscriptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (subscriptionId: string) => {
    try {
      setDeletingId(subscriptionId);
      await auditService.deleteSubscription(subscriptionId);
      setSubscriptions((prev) => prev.filter((s) => s.subscriptionId !== subscriptionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.unsubscribeError"));
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="logs-audit-data-streams">
      <div className="logs-audit-data-streams-header">
        <button className="btn btn-secondary btn-sm" onClick={onGoBack}>
          ← {t("dataStreams.back")}
        </button>
        <h3>{t("dataStreams.title")}</h3>
      </div>
      <div className="logs-audit-data-streams-description">
        <p>{t("dataStreams.description")}</p>
      </div>
      {loading ? (
        <div className="logs-audit-loading-state">
          <div className="spinner"></div>
          <p>{t("dataStreams.loading")}</p>
        </div>
      ) : error ? (
        <div className="logs-audit-error-banner">
          <span>{error}</span>
          <button onClick={loadSubscriptions} className="btn btn-sm btn-secondary">
            {tc("actions.retry")}
          </button>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="logs-audit-empty-state">
          <h4>{t("dataStreams.empty.title")}</h4>
          <p>{t("dataStreams.empty.description")}</p>
        </div>
      ) : (
        <table className="logs-audit-table">
          <thead>
            <tr>
              <th>{t("dataStreams.columns.streamId")}</th>
              <th>{t("dataStreams.columns.service")}</th>
              <th>{t("dataStreams.columns.kind")}</th>
              <th>{t("dataStreams.columns.createdAt")}</th>
              <th>{t("dataStreams.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.subscriptionId}>
                <td className="logs-audit-text-mono">{sub.streamId}</td>
                <td>{sub.serviceName}</td>
                <td><span className="badge badge-neutral">{sub.kind}</span></td>
                <td>{formatDate(sub.createdAt)}</td>
                <td>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleUnsubscribe(sub.subscriptionId)}
                    disabled={deletingId === sub.subscriptionId}
                  >
                    {deletingId === sub.subscriptionId ? (
                      <span className="spinner-sm"></span>
                    ) : (
                      t("dataStreams.unsubscribe")
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="logs-audit-data-streams-footer">
        <button className="btn btn-outline btn-sm" onClick={loadSubscriptions}>
          {tc("actions.refresh")}
        </button>
      </div>
    </div>
  );
}
