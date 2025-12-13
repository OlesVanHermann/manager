import { useState } from "react";
import "./styles.css";

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
        <p className="page-description">Consultez et gérez vos demandes de support technique OVHcloud.</p>
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
  return (
    <div className="tickets-tab">
      <div className="filter-bar">
        <select className="filter-select">
          <option value="all">Tous les tickets</option>
          <option value="open">Ouverts</option>
          <option value="closed">Fermés</option>
        </select>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>N° Ticket</th>
            <th>Sujet</th>
            <th>Service</th>
            <th>État</th>
            <th>Dernière mise à jour</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5} className="empty-cell">Aucun ticket d'assistance</td>
          </tr>
        </tbody>
      </table>
      <div className="table-actions">
        <a href="https://help.ovhcloud.com/csm" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Centre d'aide OVHcloud</a>
      </div>
    </div>
  );
}

function NewTicketTab() {
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
