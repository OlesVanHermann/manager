// ============================================================
import "./ContactsTab.css";
// TAB: CONTACTS - Gestion des 4 contacts du domaine
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { contactsService } from "./ContactsTab";
import type { DomainServiceInfos, DomainContact } from "../../domains.types";

interface Props {
  domain: string;
  serviceInfos?: DomainServiceInfos;
}

interface ContactInfo {
  type: "owner" | "admin" | "tech" | "billing";
  nic: string;
  details?: DomainContact;
  loading: boolean;
}

// ============ ICONS ============

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const CONTACT_ICONS: Record<string, () => JSX.Element> = {
  owner: BuildingIcon,
  admin: ShieldIcon,
  tech: SettingsIcon,
  billing: CreditCardIcon,
};

// Utilise les classes CSS au lieu de couleurs hardcodées
const CONTACT_VARIANTS: Record<string, string> = {
  owner: "contact-variant-enterprise",
  admin: "contact-variant-primary",
  tech: "contact-variant-success",
  billing: "contact-variant-warning",
};

const OVH_MANAGER_BASE = "https://www.ovh.com/manager";

export function ContactsTab({ domain, serviceInfos }: Props) {
  const { t } = useTranslation("web-cloud/domains/contacts");

  const [contacts, setContacts] = useState<ContactInfo[]>([
    { type: "owner", nic: "", loading: true },
    { type: "admin", nic: "", loading: true },
    { type: "tech", nic: "", loading: true },
    { type: "billing", nic: "", loading: true },
  ]);

  const loadContacts = useCallback(async () => {
    if (!serviceInfos) return;

    const nics = {
      admin: serviceInfos.contactAdmin,
      tech: serviceInfos.contactTech,
      billing: serviceInfos.contactBilling,
    };

    const updated: ContactInfo[] = [
      { type: "owner", nic: "OVHcloud", loading: false },
      { type: "admin", nic: nics.admin, loading: true },
      { type: "tech", nic: nics.tech, loading: true },
      { type: "billing", nic: nics.billing, loading: true },
    ];
    setContacts(updated);

    for (const type of ["admin", "tech", "billing"] as const) {
      try {
        const details = await contactsService.getContact(nics[type]);
        setContacts((prev) =>
          prev.map((c) => (c.type === type ? { ...c, details, loading: false } : c))
        );
      } catch {
        setContacts((prev) =>
          prev.map((c) => (c.type === type ? { ...c, loading: false } : c))
        );
      }
    }
  }, [serviceInfos]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const getContactUrl = () => `${OVH_MANAGER_BASE}/#/dedicated/contacts/services?serviceName=${encodeURIComponent(domain)}`;

  return (
    <div className="contacts-tab">
      <div className="tab-header">
        <div>
          <h3>{t("title")}</h3>
          <p className="tab-description">{t("description")}</p>
        </div>
        <div className="tab-header-actions">
          <a href={getContactUrl()} target="_blank" rel="noopener noreferrer" className="btn-primary">
            {t("reassignContacts")} <ExternalLinkIcon />
          </a>
        </div>
      </div>

      <div className="contacts-grid-v2">
        {contacts.map((contact) => {
          const IconComponent = CONTACT_ICONS[contact.type];
          const variantClass = CONTACT_VARIANTS[contact.type];

          return (
            <div key={contact.type} className="contact-card-v2">
              <div className={`contact-icon-v2 ${variantClass}`}>
                <IconComponent />
              </div>
              <div className="contact-content-v2">
                <div className="contact-type-v2">{t(`types.${contact.type}`)}</div>
                {contact.loading ? (
                  <div className="skeleton-text" style={{ width: "120px", height: "20px" }} />
                ) : (
                  <>
                    <div className="contact-nic-v2">{contact.nic}</div>
                    {contact.details && (
                      <div className="contact-name-v2">
                        {contact.details.firstName} {contact.details.lastName}
                      </div>
                    )}
                  </>
                )}
                <div className="contact-role-v2">{t(`roles.${contact.type}`)}</div>
              </div>
              <a href={getContactUrl()} target="_blank" rel="noopener noreferrer" className="contact-edit-v2">
                {t("modify")} →
              </a>
            </div>
          );
        })}
      </div>

      <div className="info-box">
        <p>{t("info")}</p>
      </div>
    </div>
  );
}

export default ContactsTab;
