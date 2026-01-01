// ============================================================
// EMAILS - Page unifiée avec NAV3 [General] [Packs]
// NAV3 dans LeftPanel, NAV4 tabs dans RightPanel
// ============================================================

import { useState, useMemo, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { Nav3Mode, EmailTab, EmailOffer } from "./types";
import {
  GENERAL_TABS_CONFIG,
  PACKS_TABS_CONFIG,
  DEFAULT_NAV3_MODE,
  DEFAULT_GENERAL_TAB,
  DEFAULT_PACKS_TAB,
  DEFAULT_SUB_TABS,
} from "./emails.constants";
import { useEmailDomains } from "./useEmailDomains";
import { useEmailLicenses } from "./useEmailLicenses";
import { LeftPanel } from "./LeftPanel";
import { RightPanelHeader } from "./RightPanelHeader";
import { Onboarding } from "./Onboarding";
import "./styles.css";
import "./LeftPanel.css";
import "./general/general.css";
import "./modals.css";

// Lazy load tabs for code-splitting (amélioration performance)
// NAV3=General tabs
const AccountsTab = lazy(() => import("./general/AccountsTab"));
const RedirectionsTab = lazy(() => import("./general/RedirectionsTab"));
const RespondersTab = lazy(() => import("./general/RespondersTab"));
const ListsTab = lazy(() => import("./general/ListsTab"));
const SecurityTab = lazy(() => import("./general/security/SecurityTab"));
const AdvancedTab = lazy(() => import("./general/advanced/AdvancedTab"));
const TasksTab = lazy(() => import("./general/TasksTab"));
// NAV3=Packs tabs
const PacksTab = lazy(() => import("./packs/PacksTab"));
const AlacarteTab = lazy(() => import("./packs/AlacarteTab"));
const HistoryTab = lazy(() => import("./packs/HistoryTab"));

/** Skeleton de chargement pour les tabs */
function TabSkeleton() {
  return (
    <div className="tab-skeleton">
      <div className="skeleton skeleton-header" />
      <div className="skeleton skeleton-row" />
      <div className="skeleton skeleton-row" />
      <div className="skeleton skeleton-row" />
    </div>
  );
}

/** Page principale Emails - Vue unifiée avec NAV3 [General] [Packs]. */
export default function EmailsPage() {
  const { t } = useTranslation("web-cloud/emails/index");

  // ---------- STATE ----------

  const [nav3Mode, setNav3Mode] = useState<Nav3Mode>(DEFAULT_NAV3_MODE);
  const [activeTab, setActiveTab] = useState<EmailTab>(DEFAULT_GENERAL_TAB);
  const [activeSubTab, setActiveSubTab] = useState<string>(DEFAULT_SUB_TABS[DEFAULT_GENERAL_TAB]);

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
    if (nav3Mode === "general" && selectedDomain) {
      return selectedDomain.offers;
    }
    if (nav3Mode === "packs" && selectedLicense) {
      return [selectedLicense.offer];
    }
    return ["exchange", "email-pro", "zimbra", "mx-plan"];
  }, [nav3Mode, selectedDomain, selectedLicense]);

  // NAV4 tabs selon NAV3 sélectionnée
  const currentTabsConfig = nav3Mode === "general" ? GENERAL_TABS_CONFIG : PACKS_TABS_CONFIG;

  const visibleTabs = useMemo(() => {
    return currentTabsConfig.filter((tab) => {
      if (tab.offers === "all") return true;
      return tab.offers.some((offer) => availableOffers.includes(offer));
    });
  }, [currentTabsConfig, availableOffers]);

  // ---------- HANDLERS ----------

  const handleNav3ModeChange = (mode: Nav3Mode) => {
    setNav3Mode(mode);
    // Reset to default tab for this NAV3
    const defaultTab = mode === "general" ? DEFAULT_GENERAL_TAB : DEFAULT_PACKS_TAB;
    setActiveTab(defaultTab);
    setActiveSubTab(DEFAULT_SUB_TABS[defaultTab] || "");
  };

  const handleTabChange = (tab: EmailTab) => {
    setActiveTab(tab);
    setActiveSubTab(DEFAULT_SUB_TABS[tab] || "");
  };

  const handleAddDomain = () => {
    // TODO: Open modal add domain
  };

  const handleOrderPack = () => {
    // TODO: Open modal order pack
  };

  // ---------- ONBOARDING ----------

  if (!loading && domains.length === 0) {
    return <Onboarding onAddDomain={handleAddDomain} onOrderPack={handleOrderPack} />;
  }

  // ---------- RENDER TAB CONTENT ----------

  const renderTabContent = () => {
    const domain = nav3Mode === "general" ? selectedDomain?.name : undefined;
    const licenseId = nav3Mode === "packs" ? selectedLicense?.id : undefined;

    switch (activeTab) {
      // NAV3=General tabs
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
      case "tasks":
        return <TasksTab domain={domain} />;
      // NAV3=Packs tabs
      case "packs":
        return <PacksTab />;
      case "alacarte":
        return <AlacarteTab />;
      case "history":
        return <HistoryTab />;
      default:
        return null;
    }
  };

  // ---------- RENDER ----------

  return (
    <div className="emails-page">
      {/* ---------- LEFT PANEL ---------- */}
      <LeftPanel
        nav3Mode={nav3Mode}
        onNav3ModeChange={handleNav3ModeChange}
        domains={domains}
        licenses={[...packs, ...alacarte]}
        selectedDomain={selectedDomain?.name || null}
        selectedLicense={selectedLicense?.id || null}
        onSelectDomain={selectDomain}
        onSelectLicense={selectLicense}
        loading={loading}
        onAddDomain={handleAddDomain}
        onOrderPack={handleOrderPack}
      />

      {/* ---------- RIGHT PANEL ---------- */}
      <main className="emails-right-panel">
        {/* Header */}
        <RightPanelHeader
          nav3Mode={nav3Mode}
          selectedDomain={selectedDomain}
          selectedLicense={selectedLicense}
        />

        {/* NAV4 Tabs */}
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

        {/* Tab Content with Suspense for lazy-loaded tabs */}
        <div className="emails-tab-content">
          <Suspense fallback={<TabSkeleton />}>
            {renderTabContent()}
          </Suspense>
        </div>
      </main>
    </div>
  );
}

// Re-export modals for use in tabs
export { CreateAccountModal } from "./CreateAccountModal";
export { EditAccountModal } from "./EditAccountModal";
export { DeleteAccountModal } from "./DeleteAccountModal";
export { CreateRedirectionModal } from "./CreateRedirectionModal";
export { CreateResponderModal } from "./CreateResponderModal";
export { CreateListModal } from "./CreateListModal";
export { AddListMemberModal } from "./AddListMemberModal";
export { AddAliasModal } from "./AddAliasModal";
export { ChangePasswordModal } from "./ChangePasswordModal";
export { DeleteModal } from "./DeleteModal";
export { ConfigureDmarcModal } from "./ConfigureDmarcModal";
