// ============================================================
// MODAL: DynHost Login Edit - Modifier un login DynHost
// Ref: target_.web-cloud.domain.modal-dynhost-login-edit.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { dynHostService } from "./dynhost/DynHostTab.service";

interface Props {
  zoneName: string;
  login: string;
  currentSubDomain: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export function DynHostLoginEditModal({ zoneName, login, currentSubDomain, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/dynhost");
  const { t: tCommon } = useTranslation("common");

  const [subDomain, setSubDomain] = useState(currentSubDomain);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    // Validate password if provided
    if (newPassword && newPassword !== confirmPassword) {
      setError(t("modals.loginEdit.errorPasswordMismatch"));
      return;
    }
    if (newPassword && newPassword.length < 8) {
      setError(t("modals.loginEdit.errorPasswordLength"));
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Update subdomain if changed
      if (subDomain !== currentSubDomain) {
        await dynHostService.updateLogin(zoneName, login, { subDomain });
      }

      // Change password if provided
      if (newPassword) {
        await dynHostService.changeLoginPassword(zoneName, login, newPassword);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dynhost-modal-overlay" onClick={onClose}>
      <div className="dynhost-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="dynhost-modal-header">
          <h3>{t("modals.loginEdit.title")}</h3>
          <button className="dynhost-btn-icon" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="dynhost-modal-body">
          <div className="dynhost-form-group">
            <label>{t("modals.loginEdit.login")}</label>
            <input type="text" value={login} disabled className="dynhost-input disabled" />
          </div>
          <div className="dynhost-form-group">
            <label>{t("modals.loginEdit.subDomain")}</label>
            <div className="dynhost-input-with-suffix">
              <input
                type="text"
                value={subDomain}
                onChange={(e) => setSubDomain(e.target.value)}
                placeholder="dyn"
                className="dynhost-input"
              />
              <span className="dynhost-input-suffix">.{zoneName}</span>
            </div>
          </div>
          <hr className="dynhost-divider" />
          <p className="dynhost-hint">{t("modals.loginEdit.passwordHint")}</p>
          <div className="dynhost-form-group">
            <label>{t("modals.loginEdit.newPassword")}</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="dynhost-input"
            />
          </div>
          <div className="dynhost-form-group">
            <label>{t("modals.loginEdit.confirmPassword")}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="dynhost-input"
            />
          </div>
          {error && <div className="dynhost-form-error">{error}</div>}
        </div>
        <div className="dynhost-modal-footer">
          <button className="dynhost-btn-secondary" onClick={onClose}>{tCommon("actions.cancel")}</button>
          <button className="dynhost-btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? tCommon("loading") : tCommon("actions.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DynHostLoginEditModal;
