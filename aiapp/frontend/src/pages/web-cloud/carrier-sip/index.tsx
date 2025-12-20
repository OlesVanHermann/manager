// ============================================================
// CARRIER SIP PAGE - Carrier SIP (style Billing)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../shared";
import { carrierSipService } from "../../../services/web-cloud.carrier-sip";
import { GeneralTab, EndpointsTab, CdrTab } from "./tabs";
import "../styles.css";

// ============ ICONS ============

const SipIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    <path d="M14.5 2a9.5 9.5 0 0 1 9.5 9.5"/>
    <path d="M14.5 6a5.5 5.5 0 0 1 5.5 5.5"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Carrier SIP avec liste à gauche et détails à droite. */
export default function CarrierSipPage() {
  const { t } = useTranslation("web-cloud/carrier-sip/index");

  // ---------- STATE ----------
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  // ---------- LOAD SERVICES ----------
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const serviceNames = await carrierSipService.listServices();
      const items: ServiceItem[] = serviceNames.map((name) => ({
        id: name,
        name: name,
        type: "Carrier SIP",
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
    { id: "general", label: t("tabs.general") },
    { id: "endpoints", label: t("tabs.endpoints") },
    { id: "cdr", label: t("tabs.cdr") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-carrier-sip"
      i18nNamespace="web-cloud/carrier-sip/index"
      services={services}
      loading={loading}
      error={error}
      selectedService={selectedService}
      onSelectService={setSelectedService}
      emptyIcon={<SipIcon />}
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
            {activeTab === "general" && <GeneralTab serviceName={selectedService} />}
            {activeTab === "endpoints" && <EndpointsTab serviceName={selectedService} />}
            {activeTab === "cdr" && <CdrTab serviceName={selectedService} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
