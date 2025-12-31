// ============================================================
// MODAL: ContactEditModal - Modifier les informations du contact
// Basé sur target SVG modal-contact-edit.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { contactsService } from "./contacts/ContactsTab.service";

interface ContactDetails {
  firstName: string;
  lastName: string;
  address: string;
  zip: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  companyName?: string;
  vat?: string;
}

interface Props {
  domain: string;
  contactType: "owner" | "admin" | "tech" | "billing";
  contact: ContactDetails;
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

export function ContactEditModal({ domain, contactType, contact, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/domains/contacts");
  const [formData, setFormData] = useState<ContactDetails>({ ...contact });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await contactsService.updateContact(domain, contactType, formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.address.trim() &&
    formData.zip.trim() &&
    formData.city.trim() &&
    formData.country.trim() &&
    formData.email.trim();

  const updateField = (field: keyof ContactDetails, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal dom-modal-large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header">
          <h3>{t("modals.edit.title")}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          <div className="dom-modal-form">
            {/* Section Identité */}
            <div className="dom-modal-section">
              <h4 className="dom-modal-section-title">{t("modals.edit.identity")}</h4>
              <div className="dom-modal-row">
                <div className="dom-modal-field dom-modal-field-half">
                  <label>{t("modals.edit.firstName")} *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                  />
                </div>
                <div className="dom-modal-field dom-modal-field-half">
                  <label>{t("modals.edit.lastName")} *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section Adresse */}
            <div className="dom-modal-section">
              <h4 className="dom-modal-section-title">{t("modals.edit.addressSection")}</h4>
              <div className="dom-modal-field">
                <label>{t("modals.edit.address")} *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />
              </div>
              <div className="dom-modal-row">
                <div className="dom-modal-field dom-modal-field-third">
                  <label>{t("modals.edit.zip")} *</label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => updateField("zip", e.target.value)}
                  />
                </div>
                <div className="dom-modal-field dom-modal-field-third">
                  <label>{t("modals.edit.city")} *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                  />
                </div>
                <div className="dom-modal-field dom-modal-field-third">
                  <label>{t("modals.edit.country")} *</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section Contact */}
            <div className="dom-modal-section">
              <h4 className="dom-modal-section-title">{t("modals.edit.contactSection")}</h4>
              <div className="dom-modal-row">
                <div className="dom-modal-field dom-modal-field-half">
                  <label>{t("modals.edit.email")} *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>
                <div className="dom-modal-field dom-modal-field-half">
                  <label>{t("modals.edit.phone")}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>
            </div>

            {/* Section Organisation (optionnel) */}
            <div className="dom-modal-section">
              <h4 className="dom-modal-section-title">{t("modals.edit.organization")}</h4>
              <div className="dom-modal-row">
                <div className="dom-modal-field dom-modal-field-half">
                  <label>{t("modals.edit.companyName")}</label>
                  <input
                    type="text"
                    value={formData.companyName || ""}
                    onChange={(e) => updateField("companyName", e.target.value)}
                  />
                </div>
                <div className="dom-modal-field dom-modal-field-half">
                  <label>{t("modals.edit.vat")}</label>
                  <input
                    type="text"
                    value={formData.vat || ""}
                    onChange={(e) => updateField("vat", e.target.value)}
                    placeholder="FR12345678901"
                  />
                </div>
              </div>
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
            {loading ? "..." : t("actions.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactEditModal;
