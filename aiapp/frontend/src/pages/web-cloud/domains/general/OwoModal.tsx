// ============================================================
// MODAL: OwoModal - Protection Whois (OwO)
// Basé sur target SVG modal-owo.svg
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { generalService } from "./GeneralTab.service";

interface Props {
  domain: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface OwoField {
  field: string;
  obfuscated: boolean;
}

// ============ ICONS ============

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// ============ COMPOSANT ============

export function OwoModal({ domain, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<OwoField[]>([]);

  // Default OWO fields
  const owoFields = ["address", "email", "phone"];

  useEffect(() => {
    const loadOwo = async () => {
      try {
        const status = await generalService.getOwoStatus(domain);
        setFields(owoFields.map((field) => ({
          field,
          obfuscated: status?.[field] ?? true,
        })));
      } catch {
        setFields(owoFields.map((field) => ({ field, obfuscated: true })));
      } finally {
        setLoading(false);
      }
    };
    loadOwo();
  }, [domain]);

  const toggleField = (fieldName: string) => {
    setFields((prev) =>
      prev.map((f) => (f.field === fieldName ? { ...f, obfuscated: !f.obfuscated } : f))
    );
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const owoData: Record<string, boolean> = {};
      fields.forEach((f) => {
        owoData[f.field] = f.obfuscated;
      });
      await generalService.updateOwo(domain, owoData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      address: t("modals.owo.fieldAddress"),
      email: t("modals.owo.fieldEmail"),
      phone: t("modals.owo.fieldPhone"),
    };
    return labels[field] || field;
  };

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header">
          <h3>{t("modals.owo.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          <div className="dom-modal-domain">{domain}</div>

          <div className="dom-modal-info-banner">
            {t("modals.owo.info")}
          </div>

          {loading ? (
            <div className="dom-modal-loading">{t("common.loading")}</div>
          ) : (
            <div className="dom-modal-owo-fields">
              {fields.map((field) => (
                <div key={field.field} className="dom-modal-owo-field" onClick={() => toggleField(field.field)}>
                  <div className="dom-modal-owo-icon">
                    {field.obfuscated ? <EyeOffIcon /> : <EyeIcon />}
                  </div>
                  <div className="dom-modal-owo-label">{getFieldLabel(field.field)}</div>
                  <div className={`dom-modal-owo-status ${field.obfuscated ? "hidden" : "visible"}`}>
                    {field.obfuscated ? t("modals.owo.hidden") : t("modals.owo.visible")}
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && <div className="dom-modal-error">{error}</div>}
        </div>

        {/* Footer */}
        <div className="dom-modal-footer">
          <button className="dom-btn-secondary" onClick={onClose} disabled={saving}>
            {t("actions.cancel")}
          </button>
          <button className="dom-btn-primary" onClick={handleSubmit} disabled={saving || loading}>
            {saving ? "..." : t("actions.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OwoModal;
