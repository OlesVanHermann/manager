// ============================================================
// PACK XDSL PAGE - Accès Internet xDSL
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage } from "../../../../components/ServiceListPage";
import type { ServiceItem } from "../../../../components/ServiceListPage.types";
import { ovhApi } from "../../../../services/api";
import type { PackXdslService } from "./pack-xdsl.types";

import { GeneralTab } from "./tabs/general/GeneralTab.tsx";
import { AccessTab } from "./tabs/access/AccessTab.tsx";
import { VoipTab } from "./tabs/voip/VoipTab.tsx";
import { ServicesTab } from "./tabs/services/ServicesTab.tsx";
import { TasksTab } from "./tabs/tasks/TasksTab.tsx";

async function listPacks(): Promise<string[]> {
  return ovhApi.get<string[]>('/pack/xdsl');
}

async function getPack(packName: string): Promise<PackXdslService> {
  return ovhApi.get<PackXdslService>(`/pack/xdsl/${packName}`);
}

const XdslIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
    <path d="M4 9h16M4 15h16" stroke="#3b82f6"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

export default function PackXdslPage() {
  const { t } = useTranslation("web-cloud/access/pack-xdsl/index");

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [details, setDetails] = useState<PackXdslService | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const names = await listPacks();
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
    getPack(selected).then(setDetails).catch(() => setDetails(null));
  }, [selected]);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "access", label: t("tabs.access") },
    { id: "voip", label: t("tabs.voip") },
    { id: "services", label: t("tabs.services") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  return (
    <ServiceListPage
      titleKey="title"
      descriptionKey="description"
      i18nNamespace="web-cloud/access/pack-xdsl/index"
      services={services}
      loading={loading}
      error={error}
      selectedService={selected}
      onSelectService={setSelected}
      emptyIcon={<XdslIcon />}
      emptyTitleKey="empty.title"
      emptyDescriptionKey="empty.description"
    >
      {selected && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selected}</h2>
            {details && <span className={`badge success`}>{details.offerDescription || 'xDSL'}</span>}
          </div>
          <div className="detail-tabs">
            {tabs.map(tab => (
              <button key={tab.id} className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
            ))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "general" && <GeneralTab packName={selected} />}
            {activeTab === "access" && <AccessTab packName={selected} />}
            {activeTab === "voip" && <VoipTab packName={selected} />}
            {activeTab === "services" && <ServicesTab packName={selected} />}
            {activeTab === "tasks" && <TasksTab packName={selected} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
