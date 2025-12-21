// ============================================================
// MODAL: Cancel Terminate AllDom - Annulation résiliation
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  serviceName: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

/** Modal d'annulation de résiliation d'un pack AllDom. */
export function CancelTerminateModal({ serviceName, onConfirm, onClose }: Props) {
  const { t } = useTranslation("web-cloud/alldom/index");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } catch (err) {
      alert(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("cancelTerminate.title", { serviceName })}</h2>
          <p>{t("cancelTerminate.subtitle", { serviceName })}</p>
        </div>

        <div className="modal-body">
          <p>{t("cancelTerminate.description")}</p>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            {t("cancelTerminate.cancel")}
          </button>
          <button className="btn-primary" onClick={handleConfirm} disabled={loading}>
            {loading ? "..." : t("cancelTerminate.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
