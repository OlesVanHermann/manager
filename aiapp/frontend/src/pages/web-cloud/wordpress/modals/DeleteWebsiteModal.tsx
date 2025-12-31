// ============================================================
// MODAL: Delete Website - WordPress
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../../services/api";
import './Modals.css';

interface Props {
  serviceName: string;
  websiteId: string;
  websiteName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BASE_PATH = "/managedCMS/resource";
const API_OPTIONS = { apiVersion: "v2" };

export function DeleteWebsiteModal({ serviceName, websiteId, websiteName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/wordpress/index");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText !== websiteName) {
      setError(t("website.deleteConfirmMismatch"));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await apiClient.delete(`${BASE_PATH}/${serviceName}/website/${websiteId}`, API_OPTIONS);
      onSuccess();
      setConfirmText("");
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("website.deleteTitle")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">{error}</div>}
            
            <div className="alert alert-warning">
              <strong>⚠️ {t("website.deleteWarning")}</strong>
              <p>{t("website.deleteWarningDesc")}</p>
            </div>

            <div className="form-group">
              <label>{t("website.deleteConfirmLabel", { name: websiteName })}</label>
              <input
                type="text"
                className="form-input"
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder={websiteName}
              />
              <span className="form-hint">{t("website.deleteConfirmHint")}</span>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="modal-btn modal-btn-secondary" onClick={onClose}>{t("common.cancel")}</button>
            <button type="submit" className="modal-btn modal-btn-danger" disabled={loading || confirmText !== websiteName}>
              {loading ? t("common.deleting") : t("website.delete")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteWebsiteModal;
