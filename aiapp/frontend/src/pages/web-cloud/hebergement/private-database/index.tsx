// ============================================================
// PRIVATE DATABASE PAGE - Bases de données privées (style Billing)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../../shared";
import { privateDatabaseService } from "../../../../services/web-cloud.private-database";
import { GeneralTab, DatabasesTab, UsersTab, WhitelistTab, TasksTab } from "./tabs";
import "../../styles.css";

// ============ ICONS ============

const DatabaseIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);

// ============ COMPOSANT ============

/** Page Private Database avec liste à gauche et détails à droite. */
export default function PrivateDatabasePage() {
  const { t } = useTranslation("web-cloud/private-database/index");

  // ---------- STATE ----------
  const [databases, setDatabases] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDb, setSelectedDb] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  // ---------- LOAD DATABASES ----------
  const loadDatabases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dbNames = await privateDatabaseService.listDatabases();
      const items: ServiceItem[] = dbNames.map((name) => ({
        id: name,
        name: name,
      }));
      setDatabases(items);
      if (items.length > 0 && !selectedDb) {
        setSelectedDb(items[0].id);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDatabases();
  }, [loadDatabases]);

  // ---------- TABS ----------
  const detailTabs = [
    { id: "general", label: t("tabs.general") },
    { id: "databases", label: t("tabs.databases") },
    { id: "users", label: t("tabs.users") },
    { id: "whitelist", label: t("tabs.whitelist") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  // ---------- RENDER ----------
  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-private-sql"
      i18nNamespace="web-cloud/private-database/index"
      services={databases}
      loading={loading}
      error={error}
      selectedService={selectedDb}
      onSelectService={setSelectedDb}
      emptyIcon={<DatabaseIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selectedDb && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selectedDb}</h2>
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
            {activeTab === "general" && <GeneralTab serviceName={selectedDb} />}
            {activeTab === "databases" && <DatabasesTab serviceName={selectedDb} />}
            {activeTab === "users" && <UsersTab serviceName={selectedDb} />}
            {activeTab === "whitelist" && <WhitelistTab serviceName={selectedDb} />}
            {activeTab === "tasks" && <TasksTab serviceName={selectedDb} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
