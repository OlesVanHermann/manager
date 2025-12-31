import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateEnvvarModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.envvars");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
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
          <h2>{t("modal.create.title")}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>{t("modal.create.description", { serviceName })}</p>
        </div>
        <div className="modal-footer">
          <button className="wh-modal-btn-secondary" onClick={onClose}>{t("modal.cancel")}</button>
          <button className="wh-modal-btn-primary" onClick={handleCreate} disabled={loading}>
            {loading ? "..." : t("modal.create.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateEnvvarModal;
