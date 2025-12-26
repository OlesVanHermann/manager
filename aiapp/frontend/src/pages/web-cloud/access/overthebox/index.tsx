// ============================================================
// OVERTHEBOX PAGE - Accès Internet via OverTheBox
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage } from "../../../../components/ServiceListPage";
import type { ServiceItem } from "../../../../components/ServiceListPage.types";
import { ovhApi } from "../../../../services/api";
import type { OverTheBoxService } from "./overthebox.types";

import { GeneralTab } from "./tabs/general/GeneralTab.tsx";
import { RemotesTab } from "./tabs/remotes/RemotesTab.tsx";
import { TasksTab } from "./tabs/tasks/TasksTab.tsx";

async function listServices(): Promise<string[]> {
  return ovhApi.get<string[]>('/overTheBox');
}

async function getService(serviceName: string): Promise<OverTheBoxService> {
  return ovhApi.get<OverTheBoxService>(`/overTheBox/${serviceName}`);
}

const OtbIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
    <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M6 14h.01M10 10h4M10 14h4" stroke="#10b981"/>
  </svg>
);

export default function OverTheBoxPage() {
  const { t } = useTranslation("web-cloud/access/overthebox/index");

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [details, setDetails] = useState<OverTheBoxService | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const names = await listServices();
      const items: ServiceItem[] = names.map(n => ({ id: n, name: n }));
      setServices(items);
      if (items.length > 0 && !selected) setSelected(items[0].id);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!selected) return;
    getService(selected).then(setDetails).catch(() => setDetails(null));
  }, [selected]);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "remotes", label: t("tabs.remotes") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      i18nNamespace="web-cloud/access/overthebox/index"
      services={services}
      loading={loading}
      error={error}
      selectedService={selected}
      onSelectService={setSelected}
      emptyIcon={<OtbIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selected && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selected}</h2>
            {details && <span className={`badge ${details.status === 'active' ? 'success' : 'warning'}`}>{details.status}</span>}
          </div>
          <div className="detail-tabs">
            {tabs.map(tab => (
              <button key={tab.id} className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
            ))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "general" && <GeneralTab serviceName={selected} />}
            {activeTab === "remotes" && <RemotesTab serviceName={selected} />}
            {activeTab === "tasks" && <TasksTab serviceName={selected} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
