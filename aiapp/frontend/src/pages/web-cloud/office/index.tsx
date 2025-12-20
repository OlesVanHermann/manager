// ============================================================
// OFFICE PAGE - Office 365 (style Billing)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../shared";
import { officeService } from "../../../services/web-cloud.office";
import { UsersTab, DomainsTab, TasksTab } from "./tabs";
import "../styles.css";

// ============ ICONS ============

const OfficeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 5v14l3 3h12l3-3V5l-3-3H6z"/><path d="M8 10h8"/><path d="M8 14h8"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Office 365 avec liste à gauche et détails à droite. */
export default function OfficePage() {
  const { t } = useTranslation("web-cloud/office/index");

  // ---------- STATE ----------
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("users");

  // ---------- LOAD SERVICES ----------
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const serviceNames = await officeService.listServices();
      const items: ServiceItem[] = serviceNames.map((name) => ({
        id: name,
        name: name,
        type: "Office 365",
      }));
      setServices(items);
      if (items.length > 0 && !selectedService) {
        setSelectedService(items[0].id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // ---------- TABS ----------
  const detailTabs = [
    { id: "users", label: t("tabs.users") },
    { id: "domains", label: t("tabs.domains") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-office365"
      i18nNamespace="web-cloud/office/index"
      services={services}
      loading={loading}
      error={error}
      selectedService={selectedService}
      onSelectService={setSelectedService}
      emptyIcon={<OfficeIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedService && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selectedService}</h2>
          </div>
          <div className="detail-tabs">
            {detailTabs.map((tab) => (
              <button
                key={tab.id}
                className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "users" && <UsersTab serviceName={selectedService} />}
            {activeTab === "domains" && <DomainsTab serviceName={selectedService} />}
            {activeTab === "tasks" && <TasksTab serviceName={selectedService} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
