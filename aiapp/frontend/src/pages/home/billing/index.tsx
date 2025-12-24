// ============================================================
// BILLING PAGE - Facturation
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCredentials } from "./utils";
import { LockIcon, BookIcon } from "./icons";
import {
  ServicesTab, InvoicesTab, RefundsTab, PaymentsTab,
  OrdersTab, ReferencesTab, MethodsTab, PrepaidTab,
  VouchersTab, FidelityTab, ContractsTab
} from "./tabs";
import "./index.css";

interface BillingPageProps {
  isActive: boolean;
  initialTab?: string;
}

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
  const { t } = useTranslation('home/billing/index');
  const [activeTab, setActiveTab] = useState(initialTab);
  const credentials = useCredentials();

  const tabs = [
    { id: "services", label: t('tabs.services') },
    { id: "invoices", label: t('tabs.invoices') },
    { id: "refunds", label: t('tabs.refunds') },
    { id: "payments", label: t('tabs.payments') },
    { id: "orders", label: t('tabs.orders') },
    { id: "references", label: t('tabs.references') },
    { id: "methods", label: t('tabs.methods') },
    { id: "prepaid", label: t('tabs.prepaid') },
    { id: "vouchers", label: t('tabs.vouchers') },
    { id: "fidelity", label: t('tabs.fidelity') },
    { id: "contracts", label: t('tabs.contracts') },
  ];

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
        <div className="billing-header">
          <div className="billing-header-content">
            <h1>{t('title')}</h1>
            <p className="billing-subtitle">{t('subtitleNoAuth')}</p>
          </div>
        </div>
        <div className="billing-content">
          <div className="billing-empty-state">
            <LockIcon />
            <h3>{t('authRequired.title')}</h3>
            <p>{t('authRequired.description')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-page">
      <div className="billing-header">
        <div className="billing-header-content">
          <h1>{t('title')}</h1>
          <p className="billing-subtitle">{t('subtitle')}</p>
        </div>
        <a href="https://help.ovhcloud.com/csm/fr-billing-faq" target="_blank" rel="noopener noreferrer" className="billing-guides-link">
          <BookIcon /> {t('guides')}
        </a>
      </div>

      <div className="billing-tabs-container">
        <div className="billing-tabs-list">
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
