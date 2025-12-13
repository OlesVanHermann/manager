import { useState, useEffect } from "react";
import type { OvhCredentials } from "../../types/auth.types";
import * as contactsService from "../../services/contacts.service";
import "./styles.css";

const STORAGE_KEY = "ovh_credentials";

const tabs = [
  { id: "services", label: "Mes services" },
  { id: "requests", label: "Mes demandes" },
];

export default function ContactsPage() {
  const [activeTab, setActiveTab] = useState("services");

  return (
    <div className="contacts-page">
      <div className="page-header">
        <h1>Gestion des contacts</h1>
        <p className="page-description">Vous avez la possibilite de changer les comptes administrateur, technique et facturation de vos services.</p>
      </div>

      <div className="page-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content contacts-content">
        {activeTab === "services" && <ServicesTab />}
        {activeTab === "requests" && <RequestsTab />}
      </div>
    </div>
  );
}

function ServicesTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<contactsService.ServiceContact[]>([]);

  useEffect(() => {
    loadServices();
  }, []);

  const getCredentials = (): OvhCredentials | null => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const loadServices = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError("Non authentifie");
      setLoading(false);
      return;
    }

    try {
      const data = await contactsService.getServiceContacts(credentials);
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="services-tab">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-tab">
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={loadServices}>Reessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="services-tab">
      <table className="data-table">
        <thead>
          <tr>
            <th>Nom du service</th>
            <th>Type</th>
            <th>Contact administrateur</th>
            <th>Contact technique</th>
            <th>Contact facturation</th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-cell">Aucun service</td>
            </tr>
          ) : (
            services.map((service, idx) => (
              <tr key={idx}>
                <td className="service-name">{service.serviceName}</td>
                <td>{service.serviceType}</td>
                <td><span className="contact-badge">{service.contactAdmin}</span></td>
                <td><span className="contact-badge">{service.contactTech}</span></td>
                <td><span className="contact-badge">{service.contactBilling}</span></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function RequestsTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<contactsService.ContactChange[]>([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const getCredentials = (): OvhCredentials | null => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const loadRequests = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError("Non authentifie");
      setLoading(false);
      return;
    }

    try {
      const data = await contactsService.getContactChanges(credentials);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  const getStatusBadge = (state: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      doing: { label: "En cours", className: "badge-info" },
      done: { label: "Termine", className: "badge-success" },
      refused: { label: "Refuse", className: "badge-error" },
      todo: { label: "A faire", className: "badge-warning" },
      validatingByCustomers: { label: "En attente de validation", className: "badge-warning" },
    };
    return statusMap[state] || { label: state, className: "badge-neutral" };
  };

  const getTypelabel = (type: string) => {
    const typeMap: Record<string, string> = {
      contactAdmin: "Administrateur",
      contactBilling: "Facturation",
      contactTech: "Technique",
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="requests-tab">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="requests-tab">
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={loadRequests}>Reessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="requests-tab">
      <div className="info-box">
        <p>Les demandes de changement de contact necessitent une validation par email de la part des deux parties concernees.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Type</th>
            <th>De</th>
            <th>Vers</th>
            <th>Etat</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-cell">Aucune demande en cours</td>
            </tr>
          ) : (
            requests.map((req) => {
              const status = getStatusBadge(req.state);
              return (
                <tr key={req.id}>
                  <td>{req.serviceDomain}</td>
                  <td>{getTypelabel(req.type)}</td>
                  <td><span className="contact-badge">{req.from}</span></td>
                  <td><span className="contact-badge">{req.to}</span></td>
                  <td><span className={`badge ${status.className}`}>{status.label}</span></td>
                  <td>{formatDate(req.askDate)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
