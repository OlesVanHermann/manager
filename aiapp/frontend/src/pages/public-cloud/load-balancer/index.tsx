// ============================================================
// LOAD BALANCER - Public Cloud Load Balancer OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as lbService from "../../../services/public-cloud.load-balancer";
import GeneralTab from "./tabs/GeneralTab";
import ListenersTab from "./tabs/ListenersTab";
import PoolsTab from "./tabs/PoolsTab";
import "./styles.css";

interface LoadBalancerInfo { id: string; name: string; region: string; status: string; vipAddress: string; flavor: string; }

export default function LoadBalancerPage() {
  const { t } = useTranslation("public-cloud/load-balancer/index");
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const lbId = searchParams.get("id") || "";

  const [lb, setLb] = useState<LoadBalancerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "listeners", label: t("tabs.listeners") },
    { id: "pools", label: t("tabs.pools") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!projectId || !lbId) { setLoading(false); return; }
    loadLB();
  }, [projectId, lbId]);

  const loadLB = async () => {
    try { setLoading(true); setError(null); const data = await lbService.getLoadBalancer(projectId, lbId); setLb(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { ACTIVE: "badge-success", PENDING_CREATE: "badge-warning", ERROR: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (!projectId || !lbId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadLB}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content public-cloud-page">
      <header className="page-header">
        <h1>⚖️ {lb?.name}</h1>
        {lb && (
          <div className="service-meta">
            <span className="meta-item">{lb.region}</span>
            <span className="meta-item">VIP: {lb.vipAddress}</span>
            {getStatusBadge(lb.status)}
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab projectId={projectId} lbId={lbId} lb={lb} onRefresh={loadLB} />}
        {activeTab === "listeners" && <ListenersTab projectId={projectId} lbId={lbId} />}
        {activeTab === "pools" && <PoolsTab projectId={projectId} lbId={lbId} />}
      </div>
    </div>
  );
}
