// ============================================================
// DOMAINS PAGE - Gestion des domaines (style Billing)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem, Tab } from "../shared";
import { domainsService, Domain, DomainServiceInfos } from "../../../services/web-cloud.domains";
import { GeneralTab, ZoneTab, DnsTab, TasksTab, RedirectionTab, DynHostTab, DnssecTab, GlueTab } from "./tabs";
import "../styles.css";

// ============ ICONS ============

const GlobeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Domaines avec liste à gauche et détails à droite. */
export default function DomainsPage() {
  const { t } = useTranslation("web-cloud/domains/index");

  // ---------- STATE ----------
  const [domains, setDomains] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  // ---------- SELECTED DOMAIN DATA ----------
  const [domainDetails, setDomainDetails] = useState<Domain | null>(null);
  const [serviceInfos, setServiceInfos] = useState<DomainServiceInfos | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ---------- LOAD DOMAINS ----------
  const loadDomains = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const domainNames = await domainsService.listDomains();
      const items: ServiceItem[] = domainNames.map((name) => ({
        id: name,
        name: name,
      }));
      setDomains(items);
      if (items.length > 0 && !selectedDomain) {
        setSelectedDomain(items[0].id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDomains();
  }, [loadDomains]);

  // ---------- LOAD SELECTED DOMAIN DETAILS ----------
  useEffect(() => {
    if (!selectedDomain) {
      setDomainDetails(null);
      setServiceInfos(null);
      return;
    }
    const loadDetails = async () => {
      try {
        setDetailLoading(true);
        const [details, infos] = await Promise.all([
          domainsService.getDomain(selectedDomain),
          domainsService.getServiceInfos(selectedDomain),
        ]);
        setDomainDetails(details);
        setServiceInfos(infos);
      } catch {
        setDomainDetails(null);
        setServiceInfos(null);
      } finally {
        setDetailLoading(false);
      }
    };
    loadDetails();
  }, [selectedDomain]);

  // ---------- TABS ----------
  const detailTabs = [
    { id: "general", label: t("tabs.general") },
    { id: "zone", label: t("tabs.zone") },
    { id: "dns", label: t("tabs.dns") },
    { id: "redirection", label: t("tabs.redirection") },
    { id: "dynhost", label: t("tabs.dynhost") },
    { id: "glue", label: t("tabs.glue") },
    { id: "dnssec", label: t("tabs.dnssec") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-domains"
      i18nNamespace="web-cloud/domains/index"
      services={domains}
      loading={loading}
      error={error}
      selectedService={selectedDomain}
      onSelectService={setSelectedDomain}
      emptyIcon={<GlobeIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedDomain && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selectedDomain}</h2>
            {domainDetails && (
              <span className={`badge ${domainDetails.transferLockStatus === 'locked' ? 'success' : 'warning'}`}>
                {domainDetails.transferLockStatus === 'locked' ? '🔒' : '🔓'} {domainDetails.transferLockStatus}
              </span>
            )}
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
            {activeTab === "general" && <GeneralTab domain={selectedDomain} details={domainDetails || undefined} serviceInfos={serviceInfos || undefined} loading={detailLoading} />}
            {activeTab === "zone" && <ZoneTab domain={selectedDomain} />}
            {activeTab === "dns" && <DnsTab domain={selectedDomain} />}
            {activeTab === "redirection" && <RedirectionTab domain={selectedDomain} />}
            {activeTab === "dynhost" && <DynHostTab domain={selectedDomain} />}
            {activeTab === "glue" && <GlueTab domain={selectedDomain} />}
            {activeTab === "dnssec" && <DnssecTab domain={selectedDomain} />}
            {activeTab === "tasks" && <TasksTab domain={selectedDomain} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
