// ============================================================
// OVERTHEBOX PAGE (style Hosting)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../../shared";
import { overtheboxPageService } from "./overthebox.service";
import type { OverTheBox } from "./overthebox.types";
import { GeneralTab, RemotesTab, TasksTab } from "./tabs";
import "../../styles.css";

const BoxIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

export default function OvertheboxPage() {
  const { t } = useTranslation("web-cloud/overthebox/index");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [serviceDetails, setServiceDetails] = useState<OverTheBox | null>(null);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const names = await overtheboxPageService.listServices();
      const items: ServiceItem[] = names.map((name) => ({ id: name, name: name }));
      setServices(items);
      if (items.length > 0 && !selectedService) setSelectedService(items[0].id);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadServices(); }, [loadServices]);

  useEffect(() => {
    if (!selectedService) return;
    overtheboxPageService.getService(selectedService).then(setServiceDetails).catch(() => setServiceDetails(null));
  }, [selectedService]);

  const detailTabs = [
    { id: "general", label: t("tabs.general") },
    { id: "remotes", label: t("tabs.remotes") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  return (
    <ServiceListPage titleKey="title" descriptionKey="description" guidesUrl="https://help.ovhcloud.com/csm/fr-overthebox" i18nNamespace="web-cloud/overthebox/index" services={services} loading={loading} error={error} selectedService={selectedService} onSelectService={setSelectedService} emptyIcon={<BoxIcon />} emptyTitleKey="empty.title" emptyDescriptionKey="empty.description">
      {selectedService && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{serviceDetails?.customerDescription || selectedService}</h2>
            {serviceDetails && <span className={`badge ${serviceDetails.status === 'active' ? 'success' : 'warning'}`}>{serviceDetails.status}</span>}
          </div>
          <div className="detail-tabs">
            {detailTabs.map((tab) => (<button key={tab.id} className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "general" && <GeneralTab serviceName={selectedService} details={serviceDetails} />}
            {activeTab === "remotes" && <RemotesTab serviceName={selectedService} />}
            {activeTab === "tasks" && <TasksTab serviceName={selectedService} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
