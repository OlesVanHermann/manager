import { useState } from "react";
import "./styles.css";

const tabs = [
  { id: "identities", label: "Identités" },
  { id: "policies", label: "Politiques" },
  { id: "groups", label: "Groupes" },
  { id: "logs", label: "Logs" },
];

export default function IamPage() {
  const [activeTab, setActiveTab] = useState("identities");

  return (
    <div className="iam-page">
      <div className="page-header">
        <h1>Identité, Sécurité & Opérations</h1>
        <p className="page-description">Gérez les identités, les politiques d'accès et les groupes de votre compte OVHcloud.</p>
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

      <div className="tab-content iam-content">
        {activeTab === "identities" && <IdentitiesTab />}
        {activeTab === "policies" && <PoliciesTab />}
        {activeTab === "groups" && <GroupsTab />}
        {activeTab === "logs" && <LogsTab />}
      </div>
    </div>
  );
}

function IdentitiesTab() {
  return (
    <div className="identities-tab">
      <div className="info-box">
        <p>Gérez les utilisateurs et les identités qui ont accès à votre compte OVHcloud.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Identifiant</th>
            <th>Type</th>
            <th>Email</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5} className="empty-cell">Aucune identité</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PoliciesTab() {
  return (
    <div className="policies-tab">
      <div className="info-box">
        <p>Définissez les politiques d'accès pour contrôler les permissions sur vos ressources.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Ressources</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="empty-cell">Aucune politique</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function GroupsTab() {
  return (
    <div className="groups-tab">
      <div className="info-box">
        <p>Organisez vos utilisateurs en groupes pour simplifier la gestion des accès.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Nom du groupe</th>
            <th>Description</th>
            <th>Membres</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="empty-cell">Aucun groupe</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function LogsTab() {
  return (
    <div className="logs-tab">
      <div className="info-box">
        <p>Consultez l'historique des actions effectuées sur votre compte.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Utilisateur</th>
            <th>Action</th>
            <th>Ressource</th>
            <th>Résultat</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5} className="empty-cell">Aucun log</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
