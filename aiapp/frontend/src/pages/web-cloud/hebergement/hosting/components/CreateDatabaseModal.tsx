// ============================================================
// MODAL: Créer une base de données
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

type DbType = "mysql" | "postgresql";

/** Modal de création de base de données. */
export function CreateDatabaseModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");

  // ---------- STATE ----------
  const [dbType, setDbType] = useState<DbType>("mysql");
  const [version, setVersion] = useState("8.0");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mysqlVersions = ["8.0", "5.7"];
  const postgresVersions = ["15", "14", "13"];

  if (!isOpen) return null;

  // ---------- VALIDATION ----------
  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 9) return t("createDb.errorPwdMin");
    if (pwd.length > 30) return t("createDb.errorPwdMax");
    if (!/[0-9]/.test(pwd)) return t("createDb.errorPwdDigit");
    if (!/[a-z]/.test(pwd)) return t("createDb.errorPwdLower");
    if (!/[A-Z]/.test(pwd)) return t("createDb.errorPwdUpper");
    if (!/^[a-zA-Z0-9]+$/.test(pwd)) return t("createDb.errorPwdAlpha");
    return null;
  };

  // ---------- HANDLERS ----------
  const handleClose = () => {
    setUser("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!user.trim()) {
      setError(t("createDb.errorUserRequired"));
      return;
    }
    if (user.length < 3) {
      setError(t("createDb.errorUserMin"));
      return;
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }
    if (password !== confirmPassword) {
      setError(t("createDb.errorPwdMatch"));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await hostingService.createDatabase(serviceName, {
        type: dbType,
        version,
        user: user.trim(),
        password,
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
          <h3>{t("createDb.title")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label>{t("createDb.typeLabel")}</label>
            <div className="radio-group">
              <label className="radio-item">
                <input
                  type="radio"
                  name="dbType"
                  checked={dbType === "mysql"}
                  onChange={() => { setDbType("mysql"); setVersion("8.0"); }}
                />
                <span className="radio-label">MySQL</span>
              </label>
              <label className="radio-item">
                <input
                  type="radio"
                  name="dbType"
                  checked={dbType === "postgresql"}
                  onChange={() => { setDbType("postgresql"); setVersion("15"); }}
                />
                <span className="radio-label">PostgreSQL</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>{t("createDb.versionLabel")}</label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="form-select"
            >
              {(dbType === "mysql" ? mysqlVersions : postgresVersions).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t("createDb.userLabel")}</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="dbuser"
              className="form-input"
              maxLength={16}
            />
            <span className="form-hint">{t("createDb.userHint")}</span>
          </div>

          <div className="form-group">
            <label>{t("createDb.passwordLabel")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
            <span className="form-hint">{t("createDb.passwordHint")}</span>
          </div>

          <div className="form-group">
            <label>{t("createDb.confirmLabel")}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose} disabled={loading}>
            {t("createDb.cancel")}
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? t("createDb.creating") : t("createDb.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateDatabaseModal;
