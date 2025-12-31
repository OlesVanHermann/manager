// ============================================================
// MODAL: DynHostDeleteModal - Supprimer un enregistrement DynHost
// Basé sur target SVG modal-dynhost-delete.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { dynHostService } from "./dynhost/DynHostTab.service";

interface DynHostRecord {
  id: number;
  subDomain: string;
  ip: string;
}

interface Props {
  zoneName: string;
  record: DynHostRecord;
  onClose: () => void;
  onSuccess: () => void;
}

// ============ ICONS ============

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// ============ COMPOSANT ============

export function DynHostDeleteModal({ zoneName, record, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/dynhost");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await dynHostService.deleteRecord(zoneName, record.id);
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const displayName = record.subDomain ? `${record.subDomain}.${zoneName}` : zoneName;

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header dom-modal-header-danger">
          <h3>{t("modals.delete.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content dom-modal-content-center">
          <WarningIcon />

          <p className="dom-modal-confirm-text">
            {t("modals.delete.confirm")}
          </p>

          <div className="dom-modal-record-preview">
            <span className="dom-modal-record-name">{displayName}</span>
            <span className="dom-modal-record-target">→ {record.ip}</span>
          </div>

          {error && <div className="dom-modal-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="dom-modal-footer">
          <button className="dom-btn-secondary" onClick={onClose} disabled={loading}>
            {t("actions.cancel")}
          </button>
          <button className="dom-btn-danger" onClick={handleDelete} disabled={loading}>
            {loading ? "..." : t("actions.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DynHostDeleteModal;
