// ============================================================
// MODEM DECLARE MODAL - Déclaration modem personnel
// ============================================================

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import type { ModemCustom } from "./connections.types";

interface ModemDeclareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeclare: (modem: ModemCustom) => Promise<void>;
}

const MODEM_BRANDS = [
  { id: "asus", label: "ASUS" },
  { id: "netgear", label: "Netgear" },
  { id: "tp-link", label: "TP-Link" },
  { id: "linksys", label: "Linksys" },
  { id: "ubiquiti", label: "Ubiquiti" },
  { id: "synology", label: "Synology" },
  { id: "mikrotik", label: "MikroTik" },
  { id: "draytek", label: "DrayTek" },
  { id: "fritz", label: "FRITZ!Box" },
  { id: "other", label: "Autre" },
];

export function ModemDeclareModal({ isOpen, onClose, onDeclare }: ModemDeclareModalProps) {
  const { t } = useTranslation("web-cloud/access/modals");

  // Form state
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [mac, setMac] = useState("");
  const [declaring, setDeclaring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate MAC address format
  const isValidMac = useCallback((macAddress: string): boolean => {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(macAddress);
  }, []);

  // Format MAC address as user types
  const handleMacChange = useCallback((value: string) => {
    // Remove non-hex characters
    let cleaned = value.replace(/[^0-9A-Fa-f]/g, "").toUpperCase();

    // Add colons every 2 characters
    let formatted = "";
    for (let i = 0; i < cleaned.length && i < 12; i++) {
      if (i > 0 && i % 2 === 0) {
        formatted += ":";
      }
      formatted += cleaned[i];
    }
    setMac(formatted);
  }, []);

  // Handle declaration
  const handleDeclare = useCallback(async () => {
    setError(null);

    // Validate fields
    if (!brand) {
      setError(t("modemDeclare.errors.brandRequired"));
      return;
    }
    if (!model.trim()) {
      setError(t("modemDeclare.errors.modelRequired"));
      return;
    }
    if (!isValidMac(mac)) {
      setError(t("modemDeclare.errors.invalidMac"));
      return;
    }

    setDeclaring(true);
    try {
      await onDeclare({
        brand,
        model: model.trim(),
        mac,
      });
      // Reset form
      setBrand("");
      setModel("");
      setMac("");
      onClose();
    } catch (err) {
      setError(t("modemDeclare.errors.declareFailed"));
    } finally {
      setDeclaring(false);
    }
  }, [brand, model, mac, isValidMac, onDeclare, onClose, t]);

  // Reset form on close
  const handleClose = useCallback(() => {
    setBrand("");
    setModel("");
    setMac("");
    setError(null);
    onClose();
  }, [onClose]);

  const footer = (
    <>
      <button
        className="conn-modal-btn-secondary"
        onClick={handleClose}
        disabled={declaring}
      >
        {t("cancel")}
      </button>
      <button
        className="conn-modal-btn-primary"
        onClick={handleDeclare}
        disabled={declaring || !brand || !model || !mac}
      >
        {declaring ? t("modemDeclare.declaring") : t("modemDeclare.declare")}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("modemDeclare.title")}
      footer={footer}
      size="medium"
    >
      {/* Warning banner */}
      <div className="conn-modal-warning">
        <span className="warning-icon">⚠️</span>
        <div>
          <strong>{t("modemDeclare.warningTitle")}</strong>
          <p>{t("modemDeclare.warningText")}</p>
        </div>
      </div>

      {error && (
        <div className="conn-modal-alert conn-modal-alert-error">
          {error}
        </div>
      )}

      {/* Brand selection */}
      <div className="conn-modal-field">
        <label className="conn-modal-label">{t("modemDeclare.brand")} *</label>
        <select
          className="conn-modal-select"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">{t("modemDeclare.selectBrand")}</option>
          {MODEM_BRANDS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      {/* Model input */}
      <div className="conn-modal-field">
        <label className="conn-modal-label">{t("modemDeclare.model")} *</label>
        <input
          type="text"
          className="conn-modal-input"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder={t("modemDeclare.modelPlaceholder")}
        />
        <span className="conn-modal-hint">{t("modemDeclare.modelHint")}</span>
      </div>

      {/* MAC address input */}
      <div className="conn-modal-field">
        <label className="conn-modal-label">{t("modemDeclare.macAddress")} *</label>
        <input
          type="text"
          className="conn-modal-input conn-modal-input-mono"
          value={mac}
          onChange={(e) => handleMacChange(e.target.value)}
          placeholder="00:11:22:33:44:55"
          maxLength={17}
        />
        <span className="conn-modal-hint">{t("modemDeclare.macHint")}</span>
      </div>

      {/* Requirements list */}
      <div className="conn-modal-requirements">
        <h4>{t("modemDeclare.requirements")}</h4>
        <ul>
          <li>{t("modemDeclare.req1")}</li>
          <li>{t("modemDeclare.req2")}</li>
          <li>{t("modemDeclare.req3")}</li>
          <li>{t("modemDeclare.req4")}</li>
        </ul>
      </div>
    </Modal>
  );
}
