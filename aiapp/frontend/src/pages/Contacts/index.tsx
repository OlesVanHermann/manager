import { useState } from "react";
import "./styles.css";

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
        <p className="page-description">Vous avez la possibilité de changer les comptes administrateur, technique et facturation de vos services.</p>
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
  return (
    <div className="services-tab">
      <table className="data-table">
        <thead>
          <tr>
            <th>Nom du service</th>
            <th>Service</th>
            <th>Contact administrateur</th>
            <th>Contact technique</th>
            <th>Contact facturation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5} className="empty-cell">Aucun service</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function RequestsTab() {
  return (
    <div className="requests-tab">
      <div className="info-box">
        <p>Les demandes de changement de contact nécessitent une validation par email de la part des deux parties concernées.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Type</th>
            <th>De</th>
            <th>Vers</th>
            <th>État</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={6} className="empty-cell">Aucune demande en cours</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
