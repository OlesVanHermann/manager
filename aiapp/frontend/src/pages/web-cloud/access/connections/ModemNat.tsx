// ============================================================
// MODEM NAT - NAV4 NAT/Ports (règles + UPnP + DMZ)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ModemNatRule } from "./connections.types";

interface UpnpConfig {
  enabled: boolean;
  openPorts: number;
  lastDevice?: string;
}

interface DmzConfig {
  enabled: boolean;
  ipAddress?: string;
}

interface ModemNatProps {
  connectionId: string;
  natRules: ModemNatRule[];
  upnp: UpnpConfig | null;
  dmz: DmzConfig | null;
  loading: boolean;
  onAddRule: () => void;
  onEditRule: (rule: ModemNatRule) => void;
  onDeleteRule: (ruleId: string) => void;
  onToggleRule: (ruleId: string, enabled: boolean) => void;
  onToggleUpnp: (enabled: boolean) => void;
  onConfigureDmz: () => void;
}

export function ModemNat({
  connectionId,
  natRules,
  upnp,
  dmz,
  loading,
  onAddRule,
  onEditRule,
  onDeleteRule,
  onToggleRule,
  onToggleUpnp,
  onConfigureDmz,
}: ModemNatProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = (ruleId: string) => {
    if (confirmDelete === ruleId) {
      onDeleteRule(ruleId);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(ruleId);
    }
  };

  const getProtocolBadge = (protocol: string) => {
    const colors: Record<string, string> = {
      TCP: "badge-tcp",
      UDP: "badge-udp",
      "TCP/UDP": "badge-both",
    };
    return colors[protocol] || "badge-default";
  };

  if (loading) {
    return (
      <div className="modem-nat">
        <div className="modem-loading-inline">
          <div className="spinner-small" />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="modem-nat">
      {/* Port Forwarding Rules */}
      <div className="nat-section">
        <div className="section-header">
          <h4>🔀 {t("modem.nat.portForwarding")}</h4>
          <button className="btn-primary" onClick={onAddRule}>
            + {t("modem.nat.addRule")}
          </button>
        </div>

        {natRules.length > 0 ? (
          <div className="nat-table-wrapper">
            <table className="nat-table">
              <thead>
                <tr>
                  <th>{t("modem.nat.name")}</th>
                  <th>{t("modem.nat.protocol")}</th>
                  <th>{t("modem.nat.externalPort")}</th>
                  <th>{t("modem.nat.internalIp")}</th>
                  <th>{t("modem.nat.internalPort")}</th>
                  <th>{t("modem.nat.status")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {natRules.map((rule) => (
                  <tr key={rule.id} className={!rule.enabled ? "disabled-row" : ""}>
                    <td>
                      <div className="rule-name">
                        <span>{rule.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`protocol-badge ${getProtocolBadge(rule.protocol)}`}>
                        {rule.protocol}
                      </span>
                    </td>
                    <td className="mono">{rule.externalPort}</td>
                    <td className="mono">{rule.internalIp}</td>
                    <td className="mono">{rule.internalPort}</td>
                    <td>
                      <label className="toggle toggle-small">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={(e) => onToggleRule(rule.id, e.target.checked)}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn-icon"
                        onClick={() => onEditRule(rule)}
                        title={t("modem.nat.edit")}
                      >
                        ✎
                      </button>
                      <button
                        className={`btn-icon ${confirmDelete === rule.id ? "btn-danger-active" : "btn-danger"}`}
                        onClick={() => handleDelete(rule.id)}
                        title={confirmDelete === rule.id ? t("modem.nat.confirmDelete") : t("modem.nat.delete")}
                      >
                        {confirmDelete === rule.id ? "✓" : "×"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="nat-empty">
            <span className="empty-icon">🔒</span>
            <p>{t("modem.nat.noRules")}</p>
            <p className="empty-hint">{t("modem.nat.noRulesHint")}</p>
            <button className="btn-primary" onClick={onAddRule}>
              + {t("modem.nat.addRule")}
            </button>
          </div>
        )}

        {/* Common Ports Help */}
        <div className="nat-help">
          <span className="help-label">{t("modem.nat.commonPorts")}:</span>
          <span className="help-ports">
            80 (HTTP), 443 (HTTPS), 22 (SSH), 21 (FTP), 25 (SMTP), 3389 (RDP)
          </span>
        </div>
      </div>

      {/* UPnP */}
      <div className="nat-section nat-cards">
        <div className="nat-card">
          <div className="nat-card-header">
            <div className="header-left">
              <span className="card-icon">🔄</span>
              <h5>UPnP</h5>
            </div>
            {upnp && (
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={upnp.enabled}
                  onChange={(e) => onToggleUpnp(e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            )}
          </div>
          <div className="nat-card-content">
            <p className="card-description">{t("modem.nat.upnpDescription")}</p>
            {upnp && (
              <div className="upnp-info">
                <div className="info-row">
                  <span>{t("modem.nat.openPorts")}</span>
                  <span className="value">{upnp.openPorts}</span>
                </div>
                {upnp.lastDevice && (
                  <div className="info-row">
                    <span>{t("modem.nat.lastDevice")}</span>
                    <span className="value">{upnp.lastDevice}</span>
                  </div>
                )}
              </div>
            )}
            {upnp?.enabled && (
              <div className="upnp-warning">
                <span className="warning-icon">⚠️</span>
                <span>{t("modem.nat.upnpWarning")}</span>
              </div>
            )}
          </div>
        </div>

        {/* DMZ */}
        <div className="nat-card">
          <div className="nat-card-header">
            <div className="header-left">
              <span className="card-icon">🎯</span>
              <h5>DMZ</h5>
            </div>
            {dmz && (
              <span className={`badge-status ${dmz.enabled ? "on" : "off"}`}>
                {dmz.enabled ? "ON" : "OFF"}
              </span>
            )}
          </div>
          <div className="nat-card-content">
            <p className="card-description">{t("modem.nat.dmzDescription")}</p>
            {dmz && (
              <div className="dmz-info">
                <div className="info-row">
                  <span>{t("modem.nat.dmzIp")}</span>
                  <span className="value mono">
                    {dmz.enabled && dmz.ipAddress ? dmz.ipAddress : t("modem.nat.notConfigured")}
                  </span>
                </div>
              </div>
            )}
            <button className="btn-secondary" onClick={onConfigureDmz}>
              ⚙ {t("modem.nat.configureDmz")}
            </button>
            {dmz?.enabled && (
              <div className="dmz-warning">
                <span className="warning-icon">⚠️</span>
                <span>{t("modem.nat.dmzWarning")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModemNat;
