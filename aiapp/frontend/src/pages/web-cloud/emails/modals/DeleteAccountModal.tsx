// ============================================================
// MODAL - Delete Account (Suppression de compte email)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: {
    id: string;
    email: string;
    displayName: string;
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
  const [confirmEmail, setConfirmEmail] = useState("");

  const handleConfirm = async () => {
    if (!account) return;

    if (confirmEmail !== account.email) {
      setError(t("deleteAccount.errors.emailMismatch"));
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
    setConfirmEmail("");
    setError(null);
    onClose();
  };

  if (!isOpen || !account) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container modal-danger" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
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

          <div className="delete-warning">
            <span className="warning-icon">⚠</span>
            <div className="warning-content">
              <p className="warning-title">{t("deleteAccount.warning.title")}</p>
              <p className="warning-text">{t("deleteAccount.warning.text")}</p>
            </div>
          </div>

          <div className="delete-info">
            <p>{t("deleteAccount.info.willDelete")}:</p>
            <ul>
              <li>{t("deleteAccount.info.allEmails")}</li>
              <li>{t("deleteAccount.info.allContacts")}</li>
              <li>{t("deleteAccount.info.allCalendars")}</li>
              <li>{t("deleteAccount.info.allSettings")}</li>
            </ul>
          </div>

          <div className="form-group">
            <label className="form-label">
              {t("deleteAccount.confirm.label", { email: account.email })}
            </label>
            <input
              type="text"
              className="form-input"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder={account.email}
              disabled={loading}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
            {t("common.cancel")}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={loading || confirmEmail !== account.email}
          >
            {loading ? t("common.deleting") : t("deleteAccount.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
