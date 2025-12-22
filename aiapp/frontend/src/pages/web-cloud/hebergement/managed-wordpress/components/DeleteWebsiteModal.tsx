// ============================================================
// MODAL: Supprimer un site WordPress
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { managedWordPressService } from "../../../../../services/web-cloud.managed-wordpress";

interface Website {
  id: string;
  domain: string;
}

interface Props {
  serviceName: string;
  website: Website;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteWebsiteModal({ serviceName, website, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/managed-wordpress/index");
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isConfirmed = confirmText === "SUPPRIMER";

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setLoading(true);
    setError(null);
    try {
      await managedWordPressService.deleteWebsite(serviceName, website.id);
      onSuccess();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("delete.title")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && (
            <div className="info-banner error">
              <span className="info-icon">❌</span>
              <span>{error}</span>
            </div>
          )}

          <div className="info-banner warning">
            <span className="info-icon">⚠️</span>
            <span>{t("delete.warning")}</span>
          </div>

          <p>{t("delete.confirm", { domain: website.domain })}</p>
          
          <div className="form-group">
            <label>{t("delete.typeConfirm")}</label>
            <input
              type="text"
              className="form-input"
              placeholder="SUPPRIMER"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t("common.cancel")}</button>
          <button 
            className="btn btn-danger" 
            onClick={handleDelete} 
            disabled={loading || !isConfirmed}
          >
            {loading ? t("common.deleting") : t("delete.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteWebsiteModal;
