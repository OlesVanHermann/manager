// ============================================================
// MODAL - Change Password (Changer mot de passe)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EmailOffer } from "./types";
import { OfferBadge } from "./OfferBadge";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  offer: EmailOffer;
  onSubmit: (data: ChangePasswordData) => Promise<void>;
}

interface ChangePasswordData {
  password: string;
  sendByEmail: boolean;
  forceLogout: boolean;
}

interface PasswordRequirement {
  key: string;
  label: string;
  test: (password: string) => boolean;
}

/** Modal de changement de mot de passe d'un compte email. */
export function ChangePasswordModal({
  isOpen,
  onClose,
  email,
  offer,
  onSubmit,
}: ChangePasswordModalProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sendByEmail, setSendByEmail] = useState(false);
  const [forceLogout, setForceLogout] = useState(true);

  // ---------- PASSWORD REQUIREMENTS ----------

  const requirements: PasswordRequirement[] = [
    { key: "length", label: t("changePassword.requirements.length"), test: (p) => p.length >= 8 },
    { key: "uppercase", label: t("changePassword.requirements.uppercase"), test: (p) => /[A-Z]/.test(p) },
    { key: "lowercase", label: t("changePassword.requirements.lowercase"), test: (p) => /[a-z]/.test(p) },
    { key: "digit", label: t("changePassword.requirements.digit"), test: (p) => /[0-9]/.test(p) },
    { key: "special", label: t("changePassword.requirements.special"), test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p) },
  ];

  const validRequirements = useMemo(() => {
    return requirements.filter((r) => r.test(password));
  }, [password]);

  const passwordStrength = useMemo(() => {
    const count = validRequirements.length;
    if (count <= 1) return { level: "weak", label: t("changePassword.strength.weak"), color: "#DC2626", width: "25%" };
    if (count === 2) return { level: "fair", label: t("changePassword.strength.fair"), color: "#D97706", width: "50%" };
    if (count === 3 || count === 4) return { level: "good", label: t("changePassword.strength.good"), color: "#D97706", width: "75%" };
    return { level: "strong", label: t("changePassword.strength.strong"), color: "#059669", width: "100%" };
  }, [validRequirements, t]);

  const isValid = useMemo(() => {
    return validRequirements.length === requirements.length && password === confirmPassword;
  }, [validRequirements, password, confirmPassword]);

  // ---------- HANDLERS ----------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValid) {
      setError(t("changePassword.errors.invalidPassword"));
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ password, sendByEmail, forceLogout });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("changePassword.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setSendByEmail(false);
    setForceLogout(true);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t("changePassword.title")}</h2>
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

            {/* Account info */}
            <div className="account-info-card">
              <span className="account-email">{email}</span>
              <OfferBadge offer={offer} />
            </div>

            {/* New password */}
            <div className="form-group">
              <label className="form-label">{t("changePassword.fields.newPassword")}</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Password strength indicator */}
            {password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{ width: passwordStrength.width, backgroundColor: passwordStrength.color }}
                  />
                </div>
                <span className="strength-label" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}

            {/* Requirements checklist */}
            <div className="requirements-checklist">
              {requirements.map((req) => (
                <div
                  key={req.key}
                  className={`requirement-item ${req.test(password) ? "valid" : ""}`}
                >
                  <span className="requirement-icon">{req.test(password) ? "✓" : "○"}</span>
                  <span className="requirement-text">{req.label}</span>
                </div>
              ))}
            </div>

            {/* Confirm password */}
            <div className="form-group">
              <label className="form-label">{t("changePassword.fields.confirmPassword")}</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
              {confirmPassword && password !== confirmPassword && (
                <span className="form-hint form-hint-error">
                  {t("changePassword.errors.mismatch")}
                </span>
              )}
            </div>

            {/* Options */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={sendByEmail}
                  onChange={(e) => setSendByEmail(e.target.checked)}
                  disabled={loading}
                />
                {t("changePassword.options.sendByEmail")}
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={forceLogout}
                  onChange={(e) => setForceLogout(e.target.checked)}
                  disabled={loading}
                />
                {t("changePassword.options.forceLogout")}
              </label>
              <span className="form-hint">{t("changePassword.options.forceLogoutHint")}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || !isValid}>
              {loading ? t("common.saving") : t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
