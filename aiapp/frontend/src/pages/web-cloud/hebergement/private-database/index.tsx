// ============================================================
// PRIVATE DATABASE INDEX - Page principale CloudDB
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage } from "../../shared";
import { privateDatabaseService, PrivateDatabase } from "../../../../services/web-cloud.private-database";
import { GeneralTab } from "./tabs/GeneralTab";
import { DatabasesTab } from "./tabs/DatabasesTab";
import { UsersTab } from "./tabs/UsersTab";
import { WhitelistTab } from "./tabs/WhitelistTab";
import { TasksTab } from "./tabs/TasksTab";
import "./styles.css";

const TABS = [
  { id: "general", labelKey: "tabs.general" },
  { id: "databases", labelKey: "tabs.databases" },
  { id: "users", labelKey: "tabs.users" },
  { id: "whitelist", labelKey: "tabs.whitelist" },
  { id: "tasks", labelKey: "tabs.tasks" },
];

export function PrivateDatabasePage() {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [services, setServices] = useState<PrivateDatabase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<PrivateDatabase | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const names = await privateDatabaseService.listPrivateDatabases();
      const data = await Promise.all(names.map(n => privateDatabaseService.getPrivateDatabase(n)));
      setServices(data);
      if (data.length > 0 && !selected) {
        setSelected(data[0]);
      }
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { loadServices(); }, [loadServices]);

  const getStateBadge = (state: string) => {
    const map: Record<string, { class: string; label: string }> = {
      started: { class: 'success', label: 'Démarré' },
      stopped: { class: 'inactive', label: 'Arrêté' },
      starting: { class: 'warning', label: 'Démarrage...' },
      stopping: { class: 'warning', label: 'Arrêt...' },
      error: { class: 'error', label: 'Erreur' },
    };
    return map[state] || { class: 'inactive', label: state };
  };

  const renderTabContent = () => {
    if (!selected) return null;
    const props = { serviceName: selected.serviceName, details: selected };
    
    switch (activeTab) {
      case "general": return <GeneralTab {...props} onRefresh={loadServices} />;
      case "databases": return <DatabasesTab serviceName={selected.serviceName} />;
      case "users": return <UsersTab serviceName={selected.serviceName} />;
      case "whitelist": return <WhitelistTab serviceName={selected.serviceName} />;
      case "tasks": return <TasksTab serviceName={selected.serviceName} />;
      default: return <GeneralTab {...props} onRefresh={loadServices} />;
    }
  };

  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      guidesUrl="https://help.ovhcloud.com/csm/fr-web-cloud-databases"
      i18nNamespace="web-cloud/private-database/index"
      services={services}
      loading={loading}
      error={error}
      selectedService={selected}
      onSelectService={setSelected}
      emptyIcon={<span style={{ fontSize: '3rem' }}>🗄️</span>}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selected && (
        <div className="service-detail">
          <div className="detail-header">
            <div className="detail-title-row">
              <h2>{selected.displayName || selected.serviceName}</h2>
              <span className={`badge ${getStateBadge(selected.state).class}`}>
                {getStateBadge(selected.state).label}
              </span>
            </div>
            <span className="service-sublabel">{selected.type} {selected.version} • {selected.hostname}</span>
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

export default PrivateDatabasePage;
