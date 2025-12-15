// ============================================================
// CONTACTS SERVICES TAB - Liste des contacts par service
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCredentials } from "../../../services/api";
import * as contactsService from "../../../services/contacts.service";

// ============ COMPOSANT ============

/** Affiche la liste des contacts (admin, tech, billing) par service. */
export function ContactsServicesTab() {
  const { t } = useTranslation('home/account/contacts-services');
  const { t: tCommon } = useTranslation('common');

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<contactsService.ServiceContact[]>([]);

  // ---------- EFFECTS ----------
  useEffect(() => { loadServices(); }, []);

  // ---------- LOADERS ----------
  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const creds = getCredentials();
      if (!creds) { setError(t('errors.authRequired')); return; }
      const data = await contactsService.getServiceContacts(creds);
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="tab-content"><div className="loading-state"><div className="spinner"></div><p>{t('loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-content"><div className="error-banner">{error}<button onClick={loadServices} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
  }

  return (
    <div className="tab-content">
      <div className="section-header">
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </div>

      {services.length === 0 ? (
        <div className="empty-state"><p>{t('empty')}</p></div>
      ) : (
        <div className="contacts-table-container">
          <p style={{ marginBottom: "1rem", color: "var(--color-text-secondary)" }}>{t('count', { count: services.length })}</p>
          <table className="contacts-table">
            <thead>
              <tr>
                <th>{t('columns.service')}</th>
                <th>{t('columns.type')}</th>
                <th>{t('columns.admin')}</th>
                <th>{t('columns.tech')}</th>
                <th>{t('columns.billing')}</th>
                <th>{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, idx) => (
                <tr key={idx}>
                  <td className="service-name">{service.serviceName}</td>
                  <td>{service.serviceType}</td>
                  <td><code className="contact-code">{service.contactAdmin}</code></td>
                  <td><code className="contact-code">{service.contactTech}</code></td>
                  <td><code className="contact-code">{service.contactBilling}</code></td>
                  <td><a href={"https://www.ovh.com/manager/#/dedicated/contacts/services/" + encodeURIComponent(service.serviceName)} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">{tCommon('actions.edit')}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
