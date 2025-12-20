// ============================================================
// EMAILS & COLLAB - Page combinée tous les produits email
// NAV3: MX Plan | Email Pro | Exchange | Zimbra | Office 365
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { emailDomainService } from "../../../services/web-cloud.email-domain";
import { emailProService } from "../../../services/web-cloud.email-pro";
import { exchangeService } from "../../../services/web-cloud.exchange";
import { zimbraService } from "../../../services/web-cloud.zimbra";
import { officeService } from "../../../services/web-cloud.office";
import { AccountsTab as MxAccountsTab, RedirectionsTab, MailingListsTab, TasksTab as MxTasksTab } from "../email-domain/tabs";
import { AccountsTab as ProAccountsTab, DomainsTab as ProDomainsTab, TasksTab as ProTasksTab } from "../email-pro/tabs";
import { AccountsTab as ExAccountsTab, DomainsTab as ExDomainsTab, GroupsTab, ResourcesTab, TasksTab as ExTasksTab } from "../exchange/tabs";
import { AccountsTab as ZimbraAccountsTab, DomainsTab as ZimbraDomainsTab, AliasesTab, TasksTab as ZimbraTasksTab } from "../zimbra/tabs";
import { UsersTab as OfficeUsersTab, DomainsTab as OfficeDomainsTab, TasksTab as OfficeTasksTab } from "../office/tabs";
import "../styles.css";

// ============================================================
// TYPES
// ============================================================

type ProductType = "mx-plan" | "email-pro" | "exchange" | "zimbra" | "office";

interface EmailService {
  name: string;
  type: ProductType;
  loading: boolean;
  error?: string;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

/** Page Emails & Collab - Combine tous les produits email avec navigation NAV3. */
export default function EmailsPage() {
  const { t } = useTranslation("web-cloud/emails/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- NAV3 STATE ----------
  const [activeProduct, setActiveProduct] = useState<ProductType>("mx-plan");

  // ---------- SERVICES STATE ----------
  const [mxPlans, setMxPlans] = useState<EmailService[]>([]);
  const [emailPros, setEmailPros] = useState<EmailService[]>([]);
  const [exchanges, setExchanges] = useState<EmailService[]>([]);
  const [zimbras, setZimbras] = useState<EmailService[]>([]);
  const [offices, setOffices] = useState<EmailService[]>([]);

  // ---------- SELECTION STATE ----------
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("accounts");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // ---------- TABS BY PRODUCT ----------
  const tabsByProduct: Record<ProductType, { id: string; labelKey: string }[]> = {
    "mx-plan": [
      { id: "accounts", labelKey: "tabs.accounts" },
      { id: "redirections", labelKey: "tabs.redirections" },
      { id: "mailing-lists", labelKey: "tabs.mailingLists" },
      { id: "tasks", labelKey: "tabs.tasks" },
    ],
    "email-pro": [
      { id: "accounts", labelKey: "tabs.accounts" },
      { id: "domains", labelKey: "tabs.domains" },
      { id: "tasks", labelKey: "tabs.tasks" },
    ],
    "exchange": [
      { id: "accounts", labelKey: "tabs.accounts" },
      { id: "domains", labelKey: "tabs.domains" },
      { id: "groups", labelKey: "tabs.groups" },
      { id: "resources", labelKey: "tabs.resources" },
      { id: "tasks", labelKey: "tabs.tasks" },
    ],
    "zimbra": [
      { id: "accounts", labelKey: "tabs.accounts" },
      { id: "domains", labelKey: "tabs.domains" },
      { id: "aliases", labelKey: "tabs.aliases" },
      { id: "tasks", labelKey: "tabs.tasks" },
    ],
    "office": [
      { id: "users", labelKey: "tabs.users" },
      { id: "domains", labelKey: "tabs.domains" },
      { id: "tasks", labelKey: "tabs.tasks" },
    ],
  };

  // ---------- LOAD ALL SERVICES ----------
  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const [mxList, proList, exList, zimbraList, officeList] = await Promise.all([
        emailDomainService.listDomains().catch(() => []),
        emailProService.listServices().catch(() => []),
        exchangeService.listOrganizations().catch(() => []),
        zimbraService.listPlatforms().catch(() => []),
        officeService.listTenants().catch(() => []),
      ]);
      setMxPlans(mxList.map((name: string) => ({ name, type: "mx-plan" as ProductType, loading: false })));
      setEmailPros(proList.map((name: string) => ({ name, type: "email-pro" as ProductType, loading: false })));
      setExchanges(exList.map((name: string) => ({ name, type: "exchange" as ProductType, loading: false })));
      setZimbras(zimbraList.map((name: string) => ({ name, type: "zimbra" as ProductType, loading: false })));
      setOffices(officeList.map((name: string) => ({ name, type: "office" as ProductType, loading: false })));
    } catch (err) {
      console.error("Error loading email services:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadServices(); }, [loadServices]);

  // ---------- GET CURRENT LIST ----------
  const getCurrentList = (): EmailService[] => {
    switch (activeProduct) {
      case "mx-plan": return mxPlans;
      case "email-pro": return emailPros;
      case "exchange": return exchanges;
      case "zimbra": return zimbras;
      case "office": return offices;
      default: return [];
    }
  };

  const currentList = getCurrentList();
  const filteredList = currentList.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // ---------- RENDER TAB CONTENT ----------
  const renderTabContent = () => {
    if (!selectedService) return null;
    switch (activeProduct) {
      case "mx-plan":
        switch (activeTab) {
          case "accounts": return <MxAccountsTab domain={selectedService} />;
          case "redirections": return <RedirectionsTab domain={selectedService} />;
          case "mailing-lists": return <MailingListsTab domain={selectedService} />;
          case "tasks": return <MxTasksTab domain={selectedService} />;
        }
        break;
      case "email-pro":
        switch (activeTab) {
          case "accounts": return <ProAccountsTab service={selectedService} />;
          case "domains": return <ProDomainsTab service={selectedService} />;
          case "tasks": return <ProTasksTab service={selectedService} />;
        }
        break;
      case "exchange":
        switch (activeTab) {
          case "accounts": return <ExAccountsTab organization={selectedService} />;
          case "domains": return <ExDomainsTab organization={selectedService} />;
          case "groups": return <GroupsTab organization={selectedService} />;
          case "resources": return <ResourcesTab organization={selectedService} />;
          case "tasks": return <ExTasksTab organization={selectedService} />;
        }
        break;
      case "zimbra":
        switch (activeTab) {
          case "accounts": return <ZimbraAccountsTab platform={selectedService} />;
          case "domains": return <ZimbraDomainsTab platform={selectedService} />;
          case "aliases": return <AliasesTab platform={selectedService} />;
          case "tasks": return <ZimbraTasksTab platform={selectedService} />;
        }
        break;
      case "office":
        switch (activeTab) {
          case "users": return <OfficeUsersTab tenant={selectedService} />;
          case "domains": return <OfficeDomainsTab tenant={selectedService} />;
          case "tasks": return <OfficeTasksTab tenant={selectedService} />;
        }
        break;
    }
    return null;
  };

  const handleProductChange = (product: ProductType) => {
    setActiveProduct(product);
    setSelectedService(null);
    setActiveTab(product === "office" ? "users" : "accounts");
    setSearchQuery("");
  };

  return (
    <div className="domains-page">
      {/* NAV3 - Product Selector */}
      <div className="nav3-bar">
        <button className={`nav3-btn ${activeProduct === "mx-plan" ? "active" : ""}`} onClick={() => handleProductChange("mx-plan")}>
          {t("nav.mxPlan")} <span className="count">{mxPlans.length}</span>
        </button>
        <button className={`nav3-btn ${activeProduct === "email-pro" ? "active" : ""}`} onClick={() => handleProductChange("email-pro")}>
          {t("nav.emailPro")} <span className="count">{emailPros.length}</span>
        </button>
        <button className={`nav3-btn ${activeProduct === "exchange" ? "active" : ""}`} onClick={() => handleProductChange("exchange")}>
          {t("nav.exchange")} <span className="count">{exchanges.length}</span>
        </button>
        <button className={`nav3-btn ${activeProduct === "zimbra" ? "active" : ""}`} onClick={() => handleProductChange("zimbra")}>
          {t("nav.zimbra")} <span className="count">{zimbras.length}</span>
        </button>
        <button className={`nav3-btn ${activeProduct === "office" ? "active" : ""}`} onClick={() => handleProductChange("office")}>
          {t("nav.office")} <span className="count">{offices.length}</span>
        </button>
      </div>

      {/* Sidebar */}
      <aside className="domains-sidebar">
        <div className="sidebar-header">
          <h2>{t(`products.${activeProduct}`)}</h2>
        </div>
        <div className="sidebar-search">
          <input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="domains-list">
          {loading ? (
            <div className="loading-state"><div className="skeleton-item" /><div className="skeleton-item" /><div className="skeleton-item" /></div>
          ) : filteredList.length === 0 ? (
            <div className="empty-state">{tCommon("empty.title")}</div>
          ) : (
            filteredList.map((service) => (
              <button key={service.name} className={`domain-item ${selectedService === service.name ? "active" : ""}`} onClick={() => { setSelectedService(service.name); setActiveTab(activeProduct === "office" ? "users" : "accounts"); }}>
                <div className="domain-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </div>
                <div className="domain-info">
                  <span className="domain-name">{service.name}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="domains-main">
        {selectedService ? (
          <>
            <header className="page-header">
              <div>
                <h1>{selectedService}</h1>
                <p className="page-description">{t(`products.${activeProduct}`)}</p>
              </div>
              <button className="btn-refresh" onClick={loadServices}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                {tCommon("actions.refresh")}
              </button>
            </header>
            <div className="tabs-container"><div className="tabs-list">{tabsByProduct[activeProduct].map((tab) => (<button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
            <div className="tab-content">{renderTabContent()}</div>
          </>
        ) : (
          <div className="no-selection">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            <p>{t("selectService")}</p>
          </div>
        )}
      </main>
    </div>
  );
}
