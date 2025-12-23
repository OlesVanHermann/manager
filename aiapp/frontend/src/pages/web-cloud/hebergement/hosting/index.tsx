// ============================================================
// HOSTING INDEX - Page principale hébergements web
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage } from "../../shared";
import { hostingService, Hosting } from "../../../../services/web-cloud.hosting";
import { GeneralTab } from "./tabs/GeneralTab";
import { MultisiteTab } from "./tabs/MultisiteTab";
import { FtpTab } from "./tabs/FtpTab";
import { DatabaseTab } from "./tabs/DatabaseTab";
import { ModulesTab } from "./tabs/ModulesTab";
import { CronTab } from "./tabs/CronTab";
import { EnvvarsTab } from "./tabs/EnvvarsTab";
import { RuntimesTab } from "./tabs/RuntimesTab";
import { SslTab } from "./tabs/SslTab";
import { CdnTab } from "./tabs/CdnTab";
import { BoostTab } from "./tabs/BoostTab";
import { LocalSeoTab } from "./tabs/LocalSeoTab";
import { EmailsTab } from "./tabs/EmailsTab";
import { LogsTab } from "./tabs/LogsTab";
import { TasksTab } from "./tabs/TasksTab";
import "./styles.css";

const TABS = [
  { id: "general", label: "Home" },
  { id: "multisite", label: "Multisite" },
  { id: "ftp", label: "FTP-SSH" },
  { id: "modules", label: "Modules" },
  { id: "tasks", label: "Tâches" },
  { id: "emails", label: "Emails" },
  { id: "envvars", label: "Variables" },
  { id: "runtimes", label: "Runtimes" },
  { id: "ssl", label: "SSL" },
  { id: "cdn", label: "CDN" },
  { id: "boost", label: "Boost" },
  { id: "logs", label: "Logs" },
  { id: "database", label: "BDD" },
  { id: "cron", label: "Cron" },
  { id: "localseo", label: "SEO" },
];

export function HostingPage() {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [hostings, setHostings] = useState<Hosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [attachedDomains, setAttachedDomains] = useState<string[]>([]);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const names = await hostingService.listHostings();
      const data = await Promise.all(names.map(n => hostingService.getHosting(n)));
      setHostings(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].serviceName);
      }
    } catch (err) { 
      setError(String(err)); 
    } finally { 
      setLoading(false); 
    }
  }, [selectedId]);

  const loadAttachedDomains = useCallback(async (serviceName: string) => {
    try {
      const domains = await hostingService.listAttachedDomains(serviceName);
      setAttachedDomains(domains || []);
    } catch {
      setAttachedDomains([]);
    }
  }, []);

  useEffect(() => { loadServices(); }, [loadServices]);

  useEffect(() => {
    if (selectedId) {
      loadAttachedDomains(selectedId);
    }
  }, [selectedId, loadAttachedDomains]);

  const mappedServices = useMemo(() => {
    return hostings.map(h => ({
      id: h.serviceName,
      name: h.displayName || h.serviceName,
      type: h.offer || "Hébergement",
      status: h.state === "active" ? "active" as const : 
              h.state === "bloqued" ? "suspended" as const : "active" as const
    }));
  }, [hostings]);

  const selected = useMemo(() => {
    return hostings.find(h => h.serviceName === selectedId) || null;
  }, [hostings, selectedId]);

  const handleSelectService = useCallback((id: string | { id: string }) => {
    const serviceId = typeof id === 'string' ? id : id.id;
    setSelectedId(serviceId);
    setActiveTab("general");
  }, []);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const handleRefresh = useCallback(() => {
    loadServices();
    if (selectedId) loadAttachedDomains(selectedId);
  }, [loadServices, selectedId, loadAttachedDomains]);

  const formatMultisites = (domains: string[], mainDomain: string, maxLength: number = 80) => {
    const otherDomains = domains.filter(d => d !== mainDomain && d !== `www.${mainDomain}`);
    if (otherDomains.length === 0) return null;
    
    let result = "";
    let count = 0;
    
    for (const domain of otherDomains) {
      const separator = count === 0 ? "" : ", ";
      const newPart = separator + domain;
      
      if ((result + newPart).length > maxLength) {
        const remaining = otherDomains.length - count;
        if (remaining > 0) {
          result += ` +${remaining}`;
        }
        break;
      }
      
      result += newPart;
      count++;
    }
    
    return result ? `(${result})` : null;
  };

  const renderTabContent = () => {
    if (!selected) return null;
    const props = { serviceName: selected.serviceName, details: selected };
    
    switch (activeTab) {
      case "general": 
        return <GeneralTab serviceName={selected.serviceName} onTabChange={handleTabChange} onRefresh={handleRefresh} />;
      case "multisite": return <MultisiteTab serviceName={selected.serviceName} />;
      case "ssl": return <SslTab serviceName={selected.serviceName} />;
      case "modules": return <ModulesTab serviceName={selected.serviceName} />;
      case "logs": return <LogsTab {...props} />;
      case "ftp": return <FtpTab {...props} />;
      case "database": return <DatabaseTab serviceName={selected.serviceName} />;
      case "tasks": return <TasksTab serviceName={selected.serviceName} />;
      case "cron": return <CronTab serviceName={selected.serviceName} />;
      case "envvars": return <EnvvarsTab serviceName={selected.serviceName} />;
      case "runtimes": return <RuntimesTab serviceName={selected.serviceName} />;
      case "cdn": return <CdnTab {...props} />;
      case "boost": return <BoostTab {...props} />;
      case "localseo": return <LocalSeoTab serviceName={selected.serviceName} />;
      case "emails": return <EmailsTab serviceName={selected.serviceName} />;
      default: 
        return <GeneralTab serviceName={selected.serviceName} onTabChange={handleTabChange} onRefresh={handleRefresh} />;
    }
  };

  const multisitesText = selected ? formatMultisites(attachedDomains, selected.serviceName) : null;

  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-web-hosting"
      i18nNamespace="web-cloud/hosting/index"
      services={mappedServices}
      loading={loading}
      error={error}
      selectedService={selectedId}
      onSelectService={handleSelectService}
      emptyIcon={<span style={{ fontSize: '3rem' }}>🌐</span>}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selected && (
        <div className="service-detail">
          {/* Ligne 1: Nom domaine + aliases */}
          <div className="detail-header-domains">
            <h2>{selected.displayName || selected.serviceName}</h2>
            {multisitesText && (
              <span className="multisites-list" title={attachedDomains.join(", ")}>
                {multisitesText}
              </span>
            )}
          </div>

          {/* Ligne 2: NAV3 Tabs */}
          <div className="detail-header-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenu */}
          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}

export default HostingPage;
