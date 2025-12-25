// ============================================================
// CONTACTS SERVICES TAB - Liste des contacts par service
// Styles: ./ContactsServicesTab.css (préfixe .contacts-services-)
// Service: ./ContactsServicesTab.service.ts (ISOLÉ)
// ============================================================

import "./ContactsServicesTab.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as contactsServicesService from "./ContactsServicesTab.service";

// ============ TYPES LOCAUX ============

interface ModalState {
  service: contactsServicesService.ServiceContact | null;
}

type ContactType = "contactAdmin" | "contactTech" | "contactBilling";

// ============ COMPOSANT ============

export default function ContactsServicesTab() {
  const { t } = useTranslation("home/account/contacts-services");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<contactsServicesService.ServiceContact[]>([]);
  const [modal, setModal] = useState<ModalState>({ service: null });
  const [selectedType, setSelectedType] = useState<ContactType>("contactAdmin");
  const [newNic, setNewNic] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadServices();
  }, []);

  // ---------- LOADERS ----------
  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactsServicesService.getServiceContacts();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.loadError"));
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
      const contactRequest: contactsServicesService.ContactChangeRequest = {};
      contactRequest[selectedType] = newNic.trim();

      await contactsServicesService.initiateContactChange(modal.service.serviceName, contactRequest);
      setSuccessMessage(t("modal.success"));
      setNewNic("");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t("errors.changeError"));
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (service: contactsServicesService.ServiceContact) => {
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
  const getCurrentContact = (service: contactsServicesService.ServiceContact, type: ContactType): string => {
    const map: Record<ContactType, string> = {
      contactAdmin: service.contactAdmin,
      contactTech: service.contactTech,
      contactBilling: service.contactBilling,
    };
    return map[type];
  };

  // ---------- LOADING ----------
  if (loading) {
    return (
      <div className="contacts-services-content">
        <div className="contacts-services-loading">
          <div className="contacts-services-spinner"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  // ---------- ERROR ----------
  if (error) {
    return (
      <div className="contacts-services-content">
        <div className="contacts-services-error-banner">
          {error}
          <button onClick={loadServices} className="contacts-services-btn contacts-services-btn-secondary contacts-services-btn-sm">
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="contacts-services-content">
      <div className="contacts-services-header">
        <h2>{t("title")}</h2>
        <p>{t("description")}</p>
      </div>

      {services.length === 0 ? (
        <div className="contacts-services-empty-state">
          <p>{t("empty")}</p>
        </div>
      ) : (
        <>
          <p className="contacts-services-count">{t("count", { count: services.length })}</p>
          <div className="contacts-services-table-container">
            <table className="contacts-services-table">
              <thead>
                <tr>
                  <th>{t("columns.service")}</th>
                  <th>{t("columns.type")}</th>
                  <th>{t("columns.admin")}</th>
                  <th>{t("columns.tech")}</th>
                  <th>{t("columns.billing")}</th>
                  <th>{t("columns.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, idx) => (
                  <tr key={idx}>
                    <td className="contacts-services-service-name">{service.serviceName}</td>
                    <td>{service.serviceType || "-"}</td>
                    <td>
                      <code className="contacts-services-contact-code">{service.contactAdmin}</code>
                    </td>
                    <td>
                      <code className="contacts-services-contact-code">{service.contactTech}</code>
                    </td>
                    <td>
                      <code className="contacts-services-contact-code">{service.contactBilling}</code>
                    </td>
                    <td>
                      <button
                        onClick={() => openModal(service)}
                        className="contacts-services-btn contacts-services-btn-outline contacts-services-btn-sm"
                      >
                        {t("actions.changeContact")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal changement de contact */}
      {modal.service && (
        <div className="contacts-services-modal-overlay" onClick={closeModal}>
          <div className="contacts-services-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t("modal.title")}</h3>
            <p className="contacts-services-modal-description">{t("modal.description")}</p>

            <div className="contacts-services-modal-service-info">
              <p>
                <strong>{t("columns.service")}:</strong> {modal.service.serviceName}
              </p>
              <p>
                <strong>{t("columns.type")}:</strong> {modal.service.serviceType || "-"}
              </p>
            </div>

            <div className="contacts-services-form-group">
              <label>{t("modal.contactTypeLabel")}</label>
              <select
                className="contacts-services-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ContactType)}
                disabled={actionLoading}
              >
                <option value="contactAdmin">{t("contactTypes.admin")}</option>
                <option value="contactTech">{t("contactTypes.tech")}</option>
                <option value="contactBilling">{t("contactTypes.billing")}</option>
              </select>
              <p className="contacts-services-form-hint">
                {t("modal.currentContact")}:{" "}
                <code>{getCurrentContact(modal.service, selectedType)}</code>
              </p>
            </div>

            <div className="contacts-services-form-group">
              <label htmlFor="contacts-services-newNic">{t("modal.newNicLabel")}</label>
              <input
                type="text"
                id="contacts-services-newNic"
                className="contacts-services-input"
                value={newNic}
                onChange={(e) => setNewNic(e.target.value)}
                placeholder={t("modal.newNicPlaceholder")}
                disabled={actionLoading}
              />
              <p className="contacts-services-form-hint">{t("modal.newNicHint")}</p>
            </div>

            {actionError && <div className="contacts-services-error-banner">{actionError}</div>}
            {successMessage && <div className="contacts-services-success-banner">{successMessage}</div>}

            <div className="contacts-services-modal-actions">
              <button
                onClick={closeModal}
                className="contacts-services-btn contacts-services-btn-secondary"
                disabled={actionLoading}
              >
                {tCommon("actions.cancel")}
              </button>
              <button
                onClick={handleInitiateChange}
                className="contacts-services-btn contacts-services-btn-primary"
                disabled={actionLoading || !newNic.trim()}
              >
                {actionLoading ? tCommon("loading") : t("modal.submitButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
