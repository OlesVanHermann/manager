// ============================================================
// WIFI CONFIG MODAL - Configuration WiFi modem
// ============================================================

import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import type { ModemWifi } from "./connections.types";

interface WifiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  wifi: ModemWifi | null;
  band: "2.4" | "5";
  onSave: (config: Partial<ModemWifi>) => Promise<void>;
}

const CHANNELS_24 = [
  { value: "auto", label: "Auto" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
  { value: "13", label: "13" },
];

const CHANNELS_5 = [
  { value: "auto", label: "Auto" },
  { value: "36", label: "36" },
  { value: "40", label: "40" },
  { value: "44", label: "44" },
  { value: "48", label: "48" },
  { value: "52", label: "52" },
  { value: "56", label: "56" },
  { value: "60", label: "60" },
  { value: "64", label: "64" },
  { value: "100", label: "100" },
  { value: "104", label: "104" },
  { value: "108", label: "108" },
  { value: "112", label: "112" },
  { value: "116", label: "116" },
];

const SECURITY_TYPES = [
  { value: "WPA2", label: "WPA2-Personal" },
  { value: "WPA3", label: "WPA3-Personal" },
  { value: "WPA2/WPA3", label: "WPA2/WPA3 Mixed" },
];

export function WifiConfigModal({ isOpen, onClose, wifi, band, onSave }: WifiConfigModalProps) {
  const { t } = useTranslation("web-cloud/access/modals");

  // Form state
  const [enabled, setEnabled] = useState(true);
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [channel, setChannel] = useState<string>("auto");
  const [security, setSecurity] = useState<"WPA2" | "WPA3" | "WPA2/WPA3">("WPA2");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with current values
  useEffect(() => {
    if (wifi) {
      if (band === "2.4") {
        setEnabled(wifi.enabled24);
        setSsid(wifi.ssid24);
        setPassword(wifi.password24);
        setChannel(String(wifi.channel24));
      } else {
        setEnabled(wifi.enabled5);
        setSsid(wifi.ssid5);
        setPassword(wifi.password5);
        setChannel(String(wifi.channel5));
      }
      setSecurity(wifi.security);
    }
  }, [wifi, band]);

  // Get channels based on band
  const channels = band === "2.4" ? CHANNELS_24 : CHANNELS_5;

  // Generate random password
  const generatePassword = useCallback(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    let result = "";
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    setShowPassword(true);
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    setError(null);

    // Validate SSID
    if (!ssid.trim()) {
      setError(t("wifi.errors.ssidRequired"));
      return;
    }
    if (ssid.length > 32) {
      setError(t("wifi.errors.ssidTooLong"));
      return;
    }

    // Validate password
    if (enabled && password.length < 8) {
      setError(t("wifi.errors.passwordTooShort"));
      return;
    }
    if (enabled && password.length > 63) {
      setError(t("wifi.errors.passwordTooLong"));
      return;
    }

    setSaving(true);
    try {
      const config: Partial<ModemWifi> = {
        security,
      };

      if (band === "2.4") {
        config.enabled24 = enabled;
        config.ssid24 = ssid.trim();
        config.password24 = password;
        config.channel24 = channel === "auto" ? "auto" : Number(channel);
      } else {
        config.enabled5 = enabled;
        config.ssid5 = ssid.trim();
        config.password5 = password;
        config.channel5 = channel === "auto" ? "auto" : Number(channel);
      }

      await onSave(config);
      onClose();
    } catch (err) {
      setError(t("wifi.errors.saveFailed"));
    } finally {
      setSaving(false);
    }
  }, [enabled, ssid, password, channel, security, band, onSave, onClose, t]);

  const footer = (
    <>
      <button
        className="conn-modal-btn-secondary"
        onClick={onClose}
        disabled={saving}
      >
        {t("cancel")}
      </button>
      <button
        className="conn-modal-btn-primary"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? t("saving") : t("save")}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("wifi.title", { band: band === "2.4" ? "2.4 GHz" : "5 GHz" })}
      footer={footer}
      size="medium"
    >
      {error && (
        <div className="conn-modal-alert conn-modal-alert-error">
          {error}
        </div>
      )}

      {/* Band indicator */}
      <div className="conn-modal-band-indicator">
        <span className={`conn-band-badge conn-band-${band === "2.4" ? "24" : "5"}`}>
          {band === "2.4" ? "2.4 GHz" : "5 GHz"}
        </span>
        <span className="conn-band-desc">
          {band === "2.4" ? t("wifi.band24Desc") : t("wifi.band5Desc")}
        </span>
      </div>

      {/* Enable/Disable WiFi */}
      <div className="conn-modal-field">
        <label className="conn-modal-toggle-row">
          <span className="conn-modal-label">{t("wifi.enableWifi")}</span>
          <label className="conn-toggle">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            <span className="conn-toggle-slider"></span>
          </label>
        </label>
      </div>

      {enabled && (
        <>
          {/* SSID */}
          <div className="conn-modal-field">
            <label className="conn-modal-label">{t("wifi.ssid")} *</label>
            <input
              type="text"
              className="conn-modal-input"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              placeholder={t("wifi.ssidPlaceholder")}
              maxLength={32}
            />
            <span className="conn-modal-hint">{t("wifi.ssidHint")}</span>
          </div>

          {/* Security type */}
          <div className="conn-modal-field">
            <label className="conn-modal-label">{t("wifi.security")}</label>
            <select
              className="conn-modal-select"
              value={security}
              onChange={(e) => setSecurity(e.target.value as "WPA2" | "WPA3" | "WPA2/WPA3")}
            >
              {SECURITY_TYPES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="conn-modal-field">
            <label className="conn-modal-label">{t("wifi.password")} *</label>
            <div className="conn-modal-password-row">
              <input
                type={showPassword ? "text" : "password"}
                className="conn-modal-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("wifi.passwordPlaceholder")}
                maxLength={63}
              />
              <button
                type="button"
                className="conn-modal-btn-icon"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? t("wifi.hidePassword") : t("wifi.showPassword")}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
              <button
                type="button"
                className="conn-modal-btn-icon"
                onClick={generatePassword}
                title={t("wifi.generatePassword")}
              >
                🔄
              </button>
            </div>
            <span className="conn-modal-hint">{t("wifi.passwordHint")}</span>
          </div>

          {/* Channel */}
          <div className="conn-modal-field">
            <label className="conn-modal-label">{t("wifi.channel")}</label>
            <select
              className="conn-modal-select"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              {channels.map((ch) => (
                <option key={ch.value} value={ch.value}>
                  {ch.label}
                </option>
              ))}
            </select>
            <span className="conn-modal-hint">{t("wifi.channelHint")}</span>
          </div>
        </>
      )}
    </Modal>
  );
}
