// ============================================================
// MODAL: LockModal - Verrouiller/Déverrouiller le domaine
// Basé sur target SVG modal-lock.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { generalService } from "./GeneralTab.service";

interface Props {
  domain: string;
  isLocked: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ============ ICONS ============

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const UnlockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>
  </svg>
);

// ============ COMPOSANT ============

export function LockModal({ domain, isLocked, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/general");
  const [action, setAction] = useState<"lock" | "unlock">(isLocked ? "unlock" : "lock");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (action === "lock") {
        await generalService.lockDomain(domain);
      } else {
        await generalService.unlockDomain(domain);
      }
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
          <h3>{t("modals.lock.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          <div className="dom-modal-domain">{domain}</div>

          <div className="dom-modal-status">
            <span className="dom-modal-label">{t("modals.lock.currentStatus")}</span>
            <span className={`dom-modal-badge ${isLocked ? "success" : "warning"}`}>
              {isLocked ? t("security.locked") : t("security.unlocked")}
            </span>
          </div>

          <div className="dom-modal-info-banner">
            {t("modals.lock.info")}
          </div>

          {/* Options */}
          <div className="dom-modal-options">
            <div
              className={`dom-modal-option ${action === "lock" ? "selected" : ""}`}
              onClick={() => setAction("lock")}
            >
              <LockIcon />
              <div className="dom-modal-option-content">
                <strong>{t("modals.lock.optionLock")}</strong>
                <span>{t("modals.lock.optionLockDesc")}</span>
              </div>
            </div>

            <div
              className={`dom-modal-option ${action === "unlock" ? "selected" : ""}`}
              onClick={() => setAction("unlock")}
            >
              <UnlockIcon />
              <div className="dom-modal-option-content">
                <strong>{t("modals.lock.optionUnlock")}</strong>
                <span>{t("modals.lock.optionUnlockDesc")}</span>
              </div>
            </div>
          </div>

          {error && <div className="dom-modal-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="dom-modal-footer">
          <button className="dom-btn-secondary" onClick={onClose} disabled={loading}>
            {t("actions.cancel")}
          </button>
          <button className="dom-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "..." : t("actions.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LockModal;
