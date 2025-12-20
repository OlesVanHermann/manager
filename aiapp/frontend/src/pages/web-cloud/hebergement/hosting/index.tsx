// ============================================================
// HOSTING PAGE - Hébergements web (style Billing)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../../shared";
import { hostingService } from "../../../../services/web-cloud.hosting";
import { GeneralTab, MultisiteTab, FtpTab, DatabaseTab, CronTab, TasksTab, ModulesTab, EnvvarsTab, LogsTab, SslTab, RuntimesTab, EmailsTab } from "./tabs";
import "../../styles.css";

// ============ ICONS ============

const ServerIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Hébergements avec liste à gauche et détails à droite. */
export default function HostingPage() {
  const { t } = useTranslation("web-cloud/hosting/index");

  // ---------- STATE ----------
  const [hostings, setHostings] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHosting, setSelectedHosting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  // ---------- LOAD HOSTINGS ----------
  const loadHostings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const names = await hostingService.listHostings();
      const items: ServiceItem[] = [];
      for (const name of names) {
        try {
          const details = await hostingService.getHosting(name);
          items.push({
            id: name,
            name: name,
            type: details.offer || undefined,
          });
        } catch {
          items.push({ id: name, name: name });
        }
      }
      setHostings(items);
      if (items.length > 0 && !selectedHosting) {
        setSelectedHosting(items[0].id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHostings();
  }, [loadHostings]);

  // ---------- TABS ----------
  const detailTabs = [
    { id: "general", label: t("tabs.general") },
    { id: "multisite", label: t("tabs.multisite") },
    { id: "ftp", label: t("tabs.ftp") },
    { id: "database", label: t("tabs.database") },
    { id: "modules", label: t("tabs.modules") },
    { id: "cron", label: t("tabs.cron") },
    { id: "envvars", label: t("tabs.envvars") },
    { id: "runtimes", label: t("tabs.runtimes") },
    { id: "ssl", label: t("tabs.ssl") },
    { id: "emails", label: t("tabs.emails") },
    { id: "logs", label: t("tabs.logs") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-web-hosting"
      i18nNamespace="web-cloud/hosting/index"
      services={hostings}
      loading={loading}
      error={error}
      selectedService={selectedHosting}
      onSelectService={setSelectedHosting}
      emptyIcon={<ServerIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedHosting && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selectedHosting}</h2>
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
            {activeTab === "general" && <GeneralTab serviceName={selectedHosting} />}
            {activeTab === "multisite" && <MultisiteTab serviceName={selectedHosting} />}
            {activeTab === "ftp" && <FtpTab serviceName={selectedHosting} />}
            {activeTab === "database" && <DatabaseTab serviceName={selectedHosting} />}
            {activeTab === "modules" && <ModulesTab serviceName={selectedHosting} />}
            {activeTab === "cron" && <CronTab serviceName={selectedHosting} />}
            {activeTab === "envvars" && <EnvvarsTab serviceName={selectedHosting} />}
            {activeTab === "runtimes" && <RuntimesTab serviceName={selectedHosting} />}
            {activeTab === "ssl" && <SslTab serviceName={selectedHosting} />}
            {activeTab === "emails" && <EmailsTab serviceName={selectedHosting} />}
            {activeTab === "logs" && <LogsTab serviceName={selectedHosting} />}
            {activeTab === "tasks" && <TasksTab serviceName={selectedHosting} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
