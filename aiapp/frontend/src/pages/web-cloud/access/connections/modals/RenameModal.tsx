// ============================================================
// RENAME MODAL - Renommer une connexion
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import { connectionsService } from "../connections.service";

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionId: string;
  currentName: string;
  onSuccess: (newName: string) => void;
}

export function RenameModal({ isOpen, onClose, connectionId, currentName, onSuccess }: RenameModalProps) {
  const { t } = useTranslation("web-cloud/access/modals");
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError(t("rename.errorEmpty"));
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await connectionsService.renameConnection(connectionId, name);
      onSuccess(name);
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
      title={t("rename.title")}
      size="small"
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
        <label className="conn-modal-label">{t("rename.label")}</label>
        <input
          type="text"
          className="conn-modal-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("rename.placeholder")}
        />
        {error && <span className="conn-modal-error">{error}</span>}
      </div>
    </Modal>
  );
}
