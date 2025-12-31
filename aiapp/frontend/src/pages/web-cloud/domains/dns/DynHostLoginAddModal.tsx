// ============================================================
// MODAL: DynHostLoginAddModal - Ajouter un login DynHost
// Basé sur target SVG modal-dynhost-login-add.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { dynHostService } from "./dynhost/DynHostTab.service";

interface Props {
  zoneName: string;
  onClose: () => void;
  onSuccess: () => void;
}

// ============ ICONS ============

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// ============ COMPOSANT ============

export function DynHostLoginAddModal({ zoneName, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/dynhost");
  const [formData, setFormData] = useState({
    login: "",
    subDomain: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError(t("modals.loginAdd.passwordMismatch"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await dynHostService.createLogin(zoneName, {
        login: formData.login,
        subDomain: formData.subDomain,
        password: formData.password,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.login && formData.password && formData.password === formData.confirmPassword;

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header dom-modal-header-blue">
          <h3>{t("modals.loginAdd.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          <div className="dom-modal-info-banner">
            {t("modals.loginAdd.info")}
          </div>

          <div className="dom-modal-form">
            <div className="dom-modal-field">
              <label>{t("modals.loginAdd.login")} *</label>
              <div className="dom-modal-input-suffix">
                <input
                  type="text"
                  value={formData.login}
                  onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                  placeholder="mylogin"
                />
                <span>.{zoneName}</span>
              </div>
            </div>

            <div className="dom-modal-field">
              <label>{t("modals.loginAdd.subDomain")}</label>
              <div className="dom-modal-input-suffix">
                <input
                  type="text"
                  value={formData.subDomain}
                  onChange={(e) => setFormData({ ...formData, subDomain: e.target.value })}
                  placeholder="*"
                />
                <span>.{zoneName}</span>
              </div>
              <small>{t("modals.loginAdd.subDomainHelp")}</small>
            </div>

            <div className="dom-modal-field">
              <label>{t("modals.loginAdd.password")} *</label>
              <div className="dom-modal-input-password">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="dom-modal-field">
              <label>{t("modals.loginAdd.confirmPassword")} *</label>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          {error && <div className="dom-modal-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="dom-modal-footer">
          <button className="dom-btn-secondary" onClick={onClose} disabled={loading}>
            {t("actions.cancel")}
          </button>
          <button className="dom-btn-primary" onClick={handleSubmit} disabled={loading || !isValid}>
            {loading ? "..." : t("actions.validate")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DynHostLoginAddModal;
