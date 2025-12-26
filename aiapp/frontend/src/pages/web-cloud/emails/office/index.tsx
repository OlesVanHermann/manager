// ============================================================
// OFFICE 365 PAGE (style Hosting)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../../../../components/ServiceListPage";
import { officeService, OfficeTenant } from "../../../../services/web-cloud.office";
import { UsersTab } from "./tabs/users/UsersTab.tsx";
import { DomainsTab } from "./tabs/domains/DomainsTab.tsx";
import { TasksTab } from "./tabs/tasks/TasksTab.tsx";

// ============ ICONS ============

const OfficeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 4v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M14 3v4h4"/><path d="M8 13h8M8 17h5" stroke="#d83b01"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Office 365 avec liste a gauche et details a droite. */
export default function OfficePage() {
  const { t } = useTranslation("web-cloud/office/index");

  // ---------- STATE ----------
  const [tenants, setTenants] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("users");
  const [tenantDetails, setTenantDetails] = useState<OfficeTenant | null>(null);

  // ---------- LOAD TENANTS ----------
  const loadTenants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const names = await officeService.listTenants();
      const items: ServiceItem[] = names.map((name) => ({ id: name, name: name }));
      setTenants(items);
      if (items.length > 0 && !selectedTenant) {
        setSelectedTenant(items[0].id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTenants(); }, [loadTenants]);

  // ---------- LOAD DETAILS ----------
  useEffect(() => {
    if (!selectedTenant) return;
    officeService.getTenant(selectedTenant).then(setTenantDetails).catch(() => setTenantDetails(null));
  }, [selectedTenant]);

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
      guidesUrl="https://help.ovhcloud.com/csm/fr-microsoft-365"
      i18nNamespace="web-cloud/office/index"
      services={tenants}
      loading={loading}
      error={error}
      selectedService={selectedTenant}
      onSelectService={setSelectedTenant}
      emptyIcon={<OfficeIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedTenant && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{tenantDetails?.displayName || selectedTenant}</h2>
            {tenantDetails && (
              <span className={`badge ${tenantDetails.status === 'ok' ? 'success' : 'warning'}`}>
                {tenantDetails.status === 'ok' ? '✓ Actif' : tenantDetails.status}
              </span>
            )}
          </div>
          <div className="detail-tabs">
            {detailTabs.map((tab) => (
              <button key={tab.id} className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
            ))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "users" && <UsersTab tenantId={selectedTenant} />}
            {activeTab === "domains" && <DomainsTab tenantId={selectedTenant} />}
            {activeTab === "tasks" && <TasksTab tenantId={selectedTenant} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
