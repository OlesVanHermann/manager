// ============================================================
// ACTIVITY TAB - Logs d'activités API (DÉFACTORISÉ)
// LiveTail et DataStreams intégrés directement
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import * as activityService from "./ActivityTab.service";
import type { LogEntry, LogSubscription } from "../../logs.types";
import "./ActivityTab.css";

// ============================================================
// CONSTANTS
// ============================================================

const POLL_INTERVAL = 5000;
const MAX_LOGS = 500;

const LOG_LEVEL_CLASSES: Record<string, string> = {
  error: "logs-activity-log-error",
  warn: "logs-activity-log-warn",
  warning: "logs-activity-log-warn",
  info: "logs-activity-log-info",
  debug: "logs-activity-log-debug",
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export default function ActivityTab() {
  const { t } = useTranslation("iam/logs/activity");
  const [kinds, setKinds] = useState<string[]>([]);
  const [selectedKind, setSelectedKind] = useState("access");
  const [view, setView] = useState<"live-tail" | "data-streams">("live-tail");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKinds();
  }, []);

  const loadKinds = async () => {
    try {
      const data = await activityService.getLogKinds();
      setKinds(data);
      if (data.length > 0 && !data.includes(selectedKind)) {
        setSelectedKind(data[0]);
      }
    } catch (err) {
      console.error("Error loading log kinds:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="logs-activity-tab">
        <div className="logs-activity-loading-state"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="logs-activity-tab">
      {kinds.length > 1 && (
        <div className="logs-activity-kind-selector">
          <label>{t("kindSelector.label")}</label>
          <select
            value={selectedKind}
            onChange={(e) => setSelectedKind(e.target.value)}
            className="logs-activity-kind-select"
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
  const { t } = useTranslation("iam/logs/activity");
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
      const result = await activityService.getLogUrl(kind);
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
      const newLogs = await activityService.fetchLogsFromUrl(url);
      if (newLogs.length > 0) {
        setLogs((prev) => [...prev, ...newLogs].slice(-MAX_LOGS));
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching logs:", err);
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
    const cls = LOG_LEVEL_CLASSES[level.toLowerCase()] || "logs-activity-log-info";
    const time = log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "";
    return (
      <div key={idx} className="logs-activity-log-entry">
        <span className="logs-activity-log-time">{time}</span>
        <span className={`activity-log-level ${cls}`}>{level.toUpperCase()}</span>
        <span className="logs-activity-log-message">{log.message || JSON.stringify(log)}</span>
      </div>
    );
  };

  return (
    <div className="logs-activity-live-tail">
      <div className="logs-activity-live-tail-header">
        <p className="logs-activity-live-tail-description">{description}</p>
        <div>
          <button className="btn btn-secondary btn-sm" onClick={onGoToDataStreams}>
            {t("liveTail.dataStreams")}
          </button>
        </div>
      </div>
      <div className="logs-activity-live-tail-toolbar">
        <div className="logs-activity-toolbar-left">
          <button
            className={`btn btn-sm ${isPolling ? "btn-success" : "btn-secondary"}`}
            onClick={togglePolling}
          >
            {t(isPolling ? "liveTail.pause" : "liveTail.resume")}
          </button>
          <button className="btn btn-outline btn-sm" onClick={refresh}>{tc("actions.refresh")}</button>
          <button className="btn btn-outline btn-sm" onClick={clearLogs}>{t("liveTail.clear")}</button>
          <label className="logs-activity-checkbox-label">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
            />
            {t("liveTail.autoScroll")}
          </label>
        </div>
        <div className="logs-activity-toolbar-right">
          <input
            type="text"
            className="logs-activity-filter-input"
            placeholder={t("liveTail.filterPlaceholder")}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <span className="logs-activity-log-count">{filteredLogs.length} logs</span>
        </div>
      </div>
      {loading && logs.length === 0 ? (
        <div className="logs-activity-loading-state">
          <div className="spinner"></div>
          <p>{t("liveTail.loading")}</p>
        </div>
      ) : error ? (
        <div className="logs-activity-error-banner">
          <span>{error}</span>
          <button onClick={refresh} className="btn btn-sm btn-secondary">{tc("actions.retry")}</button>
        </div>
      ) : (
        <div className="logs-activity-log-container">
          {filteredLogs.length === 0 ? (
            <div className="logs-activity-empty-logs"><p>{t("liveTail.noLogs")}</p></div>
          ) : (
            <>
              {filteredLogs.map(renderLog)}
              <div ref={bottomRef}></div>
            </>
          )}
        </div>
      )}
      {isPolling && (
        <div className="logs-activity-polling-indicator">
          <span className="logs-activity-pulse"></span>
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
  const { t } = useTranslation("iam/logs/activity");
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
      const data = await activityService.getSubscriptions(kind);
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
      await activityService.deleteSubscription(subscriptionId);
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
    <div className="logs-activity-data-streams">
      <div className="logs-activity-data-streams-header">
        <button className="btn btn-secondary btn-sm" onClick={onGoBack}>
          ← {t("dataStreams.back")}
        </button>
        <h3>{t("dataStreams.title")}</h3>
      </div>
      <div className="logs-activity-data-streams-description">
        <p>{t("dataStreams.description")}</p>
      </div>
      {loading ? (
        <div className="logs-activity-loading-state">
          <div className="spinner"></div>
          <p>{t("dataStreams.loading")}</p>
        </div>
      ) : error ? (
        <div className="logs-activity-error-banner">
          <span>{error}</span>
          <button onClick={loadSubscriptions} className="btn btn-sm btn-secondary">
            {tc("actions.retry")}
          </button>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="logs-activity-empty-state">
          <h4>{t("dataStreams.empty.title")}</h4>
          <p>{t("dataStreams.empty.description")}</p>
        </div>
      ) : (
        <table className="logs-activity-table">
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
                <td className="logs-activity-text-mono">{sub.streamId}</td>
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
      <div className="logs-activity-data-streams-footer">
        <button className="btn btn-outline btn-sm" onClick={loadSubscriptions}>
          {tc("actions.refresh")}
        </button>
      </div>
    </div>
  );
}
