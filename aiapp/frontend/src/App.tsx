import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dev from "./pages/Dev";
import { AccountPage } from "./pages/Account";
import { BillingPage } from "./pages/Billing";
import { ServicesPage } from "./pages/Services";
import { PlaceholderPage } from "./pages/Placeholder";
import OrdersPage from "./pages/Orders";
import ContactsPage from "./pages/Contacts";
import CommunicationPage from "./pages/Communication";
import SupportPage from "./pages/Support";
import CarbonPage from "./pages/Carbon";
import IamPage from "./pages/Iam";
import { Sidebar, NavNode } from "./components/Sidebar";
import { AccountSidebar } from "./components/AccountSidebar";
import * as authService from "./services/auth.service";
import type { OvhCredentials, OvhUser } from "./types/auth.types";
import "./design-system/tokens.css";

const STORAGE_KEY = "ovh_credentials";

type PaneType = 
  | "home" 
  | "account" 
  | "billing" 
  | "services"
  | "orders"
  | "communication"
  | "contacts"
  | "carbon"
  | "support"
  | "iam"
  | "dev"
  | "dedicated-servers"
  | "vps"
  | "public-cloud"
  | "domains"
  | "hosting"
  | "emails";

interface PlaceholderConfig {
  title: string;
  description?: string;
  oldManagerPath: string;
}

const PLACEHOLDER_CONFIGS: Record<string, PlaceholderConfig> = {
  "dedicated-servers": { title: "Serveurs dédiés", description: "Gérez vos serveurs dédiés, leurs configurations et options.", oldManagerPath: "#/dedicated/servers" },
  "vps": { title: "VPS", description: "Gérez vos serveurs virtuels privés.", oldManagerPath: "#/vps" },
  "public-cloud": { title: "Public Cloud", description: "Gérez vos projets Public Cloud, instances et ressources.", oldManagerPath: "#/public-cloud" },
  "domains": { title: "Noms de domaine", description: "Gérez vos domaines, DNS et redirections.", oldManagerPath: "#/domain" },
  "hosting": { title: "Hébergements Web", description: "Gérez vos hébergements web, bases de données et certificats SSL.", oldManagerPath: "#/hosting" },
  "emails": { title: "E-mails", description: "Gérez vos comptes e-mail, alias et redirections.", oldManagerPath: "#/email" },
};

const NAV_TABS = [
  { id: "home", label: "Accueil" },
  { id: "account", label: "Compte" },
  { id: "billing", label: "Factures" },
  { id: "services", label: "Services" },
  { id: "orders", label: "Commandes" },
  { id: "communication", label: "Communications" },
  { id: "contacts", label: "Contacts" },
  { id: "carbon", label: "Carbone" },
  { id: "support", label: "Assistance" },
  { id: "iam", label: "IAM" },
  { id: "dev", label: "Dev" },
];

function AppContent() {
  const { isLoading, logout } = useAuth();
  const [user, setUser] = useState<OvhUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [accountSidebarOpen, setAccountSidebarOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePane, setActivePane] = useState<PaneType>("home");
  const [billingTab, setBillingTab] = useState("invoices");

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

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem("ovh_user");
    setUser(null);
    setIsAuthenticated(false);
    setAccountSidebarOpen(false);
    logout();
  };

  const handleNavigate = (node: NavNode) => {
    const nodeToPane: Record<string, PaneType> = {
      "home": "home",
      "dedicated_server": "dedicated-servers",
      "vps": "vps",
      "public_cloud": "public-cloud",
      "domain": "domains",
      "hosting_web": "hosting",
      "email": "emails",
      "support": "support",
    };
    const pane = nodeToPane[node.id];
    if (pane) { setActivePane(pane); }
    else if (node.id === "home" || node.url === "#/") { setActivePane("home"); }
  };

  const handleShortcutNavigation = (shortcutId: string) => {
    switch (shortcutId) {
      case "ALL_BILLS": setActivePane("billing"); setBillingTab("invoices"); break;
      case "PAYMENT_FOLLOW_UP": setActivePane("billing"); setBillingTab("payments"); break;
      case "ADD_PAYMENT_METHOD": setActivePane("billing"); setBillingTab("methods"); break;
      case "MANAGE_SERVICES": setActivePane("services"); break;
      default: break;
    }
  };

  if (checking || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) { return <Login />; }

  const renderPane = () => {
    if (PLACEHOLDER_CONFIGS[activePane]) {
      const config = PLACEHOLDER_CONFIGS[activePane];
      return <PlaceholderPage {...config} />;
    }
    switch (activePane) {
      case "home": return <Home />;
      case "account": return <AccountPage user={user} isActive={true} onShortcutClick={handleShortcutNavigation} />;
      case "billing": return <BillingPage isActive={true} initialTab={billingTab} />;
      case "services": return <ServicesPage isActive={true} />;
      case "orders": return <OrdersPage />;
      case "contacts": return <ContactsPage />;
      case "communication": return <CommunicationPage />;
      case "support": return <SupportPage />;
      case "carbon": return <CarbonPage />;
      case "iam": return <IamPage />;
      case "dev": return <Dev />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onNavigate={handleNavigate} activeNodeId={activePane} />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b px-4 py-2 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 overflow-x-auto">
            <nav className="flex gap-1 flex-nowrap">
              {NAV_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePane(tab.id as PaneType)}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  style={activePane === tab.id ? { backgroundColor: "var(--color-primary-100)", color: "var(--color-primary-700)" } : { color: "var(--color-neutral-600)" }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <button onClick={() => setAccountSidebarOpen(!accountSidebarOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0">
            <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-medium" style={{ backgroundColor: "var(--color-primary-300)" }}>
              {user?.firstname?.[0]?.toUpperCase() || ""}{user?.name?.[0]?.toUpperCase() || ""}
            </div>
            <span className="text-sm text-gray-700 hidden md:inline">{user?.nichandle}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </header>
        <div className="flex-1 overflow-hidden bg-gray-100">
          <div className="h-full overflow-y-auto">{renderPane()}</div>
        </div>
      </main>
      <AccountSidebar user={user} isOpen={accountSidebarOpen} onClose={() => setAccountSidebarOpen(false)} onLogout={handleLogout} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
