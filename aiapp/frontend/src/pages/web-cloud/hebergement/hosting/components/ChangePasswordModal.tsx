// ============================================================
// MODAL: Change FTP/SSH Password
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  login: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Modal pour changer le mot de passe d'un utilisateur FTP/SSH. */
export function ChangePasswordModal({ serviceName, login, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- VALIDATION ----------
  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 9) errors.push("Minimum 9 caractères");
    if (pwd.length > 30) errors.push("Maximum 30 caractères");
    if (!/[0-9]/.test(pwd)) errors.push("Au moins 1 chiffre");
    if (!/[a-z]/.test(pwd)) errors.push("Au moins 1 minuscule");
    if (!/[A-Z]/.test(pwd)) errors.push("Au moins 1 majuscule");
    if (!/^[a-zA-Z0-9]+$/.test(pwd)) errors.push("Alphanumérique uniquement");
    return errors;
  };

  const passwordErrors = validatePassword(password);
  const isValid = password.length > 0 && passwordErrors.length === 0 && password === confirmPassword;

  // ---------- HANDLERS ----------
  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError(null);
    try {
      await hostingService.changeFtpUserPassword(serviceName, login, password);
      onSuccess();
      onClose();
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setConfirmPassword("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  // ---------- RENDER ----------
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("ftp.changePassword")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <p className="modal-info">
            Modification du mot de passe pour <strong>{login}</strong>
          </p>

          <div className="form-group">
            <label>{t("ftp.newPassword")} *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              autoComplete="new-password"
            />
            {password && passwordErrors.length > 0 && (
              <ul className="validation-errors">
                {passwordErrors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label>{t("ftp.confirmPassword")} *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe"
              autoComplete="new-password"
            />
            {confirmPassword && password !== confirmPassword && (
              <span className="field-error">Les mots de passe ne correspondent pas</span>
            )}
          </div>

          <div className="password-rules">
            <small>
              Le mot de passe doit contenir entre 9 et 30 caractères alphanumériques,
              avec au moins 1 majuscule, 1 minuscule et 1 chiffre.
            </small>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose} disabled={loading}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!isValid || loading}>
            {loading ? "Modification..." : "Modifier"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
