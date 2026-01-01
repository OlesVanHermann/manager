// ============================================================
// MODAL: Delete Website - WordPress
// Aligné sur OLD_MANAGER: DELETE /managedCMS/resource/{serviceName}/website/{websiteId}
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { wordpressApi } from "./wordpress.api";
import './Modals.css';

interface Props {
  serviceName: string;
  websiteId: string;
  websiteName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteWebsiteModal({
  serviceName,
  websiteId,
  websiteName,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const { t } = useTranslation("web-cloud/wordpress/index");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText !== websiteName) {
      setError(t("website.deleteConfirmMismatch") || "Le nom ne correspond pas");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Appel API aligné sur OLD_MANAGER
      await wordpressApi.deleteWebsite(serviceName, websiteId);
      onSuccess();
      setConfirmText("");
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmText("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("website.deleteTitle") || "Supprimer le site"}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="modal-error">{error}</div>}

            <div className="modal-warning">
              <span className="modal-warning-icon">⚠️</span>
              <div>
                <strong>{t("website.deleteWarning") || "Attention"}</strong>
                <p>{t("website.deleteWarningDesc") || "Cette action est irréversible. Toutes les données du site seront supprimées."}</p>
              </div>
            </div>

            <div className="form-group">
              <label>
                {t("website.deleteConfirmLabel", { name: websiteName }) ||
                  `Pour confirmer, tapez "${websiteName}"`}
              </label>
              <input
                type="text"
                className="form-input"
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder={websiteName}
                autoComplete="off"
              />
              <span className="form-hint">
                {t("website.deleteConfirmHint") || "Entrez le nom exact du site pour confirmer"}
              </span>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="modal-btn modal-btn-secondary"
              onClick={handleClose}
            >
              {t("common.cancel") || "Annuler"}
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-danger"
              disabled={loading || confirmText !== websiteName}
            >
              {loading ? "..." : (t("website.delete") || "Supprimer")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteWebsiteModal;
