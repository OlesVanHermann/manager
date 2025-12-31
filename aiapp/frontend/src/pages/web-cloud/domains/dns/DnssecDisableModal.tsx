// ============================================================
// MODAL: DnssecDisableModal - Désactiver DNSSEC
// Basé sur target SVG modal-dnssec-disable.svg
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

const WarningIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// ============ COMPOSANT ============

export function DnssecDisableModal({ domain, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/dnssec");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmationText = "DISABLE";
  const isConfirmed = confirmation === confirmationText;

  const handleDisable = async () => {
    if (!isConfirmed) return;
    setLoading(true);
    setError(null);
    try {
      await dnssecService.disableDnssec(domain);
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
        <div className="dom-modal-header dom-modal-header-danger">
          <h3>{t("modals.disable.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content dom-modal-content-center">
          <WarningIcon />

          <div className="dom-modal-domain">{domain}</div>

          <p className="dom-modal-confirm-text">
            {t("modals.disable.confirm")}
          </p>

          <div className="dom-modal-warning-banner">
            {t("modals.disable.warning")}
          </div>

          {/* Confirmation input */}
          <div className="dom-modal-field">
            <label>{t("modals.disable.typeConfirm", { text: confirmationText })}</label>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder={confirmationText}
            />
          </div>

          {error && <div className="dom-modal-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="dom-modal-footer">
          <button className="dom-btn-secondary" onClick={onClose} disabled={loading}>
            {t("actions.cancel")}
          </button>
          <button className="dom-btn-danger" onClick={handleDisable} disabled={loading || !isConfirmed}>
            {loading ? "..." : t("modals.disable.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DnssecDisableModal;
