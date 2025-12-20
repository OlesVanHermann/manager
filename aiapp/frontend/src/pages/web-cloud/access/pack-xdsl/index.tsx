// ============================================================
// PACK XDSL PAGE (style Hosting)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ServiceListPage, ServiceItem } from "../../shared";
import { packXdslService, Pack } from "../../../../services/web-cloud.pack-xdsl";
import { GeneralTab, AccessTab, ServicesTab, VoipTab, TasksTab } from "./tabs";
import "../../styles.css";
import "./styles.css";

const WifiIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/>
  </svg>
);

export default function PackXdslPage() {
  const { t } = useTranslation("web-cloud/pack-xdsl/index");
  const [packs, setPacks] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [packDetails, setPackDetails] = useState<Pack | null>(null);

  const loadPacks = useCallback(async () => {
    try {
      setLoading(true);
      const names = await packXdslService.listPacks();
      const items: ServiceItem[] = names.map((name) => ({ id: name, name: name }));
      setPacks(items);
      if (items.length > 0 && !selectedPack) setSelectedPack(items[0].id);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadPacks(); }, [loadPacks]);

  useEffect(() => {
    if (!selectedPack) return;
    packXdslService.getPack(selectedPack).then(setPackDetails).catch(() => setPackDetails(null));
  }, [selectedPack]);

  const detailTabs = [
    { id: "general", label: t("tabs.general") },
    { id: "access", label: t("tabs.access") },
    { id: "services", label: t("tabs.services") },
    { id: "voip", label: t("tabs.voip") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  return (
    <ServiceListPage titleKey="title" descriptionKey="description" guidesUrl="https://help.ovhcloud.com/csm/fr-xdsl" i18nNamespace="web-cloud/pack-xdsl/index" services={packs} loading={loading} error={error} selectedService={selectedPack} onSelectService={setSelectedPack} emptyIcon={<WifiIcon />} emptyTitleKey="empty.title" emptyDescriptionKey="empty.description">
      {selectedPack && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h2>{selectedPack}</h2>
            {packDetails && <span className="badge info">{packDetails.offerDescription}</span>}
          </div>
          <div className="detail-tabs">
            {detailTabs.map((tab) => (<button key={tab.id} className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>))}
          </div>
          <div className="detail-tab-content">
            {activeTab === "general" && <GeneralTab packName={selectedPack} details={packDetails} />}
            {activeTab === "access" && <AccessTab packName={selectedPack} />}
            {activeTab === "services" && <ServicesTab packName={selectedPack} />}
            {activeTab === "voip" && <VoipTab packName={selectedPack} />}
            {activeTab === "tasks" && <TasksTab packName={selectedPack} />}
          </div>
        </div>
      )}
    </ServiceListPage>
  );
}
