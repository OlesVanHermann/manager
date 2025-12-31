// ============================================================
// LOGS TAB - Console de logs OverTheBox
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { OtbLogEntry, LogLevel, LogPeriod } from "./overthebox.types";
import "./LogsTab.css";

interface Props {
  serviceName: string;
}

// Mock log data
const mockLogs: OtbLogEntry[] = [
  { timestamp: "2024-12-30T16:45:32Z", level: "INFO", message: "Connection FTTH: synchronized at 500 Mbps / 200 Mbps" },
  { timestamp: "2024-12-30T16:44:28Z", level: "INFO", message: "Aggregation: load balancing active on 3 connections" },
  { timestamp: "2024-12-30T16:43:15Z", level: "WARN", message: "Connection VDSL: signal quality degraded (attenuation 42dB)" },
  { timestamp: "2024-12-30T16:42:00Z", level: "DEBUG", message: "DHCP: lease renewed for device 192.168.100.45" },
  { timestamp: "2024-12-30T16:41:30Z", level: "INFO", message: "QoS: traffic shaping active (850/350 Mbps)" },
  { timestamp: "2024-12-30T16:40:00Z", level: "ERROR", message: "Connection 4G: temporary disconnection (signal lost)" },
  { timestamp: "2024-12-30T16:39:45Z", level: "INFO", message: "Connection 4G: reconnected" },
  { timestamp: "2024-12-30T16:38:20Z", level: "DEBUG", message: "DNS: query forwarded to 213.186.33.99" },
  { timestamp: "2024-12-30T16:37:00Z", level: "INFO", message: "Tunnel: encrypted session established" },
  { timestamp: "2024-12-30T16:36:15Z", level: "INFO", message: "System: firmware v0.9.12 running" },
  { timestamp: "2024-12-30T16:35:00Z", level: "INFO", message: "Boot: OverTheBox started successfully" },
];

export function LogsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/access/overthebox/logs");
  const logsContainerRef = useRef<HTMLDivElement>(null);

  const [logs, setLogs] = useState<OtbLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<LogLevel | "ALL">("ALL");
  const [periodFilter, setPeriodFilter] = useState<LogPeriod>("24h");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // In production: const data = await ovhApi.get(`/overthebox/${serviceName}/logs`);
        await new Promise(r => setTimeout(r, 300));
        setLogs(mockLogs);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName, periodFilter]);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (isLive && logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs, isLive]);

  // Simulated live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newLog: OtbLogEntry = {
        timestamp: new Date().toISOString(),
        level: ["INFO", "DEBUG", "WARN"][Math.floor(Math.random() * 3)] as LogLevel,
        message: `Live update: heartbeat from ${serviceName}`,
      };
      setLogs(prev => [newLog, ...prev.slice(0, 99)]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive, serviceName]);

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (levelFilter !== "ALL" && log.level !== levelFilter) return false;
    if (search && !log.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLogs(mockLogs);
      setLoading(false);
    }, 300);
  }, []);

  const handleExport = useCallback(() => {
    const content = filteredLogs
      .map((log) => `[${log.timestamp}] [${log.level}] ${log.message}`)
      .join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `overthebox-${serviceName}-logs.log`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredLogs, serviceName]);

  const getLevelClass = useCallback((level: LogLevel): string => {
    switch (level) {
      case "DEBUG": return "debug";
      case "INFO": return "info";
      case "WARN": return "warn";
      case "ERROR": return "error";
      case "FATAL": return "fatal";
      default: return "info";
    }
  }, []);

  if (loading) {
    return (
      <div className="otb-logs-loading">
        <div className="otb-logs-skeleton" />
      </div>
    );
  }

  return (
    <div className="otb-logs-container">
      {/* Toolbar */}
      <div className="otb-logs-toolbar">
        <div className="otb-logs-toolbar-left">
          <button className="otb-logs-btn-icon" onClick={handleRefresh} title={t("refresh")}>
            ↻
          </button>
          <div className="otb-logs-search">
            <input
              type="text"
              className="otb-logs-search-input"
              placeholder={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="otb-logs-filter"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as LogLevel | "ALL")}
          >
            <option value="ALL">{t("levels.all")}</option>
            <option value="DEBUG">{t("levels.debug")}</option>
            <option value="INFO">{t("levels.info")}</option>
            <option value="WARN">{t("levels.warn")}</option>
            <option value="ERROR">{t("levels.error")}</option>
            <option value="FATAL">{t("levels.fatal")}</option>
          </select>
          <select
            className="otb-logs-filter"
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value as LogPeriod)}
          >
            <option value="1h">{t("periods.1h")}</option>
            <option value="24h">{t("periods.24h")}</option>
            <option value="7d">{t("periods.7d")}</option>
            <option value="30d">{t("periods.30d")}</option>
          </select>
        </div>
        <div className="otb-logs-toolbar-right">
          <button className="otb-logs-btn-secondary" onClick={handleExport}>
            {t("export")}
          </button>
        </div>
      </div>

      {/* Live indicator */}
      <div className="otb-logs-live-bar">
        <button
          className={`otb-logs-live-btn ${isLive ? "active" : ""}`}
          onClick={() => setIsLive(!isLive)}
        >
          <span className={`otb-logs-live-dot ${isLive ? "pulse" : ""}`}></span>
          {isLive ? t("live") : t("paused")}
        </button>
        <span className="otb-logs-count">
          {filteredLogs.length} {t("entries")}
        </span>
      </div>

      {/* Logs console */}
      <div className="otb-logs-console" ref={logsContainerRef}>
        {filteredLogs.length === 0 ? (
          <div className="otb-logs-empty">
            {t("empty")}
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div key={index} className="otb-logs-line">
              <span className="otb-logs-timestamp">
                [{new Date(log.timestamp).toLocaleString("fr-FR")}]
              </span>
              <span className={`otb-logs-level ${getLevelClass(log.level)}`}>
                [{log.level}]
              </span>
              <span className="otb-logs-message">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LogsTab;
