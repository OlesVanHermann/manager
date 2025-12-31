// ============================================================
// MODAL: DynHostAddModal - Ajouter un enregistrement DynHost
// Basé sur target SVG modal.dynhost-add.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { dynHostService } from "./dynhost/DynHostTab.service";

interface Props {
  zoneName: string;
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

export function DynHostAddModal({ zoneName, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/dynhost");
  const [formData, setFormData] = useState({
    subDomain: "",
    ip: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await dynHostService.createRecord(zoneName, {
        subDomain: formData.subDomain,
        ip: formData.ip,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.ip.trim();

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header dom-modal-header-blue">
          <h3>{t("modals.add.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          <p className="dom-modal-description">
            {t("modals.add.description")}
          </p>

          <div className="dom-modal-required-note">
            * {t("modals.add.requiredFields")}
          </div>

          <div className="dom-modal-form">
            <div className="dom-modal-field">
              <label>{t("modals.add.subDomain")}</label>
              <div className="dom-modal-input-suffix">
                <input
                  type="text"
                  value={formData.subDomain}
                  onChange={(e) => setFormData({ ...formData, subDomain: e.target.value })}
                  placeholder="www"
                />
                <span>.{zoneName}</span>
              </div>
            </div>

            <div className="dom-modal-field">
              <label>{t("modals.add.ip")} *</label>
              <input
                type="text"
                value={formData.ip}
                onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                placeholder="192.168.1.1"
              />
            </div>
          </div>

          {error && <div className="dom-modal-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="dom-modal-footer">
          <button className="dom-btn-secondary" onClick={onClose} disabled={loading}>
            {t("actions.cancel")}
          </button>
          <button className="dom-btn-primary" onClick={handleSubmit} disabled={loading || !isValid}>
            {loading ? "..." : t("actions.validate")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DynHostAddModal;
