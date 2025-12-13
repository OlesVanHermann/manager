import { useState } from "react";
import "./styles.css";

const tabs = [
  { id: "communications", label: "Mes communications" },
  { id: "contacts", label: "Contacts" },
  { id: "settings", label: "Paramètres de diffusion" },
];

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState("communications");

  return (
    <div className="communication-page">
      <div className="page-header">
        <h1>Mes communications</h1>
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

      <div className="tab-content communication-content">
        {activeTab === "communications" && <CommunicationsTab />}
        {activeTab === "contacts" && <ContactsTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

function CommunicationsTab() {
  return (
    <div className="communications-tab">
      <p className="tab-description">Retrouvez l'ensemble des communications qu'OVHcloud vous a envoyées, exceptées les demandes d'assistance. Vous pouvez les consulter via la section : <a href="https://help.ovhcloud.com/csm" target="_blank" rel="noopener noreferrer">Assistance</a></p>
      <table className="data-table">
        <thead>
          <tr>
            <th>Sujet</th>
            <th>Priorité</th>
            <th>Date</th>
            <th>Catégories</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="empty-cell">Aucune communication</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ContactsTab() {
  return (
    <div className="contacts-tab">
      <div className="info-box">
        <p>Gérez les contacts qui recevront les communications OVHcloud.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="empty-cell">Aucun contact</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="settings-tab">
      <div className="info-box">
        <h3>Paramètres de diffusion</h3>
        <p>Configurez vos préférences de réception des communications OVHcloud.</p>
      </div>
      <div className="pref-card">
        <div className="pref-item">
          <div className="pref-info">
            <h3>Newsletters</h3>
            <p>Recevez les dernières actualités et offres OVHcloud</p>
          </div>
          <label className="toggle">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>
        <div className="pref-item">
          <div className="pref-info">
            <h3>Alertes commerciales</h3>
            <p>Soyez informé des promotions et nouveaux produits</p>
          </div>
          <label className="toggle">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>
        <div className="pref-item">
          <div className="pref-info">
            <h3>Notifications techniques</h3>
            <p>Maintenances, incidents et mises à jour de vos services</p>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}
