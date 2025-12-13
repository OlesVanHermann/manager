import { useState } from "react";
import "./styles.css";

const tabs = [
  { id: "methods", label: "Mes moyens de paiement" },
  { id: "prepaid", label: "Mon compte prépayé" },
  { id: "credits", label: "Mes bons d'achat" },
  { id: "fidelity", label: "Mes points" },
];

export default function PaymentPage() {
  const [activeTab, setActiveTab] = useState("methods");

  return (
    <div className="payment-page">
      <div className="page-header">
        <h1>Moyens de paiement</h1>
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

      <div className="tab-content payment-content">
        {activeTab === "methods" && <MethodsTab />}
        {activeTab === "prepaid" && <PrepaidTab />}
        {activeTab === "credits" && <CreditsTab />}
        {activeTab === "fidelity" && <FidelityTab />}
      </div>
    </div>
  );
}

function MethodsTab() {
  return (
    <div className="methods-tab">
      <div className="info-box">
        <p>Lorsque vous enregistrez un moyen de paiement, vous autorisez OVH S.A.S à le conserver afin de faciliter le règlement de vos commandes futures. Le moyen de paiement que vous enregistrez en tant que moyen de paiement « par défaut » est utilisé automatiquement à chaque échéance, pour le paiement de vos services en renouvellement automatique et en paiement à l'usage (« Pay as you go »).</p>
      </div>
      <div className="table-actions">
        <a href="https://www.ovh.com/manager/#/dedicated/billing/payment/method" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Ajouter un moyen de paiement</a>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Type de paiement</th>
            <th>Compte</th>
            <th>Date d'expiration</th>
            <th>Description</th>
            <th>Moyen de paiement par défaut</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={6} className="empty-cell">Aucun moyen de paiement enregistré</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PrepaidTab() {
  return (
    <div className="prepaid-tab">
      <div className="balance-card">
        <h3>Solde du compte prépayé</h3>
        <div className="balance-amount">0,00 €</div>
        <p className="balance-info">Le compte prépayé permet de payer vos factures OVHcloud. Vous pouvez le créditer à tout moment.</p>
      </div>
      <h4>Historique des mouvements</h4>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3} className="empty-cell">Aucun mouvement</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function CreditsTab() {
  return (
    <div className="credits-tab">
      <div className="info-box">
        <p>Les bons d'achat sont des crédits offerts par OVHcloud utilisables pour vos prochaines commandes.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Montant</th>
            <th>Validité</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="empty-cell">Aucun bon d'achat disponible</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function FidelityTab() {
  return (
    <div className="fidelity-tab">
      <div className="points-card">
        <h3>Mes points de fidélité</h3>
        <div className="points-amount">0 points</div>
        <p className="points-info">Cumulez des points à chaque commande et convertissez-les en réduction sur vos prochains achats.</p>
      </div>
      <h4>Historique des points</h4>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Opération</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3} className="empty-cell">Aucun historique de points</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
