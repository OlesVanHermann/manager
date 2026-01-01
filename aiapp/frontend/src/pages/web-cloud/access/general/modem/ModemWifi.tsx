// ============================================================
// MODEM WIFI - NAV4 WiFi (config 2.4GHz + 5GHz)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ModemWifi as ModemWifiType } from "../connections.types";

interface ModemWifiProps {
  connectionId: string;
  wifi: ModemWifiType | null;
  loading: boolean;
  onSave: (data: Partial<ModemWifiType>) => Promise<void>;
  onGeneratePassword: (band: "24" | "5") => void;
}

export function ModemWifi({
  connectionId,
  wifi,
  loading,
  onSave,
  onGeneratePassword,
}: ModemWifiProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  // Local state pour formulaire
  const [showPassword24, setShowPassword24] = useState(false);
  const [showPassword5, setShowPassword5] = useState(false);
  const [localWifi, setLocalWifi] = useState<Partial<ModemWifiType>>({});
  const [saving, setSaving] = useState(false);

  // Merge local changes with wifi data
  const mergedWifi = wifi ? { ...wifi, ...localWifi } : null;

  const handleChange = (field: keyof ModemWifiType, value: any) => {
    setLocalWifi(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = async () => {
    if (!wifi || Object.keys(localWifi).length === 0) return;
    setSaving(true);
    try {
      await onSave(localWifi);
      setLocalWifi({});
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = Object.keys(localWifi).length > 0;

  const securityOptions = [
    { value: "WPA2", label: "WPA2-Personal" },
    { value: "WPA3", label: "WPA3-Personal (recommandé)" },
    { value: "WPA2/WPA3", label: "WPA2/WPA3 Mixed" },
  ];

  const channels24 = ["auto", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const channels5 = ["auto", 36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140];

  if (loading || !mergedWifi) {
    return (
      <div className="modem-wifi">
        <div className="modem-loading-inline">
          <div className="spinner-small" />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="modem-wifi">
      {/* Warning Banner */}
      <div className="wifi-warning-banner">
        <span className="warning-icon">⚠️</span>
        <p>{t("modem.wifi.warningDisconnect")}</p>
      </div>

      <div className="wifi-cards">
        {/* 2.4 GHz */}
        <div className={`wifi-card ${!mergedWifi.enabled24 ? "disabled" : ""}`}>
          <div className="wifi-card-header">
            <div className="header-left">
              <span className="band-icon">📶</span>
              <h5>WiFi 2.4 GHz</h5>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={mergedWifi.enabled24}
                onChange={(e) => handleChange("enabled24", e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="wifi-fields">
            <div className="field">
              <label>{t("modem.wifi.ssid")}</label>
              <input
                type="text"
                value={mergedWifi.ssid24}
                onChange={(e) => handleChange("ssid24", e.target.value)}
                disabled={!mergedWifi.enabled24}
              />
            </div>
            <div className="field">
              <label>{t("modem.wifi.password")}</label>
              <div className="password-field">
                <input
                  type={showPassword24 ? "text" : "password"}
                  value={mergedWifi.password24}
                  onChange={(e) => handleChange("password24", e.target.value)}
                  disabled={!mergedWifi.enabled24}
                />
                <button
                  className="btn-show"
                  onClick={() => setShowPassword24(!showPassword24)}
                  type="button"
                >
                  {showPassword24 ? "🙈" : "👁"}
                </button>
                <button
                  className="btn-generate"
                  onClick={() => onGeneratePassword("24")}
                  disabled={!mergedWifi.enabled24}
                  type="button"
                  title={t("modem.wifi.generatePassword")}
                >
                  🎲
                </button>
              </div>
            </div>
            <div className="field">
              <label>{t("modem.wifi.security")}</label>
              <select
                value={mergedWifi.security}
                onChange={(e) => handleChange("security", e.target.value)}
                disabled={!mergedWifi.enabled24}
              >
                {securityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{t("modem.wifi.channel")}</label>
              <select
                value={mergedWifi.channel24}
                onChange={(e) => handleChange("channel24", e.target.value === "auto" ? "auto" : Number(e.target.value))}
                disabled={!mergedWifi.enabled24}
              >
                {channels24.map(ch => (
                  <option key={ch} value={ch}>{ch === "auto" ? "Auto" : ch}</option>
                ))}
              </select>
            </div>
            <div className="wifi-devices-row">
              <span className="devices-icon">📱</span>
              <span>{t("modem.wifi.connectedDevices")}:</span>
              <strong>{mergedWifi.connectedDevices || 0}</strong>
              <button className="btn-link">{t("modem.wifi.viewList")}</button>
            </div>
          </div>
        </div>

        {/* 5 GHz */}
        <div className={`wifi-card ${!mergedWifi.enabled5 ? "disabled" : ""}`}>
          <div className="wifi-card-header">
            <div className="header-left">
              <span className="band-icon">📶</span>
              <h5>WiFi 5 GHz</h5>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={mergedWifi.enabled5}
                onChange={(e) => handleChange("enabled5", e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="wifi-fields">
            <div className="field">
              <label>{t("modem.wifi.ssid")}</label>
              <input
                type="text"
                value={mergedWifi.ssid5}
                onChange={(e) => handleChange("ssid5", e.target.value)}
                disabled={!mergedWifi.enabled5}
              />
            </div>
            <div className="field">
              <label>{t("modem.wifi.password")}</label>
              <div className="password-field">
                <input
                  type={showPassword5 ? "text" : "password"}
                  value={mergedWifi.password5}
                  onChange={(e) => handleChange("password5", e.target.value)}
                  disabled={!mergedWifi.enabled5}
                />
                <button
                  className="btn-show"
                  onClick={() => setShowPassword5(!showPassword5)}
                  type="button"
                >
                  {showPassword5 ? "🙈" : "👁"}
                </button>
                <button
                  className="btn-generate"
                  onClick={() => onGeneratePassword("5")}
                  disabled={!mergedWifi.enabled5}
                  type="button"
                  title={t("modem.wifi.generatePassword")}
                >
                  🎲
                </button>
              </div>
            </div>
            <div className="field">
              <label>{t("modem.wifi.security")}</label>
              <select
                value={mergedWifi.security}
                onChange={(e) => handleChange("security", e.target.value)}
                disabled={!mergedWifi.enabled5}
              >
                {securityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{t("modem.wifi.channel")}</label>
              <select
                value={mergedWifi.channel5}
                onChange={(e) => handleChange("channel5", e.target.value === "auto" ? "auto" : Number(e.target.value))}
                disabled={!mergedWifi.enabled5}
              >
                {channels5.map(ch => (
                  <option key={ch} value={ch}>{ch === "auto" ? "Auto" : ch}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      {hasChanges && (
        <div className="wifi-actions">
          <button
            className="btn-secondary"
            onClick={() => setLocalWifi({})}
            disabled={saving}
          >
            {t("cancel")}
          </button>
          <button
            className="btn-primary"
            onClick={handleApply}
            disabled={saving}
          >
            {saving ? t("saving") : t("modem.wifi.apply")}
          </button>
        </div>
      )}
    </div>
  );
}

export default ModemWifi;
