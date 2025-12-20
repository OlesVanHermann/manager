// ============================================================
// TAB: CONTACTS - Gestion des 4 contacts du domaine
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { DomainServiceInfos, DomainContact, domainsService } from "../../../../services/web-cloud.domains";

interface Props { domain: string; serviceInfos?: DomainServiceInfos; }
interface ContactInfo { type: "owner" | "admin" | "tech" | "billing"; nic: string; details?: DomainContact; loading: boolean; }

const ExternalLinkIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

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
    const nics = { admin: serviceInfos.contactAdmin, tech: serviceInfos.contactTech, billing: serviceInfos.contactBilling };
    const updated: ContactInfo[] = [
      { type: "owner", nic: "OVHcloud", loading: false },
      { type: "admin", nic: nics.admin, loading: true },
      { type: "tech", nic: nics.tech, loading: true },
      { type: "billing", nic: nics.billing, loading: true },
    ];
    setContacts(updated);
    for (const type of ["admin", "tech", "billing"] as const) {
      try {
        const details = await domainsService.getContact(nics[type]);
        setContacts((prev) => prev.map((c) => (c.type === type ? { ...c, details, loading: false } : c)));
      } catch {
        setContacts((prev) => prev.map((c) => (c.type === type ? { ...c, loading: false } : c)));
      }
    }
  }, [serviceInfos]);

  useEffect(() => { loadContacts(); }, [loadContacts]);

  return (
    <div className="contacts-tab">
      <div className="tab-header">
        <div><h3>{t("title")}</h3><p className="tab-description">{t("description")}</p></div>
        <div className="tab-header-actions"><a href={`${OVH_MANAGER_BASE}/#/dedicated/contacts/services?serviceName=${domain}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">{t("reassignContacts")} <ExternalLinkIcon /></a></div>
      </div>
      <div className="info-box"><p>{t("info")}</p></div>
      <div className="contacts-grid">
        {contacts.map((c) => (
          <div key={c.type} className="contact-card">
            <div className="contact-header"><h4>{t(`types.${c.type}`)}</h4></div>
            <div className="contact-body">
              {c.loading ? <div className="skeleton-block" /> : (
                <>
                  <div className="contact-nic"><strong>{c.nic}</strong></div>
                  {c.details ? (
                    <div className="contact-details">
                      {c.details.organisationName && <p className="org-name">{c.details.organisationName}</p>}
                      <p className="name">{c.details.firstName} {c.details.lastName}</p>
                      {c.details.address && <p className="address">{c.details.address.line1}<br />{c.details.address.zip} {c.details.address.city}</p>}
                      <p className="email">{c.details.email}</p>
                      <p className="phone">{c.details.phone}</p>
                    </div>
                  ) : c.type === "owner" ? <div className="contact-details"><p className="hint">{t("ownerHint")}</p></div> : null}
                  <p className="contact-role">{t(`roles.${c.type}`)}</p>
                </>
              )}
            </div>
            <div className="contact-footer"><a href={`${OVH_MANAGER_BASE}/#/dedicated/contacts/services?serviceName=${domain}`} target="_blank" rel="noopener noreferrer" className="btn-link">{t("modify")} →</a></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContactsTab;
