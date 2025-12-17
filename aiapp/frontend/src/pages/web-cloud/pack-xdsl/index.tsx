// ============================================================
// PACK XDSL - Gestion des packs Internet OVH
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as packXdslService from "../../../services/web-cloud.pack-xdsl";
import GeneralTab from "./tabs/GeneralTab";
import AccessTab from "./tabs/AccessTab";
import VoipTab from "./tabs/VoipTab";
import ServicesTab from "./tabs/ServicesTab";
import TasksTab from "./tabs/TasksTab";
import "../styles.css";

interface PackInfo {
  packName: string;
  description?: string;
  offerDescription: string;
  capabilities: {
    isLegacyOffer: boolean;
    canMoveAddress: boolean;
  };
}

export default function PackXdslPage() {
  const { t } = useTranslation("web-cloud/pack-xdsl/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [pack, setPack] = useState<PackInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "access", label: t("tabs.access") },
    { id: "voip", label: t("tabs.voip") },
    { id: "services", label: t("tabs.services") },
    { id: "tasks", label: t("tabs.tasks") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!serviceId) { setLoading(false); return; }
    loadPack();
  }, [serviceId]);

  const loadPack = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await packXdslService.getPack(serviceId);
      setPack(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  if (!serviceId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2><p>{t("noService.description")}</p></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadPack}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content web-cloud-page">
      <header className="page-header">
        <h1>🌐 {pack?.description || pack?.packName}</h1>
        {pack && (
          <div className="service-meta">
            <span className="meta-item">{pack.offerDescription}</span>
            {pack.capabilities.isLegacyOffer && <span className="status-badge badge-secondary">{t("legacy")}</span>}
          </div>
        )}
      </header>

      <TabButtons />

      <div className="tab-content">
        {activeTab === "general" && <GeneralTab serviceId={serviceId} pack={pack} onRefresh={loadPack} />}
        {activeTab === "access" && <AccessTab serviceId={serviceId} />}
        {activeTab === "voip" && <VoipTab serviceId={serviceId} />}
        {activeTab === "services" && <ServicesTab serviceId={serviceId} />}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
