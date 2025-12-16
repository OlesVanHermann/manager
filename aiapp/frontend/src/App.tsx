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

// Bare Metal
const BareMetalDashboard = lazy(() => import("./pages/bare-metal"));
const VpsPage = lazy(() => import("./pages/bare-metal/vps"));
const DedicatedPage = lazy(() => import("./pages/bare-metal/dedicated"));

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

// Network
const NetworkDashboard = lazy(() => import("./pages/network"));
const IpPage = lazy(() => import("./pages/network/ip"));
const VrackPage = lazy(() => import("./pages/network/vrack"));
const LoadBalancerPage = lazy(() => import("./pages/network/load-balancer"));

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
    // ============================================================
    // HOME Universe
    // ============================================================
    if (nav.activeUniverseId === "home") {
      switch (nav.activeSectionId) {
        case "home-dashboard":
          return <HomePage onNavigate={nav.handleNavigate} />;
        case "home-account":
          return <AccountPage user={user} isActive={true} onNavigate={nav.handleNavigate} initialTab={nav.activeTabId} />;
        case "home-billing":
          return <BillingPage isActive={true} initialTab={nav.activeTabId} />;
        case "home-support":
          return <SupportPage initialTab={nav.activeTabId} />;
        case "home-carbon":
          return <CarbonPage />;
        case "home-api":
          return <ApiPage initialTab={nav.activeTabId} />;
        default:
          return <HomePage onNavigate={nav.handleNavigate} />;
      }
    }

    // ============================================================
    // IAM Universe
    // ============================================================
    if (nav.activeUniverseId === "iam") {
      return <IamPage initialTab={nav.activeTabId} />;
    }

    // ============================================================
    // PUBLIC CLOUD Universe
    // ============================================================
    if (nav.activeUniverseId === "public-cloud") {
      switch (nav.activeSectionId) {
        case "pci-home":
          return <PublicCloudDashboard />;
        case "pci-instances":
        case "pci-storage":
        case "pci-network":
        case "pci-databases":
        case "pci-ai":
          return <CloudProjectPage />;
        default:
          return <PublicCloudDashboard />;
      }
    }

    // ============================================================
    // BARE METAL Universe
    // ============================================================
    if (nav.activeUniverseId === "bare-metal") {
      switch (nav.activeSectionId) {
        case "bm-home":
          return <BareMetalDashboard />;
        case "bm-dedicated":
          return <DedicatedPage />;
        case "bm-vps":
          return <VpsPage />;
        case "bm-managed":
          return <BareMetalDashboard />;
        default:
          return <BareMetalDashboard />;
      }
    }

    // ============================================================
    // WEB CLOUD Universe
    // ============================================================
    if (nav.activeUniverseId === "web-cloud") {
      switch (nav.activeSectionId) {
        case "web-home":
          return <WebCloudDashboard />;
        case "web-domains":
          return <DomainsPage />;
        case "web-dns-zones":
          return <DnsZonesPage />;
        case "web-hosting":
          return <HostingPage />;
        case "web-private-db":
          return <PrivateDatabasePage />;
        case "web-email-domain":
          return <EmailDomainPage />;
        case "web-email-pro":
          return <EmailProPage />;
        case "web-exchange":
          return <ExchangePage />;
        case "web-zimbra":
          return <ZimbraPage />;
        case "web-office":
          return <OfficePage />;
        case "web-voip":
          return <VoipPage />;
        case "web-sms":
          return <SmsPage />;
        case "web-fax":
          return <FaxPage />;
        default:
          return <WebCloudDashboard />;
      }
    }

    // ============================================================
    // NETWORK Universe
    // ============================================================
    if (nav.activeUniverseId === "network") {
      switch (nav.activeSectionId) {
        case "net-home":
          return <NetworkDashboard />;
        case "net-ip":
          return <IpPage />;
        case "net-vrack":
          return <VrackPage />;
        case "net-lb":
          return <LoadBalancerPage />;
        case "net-cdn":
          return <NetworkDashboard />;
        default:
          return <NetworkDashboard />;
      }
    }

    // ============================================================
    // Other universes - Placeholder
    // ============================================================
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
