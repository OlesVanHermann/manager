// ============================================================
// MODAL: Change Password (Database / FTP user)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  login: string;
  type: "database" | "ftp";
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ChangePasswordModal({ serviceName, login, type, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
    if (!/[A-Z]/.test(pwd)) return "Le mot de passe doit contenir au moins une majuscule.";
    if (!/[a-z]/.test(pwd)) return "Le mot de passe doit contenir au moins une minuscule.";
    if (!/[0-9]/.test(pwd)) return "Le mot de passe doit contenir au moins un chiffre.";
    if (!/[^A-Za-z0-9]/.test(pwd)) return "Le mot de passe doit contenir au moins un caractère spécial.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      if (type === "database") {
        await hostingService.changeDatabasePassword(serviceName, login, password);
      } else {
        await hostingService.changeFtpPassword(serviceName, login, password);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*";
    let pwd = "";
    for (let i = 0; i < 16; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pwd);
    setConfirmPassword(pwd);
  };

  const title = type === "database" 
    ? t("database.changePassword") 
    : t("ftp.changePassword");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-banner">{error}</div>}

            <div className="form-group">
              <label className="form-label">
                {type === "database" ? t("database.name") : t("ftp.login")}
              </label>
              <input type="text" className="form-input" value={login} disabled />
            </div>

            <div className="form-group">
              <label className="form-label">{"Nouveau mot de passe"} *</label>
              <div className="input-group">
                <input 
                  type={showPassword ? "text" : "password"}
                  className="form-input" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  className="btn btn-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={generatePassword}
                >
                  🎲 Générer
                </button>
              </div>
              <span className="form-hint">
                Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">{"Confirmer le mot de passe"} *</label>
              <input 
                type={showPassword ? "text" : "password"}
                className="form-input" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="password-strength">
              <div className={`strength-bar ${password.length >= 8 ? "ok" : ""}`} />
              <div className={`strength-bar ${/[A-Z]/.test(password) && /[a-z]/.test(password) ? "ok" : ""}`} />
              <div className={`strength-bar ${/[0-9]/.test(password) ? "ok" : ""}`} />
              <div className={`strength-bar ${/[^A-Za-z0-9]/.test(password) ? "ok" : ""}`} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t("common.loading") : t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
