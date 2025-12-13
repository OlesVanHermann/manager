import { useState, useEffect } from "react";
import "./styles.css";

const tabs = [
  { id: "invoices", label: "Factures" },
  { id: "payments", label: "Suivi des paiements" },
  { id: "credits", label: "Mes avoirs" },
  { id: "methods", label: "Moyens de paiement" },
  { id: "prepaid", label: "Compte prépayé" },
  { id: "vouchers", label: "Bons d'achat" },
  { id: "fidelity", label: "Points de fidélité" },
];

interface BillingPageProps {
  isActive: boolean;
  initialTab?: string;
}

export function BillingPage({ isActive, initialTab = "invoices" }: BillingPageProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  if (!isActive) return null;

  return (
    <div className="billing-page">
      <div className="page-header">
        <h1>Mes factures</h1>
        <p className="page-description">Retrouvez et téléchargez vos factures. Suivez l'état de vos paiements. Gérez vos moyens de paiement.</p>
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

      <div className="tab-content billing-content">
        {activeTab === "invoices" && <InvoicesTab />}
        {activeTab === "payments" && <PaymentsTab />}
        {activeTab === "credits" && <CreditsTab />}
        {activeTab === "methods" && <MethodsTab />}
        {activeTab === "prepaid" && <PrepaidTab />}
        {activeTab === "vouchers" && <VouchersTab />}
        {activeTab === "fidelity" && <FidelityTab />}
      </div>
    </div>
  );
}

function InvoicesTab() {
  return (
    <div className="invoices-tab">
      <div className="table-toolbar">
        <div className="toolbar-left">
          <button className="btn btn-outline">Actions de masse ▼</button>
        </div>
        <div className="toolbar-right">
          <input type="text" placeholder="Rechercher..." className="search-input" />
          <button className="btn btn-outline">Filtrer</button>
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Référence</th>
            <th>Numéro de commande</th>
            <th>Date d'émission</th>
            <th>Montant HT</th>
            <th>Montant TTC</th>
            <th>Solde</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={9} className="empty-cell">Aucune facture</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PaymentsTab() {
  return (
    <div className="payments-tab">
      <div className="info-box">
        <p>La liste suivante présente les paiements qui ont été réalisés sur votre moyen de paiement par défaut. Chacun des paiements peut regrouper une ou plusieurs factures.</p>
      </div>
      <div className="table-toolbar">
        <div className="toolbar-left">
          <button className="btn btn-outline">Exporter en CSV</button>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-outline">Filtrer</button>
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Référence</th>
            <th>Date de paiement</th>
            <th>Montant total</th>
            <th>Moyen de paiement</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5} className="empty-cell">Aucun paiement</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function CreditsTab() {
  return (
    <div className="credits-tab">
      <div className="period-filter">
        <button className="btn btn-sm btn-primary">3 mois</button>
        <button className="btn btn-sm btn-outline">6 mois</button>
        <button className="btn btn-sm btn-outline">1 an</button>
        <button className="btn btn-sm btn-outline">Définir une période</button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Référence</th>
            <th>Associé à la facture</th>
            <th>Crédité sur</th>
            <th>Montant TTC</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5} className="empty-cell">Vous n'avez pas d'avoir pour la période sélectionnée</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function MethodsTab() {
  return (
    <div className="methods-tab">
      <div className="info-box">
        <p>Lorsque vous enregistrez un moyen de paiement, vous autorisez OVH S.A.S à le conserver afin de faciliter le règlement de vos commandes futures. Le moyen de paiement « par défaut » est utilisé automatiquement à chaque échéance.</p>
      </div>
      <div className="table-toolbar">
        <div className="toolbar-left">
          <a href="https://www.ovh.com/manager/#/dedicated/billing/payment/method/add" target="_blank" rel="noopener noreferrer" className="btn btn-primary">+ Ajouter un moyen de paiement</a>
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Type de paiement</th>
            <th>Compte</th>
            <th>Date d'expiration</th>
            <th>Description</th>
            <th>Par défaut</th>
            <th>État</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7} className="empty-cell">Aucun moyen de paiement enregistré</td>
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
        <a href="https://www.ovh.com/manager/#/dedicated/billing/ovhaccount/credit" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Créditer mon compte</a>
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

function VouchersTab() {
  return (
    <div className="vouchers-tab">
      <div className="info-box">
        <p>Les bons d'achat sont des crédits offerts par OVHcloud utilisables pour vos prochaines commandes.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Montant initial</th>
            <th>Montant restant</th>
            <th>Validité</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5} className="empty-cell">Aucun bon d'achat disponible</td>
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
        <a href="https://www.ovh.com/manager/#/dedicated/billing/fidelity" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Utiliser mes points</a>
      </div>
      <h4>Historique des points</h4>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Opération</th>
            <th>Points</th>
            <th>Solde</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="empty-cell">Aucun historique de points</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BillingPage;
