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
      <div className="account-header">
        <div className="account-header-content">
          <h1>Mon compte</h1>
          <p className="account-subtitle">
            Administrez votre compte client. Dans cette rubrique, vous gérez la sécurité de votre compte et vos paramètres.
          </p>
        </div>
        <a href="https://help.ovhcloud.com" target="_blank" rel="noopener noreferrer" className="guides-link">
          Guides
        </a>
      </div>

      <div className="account-tabs">
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
    </div>
  );
}

// ============================================================
// CONTACTS SERVICES TAB - Gestion des contacts par service
// ============================================================
function ContactsServicesTab() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Charger depuis /me/contact ou API contacts
    const timer = setTimeout(() => {
      setServices([
        { id: "1", name: "ns1234567.ip-1-2-3.eu", type: "Serveur dédié", admin: "xx1234-ovh", tech: "xx1234-ovh", billing: "xx1234-ovh" },
        { id: "2", name: "vps-abc123.vps.ovh.net", type: "VPS", admin: "xx1234-ovh", tech: "xx1234-ovh", billing: "xx1234-ovh" },
        { id: "3", name: "example.com", type: "Domaine", admin: "xx1234-ovh", tech: "xx1234-ovh", billing: "xx1234-ovh" },
      ]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="tab-content">
        <div className="loading-state">Chargement des services...</div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="section-header">
        <h2>Mes services</h2>
        <p>Gérez les contacts associés à chacun de vos services.</p>
      </div>

      <div className="contacts-table-container">
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
            {services.map((service) => (
              <tr key={service.id}>
                <td className="service-name">{service.name}</td>
                <td>{service.type}</td>
                <td>{service.admin}</td>
                <td>{service.tech}</td>
                <td>{service.billing}</td>
                <td>
                  <button className="btn btn-outline btn-sm">Modifier</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// CONTACTS REQUESTS TAB - Demandes de changement de contact
// ============================================================
function ContactsRequestsTab() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  useEffect(() => {
    // TODO: Charger depuis /me/task/contactChange
    const timer = setTimeout(() => {
      setRequests([
        { id: "1", service: "ns1234567.ip-1-2-3.eu", type: "admin", from: "xx1234-ovh", to: "yy5678-ovh", status: "pending", date: "2025-01-10" },
        { id: "2", service: "example.com", type: "tech", from: "xx1234-ovh", to: "zz9012-ovh", status: "done", date: "2025-01-05" },
      ]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredRequests = filter === "pending" 
    ? requests.filter(r => r.status === "pending")
    : requests;

  if (loading) {
    return (
      <div className="tab-content">
        <div className="loading-state">Chargement des demandes...</div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="section-header">
        <h2>Mes demandes de changement de contact</h2>
        <p>Suivez et validez les demandes de transfert de contact.</p>
      </div>

      <div className="filter-bar">
        <button
          className={"filter-btn" + (filter === "pending" ? " active" : "")}
          onClick={() => setFilter("pending")}
        >
          En attente ({requests.filter(r => r.status === "pending").length})
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
              {filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td className="service-name">{req.service}</td>
                  <td>{req.type}</td>
                  <td>{req.from}</td>
                  <td>{req.to}</td>
                  <td>{req.date}</td>
                  <td>
                    <span className={`status-badge badge-${req.status === "pending" ? "warning" : "success"}`}>
                      {req.status === "pending" ? "En attente" : "Terminé"}
                    </span>
                  </td>
                  <td>
                    {req.status === "pending" && (
                      <>
                        <button className="btn btn-primary btn-sm">Accepter</button>
                        <button className="btn btn-outline btn-sm" style={{ marginLeft: "0.5rem" }}>Refuser</button>
                      </>
                    )}
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
