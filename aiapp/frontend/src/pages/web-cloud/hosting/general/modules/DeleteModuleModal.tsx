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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modules-modal-overlay" onClick={onClose}>
      <div className="modules-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modules-modal-header">
          <h2>{t("modals.delete.title")}</h2>
          <button className="modules-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modules-modal-body">
          <p>{t("modals.delete.confirm", { name: moduleName })}</p>
          <p className="modules-modal-warning">{t("modals.delete.warning")}</p>
        </div>
        <div className="modules-modal-footer">
          <button className="wh-modal-btn-secondary" onClick={onClose} disabled={loading}>
            {t("common.cancel")}
          </button>
          <button className="wh-modal-btn-danger" onClick={handleConfirm} disabled={loading}>
            {loading ? t("modals.delete.deleting") : t("common.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModuleModal;
