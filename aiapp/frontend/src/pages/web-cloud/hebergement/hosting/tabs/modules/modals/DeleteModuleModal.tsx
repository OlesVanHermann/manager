// ============================================================
// DELETE MODULE MODAL
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  moduleName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteModuleModal({ moduleName, isOpen, onClose, onConfirm }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.modules");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("modals.delete.title")}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>{t("modals.delete.confirm", { name: moduleName })}</p>
          <p className="modal-warning">{t("modals.delete.warning")}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            {t("common.cancel")}
          </button>
          <button className="btn btn-danger" onClick={handleConfirm} disabled={loading}>
            {loading ? t("modals.delete.deleting") : t("common.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModuleModal;
