// ============================================================
// MODAL: CancelTerminateModal - Annulation résiliation
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { allDomService } from "../../../../services/web-cloud.alldom";

interface Props {
  serviceName: string;
  serviceId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export function CancelTerminateModal({ serviceName, serviceId, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/alldom/index");
  const { t: tCommon } = useTranslation("common");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      await allDomService.updateTermination(serviceId, "empty");
      onSuccess();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("cancelTerminate.title", { serviceName })}</h3>
          <button className="btn-icon" onClick={onClose}><CloseIcon /></button>
        </div>

        <div className="modal-body">
          {error && <div className="error-banner">{error}</div>}
          <p>{t("cancelTerminate.message", { serviceName })}</p>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>{tCommon("actions.cancel")}</button>
          <button className="btn-primary" onClick={handleConfirm} disabled={loading}>
            {loading ? tCommon("loading") : t("cancelTerminate.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
