// ============================================================
// LINE STATS - NAV4 Statistiques
// Graphique débit + Uptime + Connexions + Historique
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { LineStats as LineStatsType } from "./connections.types";

interface LineStatsProps {
  connectionId: string;
  stats: LineStatsType | null;
  loading: boolean;
  onPeriodChange: (period: string) => void;
  onExport: () => void;
}

type Period = "24h" | "7d" | "30d" | "3m" | "1y";

export function LineStats({
  connectionId,
  stats,
  loading,
  onPeriodChange,
  onExport,
}: LineStatsProps) {
  const { t } = useTranslation("web-cloud/access/connections");
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("7d");

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
    onPeriodChange(period);
  };

  const periods: { id: Period; label: string }[] = [
    { id: "24h", label: t("line.stats.periods.24h") },
    { id: "7d", label: t("line.stats.periods.7d") },
    { id: "30d", label: t("line.stats.periods.30d") },
    { id: "3m", label: t("line.stats.periods.3m") },
    { id: "1y", label: t("line.stats.periods.1y") },
  ];

  const formatDuration = (minutes: number): string => {
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const mins = minutes % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}j`);
    if (hours > 0) parts.push(`${hours}h`);
    if (mins > 0 || parts.length === 0) parts.push(`${mins}m`);

    return parts.join(" ");
  };

  return (
    <div className="line-stats">
      {/* Toolbar */}
      <div className="stats-toolbar">
        <div className="period-selector">
          {periods.map((period) => (
            <button
              key={period.id}
              className={`period-btn ${selectedPeriod === period.id ? "active" : ""}`}
              onClick={() => handlePeriodChange(period.id)}
            >
              {period.label}
            </button>
          ))}
        </div>
        <button className="btn-export" onClick={onExport}>
          📥 {t("line.stats.export")}
        </button>
      </div>

      {loading ? (
        <div className="stats-loading">
          <div className="spinner" />
          <p>{t("loading")}</p>
        </div>
      ) : stats ? (
        <>
          {/* Graphique Débit */}
          <div className="stats-card chart-card">
            <div className="card-header">
              <h4>{t("line.stats.bandwidthTitle")}</h4>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: "#0050D7" }} />
                  {t("line.stats.download")}
                </span>
                <span className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: "#10B981" }} />
                  {t("line.stats.upload")}
                </span>
              </div>
            </div>
            <div className="chart-container">
              {/* Graphique simplifié - en production utiliser recharts */}
              <div className="chart-placeholder">
                <div className="chart-bars">
                  {stats.bandwidth?.slice(-7).map((point, i) => (
                    <div key={i} className="chart-bar-group">
                      <div
                        className="chart-bar download"
                        style={{ height: `${(point.down / 1000) * 100}%` }}
                        title={`↓ ${point.down} Mbps`}
                      />
                      <div
                        className="chart-bar upload"
                        style={{ height: `${(point.up / 500) * 100}%` }}
                        title={`↑ ${point.up} Mbps`}
                      />
                      <span className="chart-label">{point.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cartes Uptime + Connexions */}
          <div className="stats-cards-row">
            {/* Uptime */}
            <div className="stats-card">
              <h4>{t("line.stats.uptimeTitle")}</h4>
              <div className="uptime-main">
                <span className="uptime-percent">{stats.uptime?.percentage || 100}%</span>
                <span className="uptime-label">{t("line.stats.availability")}</span>
              </div>
              <div className="uptime-details">
                <div className="uptime-row">
                  <span>{t("line.stats.availableDuration")}</span>
                  <span className="value-success">
                    {formatDuration(stats.uptime?.availableMinutes || 0)}
                  </span>
                </div>
                <div className="uptime-row">
                  <span>{t("line.stats.unavailableDuration")}</span>
                  <span className="value-error">
                    {formatDuration(stats.uptime?.unavailableMinutes || 0)}
                  </span>
                </div>
              </div>
              <div className="uptime-bar-container">
                <div
                  className="uptime-bar"
                  style={{ width: `${stats.uptime?.percentage || 100}%` }}
                />
              </div>
            </div>

            {/* Connexions */}
            <div className="stats-card">
              <h4>{t("line.stats.connectionsTitle")}</h4>
              <div className="connections-stats">
                <div className="stat-item">
                  <span className="stat-value">{stats.events?.resyncCount || 0}</span>
                  <span className="stat-label">{t("line.stats.resyncs")}</span>
                  {stats.events?.lastResync && (
                    <span className="stat-date">{stats.events.lastResync}</span>
                  )}
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.events?.disconnectCount || 0}</span>
                  <span className="stat-label">{t("line.stats.disconnects")}</span>
                  {stats.events?.lastDisconnect && (
                    <span className="stat-date">{stats.events.lastDisconnect}</span>
                  )}
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.connectedDays || 0}</span>
                  <span className="stat-label">{t("line.stats.connectedDays")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Historique Événements */}
          <div className="stats-card">
            <h4>{t("line.stats.historyTitle")}</h4>
            {stats.events?.history && stats.events.history.length > 0 ? (
              <div className="history-table">
                <div className="table-header">
                  <span>{t("line.stats.historyDate")}</span>
                  <span>{t("line.stats.historyEvent")}</span>
                  <span>{t("line.stats.historyDuration")}</span>
                </div>
                {stats.events.history.slice(0, 10).map((event, i) => (
                  <div key={i} className="table-row">
                    <span className="date">{event.date}</span>
                    <span className={`event-type ${event.type}`}>
                      {event.type === "resync" && "🔄"}
                      {event.type === "disconnect" && "⚠"}
                      {event.type === "connect" && "✓"}
                      {" "}{t(`line.stats.eventTypes.${event.type}`)}
                    </span>
                    <span className="duration">
                      {event.duration ? formatDuration(event.duration) : "-"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="history-empty">
                <p>{t("line.stats.noEvents")}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="stats-empty">
          <span className="empty-icon">📊</span>
          <p>{t("line.stats.noData")}</p>
        </div>
      )}
    </div>
  );
}

export default LineStats;
