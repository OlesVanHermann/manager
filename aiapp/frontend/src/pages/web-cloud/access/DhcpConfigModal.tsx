// ============================================================
// DHCP CONFIG MODAL - Configuration serveur DHCP modem
// ============================================================

import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import type { ModemDhcp } from "./connections.types";

interface DhcpConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  dhcp: ModemDhcp | null;
  onSave: (config: Partial<ModemDhcp>) => Promise<void>;
}

export function DhcpConfigModal({ isOpen, onClose, dhcp, onSave }: DhcpConfigModalProps) {
  const { t } = useTranslation("web-cloud/access/modals");

  // Form state
  const [enabled, setEnabled] = useState(true);
  const [rangeStart, setRangeStart] = useState("192.168.1.20");
  const [rangeEnd, setRangeEnd] = useState("192.168.1.254");
  const [leaseTime, setLeaseTime] = useState(24);
  const [primaryDns, setPrimaryDns] = useState("213.186.33.99");
  const [secondaryDns, setSecondaryDns] = useState("213.186.33.199");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with current values
  useEffect(() => {
    if (dhcp) {
      setEnabled(dhcp.enabled);
      setRangeStart(dhcp.rangeStart);
      setRangeEnd(dhcp.rangeEnd);
      setLeaseTime(dhcp.leaseTime);
    }
  }, [dhcp]);

  // Validate IP address format
  const isValidIp = useCallback((ip: string): boolean => {
    const parts = ip.split(".");
    if (parts.length !== 4) return false;
    return parts.every(part => {
      const num = parseInt(part, 10);
      return !isNaN(num) && num >= 0 && num <= 255;
    });
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    setError(null);

    // Validate IP addresses
    if (!isValidIp(rangeStart)) {
      setError(t("dhcp.errors.invalidStart"));
      return;
    }
    if (!isValidIp(rangeEnd)) {
      setError(t("dhcp.errors.invalidEnd"));
      return;
    }
    if (!isValidIp(primaryDns)) {
      setError(t("dhcp.errors.invalidDns"));
      return;
    }
    if (secondaryDns && !isValidIp(secondaryDns)) {
      setError(t("dhcp.errors.invalidDns"));
      return;
    }

    setSaving(true);
    try {
      await onSave({
        enabled,
        rangeStart,
        rangeEnd,
        leaseTime,
      });
      onClose();
    } catch (err) {
      setError(t("dhcp.errors.saveFailed"));
    } finally {
      setSaving(false);
    }
  }, [enabled, rangeStart, rangeEnd, leaseTime, primaryDns, secondaryDns, isValidIp, onSave, onClose, t]);

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
      title={t("dhcp.title")}
      footer={footer}
      size="medium"
    >
      {error && (
        <div className="conn-modal-alert conn-modal-alert-error">
          {error}
        </div>
      )}

      {/* Enable/Disable DHCP */}
      <div className="conn-modal-field">
        <label className="conn-modal-toggle-row">
          <span className="conn-modal-label">{t("dhcp.enableServer")}</span>
          <label className="conn-toggle">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            <span className="conn-toggle-slider"></span>
          </label>
        </label>
        <span className="conn-modal-hint">{t("dhcp.enableHint")}</span>
      </div>

      {enabled && (
        <>
          {/* IP Range */}
          <div className="conn-modal-section">
            <h4 className="conn-modal-section-title">{t("dhcp.ipRange")}</h4>
            <div className="conn-modal-row">
              <div className="conn-modal-field">
                <label className="conn-modal-label">{t("dhcp.rangeStart")}</label>
                <input
                  type="text"
                  className="conn-modal-input"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  placeholder="192.168.1.20"
                />
              </div>
              <div className="conn-modal-field">
                <label className="conn-modal-label">{t("dhcp.rangeEnd")}</label>
                <input
                  type="text"
                  className="conn-modal-input"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  placeholder="192.168.1.254"
                />
              </div>
            </div>
          </div>

          {/* Lease Time */}
          <div className="conn-modal-field">
            <label className="conn-modal-label">{t("dhcp.leaseTime")}</label>
            <select
              className="conn-modal-select"
              value={leaseTime}
              onChange={(e) => setLeaseTime(Number(e.target.value))}
            >
              <option value={1}>1 {t("dhcp.hour")}</option>
              <option value={6}>6 {t("dhcp.hours")}</option>
              <option value={12}>12 {t("dhcp.hours")}</option>
              <option value={24}>24 {t("dhcp.hours")}</option>
              <option value={48}>48 {t("dhcp.hours")}</option>
              <option value={168}>168 {t("dhcp.hours")}</option>
            </select>
            <span className="conn-modal-hint">{t("dhcp.leaseHint")}</span>
          </div>

          {/* DNS Servers */}
          <div className="conn-modal-section">
            <h4 className="conn-modal-section-title">{t("dhcp.dnsServers")}</h4>
            <div className="conn-modal-row">
              <div className="conn-modal-field">
                <label className="conn-modal-label">{t("dhcp.primaryDns")}</label>
                <input
                  type="text"
                  className="conn-modal-input"
                  value={primaryDns}
                  onChange={(e) => setPrimaryDns(e.target.value)}
                  placeholder="213.186.33.99"
                />
              </div>
              <div className="conn-modal-field">
                <label className="conn-modal-label">{t("dhcp.secondaryDns")}</label>
                <input
                  type="text"
                  className="conn-modal-input"
                  value={secondaryDns}
                  onChange={(e) => setSecondaryDns(e.target.value)}
                  placeholder="213.186.33.199"
                />
              </div>
            </div>
            <span className="conn-modal-hint">{t("dhcp.dnsHint")}</span>
          </div>
        </>
      )}
    </Modal>
  );
}
