// ============================================================
// MODAL: DnssecEnableModal - Activer DNSSEC
// Basé sur target SVG modal.dnssec-enable.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { dnssecService } from "./dnssec/DnssecTab.service";

interface Props {
  domain: string;
  onClose: () => void;
  onSuccess: () => void;
}

// ============ ICONS ============

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0050D7" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

// ============ COMPOSANT ============

export function DnssecEnableModal({ domain, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/dnssec");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnable = async () => {
    setLoading(true);
    setError(null);
    try {
      await dnssecService.enableDnssec(domain);
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
          <h3>{t("modals.enable.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content dom-modal-content-center">
          <ShieldIcon />

          <div className="dom-modal-domain">{domain}</div>

          <p className="dom-modal-description">
            {t("modals.enable.description")}
          </p>

          <div className="dom-modal-info-banner">
            {t("modals.enable.info")}
          </div>

          <ul className="dom-modal-benefits">
            <li>{t("modals.enable.benefit1")}</li>
            <li>{t("modals.enable.benefit2")}</li>
            <li>{t("modals.enable.benefit3")}</li>
          </ul>

          {error && <div className="dom-modal-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="dom-modal-footer">
          <button className="dom-btn-secondary" onClick={onClose} disabled={loading}>
            {t("actions.cancel")}
          </button>
          <button className="dom-btn-primary" onClick={handleEnable} disabled={loading}>
            {loading ? "..." : t("modals.enable.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DnssecEnableModal;
