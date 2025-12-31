// ============================================================
// MODAL: TtlModal - Modifier le TTL par défaut
// Basé sur target SVG modal-zone-ttl.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { zoneService } from "./zone/ZoneTab.service";

interface Props {
  zoneName: string;
  currentTtl: number;
  onClose: () => void;
  onSuccess: () => void;
}

// ============ ICONS ============

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

// ============ TTL PRESETS ============

const TTL_PRESETS = [
  { value: 60, label: "1 minute" },
  { value: 300, label: "5 minutes" },
  { value: 900, label: "15 minutes" },
  { value: 1800, label: "30 minutes" },
  { value: 3600, label: "1 heure" },
  { value: 7200, label: "2 heures" },
  { value: 14400, label: "4 heures" },
  { value: 43200, label: "12 heures" },
  { value: 86400, label: "1 jour" },
  { value: 172800, label: "2 jours" },
  { value: 604800, label: "1 semaine" },
];

// ============ COMPOSANT ============

export function TtlModal({ zoneName, currentTtl, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/zone");
  const [ttl, setTtl] = useState<number>(currentTtl);
  const [customTtl, setCustomTtl] = useState<string>(String(currentTtl));
  const [useCustom, setUseCustom] = useState(!TTL_PRESETS.find((p) => p.value === currentTtl));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePresetSelect = (value: number) => {
    setTtl(value);
    setCustomTtl(String(value));
    setUseCustom(false);
  };

  const handleCustomChange = (value: string) => {
    setCustomTtl(value);
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      setTtl(num);
    }
    setUseCustom(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await zoneService.updateDefaultTtl(zoneName, ttl);
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header">
          <h3>{t("modals.ttl.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          <div className="dom-modal-domain">{zoneName}</div>

          <div className="dom-modal-info-banner">
            <ClockIcon />
            <span>{t("modals.ttl.info")}</span>
          </div>

          {/* Presets grid */}
          <div className="dom-modal-field">
            <label>{t("modals.ttl.presets")}</label>
            <div className="dom-modal-ttl-grid">
              {TTL_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  className={`dom-modal-ttl-btn ${ttl === preset.value && !useCustom ? "selected" : ""}`}
                  onClick={() => handlePresetSelect(preset.value)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom TTL */}
          <div className="dom-modal-field">
            <label>{t("modals.ttl.custom")}</label>
            <div className="dom-modal-input-suffix">
              <input
                type="number"
                value={customTtl}
                onChange={(e) => handleCustomChange(e.target.value)}
                min={60}
                max={2592000}
              />
              <span>{t("modals.ttl.seconds")}</span>
            </div>
            <small>{t("modals.ttl.customHelp")}</small>
          </div>

          {error && <div className="dom-modal-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="dom-modal-footer">
          <button className="dom-btn-secondary" onClick={onClose} disabled={loading}>
            {t("actions.cancel")}
          </button>
          <button className="dom-btn-primary" onClick={handleSubmit} disabled={loading || ttl < 60}>
            {loading ? "..." : t("actions.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TtlModal;
