// ============================================================
// MODAL - Edit Account (Modification de compte email)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { EmailOffer } from "../types";
import { OfferBadge } from "./OfferBadge";
import { OFFER_CONFIG } from "./emails.constants";

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: {
    id: string;
    email: string;
    displayName: string;
    offer: EmailOffer;
    quota: { used: number; total: number };
    packName?: string;
  } | null;
  onSubmit: (data: EditAccountData) => Promise<void>;
}

interface EditAccountData {
  displayName: string;
  quota: number;
  newPassword?: string;
}

/** Modal de modification d'un compte email. */
export function EditAccountModal({
  isOpen,
  onClose,
  account,
  onSubmit,
}: EditAccountModalProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [quota, setQuota] = useState(5);
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (account) {
      setDisplayName(account.displayName);
      setQuota(Math.round(account.quota.total / (1024 * 1024 * 1024)));
    }
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (changePassword) {
      if (newPassword !== confirmPassword) {
        setError(t("editAccount.errors.passwordMismatch"));
        return;
      }
      if (newPassword.length < 8) {
        setError(t("editAccount.errors.passwordTooShort"));
        return;
      }
    }

    setLoading(true);
    try {
      await onSubmit({
        displayName,
        quota,
        newPassword: changePassword ? newPassword : undefined,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("editAccount.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setChangePassword(false);
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    onClose();
  };

  if (!isOpen || !account) return null;

  const usedGb = account.quota.used / (1024 * 1024 * 1024);
  const totalGb = account.quota.total / (1024 * 1024 * 1024);
  const usedPercent = Math.round((usedGb / totalGb) * 100);

  // Quotas disponibles selon l'offre
  const getAvailableQuotas = (offer: EmailOffer): number[] => {
    switch (offer) {
      case "exchange": return [50, 100, 300];
      case "email-pro": return [10];
      case "zimbra": return [10];
      case "mx-plan": return [5];
      default: return [5, 10, 25, 50];
    }
  };

  const availableQuotas = getAvailableQuotas(account.offer);

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-icon">✏️</span>
          <h2 className="modal-title">{t("editAccount.title")}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="modal-error">
                <span className="error-icon">⚠</span>
                {error}
              </div>
            )}

            {/* Account info card */}
            <div className="account-info-card">
              <div className="account-info-left">
                <span className="info-label">{t("editAccount.fields.account")}</span>
                <span className="info-value">{account.email}</span>
              </div>
              <div className="account-info-right">
                <OfferBadge offer={account.offer} />
                <span className="offer-quota">{totalGb} Go</span>
              </div>
            </div>

            {/* Display name */}
            <div className="form-group">
              <label className="form-label">{t("editAccount.fields.displayName")}</label>
              <input
                type="text"
                className="form-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Quota */}
            <div className="form-group">
              <label className="form-label">{t("editAccount.fields.quota")}</label>
              <div className="quota-row">
                <select
                  className="form-select"
                  value={quota}
                  onChange={(e) => setQuota(Number(e.target.value))}
                  disabled={loading || availableQuotas.length === 1}
                >
                  {availableQuotas.map((q) => (
                    <option key={q} value={q} disabled={usedGb > q}>
                      {q} Go
                    </option>
                  ))}
                </select>
                <span className="quota-usage">
                  {t("editAccount.quotaUsed", { used: usedGb.toFixed(1), percent: usedPercent })}
                </span>
              </div>
            </div>

            {/* Change password section */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={changePassword}
                  onChange={(e) => setChangePassword(e.target.checked)}
                  disabled={loading}
                />
                {t("editAccount.fields.changePassword")}
              </label>
            </div>

            {changePassword && (
              <div className="password-fields">
                <div className="form-group">
                  <label className="form-label">{t("editAccount.fields.newPassword")}</label>
                  <input
                    type="password"
                    className="form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t("editAccount.fields.confirmPassword")}</label>
                  <input
                    type="password"
                    className="form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Info box */}
            <div className="info-box info-box-primary">
              <span className="info-icon">ℹ️</span>
              <div className="info-content">
                <p>{t("editAccount.info.immediate")}</p>
                {availableQuotas.length > 1 && (
                  <p>{t("editAccount.info.quotaModifiable")}</p>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t("common.saving") : t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
