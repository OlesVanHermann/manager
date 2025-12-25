// ============================================================
// EXCHANGE PAGE - Microsoft Exchange (style Hosting)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../../../../components/ServiceListPage";
import { ovhApi } from "../../../../services/api";
import type { ExchangeService } from "./exchange.types";

// Imports directs sans barrel file (JS-5)
import { AccountsTab } from "./tabs/accounts/AccountsTab.tsx";
import { DomainsTab } from "./tabs/domains/DomainsTab.tsx";
import { GroupsTab } from "./tabs/groups/GroupsTab.tsx";
import { ResourcesTab } from "./tabs/resources/ResourcesTab.tsx";
import { TasksTab } from "./tabs/tasks/TasksTab.tsx";


// ============ LOCAL API CALLS ============

async function listOrganizations(): Promise<string[]> {
  return ovhApi.get<string[]>('/email/exchange');
}

async function listServices(org: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/email/exchange/${org}/service`);
}

async function getService(org: string, service: string): Promise<ExchangeService> {
  return ovhApi.get<ExchangeService>(`/email/exchange/${org}/service/${service}`);
}

// ============ ICONS ============

const ExchangeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="M16 2v4M8 2v4" stroke="#0078d4"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Exchange avec liste a gauche et details a droite. */
export default function ExchangePage() {
  const { t } = useTranslation("web-cloud/exchange/index");

  // ---------- STATE ----------
  const [orgs, setOrgs] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("accounts");
  const [serviceDetails, setServiceDetails] = useState<ExchangeService | null>(null);

  // ---------- LOAD ORGS ----------
  const loadOrgs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const orgList = await listOrganizations();
      const items: ServiceItem[] = [];
      for (const org of orgList) {
        const services = await listServices(org);
        for (const svc of services) {
          items.push({ id: `${org}/${svc}`, name: svc, type: org });
        }
      }
      setOrgs(items);
      if (items.length > 0 && !selectedOrg) {
        setSelectedOrg(items[0].id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrgs(); }, [loadOrgs]);

  // ---------- PARSE SELECTED ----------
  const [org, service] = selectedOrg?.split('/') || [null, null];

  // ---------- LOAD DETAILS ----------
  useEffect(() => {
    if (!org || !service) return;
    getService(org, service).then(setServiceDetails).catch(() => setServiceDetails(null));
  }, [org, service]);

  // ---------- TABS ----------
  const detailTabs = [
    { id: "accounts", label: t("tabs.accounts") },
    { id: "domains", label: t("tabs.domains") },
    { id: "groups", label: t("tabs.groups") },
    { id: "resources", label: t("tabs.resources") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-exchange"
      i18nNamespace="web-cloud/exchange/index"
      services={orgs}
      loading={loading}
      error={error}
      selectedService={selectedOrg}
      onSelectService={setSelectedOrg}
      emptyIcon={<ExchangeIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedOrg && org && service && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{service}</h2>
            {serviceDetails && (
              <span className={`badge ${serviceDetails.state === 'ok' ? 'success' : 'warning'}`}>
                {serviceDetails.offer} - {serviceDetails.state}
              </span>
            )}
          </div>
          <div className="detail-tabs">
            {detailTabs.map((tab) => (
              <button key={tab.id} className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
            ))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "accounts" && <AccountsTab org={org} service={service} />}
            {activeTab === "domains" && <DomainsTab org={org} service={service} />}
            {activeTab === "groups" && <GroupsTab org={org} service={service} />}
            {activeTab === "resources" && <ResourcesTab org={org} service={service} />}
            {activeTab === "tasks" && <TasksTab org={org} service={service} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
