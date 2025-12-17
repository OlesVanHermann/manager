import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as nutanixService from "../../../services/private-cloud.nutanix";
import GeneralTab from "./tabs/GeneralTab";
import NodesTab from "./tabs/NodesTab";
import IpsTab from "./tabs/IpsTab";
import TasksTab from "./tabs/TasksTab";
import "../styles.css";

interface NutanixCluster { serviceName: string; targetSpec?: { name: string; controlPanelURL: string; }; status: string; }

export default function NutanixPage() {
  const { t } = useTranslation("private-cloud/nutanix/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";
  const [cluster, setCluster] = useState<NutanixCluster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tabs = [{ id: "general", label: t("tabs.general") }, { id: "nodes", label: t("tabs.nodes") }, { id: "ips", label: t("tabs.ips") }, { id: "tasks", label: t("tabs.tasks") }];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => { if (!serviceId) { setLoading(false); return; } loadCluster(); }, [serviceId]);
  const loadCluster = async () => { try { setLoading(true); setError(null); const data = await nutanixService.getCluster(serviceId); setCluster(data); } catch (err) { setError(err instanceof Error ? err.message : "Erreur"); } finally { setLoading(false); } };
  const getStatusBadge = (status: string) => { const classes: Record<string, string> = { DEPLOYED: "badge-success", DEPLOYING: "badge-warning", ERROR: "badge-error" }; return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>; };

  if (!serviceId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadCluster}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content private-cloud-page">
      <header className="page-header"><h1>🔷 {cluster?.targetSpec?.name || cluster?.serviceName}</h1>{cluster && <div className="service-meta">{getStatusBadge(cluster.status)}</div>}</header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab serviceId={serviceId} cluster={cluster} onRefresh={loadCluster} />}
        {activeTab === "nodes" && <NodesTab serviceId={serviceId} />}
        {activeTab === "ips" && <IpsTab serviceId={serviceId} />}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
