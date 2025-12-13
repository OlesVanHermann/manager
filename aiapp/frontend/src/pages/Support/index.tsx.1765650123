import { useState, useEffect } from "react";
import type { OvhCredentials } from "../../types/auth.types";
import * as supportService from "../../services/support.service";
import "./styles.css";

const STORAGE_KEY = "ovh_credentials";

const tabs = [
  { id: "tickets", label: "Mes tickets" },
  { id: "new", label: "Nouvelle demande" },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("tickets");

  return (
    <div className="support-page">
      <div className="page-header">
        <h1>Mes demandes d'assistance</h1>
        <p className="page-description">Consultez et gerez vos demandes de support technique OVHcloud.</p>
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

      <div className="tab-content support-content">
        {activeTab === "tickets" && <TicketsTab />}
        {activeTab === "new" && <NewTicketTab />}
      </div>
    </div>
  );
}

function TicketsTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<supportService.SupportTicket[]>([]);
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");

  useEffect(() => {
    loadTickets();
  }, [filter]);

  const getCredentials = (): OvhCredentials | null => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const loadTickets = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError("Non authentifie");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await supportService.getTickets(credentials, filter);
      setTickets(data);
    } catch (err) {
      // Support API peut ne pas etre disponible pour tous les comptes
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
      closed: { label: "Ferme", className: "badge-neutral" },
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
    return (
      <div className="tickets-tab">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tickets-tab">
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={loadTickets}>Reessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tickets-tab">
      <div className="filter-bar">
        <select 
          className="filter-select" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value as "all" | "open" | "closed")}
        >
          <option value="all">Tous les tickets</option>
          <option value="open">Ouverts</option>
          <option value="closed">Fermes</option>
        </select>
        <span className="result-count">{tickets.length} ticket(s)</span>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>N° Ticket</th>
            <th>Sujet</th>
            <th>Service</th>
            <th>Type</th>
            <th>Etat</th>
            <th>Derniere mise a jour</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-cell">Aucun ticket d'assistance</td>
            </tr>
          ) : (
            tickets.map((ticket) => {
              const state = getStateBadge(ticket.state);
              const type = getTypeBadge(ticket.type);
              return (
                <tr key={ticket.ticketId}>
                  <td>
                    <span className="ticket-number">#{ticket.ticketNumber}</span>
                  </td>
                  <td className="subject-cell">{ticket.subject}</td>
                  <td>{ticket.serviceName || "-"}</td>
                  <td><span className={`badge ${type.className}`}>{type.label}</span></td>
                  <td><span className={`badge ${state.className}`}>{state.label}</span></td>
                  <td>
                    <div className="update-info">
                      <span>{formatDate(ticket.updateDate)}</span>
                      <span className="last-from">
                        {ticket.lastMessageFrom === "support" ? "Reponse support" : "Votre message"}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className="table-actions">
        <a href="https://help.ovhcloud.com/csm" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
          Centre d'aide OVHcloud
        </a>
      </div>
    </div>
  );
}

function NewTicketTab() {
  return (
    <div className="new-ticket-tab">
      <div className="info-box">
        <h3>Creer une demande d'assistance</h3>
        <p>Pour creer un nouveau ticket de support, vous serez redirige vers le centre d'aide OVHcloud ou vous pourrez decrire votre probleme et selectionner le service concerne.</p>
      </div>
      <div className="quick-links">
        <h4>Ressources utiles</h4>
        <ul>
          <li><a href="https://docs.ovh.com" target="_blank" rel="noopener noreferrer">Documentation OVHcloud</a></li>
          <li><a href="https://community.ovh.com" target="_blank" rel="noopener noreferrer">Communaute OVHcloud</a></li>
          <li><a href="https://status.ovhcloud.com" target="_blank" rel="noopener noreferrer">Etat des services (Travaux)</a></li>
        </ul>
      </div>
      <a href="https://help.ovhcloud.com/csm?id=csm_get_help" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
        Creer un ticket
      </a>
    </div>
  );
}
