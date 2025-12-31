// ============================================================
// MODAL: GlueAddModal - Ajouter un enregistrement GLUE
// Basé sur target SVG modal.glue-add.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { glueService } from "./glue/GlueTab.service";

interface Props {
  domain: string;
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

export function GlueAddModal({ domain, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/glue");
  const [formData, setFormData] = useState({
    host: "",
    ips: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const ipsArray = formData.ips.split(",").map((ip) => ip.trim()).filter(Boolean);
      await glueService.createGlue(domain, {
        host: formData.host,
        ips: ipsArray,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.host.trim() && formData.ips.trim();

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header">
          <h3>{t("modals.add.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          <p className="dom-modal-description">
            {t("modals.add.description")}
          </p>

          <div className="dom-modal-info-banner">
            {t("modals.add.info")}
          </div>

          <div className="dom-modal-form">
            <div className="dom-modal-field">
              <label>{t("modals.add.host")} *</label>
              <div className="dom-modal-input-suffix">
                <input
                  type="text"
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  placeholder="ns1"
                />
                <span>.{domain}</span>
              </div>
            </div>

            <div className="dom-modal-field">
              <label>{t("modals.add.ips")} *</label>
              <input
                type="text"
                value={formData.ips}
                onChange={(e) => setFormData({ ...formData, ips: e.target.value })}
                placeholder="203.0.113.10, 2001:db8::1"
              />
              <small>{t("modals.add.ipsHelp")}</small>
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
            {loading ? "..." : t("actions.add")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GlueAddModal;
