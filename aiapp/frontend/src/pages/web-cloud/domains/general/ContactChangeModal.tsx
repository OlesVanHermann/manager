// ============================================================
// MODAL: ContactChangeModal - Changer le contact (NIC Handle)
// Basé sur target SVG modal.contacts.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { contactsService } from "./contacts/ContactsTab.service";

interface Props {
  domain: string;
  contactType: "admin" | "tech" | "billing";
  currentNic: string;
  currentName?: string;
  currentEmail?: string;
  onClose: () => void;
  onSuccess: () => void;
}

// ============ ICONS ============

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

// ============ COMPOSANT ============

export function ContactChangeModal({
  domain,
  contactType,
  currentNic,
  currentName,
  currentEmail,
  onClose,
  onSuccess
}: Props) {
  const { t } = useTranslation("web-cloud/domains/contacts");
  const [newNic, setNewNic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await contactsService.changeContact(domain, contactType, newNic);
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const getContactTypeLabel = () => {
    switch (contactType) {
      case "admin": return t("types.admin");
      case "tech": return t("types.tech");
      case "billing": return t("types.billing");
      default: return contactType;
    }
  };

  const isValid = newNic.trim() && newNic !== currentNic;

  return (
    <div className="dom-modal-overlay" onClick={onClose}>
      <div className="dom-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dom-modal-header dom-modal-header-gray">
          <h3>{t("modals.change.title", { type: getContactTypeLabel() })}</h3>
          <button className="dom-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="dom-modal-content">
          {/* Contact actuel */}
          <div className="dom-modal-current-contact">
            <label>{t("modals.change.currentContact")}</label>
            <div className="dom-modal-contact-card">
              <div className="dom-modal-contact-icon">
                <UserIcon />
              </div>
              <div className="dom-modal-contact-info">
                <div className="dom-modal-contact-nic">{currentNic}</div>
                {currentName && <div className="dom-modal-contact-name">{currentName}</div>}
                {currentEmail && <div className="dom-modal-contact-email">{currentEmail}</div>}
              </div>
            </div>
          </div>

          <div className="dom-modal-form">
            <div className="dom-modal-field">
              <label>{t("modals.change.newNic")}</label>
              <input
                type="text"
                value={newNic}
                onChange={(e) => setNewNic(e.target.value)}
                placeholder="ab12345-ovh"
              />
            </div>

            <div className="dom-modal-divider">
              <span>{t("modals.change.or")}</span>
            </div>

            <button
              type="button"
              className="dom-btn-secondary dom-btn-full"
              onClick={() => window.open("https://www.ovh.com/manager/#/dedicated/contacts/new", "_blank")}
            >
              <PlusIcon /> {t("modals.change.createNewContact")}
            </button>
          </div>

          {/* Info banner */}
          <div className="dom-modal-info-banner">
            <InfoIcon />
            <p>{t("modals.change.validationInfo")}</p>
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

export default ContactChangeModal;
