import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Runtime } from "../../../hosting.types";

interface Props {
  serviceName: string;
  runtime: Runtime;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditRuntimeModal({ serviceName, runtime, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.runtimes");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      onSuccess();
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("modal.edit.title")}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>{t("modal.edit.description", { name: runtime.name || runtime.id })}</p>
        </div>
        <div className="modal-footer">
          <button className="wh-modal-btn-secondary" onClick={onClose}>{t("modal.cancel")}</button>
          <button className="wh-modal-btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? "..." : t("modal.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditRuntimeModal;
