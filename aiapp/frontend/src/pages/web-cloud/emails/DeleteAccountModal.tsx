// ============================================================
// MODAL - Delete Account (Suppression de compte email)
// Aligné avec target_.web-cloud.emails.modal.delete-account.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EmailOffer } from "../types";
import { OfferBadge } from "./OfferBadge";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: {
    id: string;
    email: string;
    displayName: string;
    offer: EmailOffer;
    packName?: string;
  } | null;
  onConfirm: () => Promise<void>;
}

/** Modal de confirmation de suppression d'un compte email. */
export function DeleteAccountModal({
  isOpen,
  onClose,
  account,
  onConfirm,
}: DeleteAccountModalProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");

  const CONFIRM_WORD = "SUPPRIMER";
  const isConfirmValid = confirmText === CONFIRM_WORD;

  const handleConfirm = async () => {
    if (!account) return;

    if (!isConfirmValid) {
      setError(t("deleteAccount.errors.confirmMismatch"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onConfirm();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("deleteAccount.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmText("");
    setError(null);
    onClose();
  };

  if (!isOpen || !account) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container modal-danger" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header modal-header-danger">
          <span className="modal-icon">⚠️</span>
          <h2 className="modal-title">{t("deleteAccount.title")}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="modal-error">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          {/* Warning icon centered */}
          <div className="delete-icon-container">
            <div className="delete-icon-circle">
              <span className="delete-icon">!</span>
            </div>
          </div>

          {/* Question */}
          <p className="delete-question">{t("deleteAccount.question")}</p>

          {/* Account card */}
          <div className="delete-account-card">
            <div className="account-card-left">
              <span className="account-icon">📧</span>
              <div className="account-details">
                <span className="account-email">{account.email}</span>
                <span className="account-pack">
                  <OfferBadge offer={account.offer} size="small" />
                  {account.packName && <span className="pack-name">{account.packName}</span>}
                </span>
              </div>
            </div>
          </div>

          {/* Warning box */}
          <div className="warning-box warning-box-yellow">
            <p className="warning-title">⚠️ {t("deleteAccount.warning.title")}</p>
            <ul className="warning-list">
              <li>{t("deleteAccount.info.allEmails")}</li>
              <li>{t("deleteAccount.info.allAliases")}</li>
              <li>{t("deleteAccount.info.allRedirections")}</li>
            </ul>
            <p className="warning-positive">✓ {t("deleteAccount.info.licenseFreed", { pack: account.packName || "votre pack" })}</p>
          </div>

          {/* Confirmation field */}
          <div className="form-group">
            <label className="form-label">
              {t("deleteAccount.confirm.typeWord", { word: CONFIRM_WORD })}
            </label>
            <input
              type="text"
              className={`form-input form-input-danger ${isConfirmValid ? "valid" : ""}`}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder={CONFIRM_WORD}
              disabled={loading}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
            {t("common.cancel")}
          </button>
          <button
            type="button"
            className={`btn btn-danger ${!isConfirmValid ? "btn-disabled" : ""}`}
            onClick={handleConfirm}
            disabled={loading || !isConfirmValid}
          >
            {loading ? t("common.deleting") : t("deleteAccount.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
