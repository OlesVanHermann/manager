import "./ContactsServicesTab.css";
// ============================================================
// CONTACTS SERVICES TAB - Liste des contacts par service
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCredentials } from "../../../../../services/api";
import * as contactsService from "../../../../../services/home.account.contacts";

// ============ TYPES ============

interface ModalState {
  service: contactsService.ServiceContact | null;
}

type ContactType = "contactAdmin" | "contactTech" | "contactBilling";

// ============ COMPOSANT ============

/** Affiche la liste des contacts (admin, tech, billing) par service avec possibilité de modification. */
export function ContactsServicesTab() {
  const { t } = useTranslation('home/account/contacts-services');
  const { t: tCommon } = useTranslation('common');

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<contactsService.ServiceContact[]>([]);
  const [modal, setModal] = useState<ModalState>({ service: null });
  const [selectedType, setSelectedType] = useState<ContactType>("contactAdmin");
  const [newNic, setNewNic] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  // ---------- ACTIONS ----------
  const handleInitiateChange = async () => {
    if (!modal.service || !newNic.trim()) return;
    setActionLoading(true);
    setActionError(null);
    setSuccessMessage(null);
    try {
      const creds = getCredentials();
      if (!creds) throw new Error(t('errors.authRequired'));
      
      const contactRequest: contactsService.ContactChangeRequest = {};
      contactRequest[selectedType] = newNic.trim();
      
      await contactsService.initiateContactChange(creds, modal.service.serviceName, contactRequest);
      setSuccessMessage(t('modal.success'));
      setNewNic("");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t('errors.changeError'));
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (service: contactsService.ServiceContact) => {
    setModal({ service });
    setSelectedType("contactAdmin");
    setNewNic("");
    setActionError(null);
    setSuccessMessage(null);
  };

  const closeModal = () => {
    if (!actionLoading) {
      setModal({ service: null });
      setNewNic("");
      setActionError(null);
      setSuccessMessage(null);
    }
  };

  // ---------- HELPERS ----------
  const getContactTypeLabel = (type: ContactType): string => {
    const map: Record<ContactType, string> = {
      contactAdmin: t('contactTypes.admin'),
      contactTech: t('contactTypes.tech'),
      contactBilling: t('contactTypes.billing'),
    };
    return map[type];
  };

  const getCurrentContact = (service: contactsService.ServiceContact, type: ContactType): string => {
    const map: Record<ContactType, string> = {
      contactAdmin: service.contactAdmin,
      contactTech: service.contactTech,
      contactBilling: service.contactBilling,
    };
    return map[type];
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="tab-content"><div className="contacts-services-loading-state"><div className="contacts-services-spinner"></div><p>{t('loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-content"><div className="contacts-services-error-banner">{error}<button onClick={loadServices} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
  }

  return (
    <div className="tab-content">
      <div className="section-header">
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </div>

      {services.length === 0 ? (
        <div className="contacts-services-empty-state"><p>{t('empty')}</p></div>
      ) : (
        <div className="contacts-services-table-container">
          <p style={{ marginBottom: "1rem", color: "var(--color-text-secondary)" }}>{t('count', { count: services.length })}</p>
          <table className="contacts-services-table">
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
                  <td className="contacts-services-service-name">{service.serviceName}</td>
                  <td>{service.serviceType}</td>
                  <td><code className="contact-code">{service.contactAdmin}</code></td>
                  <td><code className="contact-code">{service.contactTech}</code></td>
                  <td><code className="contact-code">{service.contactBilling}</code></td>
                  <td><button onClick={() => openModal(service)} className="btn btn-outline btn-sm">{t('actions.changeContact')}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modale changement de contact */}
      {modal.service && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('modal.title')}</h3>
            <p style={{ marginBottom: "1rem", color: "var(--color-text-secondary)" }}>{t('modal.description')}</p>
            
            <div className="modal-service-info" style={{ padding: "1rem", background: "var(--color-background-subtle)", borderRadius: "8px", marginBottom: "1.5rem" }}>
              <p><strong>{t('columns.service')}:</strong> {modal.service.serviceName}</p>
              <p><strong>{t('columns.type')}:</strong> {modal.service.serviceType}</p>
            </div>

            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label>{t('modal.contactTypeLabel')}</label>
              <select
                className="input"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ContactType)}
                disabled={actionLoading}
              >
                <option value="contactAdmin">{t('contactTypes.admin')}</option>
                <option value="contactTech">{t('contactTypes.tech')}</option>
                <option value="contactBilling">{t('contactTypes.billing')}</option>
              </select>
              <p className="form-hint">{t('modal.currentContact')}: <code>{getCurrentContact(modal.service, selectedType)}</code></p>
            </div>

            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label htmlFor="newNic">{t('modal.newNicLabel')}</label>
              <input
                type="text"
                id="newNic"
                className="input"
                value={newNic}
                onChange={(e) => setNewNic(e.target.value)}
                placeholder={t('modal.newNicPlaceholder')}
                disabled={actionLoading}
              />
              <p className="form-hint">{t('modal.newNicHint')}</p>
            </div>

            {actionError && <div className="contacts-services-error-banner" style={{ marginBottom: "1rem" }}>{actionError}</div>}
            {successMessage && <div className="success-banner" style={{ marginBottom: "1rem", padding: "0.75rem", background: "var(--color-success-bg, #d4edda)", color: "var(--color-success, #155724)", borderRadius: "6px" }}>{successMessage}</div>}

            <div className="modal-actions">
              <button onClick={closeModal} className="btn btn-secondary" disabled={actionLoading}>{tCommon('actions.cancel')}</button>
              <button
                onClick={handleInitiateChange}
                className="btn btn-primary"
                disabled={actionLoading || !newNic.trim()}
              >
                {actionLoading ? tCommon('loading') : t('modal.submitButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
