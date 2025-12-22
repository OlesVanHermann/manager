// ============================================================
// HOSTING INDEX - Page principale hébergements web
// ============================================================

import { useState, useEffect, useCallback } from "react";
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
  { id: "general", labelKey: "tabs.general" },
  { id: "multisite", labelKey: "tabs.multisite" },
  { id: "ssl", labelKey: "tabs.ssl" },
  { id: "modules", labelKey: "tabs.modules" },
  { id: "logs", labelKey: "tabs.logs" },
  { id: "ftp", labelKey: "tabs.ftp" },
  { id: "database", labelKey: "tabs.database" },
  { id: "tasks", labelKey: "tabs.tasks" },
  { id: "cron", labelKey: "tabs.cron" },
  { id: "envvars", labelKey: "tabs.envvars" },
  { id: "runtimes", labelKey: "tabs.runtimes" },
  { id: "cdn", labelKey: "tabs.cdn" },
  { id: "boost", labelKey: "tabs.boost" },
  { id: "localseo", labelKey: "tabs.localseo" },
  { id: "emails", labelKey: "tabs.emails" },
];

export function HostingPage() {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [services, setServices] = useState<Hosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Hosting | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const names = await hostingService.listHostings();
      const data = await Promise.all(names.map(n => hostingService.getHosting(n)));
      setServices(data);
      if (data.length > 0 && !selected) {
        setSelected(data[0]);
      }
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { loadServices(); }, [loadServices]);

  const renderTabContent = () => {
    if (!selected) return null;
    const props = { serviceName: selected.serviceName, details: selected };
    
    switch (activeTab) {
      case "general": return <GeneralTab serviceName={selected.serviceName} />;
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
      default: return <GeneralTab serviceName={selected.serviceName} />;
    }
  };

  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-web-hosting"
      i18nNamespace="web-cloud/hosting/index"
      services={services}
      loading={loading}
      error={error}
      selectedService={selected}
      onSelectService={setSelected}
      emptyIcon={<span style={{ fontSize: '3rem' }}>🌐</span>}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selected && (
        <div className="service-detail">
          <div className="detail-header">
            <h2>{selected.displayName || selected.serviceName}</h2>
            <span className="service-sublabel">{selected.serviceName}</span>
          </div>

          <div className="tabs-container">
            <div className="tabs-scroll">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {t(tab.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}

export default HostingPage;
