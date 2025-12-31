// ============================================================
// LINE ALERTS - NAV4 Alertes
// Table alertes + Bannière info + Warning SMS
// ============================================================

import { useTranslation } from "react-i18next";
import type { LineAlert } from "./connections.types";

interface LineAlertsProps {
  connectionId: string;
  alerts: LineAlert[];
  smsCredits?: number;
  loading: boolean;
  onAddAlert: () => void;
  onEditAlert: (alert: LineAlert) => void;
  onDeleteAlert: (alertId: string) => void;
  onReloadSms: () => void;
}

export function LineAlerts({
  connectionId,
  alerts,
  smsCredits,
  loading,
  onAddAlert,
  onEditAlert,
  onDeleteAlert,
  onReloadSms,
}: LineAlertsProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  const getChannelIcon = (channel: string): string => {
    switch (channel) {
      case "email": return "📧";
      case "sms": return "📱";
      default: return "🔔";
    }
  };

  const getEventTypeLabel = (type: string): string => {
    switch (type) {
      case "disconnect": return t("line.alerts.events.disconnect");
      case "resync": return t("line.alerts.events.resync");
      case "quality": return t("line.alerts.events.quality");
      case "incident": return t("line.alerts.events.incident");
      case "ip_change": return t("line.alerts.events.ipChange");
      default: return type;
    }
  };

  const getStatusBadge = (status: string): { label: string; class: string } => {
    switch (status) {
      case "active": return { label: t("line.alerts.status.active"), class: "badge-success" };
      case "paused": return { label: t("line.alerts.status.paused"), class: "badge-warning" };
      case "disabled": return { label: t("line.alerts.status.disabled"), class: "badge-error" };
      default: return { label: status, class: "badge-default" };
    }
  };

  return (
    <div className="line-alerts">
      {/* Header */}
      <div className="alerts-header">
        <div className="header-info">
          <h4>{t("line.alerts.title")}</h4>
          <span className="alerts-count">
            {alerts.length} {alerts.length === 1 ? t("line.alerts.alert") : t("line.alerts.alertsCount")}
          </span>
        </div>
        <button className="btn-primary" onClick={onAddAlert}>
          + {t("line.alerts.add")}
        </button>
      </div>

      {/* Bannière Info */}
      <div className="alerts-info-banner">
        <span className="info-icon">ℹ️</span>
        <div className="info-content">
          <p>{t("line.alerts.infoBanner")}</p>
          <ul>
            <li>{t("line.alerts.infoEmail")}</li>
            <li>{t("line.alerts.infoSms")}</li>
          </ul>
        </div>
      </div>

      {/* Table Alertes */}
      {loading ? (
        <div className="alerts-loading">
          <div className="spinner" />
          <p>{t("loading")}</p>
        </div>
      ) : alerts.length > 0 ? (
        <div className="alerts-table">
          <div className="table-header">
            <span className="col-type">{t("line.alerts.columns.type")}</span>
            <span className="col-channel">{t("line.alerts.columns.channel")}</span>
            <span className="col-recipient">{t("line.alerts.columns.recipient")}</span>
            <span className="col-status">{t("line.alerts.columns.status")}</span>
            <span className="col-actions">{t("line.alerts.columns.actions")}</span>
          </div>
          {alerts.map((alert) => {
            const statusBadge = getStatusBadge(alert.status);
            return (
              <div key={alert.id} className="table-row">
                <span className="col-type">
                  <span className="event-badge">{getEventTypeLabel(alert.type)}</span>
                </span>
                <span className="col-channel">
                  <span className="channel-icon">{getChannelIcon(alert.channel)}</span>
                  <span className="channel-label">
                    {alert.channel === "email" ? "Email" : "SMS"}
                  </span>
                </span>
                <span className="col-recipient">
                  <code>{alert.recipient}</code>
                </span>
                <span className="col-status">
                  <span className={`status-badge ${statusBadge.class}`}>
                    {statusBadge.label}
                  </span>
                </span>
                <span className="col-actions">
                  <button
                    className="btn-icon"
                    onClick={() => onEditAlert(alert)}
                    title={t("line.alerts.edit")}
                  >
                    ✎
                  </button>
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => onDeleteAlert(alert.id)}
                    title={t("line.alerts.delete")}
                  >
                    ×
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="alerts-empty">
          <span className="empty-icon">🔔</span>
          <p>{t("line.alerts.empty")}</p>
          <p className="empty-hint">{t("line.alerts.emptyHint")}</p>
        </div>
      )}

      {/* Warning SMS Credits */}
      {smsCredits !== undefined && smsCredits < 10 && (
        <div className={`sms-warning-banner ${smsCredits === 0 ? "critical" : ""}`}>
          <span className="warning-icon">⚠️</span>
          <div className="warning-content">
            <strong>
              {smsCredits === 0
                ? t("line.alerts.smsEmpty")
                : t("line.alerts.smsLow")}
            </strong>
            <p>
              {t("line.alerts.smsCredits", { count: smsCredits })}
              {smsCredits === 0 && ` ${t("line.alerts.smsWillNotSend")}`}
            </p>
          </div>
          <button className="btn-secondary" onClick={onReloadSms}>
            💳 {t("line.alerts.reloadSms")}
          </button>
        </div>
      )}

      {/* Info SMS Normal */}
      {smsCredits !== undefined && smsCredits >= 10 && (
        <div className="sms-info-banner">
          <span className="info-icon">📱</span>
          <span>
            {t("line.alerts.smsBalance")}: <strong>{smsCredits}</strong> {t("line.alerts.smsUnit")}
          </span>
          <button className="btn-link" onClick={onReloadSms}>
            {t("line.alerts.reloadSms")}
          </button>
        </div>
      )}
    </div>
  );
}

export default LineAlerts;
