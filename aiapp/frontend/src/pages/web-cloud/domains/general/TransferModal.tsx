// ============================================================
// MODAL: TransferModal - Préparer le transfert sortant
// Basé sur target SVG modal.transfer.svg
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

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ============ COMPOSANT ============

export function TransferModal({ domain, isLocked, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/general");
  const [step, setStep] = useState<"check" | "unlock" | "authcode">(isLocked ? "check" : "authcode");
  const [loading, setLoading] = useState(false);
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = async () => {
    setLoading(true);
    setError(null);
    try {
      await generalService.unlockDomain(domain);
      setStep("authcode");
      onSuccess();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGetAuthCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const code = await generalService.getAuthInfo(domain);
      setAuthCode(code);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (authCode) {
      navigator.clipboard.writeText(authCode);
    }
  };

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal dom-modal-large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header">
          <h3>{t("modals.transfer.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          <div className="dom-modal-domain">{domain}</div>

          {/* Steps indicator */}
          <div className="dom-modal-steps">
            <div className={`dom-modal-step ${step === "check" ? "active" : step === "unlock" || step === "authcode" ? "done" : ""}`}>
              <span className="dom-modal-step-num">1</span>
              <span>{t("modals.transfer.step1")}</span>
            </div>
            <ArrowRightIcon />
            <div className={`dom-modal-step ${step === "unlock" ? "active" : step === "authcode" ? "done" : ""}`}>
              <span className="dom-modal-step-num">2</span>
              <span>{t("modals.transfer.step2")}</span>
            </div>
            <ArrowRightIcon />
            <div className={`dom-modal-step ${step === "authcode" ? "active" : ""}`}>
              <span className="dom-modal-step-num">3</span>
              <span>{t("modals.transfer.step3")}</span>
            </div>
          </div>

          {/* Step content */}
          {step === "check" && (
            <div className="dom-modal-step-content">
              <h4>{t("modals.transfer.checkTitle")}</h4>
              <div className="dom-modal-checklist">
                <div className="dom-modal-check-item">
                  {isLocked ? <XIcon /> : <CheckIcon />}
                  <span>{t("modals.transfer.checkUnlocked")}</span>
                  <span className={`dom-modal-badge ${isLocked ? "warning" : "success"}`}>
                    {isLocked ? t("security.locked") : t("security.unlocked")}
                  </span>
                </div>
              </div>
              {isLocked && (
                <div className="dom-modal-warning-banner">
                  {t("modals.transfer.needUnlock")}
                </div>
              )}
            </div>
          )}

          {step === "unlock" && (
            <div className="dom-modal-step-content">
              <h4>{t("modals.transfer.unlockTitle")}</h4>
              <p>{t("modals.transfer.unlockDesc")}</p>
            </div>
          )}

          {step === "authcode" && (
            <div className="dom-modal-step-content">
              <h4>{t("modals.transfer.authCodeTitle")}</h4>
              <p>{t("modals.transfer.authCodeDesc")}</p>
              {authCode ? (
                <div className="dom-modal-authcode">
                  <code>{authCode}</code>
                  <button className="dom-btn-secondary" onClick={copyToClipboard}>
                    {t("actions.copy")}
                  </button>
                </div>
              ) : (
                <button className="dom-btn-primary" onClick={handleGetAuthCode} disabled={loading}>
                  {loading ? "..." : t("modals.transfer.getAuthCode")}
                </button>
              )}
            </div>
          )}

          {error && <div className="dom-modal-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="dom-modal-footer">
          <button className="dom-btn-secondary" onClick={onClose}>
            {t("actions.close")}
          </button>
          {step === "check" && isLocked && (
            <button className="dom-btn-primary" onClick={() => setStep("unlock")}>
              {t("actions.continue")}
            </button>
          )}
          {step === "check" && !isLocked && (
            <button className="dom-btn-primary" onClick={() => setStep("authcode")}>
              {t("actions.continue")}
            </button>
          )}
          {step === "unlock" && (
            <button className="dom-btn-primary" onClick={handleUnlock} disabled={loading}>
              {loading ? "..." : t("modals.transfer.unlockBtn")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransferModal;
