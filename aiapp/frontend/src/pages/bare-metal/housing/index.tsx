// ============================================================
// HOUSING - Colocation OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as housingService from "../../../services/bare-metal.housing";
import GeneralTab from "./tabs/GeneralTab";
import TasksTab from "./tabs/TasksTab";
import "../styles.css";

interface HousingInfo { name: string; datacenter: string; rack: string; networkBandwidth: number; }

export default function HousingPage() {
  const { t } = useTranslation("bare-metal/housing/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [housing, setHousing] = useState<HousingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "tasks", label: t("tabs.tasks") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!serviceId) { setLoading(false); return; }
    loadHousing();
  }, [serviceId]);

  const loadHousing = async () => {
    try { setLoading(true); setError(null); const data = await housingService.getHousing(serviceId); setHousing(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  if (!serviceId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadHousing}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content bare-metal-page">
      <header className="page-header">
        <h1>🏢 {housing?.name}</h1>
        {housing && (
          <div className="service-meta">
            <span className="meta-item">{housing.datacenter}</span>
            <span className="meta-item">Rack: {housing.rack}</span>
            <span className="meta-item">{housing.networkBandwidth} Mbps</span>
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab serviceId={serviceId} housing={housing} onRefresh={loadHousing} />}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
