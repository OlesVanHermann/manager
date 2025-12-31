// ============================================================
// GENERAL TAB - Dashboard connexion
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Connection } from "./connections.types";
import "./GeneralTab.css";

interface GeneralTabProps {
  connectionId: string;
  connection: Connection;
}

export function GeneralTab({ connectionId, connection }: GeneralTabProps) {
  const { t } = useTranslation("web-cloud/access/connections/general");
  const [showRenameModal, setShowRenameModal] = useState(false);

  const formatSpeed = (speed: number): string => {
    if (speed >= 1000) return `${(speed / 1000).toFixed(0)} Gbps`;
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

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "connected": return t("status.connected");
      case "disconnected": return t("status.disconnected");
      case "syncing": return t("status.syncing");
      default: return status;
    }
  };

  const formatAddress = (): string => {
    const addr = connection.address;
    if (!addr.street) return "-";
    return `${addr.street}, ${addr.zipCode} ${addr.city}`;
  };

  return (
    <div className="general-tab">
      {/* Bloc CONNEXION */}
      <div className="general-card connexion-card">
        <div className="card-header">
          <h3>{t("connection.title")}</h3>
        </div>
        <div className="card-content">
          <div className="status-banner">
            <div className="status-indicator">
              <span
                className="status-dot-large"
                style={{ backgroundColor: getStatusColor(connection.status) }}
              />
              <span className="status-label">{getStatusLabel(connection.status)}</span>
            </div>
            {connection.connectedSince && (
              <span className="status-since">
                {t("connection.since")} {connection.connectedSince}
              </span>
            )}
          </div>

          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">{t("connection.type")}</span>
              <span className="info-value">{connection.techType}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t("connection.offer")}</span>
              <span className="info-value">{connection.offerLabel}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t("connection.speed")}</span>
              <span className="info-value">
                ↓ {formatSpeed(connection.downSpeed)} ↑ {formatSpeed(connection.upSpeed)}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">{t("connection.address")}</span>
              <span className="info-value">{formatAddress()}</span>
            </div>
            {connection.nro && (
              <div className="info-row">
                <span className="info-label">{t("connection.nro")}</span>
                <span className="info-value">{connection.nro}</span>
              </div>
            )}
            {connection.gtr && (
              <div className="info-row">
                <span className="info-label">{t("connection.gtr")}</span>
                <span className="info-value">{connection.gtr}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Blocs MODEM + SERVICES */}
      <div className="general-row">
        {/* Bloc MODEM */}
        <div className="general-card modem-card">
          <div className="card-header">
            <h3>{t("modem.title")}</h3>
          </div>
          <div className="card-content">
            {connection.modem ? (
              <>
                <div className="modem-info">
                  <span className="modem-icon">
                    {connection.modem.type === "ovh" ? "📦" : "🔧"}
                  </span>
                  <div className="modem-details">
                    <span className="modem-name">{connection.modem.name}</span>
                    <span className="modem-type">
                      {connection.modem.type === "ovh"
                        ? t("modem.managed")
                        : t("modem.custom")}
                    </span>
                  </div>
                </div>
                <button className="btn-link">
                  {t("modem.configure")} →
                </button>
              </>
            ) : (
              <div className="modem-empty">
                <p>{t("modem.none")}</p>
                <button className="btn-link">
                  {t("modem.declare")} →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bloc SERVICES INCLUS */}
        <div className="general-card services-card">
          <div className="card-header">
            <h3>{t("services.title")}</h3>
          </div>
          <div className="card-content">
            {connection.services.length > 0 ? (
              <>
                <div className="services-list">
                  {connection.services.map((service) => (
                    <div key={service.id} className="service-item">
                      <span className="service-icon">
                        {service.type === "domain" && "🌐"}
                        {service.type === "email" && "📧"}
                        {service.type === "voip" && "☎️"}
                        {service.type === "hosting" && "🏠"}
                      </span>
                      <span className="service-name">{service.name}</span>
                      {service.count && (
                        <span className="service-count">×{service.count}</span>
                      )}
                    </div>
                  ))}
                </div>
                <button className="btn-link">
                  {t("services.manage")} →
                </button>
              </>
            ) : (
              <div className="services-empty">
                <p>{t("services.none")}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bloc OPTIONS ACTIVES */}
      <div className="general-card options-card">
        <div className="card-header">
          <h3>{t("options.title")}</h3>
          <button className="btn-add">+ {t("options.add")}</button>
        </div>
        <div className="card-content">
          {connection.options.length > 0 ? (
            <div className="options-list">
              {connection.options.map((option) => (
                <span key={option.id} className="option-badge">
                  ✓ {option.label}
                </span>
              ))}
            </div>
          ) : (
            <p className="options-empty">{t("options.none")}</p>
          )}
        </div>
      </div>

      {/* Bloc ABONNEMENT */}
      <div className="general-card subscription-card">
        <div className="card-header">
          <h3>{t("subscription.title")}</h3>
        </div>
        <div className="card-content">
          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">{t("subscription.amount")}</span>
              <span className="info-value">
                {connection.billing.amount} {connection.billing.currency}/{connection.billing.period === "monthly" ? t("subscription.month") : t("subscription.year")}
              </span>
            </div>
            {connection.billing.nextBilling && (
              <div className="info-row">
                <span className="info-label">{t("subscription.nextBilling")}</span>
                <span className="info-value">{connection.billing.nextBilling}</span>
              </div>
            )}
            {connection.billing.engagement && (
              <div className="info-row">
                <span className="info-label">{t("subscription.engagement")}</span>
                <span className="info-value">{connection.billing.engagement}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="general-actions">
        <button className="btn-action" onClick={() => setShowRenameModal(true)}>
          ✎ {t("actions.rename")}
        </button>
        <button className="btn-action">
          📋 {t("actions.contacts")}
        </button>
        <button className="btn-action btn-danger">
          × {t("actions.cancel")}
        </button>
      </div>
    </div>
  );
}
