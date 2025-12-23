// ============================================================
// TERMINATE MODAL - Résiliation hébergement
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../services/web-cloud.hosting";

interface TerminateModalProps {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TerminateModal({ serviceName, isOpen, onClose, onSuccess }: TerminateModalProps) {
  const { t } = useTranslation("web-cloud/hosting/modals/terminate");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTerminate = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await hostingService.terminateHosting(serviceName);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("[TerminateModal] Error:", err);
      setError(t("error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-danger" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("title")}</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="alert alert-warning">
            <strong>⚠️ {t("warningTitle")}</strong>
            <p>{t("warning")}</p>
          </div>
          <p>{t("description1")}</p>
          <p>{t("question")}</p>
          {error && <div className="alert alert-error mt-3">{error}</div>}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {t("cancel")}
          </button>
          <button 
            className="btn btn-danger"
            onClick={handleTerminate}
            disabled={submitting}
          >
            {submitting ? t("terminating") : t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TerminateModal;
