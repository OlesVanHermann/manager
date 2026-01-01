// ============================================================
// LINE STATUS - NAV4 Statut (défaut)
// Bloc statut + Débit + Qualité + IP + Installation
// ============================================================

import { useTranslation } from "react-i18next";
import type { LineStatus as LineStatusType } from "../connections.types";

interface LineStatusProps {
  connectionId: string;
  lineStatus: LineStatusType;
  onResync: () => void;
  onReset: () => void;
}

export function LineStatus({ connectionId, lineStatus, onResync, onReset }: LineStatusProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  const formatSpeed = (speed: number): string => {
    if (speed >= 1000) return `${(speed / 1000).toFixed(1)} Gbps`;
    return `${speed} Mbps`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "connected": return "#10B981";
      case "disconnected": return "#EF4444";
      case "syncing": return "#F59E0B";
      default: return "#9CA3AF";
    }
  };

  const getStatusBgColor = (status: string): string => {
    switch (status) {
      case "connected": return "#F0FDF4";
      case "disconnected": return "#FEF2F2";
      case "syncing": return "#FFFBEB";
      default: return "#F9FAFB";
    }
  };

  const getQualityLevel = (): { level: string; color: string; percent: number } => {
    const attenuation = lineStatus.attenuation || 0;
    const noiseMargin = lineStatus.noiseMargin || 0;
    const crcErrors = lineStatus.crcErrors || 0;

    // Qualité basée sur atténuation et marge bruit
    if (attenuation < 20 && noiseMargin > 10 && crcErrors < 10) {
      return { level: t("line.quality.excellent"), color: "#10B981", percent: 90 };
    } else if (attenuation < 40 && noiseMargin > 6) {
      return { level: t("line.quality.good"), color: "#10B981", percent: 70 };
    } else if (attenuation < 60 && noiseMargin > 3) {
      return { level: t("line.quality.average"), color: "#F59E0B", percent: 50 };
    } else {
      return { level: t("line.quality.poor"), color: "#EF4444", percent: 30 };
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const quality = getQualityLevel();

  return (
    <div className="line-status">
      {/* Bloc Statut Principal */}
      <div
        className="status-card"
        style={{ backgroundColor: getStatusBgColor(lineStatus.status) }}
      >
        <div className="status-main">
          <span
            className="status-dot-xl"
            style={{ backgroundColor: getStatusColor(lineStatus.status) }}
          />
          <div className="status-info">
            <span className="status-label-xl">
              {lineStatus.status === "connected"
                ? t("line.status.connected")
                : lineStatus.status === "syncing"
                ? t("line.status.syncing")
                : t("line.status.disconnected")}
            </span>
            {lineStatus.connectedSince && (
              <span className="status-since">
                {t("line.status.since")} {lineStatus.connectedSince}
              </span>
            )}
          </div>
        </div>
        <div className="status-actions">
          <span className="last-sync">
            {t("line.status.lastSync")}: {lineStatus.lastSync || "-"}
          </span>
          <button className="btn-action" onClick={onResync}>
            🔄 {t("line.actions.resync")}
          </button>
          <button className="btn-action" onClick={onReset}>
            ⟳ {t("line.actions.reset")}
          </button>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="line-cards">
        {/* Débit Synchronisation */}
        <div className="line-card">
          <h4>{t("line.speed.title")}</h4>
          <div className="speed-grid">
            <div className="speed-item">
              <span className="speed-label">↓ {t("line.speed.down")}</span>
              <span className="speed-value">{formatSpeed(lineStatus.downSpeed)}</span>
            </div>
            <div className="speed-item">
              <span className="speed-label">↑ {t("line.speed.up")}</span>
              <span className="speed-value">{formatSpeed(lineStatus.upSpeed)}</span>
            </div>
          </div>
          <div className="speed-max">
            {t("line.speed.max")}: ↓ {formatSpeed(lineStatus.maxDownSpeed)} ↑ {formatSpeed(lineStatus.maxUpSpeed)}
          </div>
        </div>

        {/* Qualité Ligne */}
        <div className="line-card">
          <h4>{t("line.quality.title")}</h4>
          <div className="info-rows">
            <div className="info-row">
              <span>{t("line.quality.attenuation")}</span>
              <span>{lineStatus.attenuation} dB</span>
            </div>
            <div className="info-row">
              <span>{t("line.quality.noiseMargin")}</span>
              <span>{lineStatus.noiseMargin} dB</span>
            </div>
            <div className="info-row">
              <span>{t("line.quality.crcErrors")}</span>
              <span>{lineStatus.crcErrors}</span>
            </div>
            {lineStatus.fecErrors !== undefined && (
              <div className="info-row">
                <span>{t("line.quality.fecErrors")}</span>
                <span>{lineStatus.fecErrors}</span>
              </div>
            )}
          </div>
          <div className="quality-indicator">
            <div className="quality-bar-container">
              <div
                className="quality-bar"
                style={{ width: `${quality.percent}%`, backgroundColor: quality.color }}
              />
            </div>
            <span style={{ color: quality.color }}>{quality.level}</span>
          </div>
        </div>

        {/* Adresses IP */}
        <div className="line-card">
          <h4>{t("line.ip.title")}</h4>
          <div className="info-rows">
            <div className="info-row">
              <span>IPv4</span>
              <span className="ip-value">
                <code className="mono">{lineStatus.ipv4 || "-"}</code>
                {lineStatus.ipv4 && (
                  <button
                    className="btn-copy"
                    onClick={() => copyToClipboard(lineStatus.ipv4!)}
                    title={t("line.actions.copy")}
                  >
                    📋
                  </button>
                )}
              </span>
            </div>
            {lineStatus.ipv6 && (
              <div className="info-row">
                <span>IPv6</span>
                <span className="ip-value">
                  <code className="mono">{lineStatus.ipv6}</code>
                  <button
                    className="btn-copy"
                    onClick={() => copyToClipboard(lineStatus.ipv6!)}
                    title={t("line.actions.copy")}
                  >
                    📋
                  </button>
                </span>
              </div>
            )}
            <div className="info-row">
              <span>Gateway</span>
              <span className="ip-value">
                <code className="mono">{lineStatus.gateway || "-"}</code>
                {lineStatus.gateway && (
                  <button
                    className="btn-copy"
                    onClick={() => copyToClipboard(lineStatus.gateway!)}
                    title={t("line.actions.copy")}
                  >
                    📋
                  </button>
                )}
              </span>
            </div>
            <div className="info-row">
              <span>DNS</span>
              <span className="mono">{lineStatus.dns?.join(", ") || "-"}</span>
            </div>
          </div>
        </div>

        {/* Installation */}
        <div className="line-card">
          <h4>{t("line.installation.title")}</h4>
          <div className="info-rows">
            {lineStatus.lineType && (
              <div className="info-row">
                <span>{t("line.installation.type")}</span>
                <span className="badge-tech">{lineStatus.lineType}</span>
              </div>
            )}
            <div className="info-row">
              <span>NRO</span>
              <span>{lineStatus.nro || "-"}</span>
            </div>
            {lineStatus.distance !== undefined && (
              <div className="info-row">
                <span>{t("line.installation.distance")}</span>
                <span>{lineStatus.distance} m</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bannière Diagnostic */}
      <div className="diagnostic-banner">
        <span className="banner-icon">🔍</span>
        <div className="banner-content">
          <strong>{t("line.diagnostic.bannerTitle")}</strong>
          <p>{t("line.diagnostic.bannerText")}</p>
        </div>
        <button className="btn-primary">
          {t("line.diagnostic.runShort")} →
        </button>
      </div>
    </div>
  );
}

export default LineStatus;
