// ============================================================
// BILLING PAGE - Facturation
// NAV1: general / NAV2: billing
// Tabs: general (services), invoices, refunds, payments, orders, references, methods, prepaid, vouchers, fidelity, contracts
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCredentials } from "../../../services/api";
import type { OvhCredentials } from "../../../types/auth.types";
import { GeneralTab } from "./tabs/general/GeneralTab";
import { InvoicesTab } from "./tabs/invoices/InvoicesTab";
import { RefundsTab } from "./tabs/refunds/RefundsTab";
import { PaymentsTab } from "./tabs/payments/PaymentsTab";
import { OrdersTab } from "./tabs/orders/OrdersTab";
import { ReferencesTab } from "./tabs/references/ReferencesTab";
import { MethodsTab } from "./tabs/methods/MethodsTab";
import { PrepaidTab } from "./tabs/prepaid/PrepaidTab";
import { VouchersTab } from "./tabs/vouchers/VouchersTab";
import { FidelityTab } from "./tabs/fidelity/FidelityTab";
import { ContractsTab } from "./tabs/contracts/ContractsTab";
import "./index.css";

// ============ ICONS (inline) ============

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="48" height="48">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

// ============ HOOK (inline) ============

function useCredentials() {
  const [credentials, setCredentials] = useState<OvhCredentials | null>(null);
  useEffect(() => { setCredentials(getCredentials()); }, []);
  return credentials;
}

// ============ TYPES ============

interface BillingPageProps {
  isActive: boolean;
  initialTab?: string;
}

const tabIdMap: Record<string, string> = {
  "billing-general": "general",
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

// ============ COMPOSANT ============

export function BillingPage({ isActive, initialTab = "general" }: BillingPageProps) {
  const { t } = useTranslation('general/billing/index');
  const [activeTab, setActiveTab] = useState(initialTab);
  const credentials = useCredentials();

  const tabs = [
    { id: "general", label: t('tabs.general', 'Mes services') },
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
        {activeTab === "general" && <GeneralTab credentials={credentials} />}
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
