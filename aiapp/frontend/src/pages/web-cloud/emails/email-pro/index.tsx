// ============================================================
// EMAIL PRO PAGE (style Hosting)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../../../../components/ServiceListPage";
import { emailProService, EmailProService } from "../../../../services/web-cloud.email-pro";
import { AccountsTab } from "./tabs/accounts/AccountsTab.tsx";
import { DomainsTab } from "./tabs/domains/DomainsTab.tsx";
import { TasksTab } from "./tabs/tasks/TasksTab.tsx";
import "./styles.css";

// ============ ICONS ============

const MailProIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><circle cx="18" cy="18" r="3" fill="#0050d7" stroke="#0050d7"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Email Pro avec liste a gauche et details a droite. */
export default function EmailProPage() {
  const { t } = useTranslation("web-cloud/email-pro/index");

  // ---------- STATE ----------
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("accounts");
  const [serviceDetails, setServiceDetails] = useState<EmailProService | null>(null);

  // ---------- LOAD SERVICES ----------
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const names = await emailProService.listServices();
      const items: ServiceItem[] = names.map((name) => ({ id: name, name: name }));
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

  useEffect(() => { loadServices(); }, [loadServices]);

  // ---------- LOAD DETAILS ----------
  useEffect(() => {
    if (!selectedService) return;
    emailProService.getService(selectedService).then(setServiceDetails).catch(() => setServiceDetails(null));
  }, [selectedService]);

  // ---------- TABS ----------
  const detailTabs = [
    { id: "accounts", label: t("tabs.accounts") },
    { id: "domains", label: t("tabs.domains") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-email-pro"
      i18nNamespace="web-cloud/email-pro/index"
      services={services}
      loading={loading}
      error={error}
      selectedService={selectedService}
      onSelectService={setSelectedService}
      emptyIcon={<MailProIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedService && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selectedService}</h2>
            {serviceDetails && (
              <span className={`badge ${serviceDetails.state === 'ok' ? 'success' : 'warning'}`}>
                {serviceDetails.state === 'ok' ? '✓ Actif' : serviceDetails.state}
              </span>
            )}
          </div>
          <div className="detail-tabs">
            {detailTabs.map((tab) => (
              <button key={tab.id} className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
            ))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "accounts" && <AccountsTab serviceName={selectedService} />}
            {activeTab === "domains" && <DomainsTab serviceName={selectedService} />}
            {activeTab === "tasks" && <TasksTab serviceName={selectedService} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
