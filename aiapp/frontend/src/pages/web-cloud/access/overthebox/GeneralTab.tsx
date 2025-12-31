// ============================================================
// GENERAL TAB - Vue d'ensemble OverTheBox améliorée
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ovhApi } from "../../../../services/api";
import type { OverTheBox, OtbConnection, OtbFirmware, OtbBandwidth } from "./overthebox.types";
import "./GeneralTab.css";

interface Props {
  serviceName: string;
  details: OverTheBox | null;
}

// Mock data for connections (will be replaced by API calls)
const mockConnections: OtbConnection[] = [
  { id: "conn1", name: "Fibre Pro Paris", type: "FTTH", provider: "OVH", status: "active", bandwidth: { download: 500, upload: 200 }, priority: 1 },
  { id: "conn2", name: "4G Backup", type: "4G", provider: "OVH", status: "active", bandwidth: { download: 150, upload: 50 }, priority: 2 },
  { id: "conn3", name: "VDSL Bureau", type: "VDSL", provider: "Orange", status: "degraded", bandwidth: { download: 80, upload: 20 }, priority: 3 },
];

const mockFirmware: OtbFirmware = {
  version: "0.9.12",
  upToDate: true,
  latestVersion: "0.9.12",
};

const mockAggregatedBandwidth: OtbBandwidth = {
  download: 850,
  upload: 350,
};

export function GeneralTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/access/overthebox/general");

  const [connections, setConnections] = useState<OtbConnection[]>([]);
  const [firmware, setFirmware] = useState<OtbFirmware | null>(null);
  const [aggregatedBw, setAggregatedBw] = useState<OtbBandwidth | null>(null);
  const [loading, setLoading] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // In production, these would be API calls
        // const conns = await ovhApi.get(`/overthebox/${serviceName}/connections`);
        // const fw = await ovhApi.get(`/overthebox/${serviceName}/firmware`);
        await new Promise(r => setTimeout(r, 300)); // Simulate loading
        setConnections(mockConnections);
        setFirmware(mockFirmware);
        setAggregatedBw(mockAggregatedBandwidth);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  // Format uptime
  const formatUptime = useCallback((seconds?: number): string => {
    if (!seconds) return "-";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}j ${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, []);

  // Copy to clipboard
  const handleCopy = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(field);
    setTimeout(() => setCopyFeedback(null), 2000);
  }, []);

  // Get status color
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "active": return "#10B981";
      case "degraded": return "#F59E0B";
      case "offline": return "#EF4444";
      case "maintenance": return "#6366F1";
      default: return "#9CA3AF";
    }
  }, []);

  // Get connection status icon
  const getConnectionIcon = useCallback((status: string) => {
    switch (status) {
      case "active": return "🟢";
      case "degraded": return "🟡";
      case "offline": return "🔴";
      default: return "⚪";
    }
  }, []);

  if (loading) {
    return (
      <div className="otb-general-loading">
        <div className="otb-general-skeleton" />
      </div>
    );
  }

  return (
    <div className="otb-general-container">
      {/* Status Cards */}
      <div className="otb-status-cards">
        {/* Card 1: Status + Uptime */}
        <div className="otb-status-card">
          <div className="otb-card-icon" style={{ color: getStatusColor(details?.status || "") }}>
            ●
          </div>
          <div className="otb-card-content">
            <span className="otb-card-label">{t("status.title")}</span>
            <span className="otb-card-value" style={{ color: getStatusColor(details?.status || "") }}>
              {t(`status.${details?.status || "unknown"}`)}
            </span>
            <span className="otb-card-sub">
              {t("status.uptime")}: {formatUptime(details?.uptime)}
            </span>
          </div>
        </div>

        {/* Card 2: Public IP */}
        <div className="otb-status-card">
          <div className="otb-card-icon">🌐</div>
          <div className="otb-card-content">
            <span className="otb-card-label">{t("ip.title")}</span>
            <div className="otb-card-value-row">
              <span className="otb-card-value otb-mono">{details?.publicIp || "-"}</span>
              {details?.publicIp && (
                <button
                  className="otb-copy-btn"
                  onClick={() => handleCopy(details.publicIp!, "ip")}
                  title={t("copy")}
                >
                  {copyFeedback === "ip" ? "✓" : "📋"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Aggregated Bandwidth */}
        <div className="otb-status-card">
          <div className="otb-card-icon">📊</div>
          <div className="otb-card-content">
            <span className="otb-card-label">{t("bandwidth.title")}</span>
            <span className="otb-card-value">
              {aggregatedBw ? `${aggregatedBw.download} / ${aggregatedBw.upload} Mbps` : "-"}
            </span>
            <span className="otb-card-sub">
              {t("bandwidth.aggregated")}
            </span>
          </div>
        </div>

        {/* Card 4: Firmware */}
        <div className="otb-status-card">
          <div className="otb-card-icon">⚙️</div>
          <div className="otb-card-content">
            <span className="otb-card-label">{t("firmware.title")}</span>
            <span className="otb-card-value">v{firmware?.version || "-"}</span>
            <span className={`otb-card-sub ${firmware?.upToDate ? "success" : "warning"}`}>
              {firmware?.upToDate ? t("firmware.upToDate") : t("firmware.updateAvailable")}
            </span>
          </div>
        </div>
      </div>

      {/* Active Connections */}
      <section className="otb-section">
        <div className="otb-section-header">
          <h3>{t("connections.title")}</h3>
          <div className="otb-section-actions">
            <button className="otb-btn-secondary">
              {t("connections.managePriorities")}
            </button>
            <button className="otb-btn-primary">
              + {t("connections.add")}
            </button>
          </div>
        </div>

        <div className="otb-connections-grid">
          {connections.map((conn) => (
            <div key={conn.id} className={`otb-connection-card ${conn.status}`}>
              <div className="otb-conn-header">
                <span className="otb-conn-status">{getConnectionIcon(conn.status)}</span>
                <h4 className="otb-conn-name">{conn.name}</h4>
                <span className="otb-conn-priority">#{conn.priority}</span>
              </div>
              <div className="otb-conn-info">
                <span className="otb-conn-type">{conn.type}</span>
                <span className="otb-conn-sep">·</span>
                <span className="otb-conn-provider">{conn.provider}</span>
              </div>
              <div className="otb-conn-bandwidth">
                <span>↓ {conn.bandwidth.download} Mbps</span>
                <span>↑ {conn.bandwidth.upload} Mbps</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service Information */}
      <section className="otb-section">
        <h3>{t("service.title")}</h3>
        <div className="otb-info-grid">
          <div className="otb-info-item">
            <label>{t("service.offer")}</label>
            <span>{details?.offer || "OverTheBox Plus"}</span>
          </div>
          <div className="otb-info-item">
            <label>{t("service.activation")}</label>
            <span>
              {details?.activationDate
                ? new Date(details.activationDate).toLocaleDateString("fr-FR")
                : "-"}
            </span>
          </div>
          <div className="otb-info-item">
            <label>{t("service.renewal")}</label>
            <span>
              {details?.renewalDate
                ? new Date(details.renewalDate).toLocaleDateString("fr-FR")
                : "-"}
            </span>
          </div>
          <div className="otb-info-item">
            <label>{t("service.serviceId")}</label>
            <div className="otb-info-copyable">
              <span className="otb-mono">{serviceName}</span>
              <button
                className="otb-copy-btn-small"
                onClick={() => handleCopy(serviceName, "serviceId")}
              >
                {copyFeedback === "serviceId" ? "✓" : "📋"}
              </button>
            </div>
          </div>
          <div className="otb-info-item">
            <label>{t("service.deviceId")}</label>
            <div className="otb-info-copyable">
              <span className="otb-mono">{details?.deviceId || "-"}</span>
              {details?.deviceId && (
                <button
                  className="otb-copy-btn-small"
                  onClick={() => handleCopy(details.deviceId!, "deviceId")}
                >
                  {copyFeedback === "deviceId" ? "✓" : "📋"}
                </button>
              )}
            </div>
          </div>
          <div className="otb-info-item">
            <label>{t("service.name")}</label>
            <div className="otb-info-editable">
              <span>{details?.customerDescription || serviceName}</span>
              <button className="otb-edit-btn" title={t("edit")}>✎</button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="otb-section">
        <h3>{t("actions.title")}</h3>
        <div className="otb-actions-grid">
          <button className="otb-action-btn">
            <span className="otb-action-icon">🔄</span>
            <span className="otb-action-label">{t("actions.reboot")}</span>
          </button>
          <button className="otb-action-btn">
            <span className="otb-action-icon">📈</span>
            <span className="otb-action-label">{t("actions.statistics")}</span>
          </button>
          <button className="otb-action-btn">
            <span className="otb-action-icon">📖</span>
            <span className="otb-action-label">{t("actions.documentation")}</span>
          </button>
          <button className="otb-action-btn otb-action-danger">
            <span className="otb-action-icon">⛔</span>
            <span className="otb-action-label">{t("actions.cancel")}</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default GeneralTab;
