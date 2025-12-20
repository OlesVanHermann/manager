// ============================================================
// ZIMBRA PAGE - Zimbra (style Billing)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../shared";
import { zimbraService } from "../../../services/web-cloud.zimbra";
import { AccountsTab, DomainsTab, AliasesTab, TasksTab } from "./tabs";
import "../styles.css";

// ============ ICONS ============

const ZimbraIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Zimbra avec liste à gauche et détails à droite. */
export default function ZimbraPage() {
  const { t } = useTranslation("web-cloud/zimbra/index");

  // ---------- STATE ----------
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("accounts");

  // ---------- LOAD SERVICES ----------
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const serviceNames = await zimbraService.listPlatforms();
      const items: ServiceItem[] = serviceNames.map((name) => ({
        id: name,
        name: name,
        type: "Zimbra",
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
    { id: "accounts", label: t("tabs.accounts") },
    { id: "domains", label: t("tabs.domains") },
    { id: "aliases", label: t("tabs.aliases") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-zimbra"
      i18nNamespace="web-cloud/zimbra/index"
      services={services}
      loading={loading}
      error={error}
      selectedService={selectedService}
      onSelectService={setSelectedService}
      emptyIcon={<ZimbraIcon />}
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
            {activeTab === "accounts" && <AccountsTab platform={selectedService} />}
            {activeTab === "domains" && <DomainsTab platform={selectedService} />}
            {activeTab === "aliases" && <AliasesTab platform={selectedService} />}
            {activeTab === "tasks" && <TasksTab platform={selectedService} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
