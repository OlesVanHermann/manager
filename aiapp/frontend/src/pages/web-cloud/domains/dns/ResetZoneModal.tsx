// ============================================================
// MODAL: ResetZoneModal - Réinitialiser la zone DNS
// Basé sur target SVG modal.zone-reset.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { zoneService } from "./zone/ZoneTab.service";

interface Props {
  zoneName: string;
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

export function ResetZoneModal({ zoneName, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/zone");
  const [resetType, setResetType] = useState<"minimal" | "hosting" | "redirect">("minimal");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmationText = "RESET";
  const isConfirmed = confirmation === confirmationText;

  const handleSubmit = async () => {
    if (!isConfirmed) return;
    setLoading(true);
    setError(null);
    try {
      await zoneService.resetZone(zoneName, resetType);
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
          <h3>{t("modals.reset.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content dom-modal-content-center">
          <WarningIcon />

          <p className="dom-modal-confirm-text">
            {t("modals.reset.confirm")}
          </p>

          <div className="dom-modal-domain">{zoneName}</div>

          {/* Reset type options */}
          <div className="dom-modal-options">
            <div
              className={`dom-modal-option ${resetType === "minimal" ? "selected" : ""}`}
              onClick={() => setResetType("minimal")}
            >
              <input type="radio" checked={resetType === "minimal"} onChange={() => setResetType("minimal")} />
              <div className="dom-modal-option-content">
                <strong>{t("modals.reset.typeMinimal")}</strong>
                <span>{t("modals.reset.typeMinimalDesc")}</span>
              </div>
            </div>

            <div
              className={`dom-modal-option ${resetType === "hosting" ? "selected" : ""}`}
              onClick={() => setResetType("hosting")}
            >
              <input type="radio" checked={resetType === "hosting"} onChange={() => setResetType("hosting")} />
              <div className="dom-modal-option-content">
                <strong>{t("modals.reset.typeHosting")}</strong>
                <span>{t("modals.reset.typeHostingDesc")}</span>
              </div>
            </div>

            <div
              className={`dom-modal-option ${resetType === "redirect" ? "selected" : ""}`}
              onClick={() => setResetType("redirect")}
            >
              <input type="radio" checked={resetType === "redirect"} onChange={() => setResetType("redirect")} />
              <div className="dom-modal-option-content">
                <strong>{t("modals.reset.typeRedirect")}</strong>
                <span>{t("modals.reset.typeRedirectDesc")}</span>
              </div>
            </div>
          </div>

          {/* Confirmation input */}
          <div className="dom-modal-field">
            <label>{t("modals.reset.typeConfirm", { text: confirmationText })}</label>
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
          <button className="dom-btn-danger" onClick={handleSubmit} disabled={loading || !isConfirmed}>
            {loading ? "..." : t("modals.reset.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetZoneModal;
