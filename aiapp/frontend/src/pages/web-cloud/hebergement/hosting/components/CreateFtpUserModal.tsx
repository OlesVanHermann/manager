// ============================================================
// MODAL: Créer un utilisateur FTP
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Modal de création d'utilisateur FTP/SSH. */
export function CreateFtpUserModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");

  // ---------- STATE ----------
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [home, setHome] = useState("/");
  const [sshEnabled, setSshEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // ---------- VALIDATION ----------
  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 9) return t("createFtp.errorPwdMin");
    if (pwd.length > 30) return t("createFtp.errorPwdMax");
    if (!/[0-9]/.test(pwd)) return t("createFtp.errorPwdDigit");
    if (!/[a-z]/.test(pwd)) return t("createFtp.errorPwdLower");
    if (!/[A-Z]/.test(pwd)) return t("createFtp.errorPwdUpper");
    if (!/^[a-zA-Z0-9]+$/.test(pwd)) return t("createFtp.errorPwdAlpha");
    return null;
  };

  const validatePath = (path: string): boolean => {
    return /^[\w./-]*$/.test(path) && !/\.\./.test(path);
  };

  // ---------- HANDLERS ----------
  const handleClose = () => {
    setLogin("");
    setPassword("");
    setConfirmPassword("");
    setHome("/");
    setSshEnabled(false);
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!login.trim()) {
      setError(t("createFtp.errorLoginRequired"));
      return;
    }
    if (login.length < 2) {
      setError(t("createFtp.errorLoginMin"));
      return;
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }
    if (password !== confirmPassword) {
      setError(t("createFtp.errorPwdMatch"));
      return;
    }
    if (!validatePath(home)) {
      setError(t("createFtp.errorPathInvalid"));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await hostingService.createFtpUser(serviceName, {
        login: login.trim(),
        password,
        home: home || "/",
        sshState: sshEnabled ? "active" : "none",
      });
      onSuccess();
      handleClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("createFtp.title")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label>{t("createFtp.loginLabel")}</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="user"
              className="form-input"
              maxLength={16}
              autoFocus
            />
            <span className="form-hint">{t("createFtp.loginHint")}</span>
          </div>

          <div className="form-group">
            <label>{t("createFtp.homeLabel")}</label>
            <input
              type="text"
              value={home}
              onChange={(e) => setHome(e.target.value)}
              placeholder="/"
              className="form-input font-mono"
            />
            <span className="form-hint">{t("createFtp.homeHint")}</span>
          </div>

          <div className="form-group">
            <label>{t("createFtp.passwordLabel")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
            <span className="form-hint">{t("createFtp.passwordHint")}</span>
          </div>

          <div className="form-group">
            <label>{t("createFtp.confirmLabel")}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="option-item" style={{ marginBottom: 0 }}>
              <input
                type="checkbox"
                checked={sshEnabled}
                onChange={(e) => setSshEnabled(e.target.checked)}
              />
              <div className="option-text">
                <span className="option-label">{t("createFtp.sshLabel")}</span>
                <span className="option-desc">{t("createFtp.sshHint")}</span>
              </div>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <div></div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={handleClose} disabled={loading}>
              {t("createFtp.cancel")}
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? t("createFtp.creating") : t("createFtp.confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateFtpUserModal;
