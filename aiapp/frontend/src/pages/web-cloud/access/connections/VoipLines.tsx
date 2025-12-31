// ============================================================
// VOIP LINES - NAV4 Lignes (table lignes + consommation)
// ============================================================

import { useTranslation } from "react-i18next";
import type { VoipLine, VoipStats } from "./connections.types";

interface VoipLinesProps {
  connectionId: string;
  lines: VoipLine[];
  stats: VoipStats | null;
  loading: boolean;
  onAddLine: () => void;
  onConfigureLine: (line: VoipLine) => void;
  onViewHistory: (line: VoipLine) => void;
  onViewDetails: () => void;
}

export function VoipLines({
  connectionId,
  lines,
  stats,
  loading,
  onAddLine,
  onConfigureLine,
  onViewHistory,
  onViewDetails,
}: VoipLinesProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  const formatPhoneNumber = (number: string): string => {
    if (number.length === 10) {
      return number.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
    }
    return number;
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      online: "badge-status-online",
      offline: "badge-status-offline",
      pending: "badge-status-pending",
    };
    return statusClasses[status] || "badge-status-default";
  };

  const getTypeBadge = (type: string) => {
    const typeClasses: Record<string, string> = {
      sip: "badge-type-sip",
      fax: "badge-type-fax",
    };
    return typeClasses[type] || "badge-type-default";
  };

  if (loading) {
    return (
      <div className="voip-lines">
        <div className="voip-loading-inline">
          <div className="spinner-small" />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="voip-lines">
      {/* Lines Table */}
      <div className="voip-section">
        <div className="section-header">
          <h4>📞 {t("voip.lines.phoneLines")}</h4>
          <button className="btn-primary" onClick={onAddLine}>
            + {t("voip.lines.order")}
          </button>
        </div>

        {lines.length > 0 ? (
          <div className="voip-table-wrapper">
            <table className="voip-table">
              <thead>
                <tr>
                  <th>{t("voip.lines.number")}</th>
                  <th>{t("voip.lines.description")}</th>
                  <th>{t("voip.lines.type")}</th>
                  <th>{t("voip.lines.status")}</th>
                  <th>{t("voip.lines.monthCalls")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.id}>
                    <td>
                      <div className="line-number-cell">
                        <span className="line-icon">{line.type === "fax" ? "📠" : "📞"}</span>
                        <span className="mono">{formatPhoneNumber(line.number)}</span>
                      </div>
                    </td>
                    <td>
                      <span className="line-description">{line.description || "-"}</span>
                    </td>
                    <td>
                      <span className={`badge-type ${getTypeBadge(line.type)}`}>
                        {line.type === "sip" ? "SIP" : "EcoFax"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status ${getStatusBadge(line.status)}`}>
                        <span className="status-dot">●</span>
                        {t(`voip.lines.statuses.${line.status}`)}
                      </span>
                    </td>
                    <td>
                      <span className="calls-count">{line.monthCalls || 0}</span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn-icon"
                        onClick={() => onConfigureLine(line)}
                        title={t("voip.lines.configure")}
                      >
                        ⚙
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => onViewHistory(line)}
                        title={t("voip.lines.history")}
                      >
                        📋
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="voip-empty">
            <span className="empty-icon">📞</span>
            <p>{t("voip.lines.empty")}</p>
            <p className="empty-hint">{t("voip.lines.emptyHint")}</p>
            <button className="btn-primary" onClick={onAddLine}>
              + {t("voip.lines.order")}
            </button>
          </div>
        )}
      </div>

      {/* Monthly Stats */}
      <div className="voip-section">
        <div className="section-header">
          <h4>📊 {t("voip.stats.monthlyUsage")}</h4>
          <button className="btn-secondary" onClick={onViewDetails}>
            {t("voip.stats.viewDetails")} →
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon incoming">📥</div>
            <div className="stat-content">
              <span className="stat-value">{stats?.incomingCalls || 0}</span>
              <span className="stat-label">{t("voip.stats.incomingCalls")}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon outgoing">📤</div>
            <div className="stat-content">
              <span className="stat-value">{stats?.outgoingCalls || 0}</span>
              <span className="stat-label">{t("voip.stats.outgoingCalls")}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon duration">⏱</div>
            <div className="stat-content">
              <span className="stat-value">{formatDuration(stats?.totalDuration || 0)}</span>
              <span className="stat-label">{t("voip.stats.totalDuration")}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon fax">📠</div>
            <div className="stat-content">
              <span className="stat-value">
                {(stats?.faxSent || 0)} / {(stats?.faxReceived || 0)}
              </span>
              <span className="stat-label">{t("voip.stats.faxSentReceived")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Link to full VoIP Manager */}
      <div className="voip-link-card">
        <div className="link-content">
          <span className="link-icon">🔗</span>
          <div className="link-text">
            <strong>{t("voip.fullManager.title")}</strong>
            <p>{t("voip.fullManager.description")}</p>
          </div>
        </div>
        <a href="/web-cloud/voip" className="btn-primary">
          {t("voip.fullManager.open")} →
        </a>
      </div>
    </div>
  );
}

export default VoipLines;
