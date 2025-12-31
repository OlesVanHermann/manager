// ============================================================
// MODAL: GlueEditModal - Modifier un enregistrement GLUE
// Basé sur target SVG modal-glue-edit.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { glueService } from "./glue/GlueTab.service";

interface GlueRecord {
  host: string;
  ips: string[];
}

interface Props {
  domain: string;
  record: GlueRecord;
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

export function GlueEditModal({ domain, record, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/glue");
  const [ips, setIps] = useState(record.ips.join(", "));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const ipsArray = ips.split(",").map((ip) => ip.trim()).filter(Boolean);
      await glueService.updateGlue(domain, record.host, { ips: ipsArray });
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const isValid = ips.trim();

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header">
          <h3>{t("modals.edit.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          <p className="dom-modal-description">
            {t("modals.edit.description")}
          </p>

          <div className="dom-modal-form">
            <div className="dom-modal-field">
              <label>{t("modals.edit.host")}</label>
              <input type="text" value={record.host} disabled className="dom-modal-input-disabled" />
            </div>

            <div className="dom-modal-field">
              <label>{t("modals.edit.ips")} *</label>
              <input
                type="text"
                value={ips}
                onChange={(e) => setIps(e.target.value)}
                placeholder="203.0.113.10, 2001:db8::1"
              />
              <small>{t("modals.edit.ipsHelp")}</small>
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
            {loading ? "..." : t("actions.modify")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GlueEditModal;
