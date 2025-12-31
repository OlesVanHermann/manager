// ============================================================
// MODAL: EditRecordModal - Modifier une entrée DNS
// Basé sur target SVG modal-zone-record-edit.svg
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { zoneService } from "./zone/ZoneTab.service";

interface DnsRecord {
  id: number;
  fieldType: string;
  subDomain: string;
  ttl: number;
  target: string;
  priority?: number;
}

interface Props {
  zoneName: string;
  record: DnsRecord;
  onClose: () => void;
  onSuccess: () => void;
}

// ============ ICONS ============

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

// ============ COMPOSANT ============

export function EditRecordModal({ zoneName, record, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/zone");
  const [formData, setFormData] = useState({
    subDomain: record.subDomain,
    ttl: record.ttl,
    target: record.target,
    priority: record.priority || 10,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      await zoneService.updateRecord(zoneName, record.id, {
        subDomain: formData.subDomain,
        ttl: formData.ttl,
        target: formData.target,
        ...(record.fieldType === "MX" && { priority: formData.priority }),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header">
          <h3>{t("modals.editRecord.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          <div className="dom-modal-record-type">
            <span className={`dom-record-badge type-${record.fieldType.toLowerCase()}`}>
              {record.fieldType}
            </span>
          </div>

          <div className="dom-modal-form">
            <div className="dom-modal-field">
              <label>{t("modals.editRecord.subDomain")}</label>
              <div className="dom-modal-input-suffix">
                <input
                  type="text"
                  value={formData.subDomain}
                  onChange={(e) => setFormData({ ...formData, subDomain: e.target.value })}
                  placeholder="@"
                />
                <span>.{zoneName}</span>
              </div>
            </div>

            <div className="dom-modal-field">
              <label>{t("modals.editRecord.ttl")}</label>
              <select
                value={formData.ttl}
                onChange={(e) => setFormData({ ...formData, ttl: Number(e.target.value) })}
              >
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
                <option value={3600}>1 heure</option>
                <option value={86400}>1 jour</option>
              </select>
            </div>

            {record.fieldType === "MX" && (
              <div className="dom-modal-field">
                <label>{t("modals.editRecord.priority")}</label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                  min={1}
                  max={65535}
                />
              </div>
            )}

            <div className="dom-modal-field">
              <label>{t("modals.editRecord.target")}</label>
              <input
                type="text"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              />
            </div>
          </div>

          {error && <div className="dom-modal-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="dom-modal-footer">
          <button className="dom-btn-secondary" onClick={onClose} disabled={saving}>
            {t("actions.cancel")}
          </button>
          <button className="dom-btn-primary" onClick={handleSubmit} disabled={saving || !formData.target}>
            {saving ? "..." : t("actions.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditRecordModal;
