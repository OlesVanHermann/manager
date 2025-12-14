// ============================================================
// APP.TSX - New Manager OVHcloud
// Layout: Sidebar | Header (NAV1 Univers) + NAV2 Sections + Content
// NAV3 (sous-sections) = géré à l'intérieur de chaque page
// ============================================================

import { useEffect, useState, useMemo, Suspense } from "react";
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
import { Sidebar, universes, Icon } from "./components/Sidebar";
import { AccountSidebar } from "./components/AccountSidebar";
import * as authService from "./services/auth.service";
import type { OvhCredentials, OvhUser } from "./types/auth.types";
import type { Resource, Universe, UniversSection } from "./components/Sidebar/navigationTree";
import "./design-system/tokens.css";
import "./i18n";

const STORAGE_KEY = "ovh_credentials";

// ============================================================
// UNIVERS TABS (Niveau 1)
// ============================================================
interface UniversTabsProps {
  universes: Universe[];
  activeUniverseId: string;
  onUniverseChange: (universeId: string) => void;
}

function UniversTabs({ universes, activeUniverseId, onUniverseChange }: UniversTabsProps) {
  const { t } = useTranslation('navigation');
  
  return (
    <nav className="univers-tabs">
      {universes.map((u) => (
        <button
          key={u.id}
          className={`univers-tab ${activeUniverseId === u.id ? "active" : ""}`}
          onClick={() => onUniverseChange(u.id)}
        >
          {t(u.i18nKey)}
        </button>
      ))}
    </nav>
  );
}

// ============================================================
// SECTION TABS (Niveau 2)
// ============================================================
interface SectionTabsProps {
  sections: UniversSection[];
  activeSectionId: string;
  onSectionChange: (sectionId: string) => void;
}

function SectionTabs({ sections, activeSectionId, onSectionChange }: SectionTabsProps) {
  const { t } = useTranslation('navigation');
  
  if (!sections || sections.length === 0) return null;
  return (
    <nav className="section-tabs">
      {sections.map((s) => (
        <button
          key={s.id}
          className={`section-tab ${activeSectionId === s.id ? "active" : ""}`}
          onClick={() => onSectionChange(s.id)}
        >
          {t(s.i18nKey)}
        </button>
      ))}
      {sections.length > 10 && (
        <button className="section-tab more">
          <Icon name="ellipsis" className="more-icon" />
        </button>
      )}
    </nav>
  );
}

// ============================================================
// USER MENU (Header droite)
// ============================================================
interface UserMenuProps {
  user: OvhUser | null;
  onClick: () => void;
}

function UserMenu({ user, onClick }: UserMenuProps) {
  return (
    <button className="user-menu" onClick={onClick}>
      <span className="user-badge">OK</span>
      <span className="user-nic">{user?.nichandle || "---"}</span>
      <Icon name="chevronDown" className="user-chevron" />
    </button>
  );
}

// ============================================================
// LOADING FALLBACK
// ============================================================
function LoadingFallback() {
  const { t } = useTranslation('common');
  return (
    <div className="app-loading">
      <div className="loading-text">{t('loading')}</div>
    </div>
  );
}

// ============================================================
// MAIN APP CONTENT
// ============================================================
function AppContent() {
  const { t } = useTranslation('common');
  const { t: tNav } = useTranslation('navigation');
  const { isLoading, logout } = useAuth();
  const [user, setUser] = useState<OvhUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [accountSidebarOpen, setAccountSidebarOpen] = useState(false);

  // Navigation state
  const [activeUniverseId, setActiveUniverseId] = useState("home");
  const [activeSectionId, setActiveSectionId] = useState("home-dashboard");
  const [activeTabId, setActiveTabId] = useState<string | undefined>(undefined);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Ressources (vide par défaut, à charger via API)
  const [resources, setResources] = useState<Resource[]>([]);

  // Derived state
  const activeUniverse = useMemo(() => universes.find((u) => u.id === activeUniverseId), [activeUniverseId]);

  // Auth check
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

  // Reset section when universe changes
  useEffect(() => {
    if (activeUniverse && activeUniverse.sections.length > 0) {
      setActiveSectionId(activeUniverse.sections[0].id);
    } else {
      setActiveSectionId("");
    }
    setSelectedResource(null);
    setResources([]);
    setActiveTabId(undefined);
  }, [activeUniverseId]);

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem("ovh_user");
    setUser(null);
    setIsAuthenticated(false);
    setAccountSidebarOpen(false);
    logout();
  };

  const handleResourceSelect = (resource: Resource | null) => {
    setSelectedResource(resource);
  };

  const handleHomeClick = () => {
    setActiveUniverseId("home");
    setActiveSectionId("home-dashboard");
    setActiveTabId(undefined);
  };

  // Navigation callback pour les pages (raccourcis, Home, etc.)
  const handleNavigate = (section: string, options?: { tab?: string }) => {
    // Gérer la navigation inter-univers
    if (section.startsWith("iam-")) {
      setActiveUniverseId("iam");
    }
    setActiveSectionId(section);
    if (options?.tab) {
      setActiveTabId(options.tab);
    } else {
      setActiveTabId(undefined);
    }
  };

  // Loading
  if (checking || isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-text">{t('loading')}</div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // ============================================================
  // CONTENT ROUTING
  // NAV3 (sous-sections) est géré par chaque page individuellement
  // ============================================================
  const renderContent = () => {
    // ==================== HOME Universe ====================
    if (activeUniverseId === "home") {
      switch (activeSectionId) {
        case "home-dashboard":
          return <HomePage onNavigate={handleNavigate} />;

        case "home-account":
          return (
            <AccountPage
              user={user}
              isActive={true}
              onNavigate={handleNavigate}
              initialTab={activeTabId}
            />
          );

        case "home-billing":
          return <BillingPage isActive={true} initialTab={activeTabId} />;

        case "home-support":
          return <SupportPage initialTab={activeTabId} />;

        case "home-carbon":
          return <CarbonPage />;

        case "home-api":
          return <ApiPage initialTab={activeTabId} />;

        default:
          return <HomePage onNavigate={handleNavigate} />;
      }
    }

    // ==================== IAM Universe ====================
    if (activeUniverseId === "iam") {
      return <IamPage initialTab={activeTabId} />;
    }

    // ==================== Autres univers - Placeholder ====================
    const activeSection = activeUniverse?.sections.find((s) => s.id === activeSectionId);
    const universeLabel = activeUniverse ? tNav(activeUniverse.i18nKey) : t('empty.title');
    const sectionLabel = activeSection ? tNav(activeSection.i18nKey) : '';
    
    return (
      <PlaceholderPage
        universeI18nKey={activeUniverse?.i18nKey}
        sectionI18nKey={activeSection?.i18nKey}
      />
    );
  };

  return (
    <div className="app-layout">
      {/* Sidebar gauche */}
      <Sidebar
        resources={resources}
        selectedResourceId={selectedResource?.id}
        onResourceSelect={handleResourceSelect}
        onHomeClick={handleHomeClick}
      />

      {/* Zone principale */}
      <div className="main-area">
        {/* Header: NAV1 Univers tabs + User menu */}
        <header className="main-header">
          <UniversTabs
            universes={universes}
            activeUniverseId={activeUniverseId}
            onUniverseChange={setActiveUniverseId}
          />
          <UserMenu user={user} onClick={() => setAccountSidebarOpen(!accountSidebarOpen)} />
        </header>

        {/* NAV2: Section tabs */}
        {activeUniverse && activeUniverse.sections.length > 0 && (
          <SectionTabs
            sections={activeUniverse.sections}
            activeSectionId={activeSectionId}
            onSectionChange={(sectionId) => {
              setActiveSectionId(sectionId);
              setActiveTabId(undefined);
            }}
          />
        )}

        {/* Content area - NAV3 est géré à l'intérieur de chaque page */}
        <main className="content-area">
          {renderContent()}
        </main>
      </div>

      {/* Account Sidebar (droite) */}
      <AccountSidebar
        user={user}
        isOpen={accountSidebarOpen}
        onClose={() => setAccountSidebarOpen(false)}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
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
