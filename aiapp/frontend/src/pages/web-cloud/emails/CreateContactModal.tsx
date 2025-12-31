// ============================================================
// MODAL - Create Contact (Création de contact externe Exchange)
// Aligné avec target_.web-cloud.emails.modal.create-contact.svg
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { OfferBadge } from "./OfferBadge";

interface CreateContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  onSubmit: (data: CreateContactData) => Promise<void>;
}

interface CreateContactData {
  displayName: string;
  firstName?: string;
  lastName?: string;
  externalEmail: string;
  company?: string;
  phone?: string;
  hideFromGal: boolean;
}

/** Modal de création d'un contact externe (Exchange uniquement). */
export function CreateContactModal({
  isOpen,
  onClose,
  domain,
  onSubmit,
}: CreateContactModalProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [externalEmail, setExternalEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [visibleInGal, setVisibleInGal] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!displayName.trim()) {
      setError(t("createContact.errors.displayNameRequired"));
      return;
    }

    if (!externalEmail.includes("@")) {
      setError(t("createContact.errors.emailInvalid"));
      return;
    }

    // Vérifier que l'email n'est pas du domaine interne
    if (externalEmail.toLowerCase().endsWith(`@${domain.toLowerCase()}`)) {
      setError(t("createContact.errors.emailMustBeExternal"));
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        displayName,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        externalEmail,
        company: company || undefined,
        phone: phone || undefined,
        hideFromGal: !visibleInGal,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("createContact.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDisplayName("");
    setFirstName("");
    setLastName("");
    setExternalEmail("");
    setCompany("");
    setPhone("");
    setVisibleInGal(true);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-icon">👤</span>
          <h2 className="modal-title">{t("createContact.title")}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Exchange only badge */}
            <div className="feature-badge feature-badge-exchange">
              <OfferBadge offer="exchange" size="small" />
              <span className="feature-text">{t("createContact.exchangeOnly")}</span>
              <span className="feature-domain">{domain}</span>
            </div>

            {error && (
              <div className="modal-error">
                <span className="error-icon">⚠</span>
                {error}
              </div>
            )}

            {/* Display name (required) */}
            <div className="form-group">
              <label className="form-label">{t("createContact.fields.displayName")} *</label>
              <input
                type="text"
                className="form-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t("createContact.placeholders.displayName")}
                disabled={loading}
              />
            </div>

            {/* First name / Last name */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t("createContact.fields.firstName")}</label>
                <input
                  type="text"
                  className="form-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jean"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t("createContact.fields.lastName")}</label>
                <input
                  type="text"
                  className="form-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Martin"
                  disabled={loading}
                />
              </div>
            </div>

            {/* External email (required) */}
            <div className="form-group">
              <label className="form-label">{t("createContact.fields.externalEmail")} *</label>
              <input
                type="email"
                className="form-input"
                value={externalEmail}
                onChange={(e) => setExternalEmail(e.target.value)}
                placeholder="contact@fournisseur.com"
                disabled={loading}
              />
            </div>

            {/* Company */}
            <div className="form-group">
              <label className="form-label">{t("createContact.fields.company")}</label>
              <input
                type="text"
                className="form-input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={t("createContact.placeholders.company")}
                disabled={loading}
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">{t("createContact.fields.phone")}</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 1 23 45 67 89"
                disabled={loading}
              />
            </div>

            {/* GAL visibility */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={visibleInGal}
                  onChange={(e) => setVisibleInGal(e.target.checked)}
                  disabled={loading}
                />
                {t("createContact.fields.visibleInGal")}
              </label>
              <span className="form-hint">{t("createContact.galHint")}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t("common.creating") : t("createContact.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
