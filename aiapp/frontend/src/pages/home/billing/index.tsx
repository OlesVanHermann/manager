// ============================================================
// BILLING PAGE - Facturation
// ============================================================

import { useState, useEffect } from "react";
import { useCredentials } from "./utils";
import { LockIcon, BookIcon } from "./icons";
import {
  ServicesTab, InvoicesTab, RefundsTab, PaymentsTab,
  OrdersTab, ReferencesTab, MethodsTab, PrepaidTab,
  VouchersTab, FidelityTab, ContractsTab
} from "./tabs";
import "./styles.css";

interface BillingPageProps {
  isActive: boolean;
  initialTab?: string;
}

const tabs = [
  { id: "services", label: "Mes services" },
  { id: "invoices", label: "Factures" },
  { id: "refunds", label: "Avoirs" },
  { id: "payments", label: "Paiement" },
  { id: "orders", label: "Commandes" },
  { id: "references", label: "Mes références internes" },
  { id: "methods", label: "Moyens de paiement" },
  { id: "prepaid", label: "Compte prépayé" },
  { id: "vouchers", label: "Bon d'achat" },
  { id: "fidelity", label: "Points de fidélité" },
  { id: "contracts", label: "Contrats" },
];

const tabIdMap: Record<string, string> = {
  "billing-services": "services",
  "billing-invoices": "invoices",
  "billing-refunds": "refunds",
  "billing-payments": "payments",
  "billing-orders": "orders",
  "billing-references": "references",
  "billing-methods": "methods",
  "billing-prepaid": "prepaid",
  "billing-vouchers": "vouchers",
  "billing-fidelity": "fidelity",
  "billing-contracts": "contracts",
};

export function BillingPage({ isActive, initialTab = "services" }: BillingPageProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const credentials = useCredentials();

  useEffect(() => {
    if (initialTab) {
      const mappedTab = tabIdMap[initialTab] || initialTab;
      if (tabs.find(t => t.id === mappedTab)) {
        setActiveTab(mappedTab);
      }
    }
  }, [initialTab]);

  if (!isActive) return null;

  if (!credentials) {
    return (
      <div className="billing-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1>Facturation</h1>
            <p className="page-subtitle">Connectez-vous pour accéder à vos factures et moyens de paiement.</p>
          </div>
        </div>
        <div className="billing-content">
          <div className="empty-state">
            <LockIcon />
            <h3>Authentification requise</h3>
            <p>Veuillez vous connecter avec vos identifiants OVH pour accéder à cette section.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>Facturation</h1>
          <p className="page-subtitle">Gérez vos services, factures, paiements et moyens de paiement.</p>
        </div>
        <a href="https://help.ovhcloud.com/csm/fr-billing-faq" target="_blank" rel="noopener noreferrer" className="guides-link">
          <BookIcon /> Guides
        </a>
      </div>

      <div className="tabs-container">
        <div className="tabs-list">
          {tabs.map((tab) => (
            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div className="billing-content">
        {activeTab === "services" && <ServicesTab credentials={credentials} />}
        {activeTab === "invoices" && <InvoicesTab credentials={credentials} />}
        {activeTab === "refunds" && <RefundsTab credentials={credentials} />}
        {activeTab === "payments" && <PaymentsTab credentials={credentials} />}
        {activeTab === "orders" && <OrdersTab credentials={credentials} />}
        {activeTab === "references" && <ReferencesTab credentials={credentials} />}
        {activeTab === "methods" && <MethodsTab credentials={credentials} />}
        {activeTab === "prepaid" && <PrepaidTab credentials={credentials} />}
        {activeTab === "vouchers" && <VouchersTab credentials={credentials} />}
        {activeTab === "fidelity" && <FidelityTab credentials={credentials} />}
        {activeTab === "contracts" && <ContractsTab credentials={credentials} />}
      </div>
    </div>
  );
}

export default BillingPage;
