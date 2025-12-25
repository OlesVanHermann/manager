// ============================================================
// INSTANCES - Compute VMs OVHcloud Public Cloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as instancesService from "../../../services/public-cloud.instances";
import GeneralTab from "./tabs/GeneralTab.tsx";
import NetworkTab from "./tabs/NetworkTab.tsx";
import SnapshotsTab from "./tabs/SnapshotsTab.tsx";
import ConsoleTab from "./tabs/ConsoleTab.tsx";
import "./styles.css";

interface InstanceInfo {
  id: string;
  name: string;
  flavorId: string;
  flavorName: string;
  imageId: string;
  imageName: string;
  region: string;
  status: string;
  created: string;
  ipAddresses: { ip: string; type: string; version: number }[];
}

export default function InstancesPage() {
  const { t } = useTranslation("public-cloud/instances/index");
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const instanceId = searchParams.get("id") || "";

  const [instance, setInstance] = useState<InstanceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "network", label: t("tabs.network") },
    { id: "snapshots", label: t("tabs.snapshots") },
    { id: "console", label: t("tabs.console") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!projectId || !instanceId) { setLoading(false); return; }
    loadInstance();
  }, [projectId, instanceId]);

  const loadInstance = async () => {
    try { setLoading(true); setError(null); const data = await instancesService.getInstance(projectId, instanceId); setInstance(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { ACTIVE: "badge-success", BUILD: "badge-warning", SHUTOFF: "badge-secondary", ERROR: "badge-error", REBOOT: "badge-info", RESCUE: "badge-warning" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  const getPublicIp = () => instance?.ipAddresses.find(ip => ip.type === "public" && ip.version === 4)?.ip || "-";

  if (!projectId || !instanceId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadInstance}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content public-cloud-page">
      <header className="page-header">
        <h1>🖥️ {instance?.name}</h1>
        {instance && (
          <div className="service-meta">
            <span className="meta-item">{instance.region}</span>
            <span className="meta-item">{instance.flavorName}</span>
            <span className="meta-item">{getPublicIp()}</span>
            {getStatusBadge(instance.status)}
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab projectId={projectId} instanceId={instanceId} instance={instance} onRefresh={loadInstance} />}
        {activeTab === "network" && <NetworkTab projectId={projectId} instanceId={instanceId} instance={instance} />}
        {activeTab === "snapshots" && <SnapshotsTab projectId={projectId} instanceId={instanceId} />}
        {activeTab === "console" && <ConsoleTab projectId={projectId} instanceId={instanceId} />}
      </div>
    </div>
  );
}
