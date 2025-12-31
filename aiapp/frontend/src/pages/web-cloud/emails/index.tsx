// ============================================================
// EMAILS - Page unifiée (Vue par domaine / Vue par licence)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ViewMode, EmailTab, EmailOffer } from "./types";
import { TABS_CONFIG, DEFAULT_VIEW_MODE, DEFAULT_TAB, DEFAULT_SUB_TABS } from "./emails.constants";
import { useEmailDomains } from "./hooks/useEmailDomains";
import { useEmailLicenses } from "./hooks/useEmailLicenses";
import { LeftPanel } from "./components/LeftPanel";
import { RightPanelHeader } from "./RightPanelHeader";
import { Onboarding } from "./Onboarding";
import "./styles.css";
import "./components/LeftPanel/LeftPanel.css";
import "./tabs/tabs.css";
import "./modals/modals.css";

// Import tabs (lazy loaded en production)
import AccountsTab from "./tabs/AccountsTab";
import RedirectionsTab from "./tabs/RedirectionsTab";
import RespondersTab from "./tabs/RespondersTab";
import ListsTab from "./tabs/ListsTab";
import SecurityTab from "./tabs/security/SecurityTab";
import AdvancedTab from "./tabs/advanced/AdvancedTab";
import LicensesTab from "./tabs/licenses/LicensesTab";
import TasksTab from "./tabs/TasksTab";

/** Page principale Emails - Vue unifiée multi-offres. */
export default function EmailsPage() {
  const { t } = useTranslation("web-cloud/emails/index");

  // ---------- STATE ----------

  const [viewMode, setViewMode] = useState<ViewMode>(DEFAULT_VIEW_MODE);
  const [activeTab, setActiveTab] = useState<EmailTab>(DEFAULT_TAB);
  const [activeSubTab, setActiveSubTab] = useState<string>(DEFAULT_SUB_TABS[DEFAULT_TAB]);

  // ---------- HOOKS DATA ----------

  const {
    domains,
    loading: domainsLoading,
    selectedDomain,
    selectDomain,
  } = useEmailDomains();

  const {
    licenses,
    packs,
    alacarte,
    loading: licensesLoading,
    selectedLicense,
    selectLicense,
  } = useEmailLicenses();

  // ---------- COMPUTED ----------

  const loading = domainsLoading || licensesLoading;

  const availableOffers = useMemo<EmailOffer[]>(() => {
    if (viewMode === "domain" && selectedDomain) {
      return selectedDomain.offers;
    }
    if (viewMode === "license" && selectedLicense) {
      return [selectedLicense.offer];
    }
    return ["exchange", "email-pro", "zimbra", "mx-plan"];
  }, [viewMode, selectedDomain, selectedLicense]);

  const visibleTabs = useMemo(() => {
    return TABS_CONFIG.filter((tab) => {
      if (tab.offers === "all") return true;
      return tab.offers.some((offer) => availableOffers.includes(offer));
    });
  }, [availableOffers]);

  // ---------- HANDLERS ----------

  const handleTabChange = (tab: EmailTab) => {
    setActiveTab(tab);
    setActiveSubTab(DEFAULT_SUB_TABS[tab] || "");
  };

  const handleAddDomain = () => {
    // TODO: Open modal add domain
    console.log("Add domain");
  };

  const handleOrderPack = () => {
    // TODO: Open modal order pack
    console.log("Order pack");
  };

  // ---------- ONBOARDING ----------

  if (!loading && domains.length === 0) {
    return <Onboarding onAddDomain={handleAddDomain} onOrderPack={handleOrderPack} />;
  }

  // ---------- RENDER TAB CONTENT ----------

  const renderTabContent = () => {
    const domain = viewMode === "domain" ? selectedDomain?.name : undefined;
    const licenseId = viewMode === "license" ? selectedLicense?.id : undefined;

    switch (activeTab) {
      case "accounts":
        return <AccountsTab domain={domain} licenseId={licenseId} offers={availableOffers} />;
      case "redirections":
        return <RedirectionsTab domain={domain} />;
      case "responders":
        return <RespondersTab domain={domain} />;
      case "lists":
        return <ListsTab domain={domain} offers={availableOffers} />;
      case "security":
        return (
          <SecurityTab
            domain={domain}
            offers={availableOffers}
            activeSubTab={activeSubTab}
            onSubTabChange={setActiveSubTab}
          />
        );
      case "advanced":
        return (
          <AdvancedTab
            domain={domain}
            activeSubTab={activeSubTab}
            onSubTabChange={setActiveSubTab}
          />
        );
      case "licenses":
        return (
          <LicensesTab
            activeSubTab={activeSubTab}
            onSubTabChange={setActiveSubTab}
          />
        );
      case "tasks":
        return <TasksTab domain={domain} />;
      default:
        return null;
    }
  };

  // ---------- RENDER ----------

  return (
    <div className="emails-page">
      {/* ---------- LEFT PANEL ---------- */}
      <LeftPanel
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        domains={domains}
        licenses={[...packs, ...alacarte]}
        selectedDomain={selectedDomain?.name || null}
        selectedLicense={selectedLicense?.id || null}
        onSelectDomain={selectDomain}
        onSelectLicense={selectLicense}
        loading={loading}
      />

      {/* ---------- RIGHT PANEL ---------- */}
      <main className="emails-right-panel">
        {/* Header */}
        <RightPanelHeader
          viewMode={viewMode}
          selectedDomain={selectedDomain}
          selectedLicense={selectedLicense}
        />

        {/* NAV3 Tabs */}
        <nav className="emails-tabs">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              className={`emails-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="emails-tab-content">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
