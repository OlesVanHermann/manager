// ============================================================
// ALERT DELETE MODAL - Supprimer une alerte de ligne
// ============================================================

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import "./Modal.css";

interface AlertInfo {
  id: string;
  type: string;
  lineNumber: string;
}

interface AlertDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: AlertInfo | null;
  onDelete: (alertId: string) => void;
}

export function AlertDeleteModal({ isOpen, onClose, alert, onDelete }: AlertDeleteModalProps) {
  const { t } = useTranslation("web-cloud/access/modals");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!alert) return;
    setIsDeleting(true);
    try {
      await onDelete(alert.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  }, [alert, onDelete, onClose]);

  if (!alert) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("alertDelete.title")}
      size="small"
      footer={
        <>
          <button className="conn-modal-btn conn-modal-btn-outline" onClick={onClose}>
            {t("common.cancel")}
          </button>
          <button
            className="conn-modal-btn conn-modal-btn-danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? t("common.deleting") : t("alertDelete.submit")}
          </button>
        </>
      }
    >
      <div className="conn-modal-delete-content">
        <div className="conn-modal-delete-icon">
          <span>⚠️</span>
        </div>

        <p className="conn-modal-delete-message">
          {t("alertDelete.confirmMessage")}
        </p>

        <div className="conn-modal-delete-info">
          <span className="conn-modal-alert-dot"></span>
          <span>
            {t("alertDelete.alertInfo", { type: alert.type, number: alert.lineNumber })}
          </span>
        </div>
      </div>
    </Modal>
  );
}
