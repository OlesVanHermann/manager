// ============================================================
// MODEM DHCP - NAV4 DHCP (config + baux)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ModemDhcp as ModemDhcpType, DhcpLease, ModemDns } from "./connections.types";

interface ModemDhcpProps {
  connectionId: string;
  dhcp: ModemDhcpType | null;
  dns: ModemDns | null;
  leases: DhcpLease[];
  loading: boolean;
  onSaveDhcp: (data: Partial<ModemDhcpType>) => Promise<void>;
  onSaveDns: (data: ModemDns) => Promise<void>;
  onReserveLease: (lease: DhcpLease) => void;
  onDeleteReservation: (mac: string) => void;
  onAddReservation: () => void;
}

export function ModemDhcp({
  connectionId,
  dhcp,
  dns,
  leases,
  loading,
  onSaveDhcp,
  onSaveDns,
  onReserveLease,
  onDeleteReservation,
  onAddReservation,
}: ModemDhcpProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  const [localDhcp, setLocalDhcp] = useState<Partial<ModemDhcpType>>({});
  const [localDns, setLocalDns] = useState<Partial<ModemDns>>({});
  const [saving, setSaving] = useState(false);
  const [editingDns, setEditingDns] = useState(false);

  const mergedDhcp = dhcp ? { ...dhcp, ...localDhcp } : null;
  const mergedDns = dns ? { ...dns, ...localDns } : null;

  const handleDhcpChange = (field: keyof ModemDhcpType, value: any) => {
    setLocalDhcp(prev => ({ ...prev, [field]: value }));
  };

  const handleDnsChange = (field: keyof ModemDns, value: string) => {
    setLocalDns(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyDhcp = async () => {
    if (!dhcp || Object.keys(localDhcp).length === 0) return;
    setSaving(true);
    try {
      await onSaveDhcp(localDhcp);
      setLocalDhcp({});
    } finally {
      setSaving(false);
    }
  };

  const handleApplyDns = async () => {
    if (!mergedDns) return;
    setSaving(true);
    try {
      await onSaveDns(mergedDns as ModemDns);
      setLocalDns({});
      setEditingDns(false);
    } finally {
      setSaving(false);
    }
  };

  const formatExpires = (expires?: string): string => {
    if (!expires) return "-";
    // TODO: Calculate remaining time
    return expires;
  };

  const hasChanges = Object.keys(localDhcp).length > 0;

  const leaseTimeOptions = [
    { value: 3600, label: `1 ${t("modem.dhcp.hour")}` },
    { value: 7200, label: `2 ${t("modem.dhcp.hours")}` },
    { value: 14400, label: `4 ${t("modem.dhcp.hours")}` },
    { value: 28800, label: `8 ${t("modem.dhcp.hours")}` },
    { value: 86400, label: `24 ${t("modem.dhcp.hours")}` },
  ];

  if (loading) {
    return (
      <div className="modem-dhcp">
        <div className="modem-loading-inline">
          <div className="spinner-small" />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="modem-dhcp">
      {/* DHCP Config */}
      <div className="dhcp-card">
        <div className="dhcp-card-header">
          <h5>{t("modem.dhcp.serverConfig")}</h5>
          {mergedDhcp && (
            <label className="toggle">
              <input
                type="checkbox"
                checked={mergedDhcp.enabled}
                onChange={(e) => handleDhcpChange("enabled", e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          )}
        </div>
        {mergedDhcp ? (
          <div className="dhcp-fields">
            <div className="field-row">
              <div className="field">
                <label>{t("modem.dhcp.routerIp")}</label>
                <input type="text" value="192.168.1.1" disabled />
              </div>
              <div className="field">
                <label>{t("modem.dhcp.subnetMask")}</label>
                <input type="text" value="255.255.255.0" disabled />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t("modem.dhcp.rangeStart")}</label>
                <input
                  type="text"
                  value={mergedDhcp.rangeStart}
                  onChange={(e) => handleDhcpChange("rangeStart", e.target.value)}
                  disabled={!mergedDhcp.enabled}
                />
              </div>
              <div className="field">
                <label>{t("modem.dhcp.rangeEnd")}</label>
                <input
                  type="text"
                  value={mergedDhcp.rangeEnd}
                  onChange={(e) => handleDhcpChange("rangeEnd", e.target.value)}
                  disabled={!mergedDhcp.enabled}
                />
              </div>
            </div>
            <div className="field">
              <label>{t("modem.dhcp.leaseTime")}</label>
              <select
                value={mergedDhcp.leaseTime}
                onChange={(e) => handleDhcpChange("leaseTime", Number(e.target.value))}
                disabled={!mergedDhcp.enabled}
              >
                {leaseTimeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {hasChanges && (
              <div className="field-actions">
                <button className="btn-secondary" onClick={() => setLocalDhcp({})}>
                  {t("cancel")}
                </button>
                <button className="btn-primary" onClick={handleApplyDhcp} disabled={saving}>
                  {saving ? t("saving") : t("modem.dhcp.apply")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="dhcp-empty">
            <p>{t("modem.dhcp.configUnavailable")}</p>
          </div>
        )}
      </div>

      {/* Active Leases */}
      <div className="dhcp-card">
        <div className="dhcp-card-header">
          <h5>{t("modem.dhcp.activeLeases")}</h5>
          <button className="btn-primary" onClick={onAddReservation}>
            + {t("modem.dhcp.addReservation")}
          </button>
        </div>
        {leases.length > 0 ? (
          <div className="dhcp-table-wrapper">
            <table className="dhcp-table">
              <thead>
                <tr>
                  <th>{t("modem.dhcp.device")}</th>
                  <th>{t("modem.dhcp.ipAddress")}</th>
                  <th>{t("modem.dhcp.macAddress")}</th>
                  <th>{t("modem.dhcp.expires")}</th>
                  <th>{t("modem.dhcp.type")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {leases.map((lease) => (
                  <tr key={lease.id || lease.mac}>
                    <td>
                      <div className="device-cell">
                        <span className="device-icon">💻</span>
                        <span className="device-name">{lease.hostname || t("modem.dhcp.unknownDevice")}</span>
                      </div>
                    </td>
                    <td className="mono">{lease.ip}</td>
                    <td className="mono">{lease.mac}</td>
                    <td>{formatExpires(lease.expires)}</td>
                    <td>
                      <span className={`lease-type-badge ${lease.reserved ? "reserved" : "dynamic"}`}>
                        {lease.reserved ? t("modem.dhcp.reserved") : "DHCP"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      {!lease.reserved ? (
                        <button
                          className="btn-icon"
                          onClick={() => onReserveLease(lease)}
                          title={t("modem.dhcp.reserve")}
                        >
                          📌
                        </button>
                      ) : (
                        <button
                          className="btn-icon btn-danger"
                          onClick={() => onDeleteReservation(lease.mac)}
                          title={t("modem.dhcp.deleteReservation")}
                        >
                          ×
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="dhcp-empty">
            <span className="empty-icon">📋</span>
            <p>{t("modem.dhcp.noLeases")}</p>
          </div>
        )}
      </div>

      {/* DNS Servers */}
      <div className="dhcp-card">
        <div className="dhcp-card-header">
          <h5>{t("modem.dhcp.dnsServers")}</h5>
          {!editingDns && (
            <button className="btn-secondary" onClick={() => setEditingDns(true)}>
              ✎ {t("modem.dhcp.modify")}
            </button>
          )}
        </div>
        {mergedDns ? (
          <div className="dhcp-fields">
            <div className="field-row">
              <div className="field">
                <label>{t("modem.dhcp.primaryDns")}</label>
                <input
                  type="text"
                  value={mergedDns.primary}
                  onChange={(e) => handleDnsChange("primary", e.target.value)}
                  disabled={!editingDns}
                />
              </div>
              <div className="field">
                <label>{t("modem.dhcp.secondaryDns")}</label>
                <input
                  type="text"
                  value={mergedDns.secondary}
                  onChange={(e) => handleDnsChange("secondary", e.target.value)}
                  disabled={!editingDns}
                />
              </div>
            </div>
            {editingDns && (
              <div className="field-actions">
                <button className="btn-secondary" onClick={() => { setLocalDns({}); setEditingDns(false); }}>
                  {t("cancel")}
                </button>
                <button className="btn-primary" onClick={handleApplyDns} disabled={saving}>
                  {saving ? t("saving") : t("save")}
                </button>
              </div>
            )}
            <div className="dns-presets">
              <span className="presets-label">{t("modem.dhcp.quickPresets")}:</span>
              <button className="preset-btn" onClick={() => setLocalDns({ primary: "8.8.8.8", secondary: "8.8.4.4" })}>
                Google DNS
              </button>
              <button className="preset-btn" onClick={() => setLocalDns({ primary: "1.1.1.1", secondary: "1.0.0.1" })}>
                Cloudflare
              </button>
              <button className="preset-btn" onClick={() => setLocalDns({ primary: "213.186.33.99", secondary: "" })}>
                OVH
              </button>
            </div>
          </div>
        ) : (
          <div className="dhcp-empty">
            <p>{t("modem.dhcp.dnsUnavailable")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModemDhcp;
