// ============================================================
// APP.TSX - New Manager OVHcloud
// Layout: Sidebar | Header (NAV1 Univers) + NAV2 Sections + Content
// NAV3 (sous-sections) = géré à l'intérieur de chaque page
// ============================================================

import { useEffect, useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
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
import * as authService from "./services/auth.service";
import type { OvhCredentials, OvhUser } from "./types/auth.types";
import "./design-system/tokens.css";
import "./i18n";

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
    // Home Universe
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

    // IAM Universe
    if (nav.activeUniverseId === "iam") {
      return <IamPage initialTab={nav.activeTabId} />;
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
          {renderContent()}
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
    <Suspense fallback={<LoadingFallback />}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Suspense>
  );
}
