// ============================================================
// NETAPP - Enterprise File Storage OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as netappService from "../../../services/bare-metal.netapp";
import GeneralTab from "./tabs/GeneralTab";
import VolumesTab from "./tabs/VolumesTab";
import SnapshotsTab from "./tabs/SnapshotsTab";
import TasksTab from "./tabs/TasksTab";
import "./styles.css";

interface NetAppInfo {
  id: string;
  name: string;
  region: string;
  status: string;
  performanceLevel: string;
  createdAt: string;
}

export default function NetAppPage() {
  const { t } = useTranslation("bare-metal/netapp/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [netapp, setNetapp] = useState<NetAppInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "volumes", label: t("tabs.volumes") },
    { id: "snapshots", label: t("tabs.snapshots") },
    { id: "tasks", label: t("tabs.tasks") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!serviceId) { setLoading(false); return; }
    loadNetApp();
  }, [serviceId]);

  const loadNetApp = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await netappService.getNetApp(serviceId);
      setNetapp(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { running: "badge-success", creating: "badge-warning", error: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{t(`status.${status}`)}</span>;
  };

  if (!serviceId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadNetApp}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content netapp-page">
      <header className="page-header">
        <h1>🗃️ {netapp?.name || netapp?.id}</h1>
        {netapp && (
          <div className="service-meta">
            <span className="meta-item">Région: {netapp.region}</span>
            <span className="meta-item">Performance: {netapp.performanceLevel}</span>
            {getStatusBadge(netapp.status)}
          </div>
        )}
      </header>

      <TabButtons />

      <div className="tab-content">
        {activeTab === "general" && <GeneralTab serviceId={serviceId} netapp={netapp} onRefresh={loadNetApp} />}
        {activeTab === "volumes" && <VolumesTab serviceId={serviceId} />}
        {activeTab === "snapshots" && <SnapshotsTab serviceId={serviceId} />}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
