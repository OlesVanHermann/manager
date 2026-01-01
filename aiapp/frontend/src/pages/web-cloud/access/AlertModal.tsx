// ============================================================
// ALERT MODAL - Ajouter/Modifier une alerte ligne
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import { connectionsService } from "./general/connections.service";
import type { LineAlert } from "./general/connections.types";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionId: string;
  alert?: LineAlert;
  onSuccess: () => void;
}

export function AlertModal({ isOpen, onClose, connectionId, alert, onSuccess }: AlertModalProps) {
  const { t } = useTranslation("web-cloud/access/modals");
  const isEdit = !!alert;

  const [type, setType] = useState<LineAlert["type"]>("disconnection");
  const [channel, setChannel] = useState<LineAlert["channel"]>("email");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (alert) {
      setType(alert.type);
      setChannel(alert.channel);
      setRecipient(alert.recipient);
    } else {
      setType("disconnection");
      setChannel("email");
      setRecipient("");
    }
  }, [alert, isOpen]);

  const handleSubmit = async () => {
    if (!recipient) {
      setError(t("alert.errorRecipient"));
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await connectionsService.addLineAlert(connectionId, {
        type,
        channel,
        recipient,
        active: true,
      });
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
      title={isEdit ? t("alert.titleEdit") : t("alert.titleAdd")}
      size="medium"
      footer={
        <>
          <button className="conn-modal-btn-secondary" onClick={onClose}>
            {t("cancel")}
          </button>
          <button className="conn-modal-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? t("saving") : t("save")}
          </button>
        </>
      }
    >
      <div className="conn-modal-field">
        <label className="conn-modal-label">{t("alert.type")}</label>
        <select
          className="conn-modal-select"
          value={type}
          onChange={(e) => setType(e.target.value as LineAlert["type"])}
        >
          <option value="disconnection">{t("alert.types.disconnection")}</option>
          <option value="sync">{t("alert.types.sync")}</option>
          <option value="speed-drop">{t("alert.types.speedDrop")}</option>
          <option value="errors">{t("alert.types.errors")}</option>
        </select>
      </div>

      <div className="conn-modal-field">
        <label className="conn-modal-label">{t("alert.channel")}</label>
        <select
          className="conn-modal-select"
          value={channel}
          onChange={(e) => setChannel(e.target.value as LineAlert["channel"])}
        >
          <option value="email">{t("alert.channels.email")}</option>
          <option value="sms">{t("alert.channels.sms")}</option>
          <option value="both">{t("alert.channels.both")}</option>
        </select>
      </div>

      <div className="conn-modal-field">
        <label className="conn-modal-label">{t("alert.recipient")}</label>
        <input
          type="text"
          className="conn-modal-input"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder={channel === "sms" ? "+33612345678" : "email@example.com"}
        />
        <span className="conn-modal-hint">
          {channel === "email" && t("alert.hintEmail")}
          {channel === "sms" && t("alert.hintSms")}
          {channel === "both" && t("alert.hintBoth")}
        </span>
      </div>

      {error && <span className="conn-modal-error">{error}</span>}
    </Modal>
  );
}
