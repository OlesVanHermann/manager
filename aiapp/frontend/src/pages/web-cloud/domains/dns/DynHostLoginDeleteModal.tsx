// ============================================================
// MODAL: DynHost Login Delete - Supprimer un login DynHost
// Ref: target_.web-cloud.domain.modal-dynhost-login-delete.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { dynHostService } from "./dynhost/DynHostTab.service";

interface Props {
  zoneName: string;
  login: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export function DynHostLoginDeleteModal({ zoneName, login, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/dynhost");
  const { t: tCommon } = useTranslation("common");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      await dynHostService.deleteLogin(zoneName, login);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dynhost-modal-overlay" onClick={onClose}>
      <div className="dynhost-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="dynhost-modal-header">
          <h3>{t("modals.loginDelete.title")}</h3>
          <button className="dynhost-btn-icon" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="dynhost-modal-body">
          <p>{t("modals.loginDelete.confirm", { login })}</p>
          <div className="dynhost-warning-banner">
            <WarningIcon />
            <span>{t("modals.loginDelete.warning")}</span>
          </div>
          <div className="dynhost-delete-preview">
            <strong>{t("modals.loginDelete.login")}:</strong> {login}
          </div>
          {error && <div className="dynhost-form-error">{error}</div>}
        </div>
        <div className="dynhost-modal-footer">
          <button className="dynhost-btn-secondary" onClick={onClose}>{tCommon("actions.cancel")}</button>
          <button className="dynhost-btn-danger" onClick={handleDelete} disabled={loading}>
            {loading ? tCommon("loading") : tCommon("actions.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DynHostLoginDeleteModal;
