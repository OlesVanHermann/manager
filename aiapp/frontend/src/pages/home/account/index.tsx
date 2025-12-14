// ============================================================
// ACCOUNT PAGE - Mon compte
// Tabs: Infos générales, Éditer, Sécurité, GDPR, Avancé, Contacts
// ============================================================

import { useState, useEffect } from "react";
import type { OvhUser } from "../../../types/auth.types";
import ProfileTile from "./components/ProfileTile";
import ShortcutsTile from "./components/ShortcutsTile";
import LastBillTile from "./components/LastBillTile";
import EditTab from "./EditTab";
import SecurityTab from "./SecurityTab";
import PrivacyTab from "./PrivacyTab";
import AdvancedTab from "./AdvancedTab";
import { getCredentials } from "../../../services/api";
import * as contactsService from "../../../services/contacts.service";
import * as proceduresService from "../../../services/procedures.service";
import "./styles.css";

interface AccountPageProps {
  user: OvhUser | null;
  isActive?: boolean;
  onNavigate?: (section: string, options?: { tab?: string }) => void;
  initialTab?: string;
}

const tabs = [
  { id: "info", label: "Informations générales" },
  { id: "edit", label: "Éditer mon compte" },
  { id: "security", label: "Sécurité" },
  { id: "gdpr", label: "Données personnelles" },
  { id: "advanced", label: "Paramètres avancés" },
  { id: "contacts-services", label: "Mes services (contacts)" },
  { id: "contacts-requests", label: "Mes demandes (contacts)" },
  { id: "kyc", label: "Documents KYC" },
];

// Mapping des IDs de navigation vers les IDs de tabs
const tabIdMap: Record<string, string> = {
  "account-info": "info",
  "account-edit": "edit",
  "account-security": "security",
  "account-gdpr": "gdpr",
  "account-advanced": "advanced",
  "account-contacts-services": "contacts-services",
  "account-contacts-requests": "contacts-requests",
  "account-kyc": "kyc",
};

export default function AccountPage({ user, isActive, onNavigate, initialTab }: AccountPageProps) {
  const [activeTab, setActiveTab] = useState("info");

  // Sync avec initialTab
  useEffect(() => {
    if (initialTab) {
      const mappedTab = tabIdMap[initialTab] || initialTab;
      if (tabs.find(t => t.id === mappedTab)) {
        setActiveTab(mappedTab);
      }
    }
  }, [initialTab]);

  if (isActive === false) return null;

  const handleShortcutClick = (_shortcutId: string, section?: string, tab?: string) => {
    if (onNavigate && section) {
      onNavigate(section, { tab });
    }
  };

  const handleEditProfile = () => {
    setActiveTab("edit");
  };

  const handleViewBill = () => {
    if (onNavigate) {
      onNavigate("home-billing", { tab: "billing-invoices" });
    }
  };

  return (
    <div className="account-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>Mon compte</h1>
          <p className="page-subtitle">
            Administrez votre compte client. Dans cette rubrique, vous gérez la sécurité de votre compte et vos paramètres.
          </p>
        </div>
        <a href="https://help.ovhcloud.com" target="_blank" rel="noopener noreferrer" className="guides-link">
          Guides
        </a>
      </div>

      <div className="tabs-container">
        <div className="tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={"tab-btn" + (activeTab === tab.id ? " active" : "")}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "info" && (
        <div className="account-tiles">
          <ProfileTile user={user} onEditProfile={handleEditProfile} />
          <ShortcutsTile onShortcutClick={handleShortcutClick} />
          <LastBillTile onViewBill={handleViewBill} />
        </div>
      )}

      {activeTab === "edit" && <EditTab user={user} />}
      {activeTab === "security" && <SecurityTab />}
      {activeTab === "gdpr" && <PrivacyTab />}
      {activeTab === "advanced" && <AdvancedTab />}
      {activeTab === "contacts-services" && <ContactsServicesTab />}
      {activeTab === "contacts-requests" && <ContactsRequestsTab />}
      {activeTab === "kyc" && <KycTab />}
    </div>
  );
}

// ============================================================
// CONTACTS SERVICES TAB - Gestion des contacts par service
// ============================================================
function ContactsServicesTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<contactsService.ServiceContact[]>([]);

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const creds = getCredentials();
      if (!creds) {
        setError("Authentification requise");
        return;
      }
      const data = await contactsService.getServiceContacts(creds);
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="tab-content">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content">
        <div className="error-banner">
          {error}
          <button onClick={loadServices} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="section-header">
        <h2>Mes services</h2>
        <p>Gérez les contacts associés à chacun de vos services. Un changement de contact nécessite la validation du nouveau contact.</p>
      </div>

      {services.length === 0 ? (
        <div className="empty-state">
          <p>Aucun service avec contacts trouvé.</p>
        </div>
      ) : (
        <div className="contacts-table-container">
          <p style={{ marginBottom: "1rem", color: "var(--color-text-secondary)" }}>{services.length} service(s)</p>
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Type</th>
                <th>Contact Admin</th>
                <th>Contact Tech</th>
                <th>Contact Facturation</th>
                <th>Actions</th>
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
                  <td>
                    <a
                      href={`https://www.ovh.com/manager/#/dedicated/contacts/services/${encodeURIComponent(service.serviceName)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      Modifier
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CONTACTS REQUESTS TAB - Demandes de changement de contact
// ============================================================
function ContactsRequestsTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<contactsService.ContactChange[]>([]);
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const creds = getCredentials();
      if (!creds) {
        setError("Authentification requise");
        return;
      }
      const data = await contactsService.getContactChanges(creds);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  const getStatusBadge = (state: string) => {
    const map: Record<string, { label: string; className: string }> = {
      todo: { label: "En attente", className: "badge-warning" },
      doing: { label: "En cours", className: "badge-info" },
      done: { label: "Terminé", className: "badge-success" },
      refused: { label: "Refusé", className: "badge-error" },
      validatingByCustomers: { label: "Validation client", className: "badge-warning" },
    };
    return map[state] || { label: state, className: "badge-neutral" };
  };

  const getContactTypeName = (type: string) => {
    const map: Record<string, string> = {
      contactAdmin: "Administrateur",
      contactTech: "Technique",
      contactBilling: "Facturation",
    };
    return map[type] || type;
  };

  const pendingStates = ["todo", "doing", "validatingByCustomers"];
  const filteredRequests = filter === "pending"
    ? requests.filter(r => pendingStates.includes(r.state))
    : requests;

  if (loading) {
    return (
      <div className="tab-content">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content">
        <div className="error-banner">
          {error}
          <button onClick={loadRequests} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>Réessayer</button>
        </div>
      </div>
    );
  }

  const pendingCount = requests.filter(r => pendingStates.includes(r.state)).length;

  return (
    <div className="tab-content">
      <div className="section-header">
        <h2>Mes demandes de changement de contact</h2>
        <p>Suivez et validez les demandes de transfert de contact. Vous recevrez un email avec un lien de validation.</p>
      </div>

      <div className="filter-bar">
        <button
          className={"filter-btn" + (filter === "pending" ? " active" : "")}
          onClick={() => setFilter("pending")}
        >
          En attente ({pendingCount})
        </button>
        <button
          className={"filter-btn" + (filter === "all" ? " active" : "")}
          onClick={() => setFilter("all")}
        >
          Toutes ({requests.length})
        </button>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="empty-state">
          <p>Aucune demande {filter === "pending" ? "en attente" : ""}</p>
        </div>
      ) : (
        <div className="contacts-table-container">
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Type de contact</th>
                <th>De</th>
                <th>Vers</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => {
                const status = getStatusBadge(req.state);
                return (
                  <tr key={req.id}>
                    <td className="service-name">{req.serviceDomain}</td>
                    <td>{getContactTypeName(req.type)}</td>
                    <td><code className="contact-code">{req.from}</code></td>
                    <td><code className="contact-code">{req.to}</code></td>
                    <td>{formatDate(req.askDate)}</td>
                    <td>
                      <span className={`status-badge ${status.className}`}>{status.label}</span>
                    </td>
                    <td>
                      {pendingStates.includes(req.state) && (
                        <a
                          href={`https://www.ovh.com/manager/#/dedicated/contacts/requests/${req.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                        >
                          Gérer
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// KYC TAB - Documents KYC / Vérification d'identité
// ============================================================
function KycTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<proceduresService.FraudStatus | null>(null);

  useEffect(() => { loadStatus(); }, []);

  const loadStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await proceduresService.getFraudStatus();
      setStatus(data);
    } catch (err) {
      // Si erreur 404, pas de procédure en cours
      setStatus({ status: "none" });
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const map: Record<string, { label: string; className: string; description: string }> = {
      required: { 
        label: "Documents requis", 
        className: "badge-warning",
        description: "OVHcloud a besoin de vérifier votre identité. Veuillez soumettre les documents demandés."
      },
      pending: { 
        label: "En cours de vérification", 
        className: "badge-info",
        description: "Vos documents ont été reçus et sont en cours d'examen par nos équipes."
      },
      open: { 
        label: "Procédure en cours", 
        className: "badge-info",
        description: "Une procédure de vérification est en cours sur votre compte."
      },
      closed: { 
        label: "Vérifié", 
        className: "badge-success",
        description: "Votre identité a été vérifiée avec succès."
      },
      none: { 
        label: "Aucune procédure", 
        className: "badge-neutral",
        description: "Aucune vérification de documents n'est requise pour le moment."
      },
    };
    return map[status] || map.none;
  };

  if (loading) {
    return (
      <div className="tab-content">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement du statut KYC...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content">
        <div className="error-banner">
          {error}
          <button onClick={loadStatus} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>Réessayer</button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(status?.status || "none");

  return (
    <div className="tab-content">
      <div className="section-header">
        <h2>Documents KYC</h2>
        <p>
          La procédure KYC (Know Your Customer) permet de vérifier votre identité conformément aux réglementations en vigueur.
        </p>
      </div>

      <div className="kyc-status-card" style={{ 
        padding: "2rem", 
        background: "var(--color-background-subtle)", 
        borderRadius: "12px",
        marginBottom: "1.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <span className={`status-badge ${statusInfo.className}`} style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>
            {statusInfo.label}
          </span>
        </div>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>
          {statusInfo.description}
        </p>

        {status?.status === "required" && (
          <div className="kyc-required-section">
            <h4 style={{ marginBottom: "1rem" }}>Documents généralement demandés :</h4>
            <ul style={{ marginLeft: "1.5rem", marginBottom: "1.5rem", color: "var(--color-text-secondary)" }}>
              <li>Pièce d'identité (carte d'identité, passeport, permis de conduire)</li>
              <li>Justificatif de domicile de moins de 3 mois</li>
              <li>Pour les entreprises : extrait Kbis ou équivalent</li>
            </ul>
            <a
              href="https://www.ovh.com/manager/#/dedicated/useraccount/kyc-documents"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Soumettre mes documents
            </a>
          </div>
        )}

        {status?.status === "pending" && (
          <div className="kyc-pending-section">
            <p style={{ color: "var(--color-text-secondary)" }}>
              Le délai de traitement est généralement de 2 à 5 jours ouvrés. Vous serez notifié par email une fois la vérification terminée.
            </p>
          </div>
        )}

        {status?.status === "none" && (
          <div className="kyc-none-section">
            <p style={{ color: "var(--color-text-secondary)" }}>
              Si une vérification est requise à l'avenir, vous en serez informé par email.
            </p>
          </div>
        )}
      </div>

      <div className="kyc-info" style={{ 
        padding: "1.5rem", 
        border: "1px solid var(--color-border)", 
        borderRadius: "8px",
        background: "var(--color-background)"
      }}>
        <h4 style={{ marginBottom: "0.5rem" }}>À propos de la vérification KYC</h4>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginBottom: "1rem" }}>
          La vérification de votre identité nous permet de sécuriser votre compte et de respecter les réglementations anti-fraude.
          Vos documents sont traités de manière confidentielle et sécurisée.
        </p>
        <a
          href="https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--color-primary)", fontSize: "0.9rem" }}
        >
          Consulter notre politique de confidentialité →
        </a>
      </div>
    </div>
  );
}
