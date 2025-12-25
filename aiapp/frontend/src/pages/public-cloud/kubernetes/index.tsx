// ============================================================
// KUBERNETES - Managed Kubernetes OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as k8sService from "../../../services/public-cloud.kubernetes";
import GeneralTab from "./tabs/GeneralTab";
import NodePoolsTab from "./tabs/NodePoolsTab";
import KubeconfigTab from "./tabs/KubeconfigTab";
import "./styles.css";

interface ClusterInfo { id: string; name: string; region: string; version: string; status: string; url?: string; nodesCount: number; }

export default function KubernetesPage() {
  const { t } = useTranslation("public-cloud/kubernetes/index");
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const clusterId = searchParams.get("id") || "";

  const [cluster, setCluster] = useState<ClusterInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "nodepools", label: t("tabs.nodepools") },
    { id: "kubeconfig", label: t("tabs.kubeconfig") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!projectId || !clusterId) { setLoading(false); return; }
    loadCluster();
  }, [projectId, clusterId]);

  const loadCluster = async () => {
    try { setLoading(true); setError(null); const data = await k8sService.getCluster(projectId, clusterId); setCluster(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { READY: "badge-success", INSTALLING: "badge-warning", ERROR: "badge-error", UPDATING: "badge-info" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (!projectId || !clusterId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadCluster}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content public-cloud-page">
      <header className="page-header">
        <h1>☸️ {cluster?.name}</h1>
        {cluster && (
          <div className="service-meta">
            <span className="meta-item">Région: {cluster.region}</span>
            <span className="meta-item">Version: {cluster.version}</span>
            <span className="meta-item">{cluster.nodesCount} nodes</span>
            {getStatusBadge(cluster.status)}
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab projectId={projectId} clusterId={clusterId} cluster={cluster} onRefresh={loadCluster} />}
        {activeTab === "nodepools" && <NodePoolsTab projectId={projectId} clusterId={clusterId} />}
        {activeTab === "kubeconfig" && <KubeconfigTab projectId={projectId} clusterId={clusterId} />}
      </div>
    </div>
  );
}
