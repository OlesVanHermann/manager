// ============================================================
// MODEM DASHBOARD - NAV4 Dashboard (vue résumé)
// ============================================================

import { useTranslation } from "react-i18next";
import type { Modem, ModemWifi, ModemRouter } from "../connections.types";

interface ModemDashboardProps {
  connectionId: string;
  modem: Modem;
  wifi?: ModemWifi | null;
  router?: ModemRouter | null;
  natRulesCount?: number;
  onReboot: () => void;
  onResetFactory: () => void;
  onNavigate: (tab: string) => void;
}

export function ModemDashboard({
  connectionId,
  modem,
  wifi,
  router,
  natRulesCount = 0,
  onReboot,
  onResetFactory,
  onNavigate,
}: ModemDashboardProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  const formatUptime = (uptime: string | undefined): string => {
    if (!uptime) return "-";
    // Parse ISO date or display as-is
    return uptime;
  };

  const isFirmwareUpToDate = true; // TODO: from API

  return (
    <div className="modem-dashboard">
      {/* Header Modem */}
      <div className="modem-header-card">
        <div className="modem-header-info">
          <span className="modem-icon">📡</span>
          <div className="modem-header-details">
            <div className="modem-model-row">
              <span className="modem-model">{modem.model || "Modem OVH"}</span>
              <span className="badge-ovh">OVH</span>
            </div>
            <span className="modem-brand">{modem.brand || "OVH Telecom"}</span>
          </div>
        </div>
        <div className="modem-header-meta">
          <div className="meta-item">
            <span className="meta-label">{t("modem.dashboard.firmware")}</span>
            <div className="meta-value-row">
              <span className="mono">{modem.firmware || "-"}</span>
              {isFirmwareUpToDate && (
                <span className="badge-success">✓ {t("modem.dashboard.upToDate")}</span>
              )}
            </div>
          </div>
          <div className="meta-item">
            <span className="meta-label">{t("modem.dashboard.uptime")}</span>
            <span className="meta-value">{formatUptime(modem.uptime)}</span>
          </div>
        </div>
        <div className="modem-header-actions">
          <button className="btn-action" onClick={onReboot}>
            🔄 {t("modem.actions.reboot")}
          </button>
          <button className="btn-action" onClick={() => {}}>
            ⬆ {t("modem.actions.update")}
          </button>
          <button className="btn-action btn-danger" onClick={onResetFactory}>
            ⚠ {t("modem.actions.reset")}
          </button>
        </div>
      </div>

      {/* Grid résumés */}
      <div className="dashboard-grid">
        {/* WiFi 2.4 GHz */}
        <div className="dashboard-card clickable" onClick={() => onNavigate("wifi")}>
          <div className="card-header-row">
            <h4>📶 WiFi 2.4 GHz</h4>
            {wifi && (
              <span className={`badge-status ${wifi.enabled24 ? "on" : "off"}`}>
                {wifi.enabled24 ? "ON" : "OFF"}
              </span>
            )}
          </div>
          {wifi ? (
            <div className="card-content">
              <div className="info-row">
                <span>SSID</span>
                <span className="value">{wifi.ssid24 || "-"}</span>
              </div>
              <div className="info-row">
                <span>{t("modem.dashboard.security")}</span>
                <span className="value">{wifi.security || "WPA2"}</span>
              </div>
              <div className="info-row">
                <span>{t("modem.dashboard.channel")}</span>
                <span className="value">{wifi.channel24 === "auto" ? "Auto" : wifi.channel24}</span>
              </div>
              <div className="info-row">
                <span>{t("modem.dashboard.devices")}</span>
                <span className="value highlight">{wifi.connectedDevices || 0}</span>
              </div>
            </div>
          ) : (
            <div className="card-loading">
              <div className="spinner-small" />
            </div>
          )}
          <div className="card-action">
            <span>⚙ {t("modem.dashboard.configure")}</span>
            <span className="arrow">→</span>
          </div>
        </div>

        {/* WiFi 5 GHz */}
        <div className="dashboard-card clickable" onClick={() => onNavigate("wifi")}>
          <div className="card-header-row">
            <h4>📶 WiFi 5 GHz</h4>
            {wifi && (
              <span className={`badge-status ${wifi.enabled5 ? "on" : "off"}`}>
                {wifi.enabled5 ? "ON" : "OFF"}
              </span>
            )}
          </div>
          {wifi ? (
            <div className="card-content">
              <div className="info-row">
                <span>SSID</span>
                <span className="value">{wifi.ssid5 || "-"}</span>
              </div>
              <div className="info-row">
                <span>{t("modem.dashboard.security")}</span>
                <span className="value">{wifi.security || "WPA2"}</span>
              </div>
              <div className="info-row">
                <span>{t("modem.dashboard.channel")}</span>
                <span className="value">{wifi.channel5 === "auto" ? "Auto" : wifi.channel5}</span>
              </div>
            </div>
          ) : (
            <div className="card-loading">
              <div className="spinner-small" />
            </div>
          )}
          <div className="card-action">
            <span>⚙ {t("modem.dashboard.configure")}</span>
            <span className="arrow">→</span>
          </div>
        </div>

        {/* Réseau Local */}
        <div className="dashboard-card clickable" onClick={() => onNavigate("dhcp")}>
          <div className="card-header-row">
            <h4>🔗 {t("modem.dashboard.localNetwork")}</h4>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span>IP LAN</span>
              <span className="value mono">{modem.lanIp || "192.168.1.1"}</span>
            </div>
            <div className="info-row">
              <span>{t("modem.dashboard.dhcpRange")}</span>
              <span className="value mono">.10 - .254</span>
            </div>
            <div className="info-row">
              <span>{t("modem.dashboard.activeLeases")}</span>
              <span className="value highlight">{modem.connectedDevices || 0}</span>
            </div>
          </div>
          <div className="card-action">
            <span>📋 {t("modem.dashboard.viewLeases")}</span>
            <span className="arrow">→</span>
          </div>
        </div>

        {/* Mode */}
        <div className="dashboard-card clickable" onClick={() => onNavigate("router")}>
          <div className="card-header-row">
            <h4>⚙ {t("modem.dashboard.mode")}</h4>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span>{t("modem.dashboard.currentMode")}</span>
              <span className="value">
                {router?.mode === "bridge" ? "Bridge" : "Routeur"}
              </span>
            </div>
            <div className="info-row">
              <span>DMZ</span>
              <span className={`badge-status small ${router?.dmzEnabled ? "on" : "off"}`}>
                {router?.dmzEnabled ? "ON" : "OFF"}
              </span>
            </div>
            <div className="info-row">
              <span>Firewall</span>
              <span className={`badge-status small ${router?.firewallEnabled ? "on" : "off"}`}>
                {router?.firewallEnabled ? "ON" : "OFF"}
              </span>
            </div>
          </div>
          <div className="card-action">
            <span>⚙ {t("modem.dashboard.changeMode")}</span>
            <span className="arrow">→</span>
          </div>
        </div>

        {/* NAT */}
        <div className="dashboard-card clickable" onClick={() => onNavigate("nat")}>
          <div className="card-header-row">
            <h4>🔒 NAT / Ports</h4>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span>{t("modem.dashboard.portRules")}</span>
              <span className="value highlight">{natRulesCount}</span>
            </div>
            <div className="info-row">
              <span>UPnP</span>
              <span className={`badge-status small ${router?.upnpEnabled ? "on" : "off"}`}>
                {router?.upnpEnabled ? "ON" : "OFF"}
              </span>
            </div>
          </div>
          <div className="card-action">
            <span>+ {t("modem.dashboard.addRule")}</span>
            <span className="arrow">→</span>
          </div>
        </div>

        {/* Connexion */}
        <div className="dashboard-card">
          <div className="card-header-row">
            <h4>🌐 {t("modem.dashboard.connection")}</h4>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span>WAN IP</span>
              <span className="value mono">{modem.wanIp || "-"}</span>
            </div>
            <div className="info-row">
              <span>MAC</span>
              <span className="value mono">{modem.mac || "-"}</span>
            </div>
            <div className="info-row">
              <span>{t("modem.dashboard.serial")}</span>
              <span className="value mono">{modem.serial || "-"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModemDashboard;
