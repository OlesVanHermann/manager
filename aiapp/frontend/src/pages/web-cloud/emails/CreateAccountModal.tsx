// ============================================================
// MODAL - Create Account (Création de compte email)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EmailOffer } from "./types";
import { OfferBadge } from "./OfferBadge";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  availableOffers: EmailOffer[];
  onSubmit: (data: CreateAccountData) => Promise<void>;
}

interface CreateAccountData {
  localPart: string;
  displayName: string;
  offer: EmailOffer;
  password: string;
  quota: number;
  sendWelcomeEmail: boolean;
}

/** Modal de création d'un compte email. */
export function CreateAccountModal({
  isOpen,
  onClose,
  domain,
  availableOffers,
  onSubmit,
}: CreateAccountModalProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [localPart, setLocalPart] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [offer, setOffer] = useState<EmailOffer>(availableOffers[0] || "exchange");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [quota, setQuota] = useState(5);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!localPart.trim()) {
      setError(t("createAccount.errors.localPartRequired"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("createAccount.errors.passwordMismatch"));
      return;
    }

    if (password.length < 8) {
      setError(t("createAccount.errors.passwordTooShort"));
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        localPart,
        displayName,
        offer,
        password,
        quota,
        sendWelcomeEmail,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("createAccount.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLocalPart("");
    setDisplayName("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t("createAccount.title")}</h2>
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

            {/* Email address */}
            <div className="form-group">
              <label className="form-label">{t("createAccount.fields.email")}</label>
              <div className="email-input-group">
                <input
                  type="text"
                  className="form-input"
                  value={localPart}
                  onChange={(e) => setLocalPart(e.target.value.toLowerCase())}
                  placeholder="contact"
                  disabled={loading}
                />
                <span className="email-domain">@{domain}</span>
              </div>
            </div>

            {/* Display name */}
            <div className="form-group">
              <label className="form-label">{t("createAccount.fields.displayName")}</label>
              <input
                type="text"
                className="form-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t("createAccount.placeholders.displayName")}
                disabled={loading}
              />
            </div>

            {/* Offer selection */}
            <div className="form-group">
              <label className="form-label">{t("createAccount.fields.offer")}</label>
              <div className="offer-select-grid">
                {availableOffers.map((o) => (
                  <button
                    key={o}
                    type="button"
                    className={`offer-select-btn ${offer === o ? "selected" : ""}`}
                    onClick={() => setOffer(o)}
                    disabled={loading}
                  >
                    <OfferBadge offer={o} />
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t("createAccount.fields.password")}</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t("createAccount.fields.confirmPassword")}</label>
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

            {/* Quota */}
            <div className="form-group">
              <label className="form-label">{t("createAccount.fields.quota")}</label>
              <select
                className="form-select"
                value={quota}
                onChange={(e) => setQuota(Number(e.target.value))}
                disabled={loading}
              >
                <option value={5}>5 Go</option>
                <option value={10}>10 Go</option>
                <option value={25}>25 Go</option>
                <option value={50}>50 Go</option>
              </select>
            </div>

            {/* Welcome email */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={sendWelcomeEmail}
                  onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                  disabled={loading}
                />
                {t("createAccount.fields.sendWelcomeEmail")}
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t("common.creating") : t("createAccount.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
