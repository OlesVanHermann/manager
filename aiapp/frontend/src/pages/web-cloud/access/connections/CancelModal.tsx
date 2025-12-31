// ============================================================
// CANCEL MODAL - Résilier une connexion
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import { connectionsService } from "./connections.service";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionId: string;
  connectionName: string;
  onSuccess: () => void;
}

export function CancelModal({ isOpen, onClose, connectionId, connectionName, onSuccess }: CancelModalProps) {
  const { t } = useTranslation("web-cloud/access/modals");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfirmed = confirmText === "RESILIER";

  const handleSubmit = async () => {
    if (!isConfirmed) return;
    try {
      setLoading(true);
      setError(null);
      await connectionsService.cancelConnection(connectionId);
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("cancel.title")}
      size="medium"
      footer={
        <>
          <button className="conn-modal-btn-secondary" onClick={onClose}>
            {t("cancel.keep")}
          </button>
          <button
            className="conn-modal-btn-danger"
            onClick={handleSubmit}
            disabled={loading || !isConfirmed}
          >
            {loading ? t("processing") : t("cancel.confirm")}
          </button>
        </>
      }
    >
      <div className="conn-cancel-warning">
        <span className="warning-icon">⚠</span>
        <p>{t("cancel.warning")}</p>
      </div>

      <div className="conn-cancel-info">
        <p>{t("cancel.connection")}: <strong>{connectionName}</strong></p>
        <p>{t("cancel.effects")}</p>
        <ul>
          <li>{t("cancel.effect1")}</li>
          <li>{t("cancel.effect2")}</li>
          <li>{t("cancel.effect3")}</li>
        </ul>
      </div>

      <div className="conn-modal-field">
        <label className="conn-modal-label">{t("cancel.confirmLabel")}</label>
        <input
          type="text"
          className="conn-modal-input"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
          placeholder="RESILIER"
        />
        <span className="conn-modal-hint">{t("cancel.confirmHint")}</span>
        {error && <span className="conn-modal-error">{error}</span>}
      </div>
    </Modal>
  );
}
