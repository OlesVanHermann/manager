// ============================================================
// SUPPORT PAGE - Support
// 5 Tabs: Tickets, Créer, Niveau, Communications, Diffusion
// ============================================================

import { useState, useEffect } from "react";
import type { OvhCredentials } from "../../../types/auth.types";
import * as supportService from "../../../services/support.service";
import * as accountService from "../../../services/account.service";
import "./styles.css";

const STORAGE_KEY = "ovh_credentials";

interface SupportPageProps {
  initialTab?: string;
}

const tabs = [
  { id: "tickets", label: "Mes tickets" },
  { id: "create", label: "Créer un nouveau ticket" },
  { id: "level", label: "Mon niveau de support" },
  { id: "communications", label: "Mes communications" },
  { id: "broadcast", label: "Paramètres de diffusion" },
];

// Mapping des IDs de navigation vers les IDs de tabs
const tabIdMap: Record<string, string> = {
  "support-tickets": "tickets",
  "support-create": "create",
  "support-level": "level",
  "support-communications": "communications",
  "support-broadcast": "broadcast",
};

function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

export default function SupportPage({ initialTab = "tickets" }: SupportPageProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      const mappedTab = tabIdMap[initialTab] || initialTab;
      if (tabs.find(t => t.id === mappedTab)) {
        setActiveTab(mappedTab);
      }
    }
  }, [initialTab]);

  return (
    <div className="support-page">
      <div className="page-header">
        <h1>Support</h1>
        <p className="page-description">Gérez vos demandes d'assistance et votre niveau de support OVHcloud.</p>
      </div>

      <div className="tabs-container">
        <div className="tabs-list">
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
      </div>

      <div className="tab-content support-content">
        {activeTab === "tickets" && <TicketsTab />}
        {activeTab === "create" && <CreateTicketTab />}
        {activeTab === "level" && <SupportLevelTab />}
        {activeTab === "communications" && <CommunicationsTab />}
        {activeTab === "broadcast" && <BroadcastTab />}
      </div>
    </div>
  );
}

// ============================================================
// TICKETS TAB - Liste des tickets
// ============================================================
function TicketsTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<supportService.SupportTicket[]>([]);
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");

  useEffect(() => { loadTickets(); }, [filter]);

  const loadTickets = async () => {
    const credentials = getCredentials();
    if (!credentials) { setError("Non authentifié"); setLoading(false); return; }

    setLoading(true);
    setError(null);

    try {
      const data = await supportService.getTickets(credentials, filter);
      setTickets(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur";
      if (message.includes("404") || message.includes("not found")) {
        setTickets([]);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getStateBadge = (state: string) => {
    const stateMap: Record<string, { label: string; className: string }> = {
      open: { label: "Ouvert", className: "badge-success" },
      closed: { label: "Fermé", className: "badge-neutral" },
      unknown: { label: "Inconnu", className: "badge-neutral" },
    };
    return stateMap[state] || { label: state, className: "badge-neutral" };
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      assistance: { label: "Assistance", className: "badge-info" },
      billing: { label: "Facturation", className: "badge-warning" },
      incident: { label: "Incident", className: "badge-error" },
    };
    return typeMap[type] || { label: type, className: "badge-neutral" };
  };

  if (loading) {
    return <div className="tickets-tab"><div className="loading-state"><div className="spinner"></div><p>Chargement des tickets...</p></div></div>;
  }

  if (error) {
    return <div className="tickets-tab"><div className="error-banner"><span>{error}</span><button onClick={loadTickets}>Réessayer</button></div></div>;
  }

  return (
    <div className="tickets-tab">
      <div className="filter-bar">
        <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value as "all" | "open" | "closed")}>
          <option value="all">Tous les tickets</option>
          <option value="open">Ouverts</option>
          <option value="closed">Fermés</option>
        </select>
        <span className="result-count">{tickets.length} ticket(s)</span>
      </div>

      {tickets.length === 0 ? (
        <div className="empty-state">
          <TicketIcon />
          <h3>Aucun ticket</h3>
          <p>Vous n'avez pas de demande d'assistance en cours.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>N° Ticket</th>
              <th>Sujet</th>
              <th>Service</th>
              <th>Type</th>
              <th>État</th>
              <th>Dernière mise à jour</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => {
              const state = getStateBadge(ticket.state);
              const type = getTypeBadge(ticket.type);
              return (
                <tr key={ticket.ticketId}>
                  <td><span className="ticket-number">#{ticket.ticketNumber}</span></td>
                  <td className="subject-cell">{ticket.subject}</td>
                  <td>{ticket.serviceName || "-"}</td>
                  <td><span className={`badge ${type.className}`}>{type.label}</span></td>
                  <td><span className={`badge ${state.className}`}>{state.label}</span></td>
                  <td>
                    <div className="update-info">
                      <span>{formatDate(ticket.updateDate)}</span>
                      <span className="last-from">{ticket.lastMessageFrom === "support" ? "Réponse support" : "Votre message"}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="table-actions">
        <a href="https://help.ovhcloud.com/csm" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Centre d'aide OVHcloud</a>
      </div>
    </div>
  );
}

// ============================================================
// CREATE TICKET TAB
// ============================================================
function CreateTicketTab() {
  return (
    <div className="new-ticket-tab">
      <div className="info-box">
        <h3>Créer une demande d'assistance</h3>
        <p>Pour créer un nouveau ticket de support, vous serez redirigé vers le centre d'aide OVHcloud où vous pourrez décrire votre problème et sélectionner le service concerné.</p>
      </div>
      <div className="quick-links">
        <h4>Ressources utiles</h4>
        <ul>
          <li><a href="https://docs.ovh.com" target="_blank" rel="noopener noreferrer">Documentation OVHcloud</a></li>
          <li><a href="https://community.ovh.com" target="_blank" rel="noopener noreferrer">Communauté OVHcloud</a></li>
          <li><a href="https://status.ovhcloud.com" target="_blank" rel="noopener noreferrer">État des services (Travaux)</a></li>
        </ul>
      </div>
      <a href="https://help.ovhcloud.com/csm?id=csm_get_help" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Créer un ticket</a>
    </div>
  );
}

// ============================================================
// SUPPORT LEVEL TAB
// ============================================================
interface SupportLevelInfo {
  id: string;
  name: string;
  description: string;
  features: string[];
  price?: string;
  isCurrent: boolean;
  actionType: "none" | "included" | "upgrade" | "contact";
}

const SUPPORT_LEVELS: Omit<SupportLevelInfo, "isCurrent">[] = [
  { id: "standard", name: "Standard", description: "Support de base inclus avec tous les produits OVHcloud.", features: ["Accès aux guides et documentation", "Communauté et forum", "Assistance par ticket", "Temps de réponse sous 8h ouvrées"], price: "Inclus", actionType: "included" },
  { id: "premium", name: "Premium", description: "Support prioritaire pour les besoins professionnels.", features: ["Tout le niveau Standard", "Support téléphonique", "Temps de réponse sous 2h", "Suivi personnalisé", "Support 24/7 pour les incidents"], price: "Sur devis", actionType: "contact" },
  { id: "business", name: "Business", description: "Support avancé pour les entreprises exigeantes.", features: ["Tout le niveau Premium", "Technical Account Manager dédié", "Temps de réponse sous 1h", "Support 24/7 téléphone et tickets", "Priorisation des demandes"], price: "Sur devis", actionType: "contact" },
  { id: "enterprise", name: "Enterprise", description: "Support sur mesure pour les grands comptes.", features: ["Tout le niveau Business", "Équipe dédiée", "SLA personnalisés", "Accès aux roadmaps produits", "Temps de réponse 15 min (P1)"], price: "Sur devis", actionType: "contact" },
];

const SUPPORT_URLS = {
  comparison: "https://www.ovhcloud.com/fr/support-levels/",
  contact: "https://www.ovhcloud.com/fr/contact/",
};

function SupportLevelTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<string>("standard");

  useEffect(() => { loadSupportLevel(); }, []);

  const loadSupportLevel = async () => {
    const credentials = getCredentials();
    if (!credentials) { setError("Non authentifié"); setLoading(false); return; }
    try {
      const level = await accountService.getSupportLevel(credentials);
      const normalizedLevel = level.level?.toLowerCase().replace("-accredited", "") || "standard";
      setCurrentLevel(normalizedLevel);
    } catch { setCurrentLevel("standard"); }
    finally { setLoading(false); }
  };

  if (loading) {
    return <div className="support-level-tab"><div className="loading-state"><div className="spinner"></div><p>Chargement du niveau de support...</p></div></div>;
  }

  if (error) {
    return <div className="support-level-tab"><div className="error-state"><p>{error}</p><button onClick={loadSupportLevel} className="btn btn-primary">Réessayer</button></div></div>;
  }

  const levels: SupportLevelInfo[] = SUPPORT_LEVELS.map(level => ({ ...level, isCurrent: level.id === currentLevel }));
  const currentLevelInfo = levels.find(l => l.isCurrent);

  return (
    <div className="support-level-tab">
      <div className="support-header">
        <h2>Mon niveau de support</h2>
        <p>Choisissez le niveau de support adapté à vos besoins.</p>
        <a href={SUPPORT_URLS.comparison} target="_blank" rel="noopener noreferrer" className="comparison-link">Voir le comparatif complet</a>
      </div>

      {currentLevelInfo && (
        <div className="current-level-banner">
          <div className="current-level-info">
            <span className="current-label">Votre niveau actuel</span>
            <span className="current-name">{currentLevelInfo.name}</span>
          </div>
          <span className="badge badge-primary">Actif</span>
        </div>
      )}

      <div className="support-levels-grid">
        {levels.map((level) => (
          <div key={level.id} className={`support-level-card ${level.isCurrent ? "current" : ""}`}>
            <div className="level-header">
              <h3>{level.name}</h3>
              {level.isCurrent && <span className="badge badge-success">Actuel</span>}
            </div>
            <p className="level-description">{level.description}</p>
            <div className="level-price">{level.price}</div>
            <ul className="level-features">
              {level.features.map((feature, idx) => (<li key={idx}>{feature}</li>))}
            </ul>
            <div className="level-actions">
              {level.isCurrent ? (
                <button className="btn btn-secondary" disabled>Niveau actuel</button>
              ) : level.actionType === "included" ? (
                <span className="included-text">Inclus par défaut</span>
              ) : (
                <a href={SUPPORT_URLS.comparison} target="_blank" rel="noopener noreferrer" className="btn btn-primary">En savoir plus</a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="support-contact">
        <h3>Besoin d'aide pour choisir ?</h3>
        <p>Contactez nos équipes commerciales.</p>
        <a href={SUPPORT_URLS.contact} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Contacter un conseiller</a>
      </div>
    </div>
  );
}

// ============================================================
// COMMUNICATIONS TAB - Emails et notifications reçus
// ============================================================
function CommunicationsTab() {
  const [loading, setLoading] = useState(true);
  const [communications, setCommunications] = useState<any[]>([]);

  useEffect(() => {
    // TODO: API /me/notification ou /me/email
    const timer = setTimeout(() => {
      setCommunications([
        { id: "1", subject: "Facture disponible - Janvier 2025", date: "2025-01-15", type: "billing", read: true },
        { id: "2", subject: "Maintenance prévue sur votre VPS", date: "2025-01-10", type: "incident", read: true },
        { id: "3", subject: "Nouvelle fonctionnalité disponible", date: "2025-01-05", type: "news", read: false },
      ]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  const getTypeBadge = (type: string) => {
    const map: Record<string, { label: string; className: string }> = {
      billing: { label: "Facturation", className: "badge-info" },
      incident: { label: "Incident", className: "badge-warning" },
      news: { label: "Actualité", className: "badge-success" },
    };
    return map[type] || { label: type, className: "badge-neutral" };
  };

  if (loading) {
    return <div className="communications-tab"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  }

  return (
    <div className="communications-tab">
      <div className="section-header">
        <h2>Mes communications</h2>
        <p>Retrouvez les emails et notifications que vous avez reçus de la part d'OVHcloud.</p>
      </div>

      {communications.length === 0 ? (
        <div className="empty-state">
          <MailIcon />
          <h3>Aucune communication</h3>
          <p>Vous n'avez pas reçu de communication récente.</p>
        </div>
      ) : (
        <div className="communications-list">
          {communications.map((c) => {
            const type = getTypeBadge(c.type);
            return (
              <div key={c.id} className={`communication-item ${c.read ? "" : "unread"}`}>
                <div className="communication-icon">
                  <MailIcon />
                </div>
                <div className="communication-content">
                  <h4>{c.subject}</h4>
                  <div className="communication-meta">
                    <span className="communication-date">{formatDate(c.date)}</span>
                    <span className={`badge ${type.className}`}>{type.label}</span>
                  </div>
                </div>
                {!c.read && <span className="unread-dot"></span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// BROADCAST TAB - Paramètres de diffusion
// ============================================================
function BroadcastTab() {
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    incidents: true,
    billing: true,
    news: false,
    marketing: false,
  });

  useEffect(() => {
    // TODO: API /me/marketing ou /me/notification/preferences
    const timer = setTimeout(() => { setLoading(false); }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    // TODO: Appeler l'API pour sauvegarder
  };

  if (loading) {
    return <div className="broadcast-tab"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  }

  return (
    <div className="broadcast-tab">
      <div className="section-header">
        <h2>Paramètres de diffusion</h2>
        <p>Configurez les types de communications que vous souhaitez recevoir.</p>
      </div>

      <div className="preferences-list">
        <div className="preference-item">
          <div className="preference-info">
            <h4>Incidents et maintenances</h4>
            <p>Notifications concernant les incidents et maintenances programmées sur vos services.</p>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={preferences.incidents} onChange={() => handleToggle("incidents")} />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="preference-item">
          <div className="preference-info">
            <h4>Facturation</h4>
            <p>Notifications de factures, paiements et renouvellements.</p>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={preferences.billing} onChange={() => handleToggle("billing")} />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="preference-item">
          <div className="preference-info">
            <h4>Actualités produits</h4>
            <p>Informations sur les nouvelles fonctionnalités et mises à jour.</p>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={preferences.news} onChange={() => handleToggle("news")} />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="preference-item">
          <div className="preference-info">
            <h4>Communications marketing</h4>
            <p>Offres promotionnelles et événements OVHcloud.</p>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={preferences.marketing} onChange={() => handleToggle("marketing")} />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="preferences-footer">
        <p className="preferences-note">Les notifications critiques de sécurité seront toujours envoyées.</p>
      </div>
    </div>
  );
}

// ============================================================
// ICONS
// ============================================================
function TicketIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" /></svg>;
}

function MailIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>;
}
