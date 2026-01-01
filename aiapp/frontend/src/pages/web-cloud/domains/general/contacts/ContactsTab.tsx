// ============================================================
import "./ContactsTab.css";
// TAB: CONTACTS - Gestion des 4 contacts du domaine + OWO
// NAV4: contacts | owo (obfuscation)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { contactsService } from "./ContactsTab.service";
import { ContactChangeModal } from "../ContactChangeModal";
import type { DomainServiceInfos, DomainContact } from "../../domains.types";

interface Props {
  domain: string;
  serviceInfos?: DomainServiceInfos;
}

interface ContactInfo {
  type: "owner" | "admin" | "tech" | "billing";
  nic: string;
  email?: string;
  details?: DomainContact;
  loading: boolean;
}

interface OwoState {
  owner: boolean;
  admin: boolean;
  tech: boolean;
  billing: boolean;
}

type ViewMode = "contacts" | "owo";

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

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
  </svg>
);

const CONTACT_ICONS: Record<string, () => JSX.Element> = {
  owner: BuildingIcon,
  admin: ShieldIcon,
  tech: SettingsIcon,
  billing: CreditCardIcon,
};

const CONTACT_VARIANTS: Record<string, string> = {
  owner: "contacts-variant-enterprise",
  admin: "contacts-variant-primary",
  tech: "contacts-variant-success",
  billing: "contacts-variant-warning",
};

export function ContactsTab({ domain, serviceInfos }: Props) {
  const { t } = useTranslation("web-cloud/domains/contacts");
  const { t: tCommon } = useTranslation("common");

  // ---------- DEBUG LOGGING ----------
  const logAction = (action: string, data?: Record<string, unknown>) => {
  };

  // ---------- VIEW MODE ----------
  const [viewMode, setViewMode] = useState<ViewMode>("contacts");

  // ---------- CONTACTS STATE ----------
  const [contacts, setContacts] = useState<ContactInfo[]>([
    { type: "owner", nic: "", loading: true },
    { type: "admin", nic: "", loading: true },
    { type: "tech", nic: "", loading: true },
    { type: "billing", nic: "", loading: true },
  ]);

  // ---------- OWO STATE ----------
  const [owoState, setOwoState] = useState<OwoState>({
    owner: false,
    admin: false,
    tech: false,
    billing: false,
  });
  const [owoInitial, setOwoInitial] = useState<OwoState>({
    owner: false,
    admin: false,
    tech: false,
    billing: false,
  });
  const [owoLoading, setOwoLoading] = useState(true);
  const [owoSaving, setOwoSaving] = useState(false);
  const [owoAvailable, setOwoAvailable] = useState(true);
  const [regeneratingContact, setRegeneratingContact] = useState<string | null>(null);

  // ---------- MODAL STATE ----------
  const [editingContact, setEditingContact] = useState<{
    type: "admin" | "tech" | "billing";
    nic: string;
    name?: string;
    email?: string;
  } | null>(null);

  // ---------- LOAD CONTACTS ----------
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
        // Utiliser /domain/contact/{nichandle} - Identique old_manager
        const details = await contactsService.getDomainContactInformations(nics[type]);
        setContacts((prev) =>
          prev.map((c) => (c.type === type ? { ...c, details, email: details.email, loading: false } : c))
        );
      } catch {
        setContacts((prev) =>
          prev.map((c) => (c.type === type ? { ...c, loading: false } : c))
        );
      }
    }
  }, [serviceInfos]);

  // ---------- LOAD OWO STATE ----------
  const loadOwoState = useCallback(async () => {
    setOwoLoading(true);
    const result = await contactsService.getOwoState(domain);
    setOwoState(result.state);
    setOwoInitial(result.state);
    setOwoAvailable(result.available);
    setOwoLoading(false);
  }, [domain]);

  useEffect(() => {
    loadContacts();
    loadOwoState();
  }, [loadContacts, loadOwoState]);

  // ---------- VIEW HANDLERS ----------
  const handleViewChange = (view: ViewMode) => {
    logAction("VIEW_CHANGE", { from: viewMode, to: view });
    setViewMode(view);
  };

  // ---------- OWO HANDLERS ----------
  const handleOwoToggle = (contactType: keyof OwoState) => {
    logAction("OWO_TOGGLE", { contactType, newValue: !owoState[contactType] });
    setOwoState((prev) => ({
      ...prev,
      [contactType]: !prev[contactType],
    }));
  };

  const handleOwoSave = async () => {
    logAction("OWO_SAVE_START", { owoState });
    setOwoSaving(true);
    const success = await contactsService.updateOwoState(domain, owoState);
    if (success) {
      logAction("OWO_SAVE_SUCCESS");
      setOwoInitial(owoState);
    } else {
      logAction("OWO_SAVE_UNAVAILABLE", { reason: "OWO not available for this TLD" });
      // Reset to initial state since OWO is not available
      setOwoState(owoInitial);
    }
    setOwoSaving(false);
  };

  const handleRegenerate = async (contactType: string) => {
    logAction("OWO_REGENERATE_START", { contactType });
    setRegeneratingContact(contactType);
    const success = await contactsService.regenerateOwo(domain, contactType);
    if (success) {
      logAction("OWO_REGENERATE_SUCCESS", { contactType });
    } else {
      logAction("OWO_REGENERATE_UNAVAILABLE", { contactType, reason: "OWO not available for this TLD" });
    }
    setRegeneratingContact(null);
  };

  const handleEditContact = (contact: ContactInfo) => {
    if (contact.type === "owner") return; // Owner non modifiable
    logAction("EDIT_CONTACT_CLICK", { type: contact.type, nic: contact.nic });
    setEditingContact({
      type: contact.type,
      nic: contact.nic,
      name: contact.details ? `${contact.details.firstName} ${contact.details.lastName}` : undefined,
      email: contact.email,
    });
  };

  const handleContactChanged = () => {
    logAction("CONTACT_CHANGED_SUCCESS");
    loadContacts();
  };

  const hasOwoChanges = JSON.stringify(owoState) !== JSON.stringify(owoInitial);

  // ============ RENDER ============
  return (
    <div className="contacts-tab">
      {/* NAV4 View Selector */}
      <div className="contacts-nav4">
        <button
          className={`contacts-nav4-btn ${viewMode === "contacts" ? "active" : ""}`}
          onClick={() => handleViewChange("contacts")}
        >
          {t("nav4.contacts")}
        </button>
        <button
          className={`contacts-nav4-btn ${viewMode === "owo" ? "active" : ""}`}
          onClick={() => handleViewChange("owo")}
        >
          {t("nav4.owo")}
        </button>
      </div>

      {/* CONTACTS VIEW */}
      {viewMode === "contacts" && (
        <>
          <div className="contacts-header">
            <div>
              <h3>{t("title")}</h3>
              <p className="contacts-description">{t("description")}</p>
            </div>
            <div className="contacts-header-actions">
              <button
                className="contacts-btn-primary"
                onClick={() => {
                  const adminContact = contacts.find(c => c.type === "admin");
                  if (adminContact) handleEditContact(adminContact);
                }}
              >
                {t("reassignContacts")}
              </button>
            </div>
          </div>

          <div className="contacts-grid">
            {contacts.map((contact) => {
              const IconComponent = CONTACT_ICONS[contact.type];
              const variantClass = CONTACT_VARIANTS[contact.type];

              return (
                <div key={contact.type} className="contacts-card">
                  <div className={`contacts-icon ${variantClass}`}>
                    <IconComponent />
                  </div>
                  <div className="contacts-content">
                    <div className="contacts-type">{t(`types.${contact.type}`)}</div>
                    {contact.loading ? (
                      <div className="contacts-skeleton contacts-skeleton-text" />
                    ) : (
                      <>
                        <div className="contacts-nic">{contact.nic}</div>
                        {contact.details && (
                          <div className="contacts-name">
                            {contact.details.firstName} {contact.details.lastName}
                          </div>
                        )}
                      </>
                    )}
                    <div className="contacts-role">{t(`roles.${contact.type}`)}</div>
                  </div>
                  {contact.type !== "owner" && (
                    <button className="contacts-edit" onClick={() => handleEditContact(contact)}>
                      {t("modify")} →
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="contacts-info-box">
            <p>{t("info")}</p>
          </div>
        </>
      )}

      {/* OWO VIEW */}
      {viewMode === "owo" && (
        <>
          <div className="contacts-header">
            <div>
              <h3>{t("owo.title")}</h3>
              <p className="contacts-description">{t("owo.description")}</p>
            </div>
          </div>

          {owoLoading ? (
            <div className="contacts-loading">
              <div className="contacts-skeleton" style={{ height: 280 }} />
            </div>
          ) : !owoAvailable ? (
            <div className="contacts-info-box contacts-info-warning">
              <p>{t("owo.notAvailable")}</p>
            </div>
          ) : (
            <>
              <div className="contacts-owo-table">
                <div className="contacts-owo-header">
                  <span className="col-contact">{t("owo.colContact")}</span>
                  <span className="col-email">{t("owo.colEmail")}</span>
                  <span className="col-obfuscation">{t("owo.colObfuscation")}</span>
                  <span className="col-action">{t("owo.colAction")}</span>
                </div>

                {contacts.map((contact) => (
                  <div key={contact.type} className="contacts-owo-row">
                    <span className="col-contact">{t(`types.${contact.type}`)}</span>
                    <span className="col-email">{contact.email || contact.nic}</span>
                    <div className="col-obfuscation">
                      <button
                        className={`contacts-toggle ${owoState[contact.type] ? "on" : "off"}`}
                        onClick={() => handleOwoToggle(contact.type)}
                        aria-label={owoState[contact.type] ? t("owo.enabled") : t("owo.disabled")}
                      >
                        <span className="contacts-toggle-circle" />
                      </button>
                      <span className="contacts-toggle-label">
                        {owoState[contact.type] ? t("owo.enabled") : t("owo.disabled")}
                      </span>
                    </div>
                    <div className="col-action">
                      <button
                        className="contacts-btn-link"
                        onClick={() => handleRegenerate(contact.type)}
                        disabled={regeneratingContact === contact.type}
                      >
                        <RefreshIcon />
                        {regeneratingContact === contact.type ? tCommon("loading") : t("owo.regenerate")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="contacts-owo-actions">
                <button
                  className="contacts-btn-primary"
                  onClick={handleOwoSave}
                  disabled={!hasOwoChanges || owoSaving}
                >
                  {owoSaving ? tCommon("loading") : t("owo.save")}
                </button>
              </div>

              <div className="contacts-info-box">
                <p>{t("owo.info")}</p>
              </div>
            </>
          )}
        </>
      )}

      {/* ============ MODAL CHANGEMENT CONTACT ============ */}
      {editingContact && (
        <ContactChangeModal
          domain={domain}
          contactType={editingContact.type}
          currentNic={editingContact.nic}
          currentName={editingContact.name}
          currentEmail={editingContact.email}
          onClose={() => setEditingContact(null)}
          onSuccess={handleContactChanged}
        />
      )}
    </div>
  );
}

export default ContactsTab;
