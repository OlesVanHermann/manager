// ============================================================
// OVERTHEBOX PAGE - OverTheBox (style Billing)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../shared";
import { overtheboxService } from "../../../services/web-cloud.overthebox";
import { GeneralTab, RemotesTab, TasksTab } from "./tabs";
import "../styles.css";

// ============ ICONS ============

const OtbIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h.01"/><path d="M10 12h.01"/><path d="M14 12h.01"/><path d="M18 12h.01"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page OverTheBox avec liste à gauche et détails à droite. */
export default function OvertheboxPage() {
  const { t } = useTranslation("web-cloud/overthebox/index");

  // ---------- STATE ----------
  const [devices, setDevices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  // ---------- LOAD DEVICES ----------
  const loadDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const deviceNames = await overtheboxService.listDevices();
      const items: ServiceItem[] = deviceNames.map((name) => ({
        id: name,
        name: name,
        type: "OTB",
      }));
      setDevices(items);
      if (items.length > 0 && !selectedDevice) {
        setSelectedDevice(items[0].id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  // ---------- TABS ----------
  const detailTabs = [
    { id: "general", label: t("tabs.general") },
    { id: "remotes", label: t("tabs.remotes") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-overthebox"
      i18nNamespace="web-cloud/overthebox/index"
      services={devices}
      loading={loading}
      error={error}
      selectedService={selectedDevice}
      onSelectService={setSelectedDevice}
      emptyIcon={<OtbIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedDevice && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selectedDevice}</h2>
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
            {activeTab === "general" && <GeneralTab serviceName={selectedDevice} />}
            {activeTab === "remotes" && <RemotesTab serviceName={selectedDevice} />}
            {activeTab === "tasks" && <TasksTab serviceName={selectedDevice} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
