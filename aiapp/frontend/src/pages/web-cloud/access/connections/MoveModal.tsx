// ============================================================
// MOVE MODAL - Déménager une connexion
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import { connectionsService } from "./connections.service";

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionId: string;
  onSuccess: () => void;
}

export function MoveModal({ isOpen, onClose, connectionId, onSuccess }: MoveModalProps) {
  const { t } = useTranslation("web-cloud/access/modals");

  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [building, setBuilding] = useState("");
  const [stair, setStair] = useState("");
  const [floor, setFloor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!street || !zipCode || !city) {
      setError(t("move.errorRequired"));
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await connectionsService.moveConnection(connectionId, {
        street,
        zipCode,
        city,
        building,
        stair,
        floor,
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
      title={t("move.title")}
      size="large"
      footer={
        <>
          <button className="conn-modal-btn-secondary" onClick={onClose}>
            {t("cancel")}
          </button>
          <button className="conn-modal-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? t("processing") : t("move.submit")}
          </button>
        </>
      }
    >
      <p className="conn-modal-description">{t("move.description")}</p>

      <div className="conn-modal-field">
        <label className="conn-modal-label">{t("move.street")} *</label>
        <input
          type="text"
          className="conn-modal-input"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder={t("move.streetPlaceholder")}
        />
      </div>

      <div className="conn-modal-row">
        <div className="conn-modal-field">
          <label className="conn-modal-label">{t("move.zipCode")} *</label>
          <input
            type="text"
            className="conn-modal-input"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="75001"
          />
        </div>
        <div className="conn-modal-field">
          <label className="conn-modal-label">{t("move.city")} *</label>
          <input
            type="text"
            className="conn-modal-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Paris"
          />
        </div>
      </div>

      <div className="conn-modal-row">
        <div className="conn-modal-field">
          <label className="conn-modal-label">{t("move.building")}</label>
          <input
            type="text"
            className="conn-modal-input"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            placeholder={t("move.buildingPlaceholder")}
          />
        </div>
        <div className="conn-modal-field">
          <label className="conn-modal-label">{t("move.stair")}</label>
          <input
            type="text"
            className="conn-modal-input"
            value={stair}
            onChange={(e) => setStair(e.target.value)}
            placeholder="A"
          />
        </div>
      </div>

      <div className="conn-modal-field">
        <label className="conn-modal-label">{t("move.floor")}</label>
        <input
          type="text"
          className="conn-modal-input"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          placeholder="3"
        />
      </div>

      <div className="conn-move-info">
        <span className="info-icon">ℹ</span>
        <p>{t("move.info")}</p>
      </div>

      {error && <span className="conn-modal-error">{error}</span>}
    </Modal>
  );
}
