// ============================================================
// PRIVATE DATABASE - Page principale (Défactorisé)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../../services/api";
import type { PrivateDatabase } from "./private-database.types";
import { 
  GeneralTab, 
  DatabasesTab, 
  UsersTab, 
  WhitelistTab, 
  TasksTab, 
  MetricsTab, 
  LogsTab, 
  ConfigurationTab 
} from "./tabs";
import { OrderCloudDbModal } from "./components";
import Onboarding from "./Onboarding";

const BASE_PATH = "/hosting/privateDatabase";

// Service local pour la page principale
const pageService = {
  async listPrivateDatabases(): Promise<string[]> {
    return apiClient.get(BASE_PATH);
  },
  async getPrivateDatabase(serviceName: string): Promise<PrivateDatabase> {
    return apiClient.get(`${BASE_PATH}/${serviceName}`);
  },
};

type TabKey = "general" | "databases" | "users" | "whitelist" | "tasks" | "metrics" | "logs" | "configuration";

const TABS: { key: TabKey; label: string }[] = [
  { key: "general", label: "Général" },
  { key: "databases", label: "Bases de données" },
  { key: "users", label: "Utilisateurs" },
  { key: "whitelist", label: "Whitelist" },
  { key: "configuration", label: "Configuration" },
  { key: "metrics", label: "Métriques" },
  { key: "logs", label: "Logs" },
  { key: "tasks", label: "Tâches" },
];

export default function PrivateDatabasePage() {
  const { t } = useTranslation("web-cloud/private-database/index");
  const { serviceName: paramServiceName } = useParams<{ serviceName?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [services, setServices] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(paramServiceName || null);
  const [details, setDetails] = useState<PrivateDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>((searchParams.get("tab") as TabKey) || "general");
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Charger la liste des services
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const list = await pageService.listPrivateDatabases();
      setServices(list);
      if (list.length > 0 && !selectedService) {
        setSelectedService(list[0]);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [selectedService]);

  // Charger les détails du service sélectionné
  const loadDetails = useCallback(async () => {
    if (!selectedService) return;
    try {
      const data = await pageService.getPrivateDatabase(selectedService);
      setDetails(data);
    } catch (err) {
      console.error(err);
    }
  }, [selectedService]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  // Sync tab avec URL
  useEffect(() => {
    const tab = searchParams.get("tab") as TabKey;
    if (tab && TABS.some(t => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleRefresh = () => {
    loadDetails();
  };

  // Onboarding si aucun service
  if (!loading && services.length === 0) {
    return (
      <>
        <Onboarding onOrder={() => setShowOrderModal(true)} />
        <OrderCloudDbModal
          isOpen={showOrderModal}
          onClose={() => setShowOrderModal(false)}
          onSuccess={() => {
            setShowOrderModal(false);
            loadServices();
          }}
        />
      </>
    );
  }

  // Render du tab actif
  const renderTab = () => {
    if (!selectedService || !details) return null;

    switch (activeTab) {
      case "general":
        return <GeneralTab serviceName={selectedService} details={details} onRefresh={handleRefresh} />;
      case "databases":
        return <DatabasesTab serviceName={selectedService} dbType={details.type} />;
      case "users":
        return <UsersTab serviceName={selectedService} />;
      case "whitelist":
        return <WhitelistTab serviceName={selectedService} />;
      case "tasks":
        return <TasksTab serviceName={selectedService} />;
      case "metrics":
        return <MetricsTab serviceName={selectedService} />;
      case "logs":
        return <LogsTab serviceName={selectedService} />;
      case "configuration":
        return <ConfigurationTab serviceName={selectedService} details={details} />;
      default:
        return null;
    }
  };

  return (
    <div className="hosting-page">
      <div className="hosting-split">
        {/* Sidebar */}
        <aside className="service-list-sidebar">
          <div className="sidebar-search">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder={t("common.search")} />
            </div>
          </div>
          <div className="sidebar-filter">
            <span>{services.length} service(s)</span>
          </div>
          <div className="service-items">
            {services.map(svc => (
              <div
                key={svc}
                className={`service-item ${svc === selectedService ? "selected" : ""}`}
                onClick={() => setSelectedService(svc)}
              >
                <span className="service-icon">🗄️</span>
                <div className="service-info">
                  <div className="service-item-name">{svc}</div>
                  <div className="service-item-type">CloudDB</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="hosting-main">
          {loading ? (
            <div className="tab-loading">Chargement...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : selectedService && details ? (
            <div className="service-detail">
              {/* Header */}
              <div className="detail-header-domains">
                <h2>{details.displayName || details.serviceName}</h2>
                <span className={`badge ${details.state === "started" ? "success" : "warning"}`}>
                  {details.state}
                </span>
              </div>

              {/* Tabs */}
              <div className="detail-header-tabs">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                    onClick={() => handleTabChange(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="tab-content">
                {renderTab()}
              </div>
            </div>
          ) : (
            <div className="hosting-empty">
              <span className="empty-icon">🗄️</span>
              <h3>{t("common.selectService")}</h3>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
