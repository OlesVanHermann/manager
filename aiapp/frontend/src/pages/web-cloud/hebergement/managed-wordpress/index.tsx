// ============================================================
// MANAGED WORDPRESS - Page principale (Défactorisé)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../../services/api";
import type { ManagedWordPress } from "./managed-wordpress.types";
import { GeneralTab, BackupsTab, ThemesPluginsTab, TasksTab } from "./tabs";
import { CreateWebsiteModal, ImportWebsiteModal } from "./components";
import Onboarding from "./Onboarding";

const BASE_PATH = "/managedCMS/resource";
const API_OPTIONS = { apiVersion: "v2" };

// Service local pour la page principale
const pageService = {
  async listServices(): Promise<string[]> {
    const response = await apiClient.get<{ serviceName: string }[]>(BASE_PATH, API_OPTIONS);
    return response.map(r => r.serviceName);
  },
  async getService(serviceName: string): Promise<ManagedWordPress> {
    return apiClient.get(`${BASE_PATH}/${serviceName}`, API_OPTIONS);
  },
};

type TabKey = "general" | "backups" | "themes" | "tasks";

const TABS: { key: TabKey; label: string }[] = [
  { key: "general", label: "Général" },
  { key: "backups", label: "Sauvegardes" },
  { key: "themes", label: "Thèmes & Extensions" },
  { key: "tasks", label: "Tâches" },
];

export default function ManagedWordPressPage() {
  const { t } = useTranslation("web-cloud/managed-wordpress/index");
  const { serviceName: paramServiceName } = useParams<{ serviceName?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [services, setServices] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(paramServiceName || null);
  const [details, setDetails] = useState<ManagedWordPress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>((searchParams.get("tab") as TabKey) || "general");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const list = await pageService.listServices();
      setServices(list);
      if (list.length > 0 && !selectedService) setSelectedService(list[0]);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [selectedService]);

  const loadDetails = useCallback(async () => {
    if (!selectedService) return;
    try { const data = await pageService.getService(selectedService); setDetails(data); }
    catch (err) { console.error(err); }
  }, [selectedService]);

  useEffect(() => { loadServices(); }, [loadServices]);
  useEffect(() => { loadDetails(); }, [loadDetails]);
  useEffect(() => { const tab = searchParams.get("tab") as TabKey; if (tab && TABS.some(t => t.key === tab)) setActiveTab(tab); }, [searchParams]);

  const handleTabChange = (tab: TabKey) => { setActiveTab(tab); setSearchParams({ tab }); };
  const handleRefresh = () => { loadDetails(); };

  // Onboarding si aucun service
  if (!loading && services.length === 0) {
    return (
      <>
        <Onboarding onCreate={() => setShowCreateModal(true)} onImport={() => setShowImportModal(true)} />
        {selectedService && (
          <>
            <CreateWebsiteModal serviceName={selectedService} isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={() => { setShowCreateModal(false); loadServices(); }} />
            <ImportWebsiteModal serviceName={selectedService} isOpen={showImportModal} onClose={() => setShowImportModal(false)} onSuccess={() => { setShowImportModal(false); loadServices(); }} />
          </>
        )}
      </>
    );
  }

  const renderTab = () => {
    if (!selectedService || !details) return null;
    switch (activeTab) {
      case "general": return <GeneralTab serviceName={selectedService} details={details} onRefresh={handleRefresh} />;
      case "backups": return <BackupsTab serviceName={selectedService} />;
      case "themes": return <ThemesPluginsTab serviceName={selectedService} />;
      case "tasks": return <TasksTab serviceName={selectedService} />;
      default: return null;
    }
  };

  return (
    <div className="hosting-page">
      <div className="hosting-split">
        <aside className="service-list-sidebar">
          <div className="sidebar-search"><div className="search-input-wrapper"><span className="search-icon">🔍</span><input type="text" placeholder={t("common.search")} /></div></div>
          <div className="sidebar-filter"><span>{services.length} site(s)</span></div>
          <div className="service-items">
            {services.map(svc => (
              <div key={svc} className={`service-item ${svc === selectedService ? "selected" : ""}`} onClick={() => setSelectedService(svc)}>
                <span className="service-icon">🌐</span>
                <div className="service-info"><div className="service-item-name">{svc}</div><div className="service-item-type">WordPress</div></div>
              </div>
            ))}
          </div>
        </aside>

        <main className="hosting-main">
          {loading ? (
            <div className="tab-loading">Chargement...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : selectedService && details ? (
            <div className="service-detail">
              <div className="detail-header-domains">
                <h2>{details.displayName || details.serviceName}</h2>
                <span className={`badge ${details.state === "active" ? "success" : "warning"}`}>{details.state}</span>
              </div>
              <div className="detail-header-tabs">
                {TABS.map(tab => (
                  <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? "active" : ""}`} onClick={() => handleTabChange(tab.key)}>{tab.label}</button>
                ))}
              </div>
              <div className="tab-content">{renderTab()}</div>
            </div>
          ) : (
            <div className="hosting-empty"><span className="empty-icon">🌐</span><h3>{t("common.selectService")}</h3></div>
          )}
        </main>
      </div>
    </div>
  );
}
