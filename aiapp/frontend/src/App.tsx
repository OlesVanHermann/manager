// ============================================================
// APP.TSX - New Manager OVHcloud
// Layout: Sidebar | Header (NAV1 Univers) + NAV2 Sections + Content
// NAV3 (sous-sections) = géré à l'intérieur de chaque page
// ============================================================

import { useEffect, useState, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import HomePage from "./pages/home";
import ApiPage from "./pages/home/api";
import AccountPage from "./pages/home/account";
import BillingPage from "./pages/home/billing";
import SupportPage from "./pages/home/support";
import CarbonPage from "./pages/home/carbon";
import IamPage from "./pages/iam";
import { PlaceholderPage } from "./pages/_placeholder";
import { Sidebar, universes } from "./components/Sidebar";
import { AccountSidebar } from "./components/AccountSidebar";
import { UniversTabs, SectionTabs, UserMenu, LoadingFallback } from "./components/HeaderNav";
import { useAppNavigation } from "./hooks/useAppNavigation";
import * as authService from "./services/auth";
import type { OvhCredentials, OvhUser } from "./types/auth.types";
import "./design-system/tokens.css";
import "./i18n";

// ============================================================
// LAZY IMPORTS - Pages Produits
// ============================================================

// Public Cloud
const PublicCloudDashboard = lazy(() => import("./pages/public-cloud"));
const CloudProjectPage = lazy(() => import("./pages/public-cloud/project"));
const PciInstancesPage = lazy(() => import("./pages/public-cloud/instances"));
const PciBlockStoragePage = lazy(() => import("./pages/public-cloud/block-storage"));
const PciObjectStoragePage = lazy(() => import("./pages/public-cloud/object-storage"));
const PciDatabasesPage = lazy(() => import("./pages/public-cloud/databases"));
const PciKubernetesPage = lazy(() => import("./pages/public-cloud/kubernetes"));
const PciRegistryPage = lazy(() => import("./pages/public-cloud/registry"));
const PciAiPage = lazy(() => import("./pages/public-cloud/ai"));
const PciLoadBalancerPage = lazy(() => import("./pages/public-cloud/load-balancer"));

// Private Cloud
const PrivateCloudDashboard = lazy(() => import("./pages/private-cloud"));
const VmwarePage = lazy(() => import("./pages/private-cloud/vmware"));
const NutanixPage = lazy(() => import("./pages/private-cloud/nutanix"));

// Bare Metal
const BareMetalDashboard = lazy(() => import("./pages/bare-metal"));
const VpsPage = lazy(() => import("./pages/bare-metal/vps"));
const DedicatedPage = lazy(() => import("./pages/bare-metal/dedicated"));
const NashaPage = lazy(() => import("./pages/bare-metal/nasha"));
const NetappPage = lazy(() => import("./pages/bare-metal/netapp"));
const HousingPage = lazy(() => import("./pages/bare-metal/housing"));

// Web Cloud
const WebCloudDashboard = lazy(() => import("./pages/web-cloud"));
const DomainsPage = lazy(() => import("./pages/web-cloud/domains"));
const HostingPage = lazy(() => import("./pages/web-cloud/hosting"));
const DnsZonesPage = lazy(() => import("./pages/web-cloud/dns-zones"));
const PrivateDatabasePage = lazy(() => import("./pages/web-cloud/private-database"));
const EmailDomainPage = lazy(() => import("./pages/web-cloud/email-domain"));
const EmailProPage = lazy(() => import("./pages/web-cloud/email-pro"));
const ExchangePage = lazy(() => import("./pages/web-cloud/exchange"));
const ZimbraPage = lazy(() => import("./pages/web-cloud/zimbra"));
const OfficePage = lazy(() => import("./pages/web-cloud/office"));
const VoipPage = lazy(() => import("./pages/web-cloud/voip"));
const SmsPage = lazy(() => import("./pages/web-cloud/sms"));
const FaxPage = lazy(() => import("./pages/web-cloud/fax"));
const CarrierSipPage = lazy(() => import("./pages/web-cloud/carrier-sip"));
const PackXdslPage = lazy(() => import("./pages/web-cloud/pack-xdsl"));
const OvertheboxPage = lazy(() => import("./pages/web-cloud/overthebox"));

// Network
const NetworkDashboard = lazy(() => import("./pages/network"));
const IpPage = lazy(() => import("./pages/network/ip"));
const VrackPage = lazy(() => import("./pages/network/vrack"));
const LoadBalancerPage = lazy(() => import("./pages/network/load-balancer"));
const CdnPage = lazy(() => import("./pages/network/cdn"));
const CloudConnectPage = lazy(() => import("./pages/network/cloud-connect"));
const VrackServicesPage = lazy(() => import("./pages/network/vrack-services"));
const NetworkSecurityPage = lazy(() => import("./pages/network/security"));

// License
const LicenseDashboard = lazy(() => import("./pages/license"));

// IAM - Nouveaux modules
const SecretManagerPage = lazy(() => import("./pages/iam/secret"));
const OkmsPage = lazy(() => import("./pages/iam/okms"));
const HsmPage = lazy(() => import("./pages/iam/hsm"));
const DbaasLogsPage = lazy(() => import("./pages/iam/dbaas-logs"));
const MetricsPage = lazy(() => import("./pages/iam/metrics"));

const STORAGE_KEY = "ovh_credentials";

// ============================================================
// MAIN APP CONTENT
// ============================================================
function AppContent() {
  const { t } = useTranslation('common');
  const { t: tNav } = useTranslation('navigation');
  const { isLoading, logout } = useAuth();

  // ---------- AUTH STATE ----------
  const [user, setUser] = useState<OvhUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [accountSidebarOpen, setAccountSidebarOpen] = useState(false);

  // ---------- NAVIGATION ----------
  const nav = useAppNavigation();

  // ---------- AUTH CHECK ----------
  useEffect(() => {
    const checkSession = async () => {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) { setChecking(false); return; }
      try {
        const credentials: OvhCredentials = JSON.parse(stored);
        if (credentials.consumerKey) {
          const me = await authService.getMe(credentials);
          setUser(me);
          sessionStorage.setItem("ovh_user", JSON.stringify(me));
          setIsAuthenticated(true);
        }
      } catch { sessionStorage.removeItem(STORAGE_KEY); }
      setChecking(false);
    };
    checkSession();
  }, []);

  // ---------- HANDLERS ----------
  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem("ovh_user");
    setUser(null);
    setIsAuthenticated(false);
    setAccountSidebarOpen(false);
    logout();
  };

  // ---------- LOADING ----------
  if (checking || isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-text">{t('loading')}</div>
      </div>
    );
  }

  // ---------- NOT AUTHENTICATED ----------
  if (!isAuthenticated) {
    return <Login />;
  }

  // ---------- CONTENT ROUTING ----------
  const renderContent = () => {
    // HOME Universe
    if (nav.activeUniverseId === "home") {
      switch (nav.activeSectionId) {
        case "home-dashboard": return <HomePage onNavigate={nav.handleNavigate} />;
        case "home-account": return <AccountPage user={user} isActive={true} onNavigate={nav.handleNavigate} initialTab={nav.activeTabId} />;
        case "home-billing": return <BillingPage isActive={true} initialTab={nav.activeTabId} />;
        case "home-support": return <SupportPage initialTab={nav.activeTabId} />;
        case "home-carbon": return <CarbonPage />;
        case "home-api": return <ApiPage initialTab={nav.activeTabId} />;
        default: return <HomePage onNavigate={nav.handleNavigate} />;
      }
    }

    // IAM Universe
    if (nav.activeUniverseId === "iam") {
      switch (nav.activeSectionId) {
        case "iam-home": return <IamPage initialTab={nav.activeTabId} />;
        case "iam-secret": return <SecretManagerPage />;
        case "iam-okms": return <OkmsPage />;
        case "iam-hsm": return <HsmPage />;
        case "iam-dbaas-logs": return <DbaasLogsPage />;
        case "iam-metrics": return <MetricsPage />;
        default: return <IamPage initialTab={nav.activeTabId} />;
      }
    }

    // LICENSE Universe
    if (nav.activeUniverseId === "license") {
      return <LicenseDashboard />;
    }

    // PUBLIC CLOUD Universe
    if (nav.activeUniverseId === "public-cloud") {
      switch (nav.activeSectionId) {
        case "pci-home": return <PublicCloudDashboard />;
        case "pci-project": return <CloudProjectPage />;
        case "pci-instances": return <PciInstancesPage />;
        case "pci-block-storage": return <PciBlockStoragePage />;
        case "pci-object-storage": return <PciObjectStoragePage />;
        case "pci-databases": return <PciDatabasesPage />;
        case "pci-kubernetes": return <PciKubernetesPage />;
        case "pci-registry": return <PciRegistryPage />;
        case "pci-ai": return <PciAiPage />;
        case "pci-load-balancer": return <PciLoadBalancerPage />;
        default: return <PublicCloudDashboard />;
      }
    }

    // PRIVATE CLOUD Universe
    if (nav.activeUniverseId === "private-cloud") {
      switch (nav.activeSectionId) {
        case "hpc-home": return <PrivateCloudDashboard />;
        case "hpc-vmware": return <VmwarePage />;
        case "hpc-nutanix": return <NutanixPage />;
        default: return <PrivateCloudDashboard />;
      }
    }

    // BARE METAL Universe
    if (nav.activeUniverseId === "bare-metal") {
      switch (nav.activeSectionId) {
        case "bm-home": return <BareMetalDashboard />;
        case "bm-dedicated": return <DedicatedPage />;
        case "bm-vps": return <VpsPage />;
        case "bm-nasha": return <NashaPage />;
        case "bm-netapp": return <NetappPage />;
        case "bm-housing": return <HousingPage />;
        default: return <BareMetalDashboard />;
      }
    }

    // WEB CLOUD Universe
    if (nav.activeUniverseId === "web-cloud") {
      switch (nav.activeSectionId) {
        case "web-home": return <WebCloudDashboard />;
        case "web-domains": return <DomainsPage />;
        case "web-dns-zones": return <DnsZonesPage />;
        case "web-hosting": return <HostingPage />;
        case "web-private-db": return <PrivateDatabasePage />;
        case "web-email-domain": return <EmailDomainPage />;
        case "web-email-pro": return <EmailProPage />;
        case "web-exchange": return <ExchangePage />;
        case "web-zimbra": return <ZimbraPage />;
        case "web-office": return <OfficePage />;
        case "web-voip": return <VoipPage />;
        case "web-sms": return <SmsPage />;
        case "web-fax": return <FaxPage />;
        case "web-carrier-sip": return <CarrierSipPage />;
        case "web-pack-xdsl": return <PackXdslPage />;
        case "web-overthebox": return <OvertheboxPage />;
        default: return <WebCloudDashboard />;
      }
    }

    // NETWORK Universe
    if (nav.activeUniverseId === "network") {
      switch (nav.activeSectionId) {
        case "net-home": return <NetworkDashboard />;
        case "net-ip": return <IpPage />;
        case "net-vrack": return <VrackPage />;
        case "net-lb": return <LoadBalancerPage />;
        case "net-cdn": return <CdnPage />;
        case "net-cloud-connect": return <CloudConnectPage />;
        case "net-vrack-services": return <VrackServicesPage />;
        case "net-security": return <NetworkSecurityPage />;
        default: return <NetworkDashboard />;
      }
    }

    // Other universes - Placeholder
    const activeSection = nav.activeUniverse?.sections.find((s) => s.id === nav.activeSectionId);
    return (
      <PlaceholderPage
        universeI18nKey={nav.activeUniverse?.i18nKey}
        sectionI18nKey={activeSection?.i18nKey}
      />
    );
  };

  // ---------- RENDER ----------
  return (
    <div className="app-layout">
      <Sidebar
        resources={nav.resources}
        selectedResourceId={nav.selectedResource?.id}
        onResourceSelect={nav.handleResourceSelect}
        onHomeClick={nav.handleHomeClick}
      />
      <div className="main-area">
        <header className="main-header">
          <UniversTabs
            universes={universes}
            activeUniverseId={nav.activeUniverseId}
            onUniverseChange={nav.setActiveUniverseId}
          />
          <UserMenu user={user} onClick={() => setAccountSidebarOpen(!accountSidebarOpen)} />
        </header>
        {nav.activeUniverse && nav.activeUniverse.sections.length > 0 && (
          <SectionTabs
            sections={nav.activeUniverse.sections}
            activeSectionId={nav.activeSectionId}
            onSectionChange={(sectionId) => {
              nav.setActiveSectionId(sectionId);
              nav.setActiveTabId(undefined);
            }}
          />
        )}
        <main className="content-area">
          <Suspense fallback={<LoadingFallback />}>
            {renderContent()}
          </Suspense>
        </main>
      </div>
      <AccountSidebar
        user={user}
        isOpen={accountSidebarOpen}
        onClose={() => setAccountSidebarOpen(false)}
        onLogout={handleLogout}
        onNavigate={nav.handleNavigate}
      />
    </div>
  );
}

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  );
}
