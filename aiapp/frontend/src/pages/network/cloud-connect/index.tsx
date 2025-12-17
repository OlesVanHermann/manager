// ============================================================
// CLOUD CONNECT - OVHcloud Connect (liaison dédiée)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as cloudConnectService from "../../../services/network.cloud-connect";
import GeneralTab from "./tabs/GeneralTab";
import InterfacesTab from "./tabs/InterfacesTab";
import TasksTab from "./tabs/TasksTab";
import "../styles.css";

interface CloudConnectInfo {
  uuid: string;
  description?: string;
  status: string;
  bandwidth: number;
  pop: string;
  portSpeed: number;
}

export default function CloudConnectPage() {
  const { t } = useTranslation("network/cloud-connect/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [service, setService] = useState<CloudConnectInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "interfaces", label: t("tabs.interfaces") },
    { id: "tasks", label: t("tabs.tasks") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!serviceId) { setLoading(false); return; }
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    try { setLoading(true); setError(null); const data = await cloudConnectService.getService(serviceId); setService(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { active: "badge-success", init: "badge-warning", disabled: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{t(`status.${status}`)}</span>;
  };

  const formatBandwidth = (mbps: number) => mbps >= 1000 ? `${mbps / 1000} Gbps` : `${mbps} Mbps`;

  if (!serviceId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadService}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content network-page">
      <header className="page-header">
        <h1>🔗 {service?.description || t("title")}</h1>
        {service && (
          <div className="service-meta">
            <span className="meta-item">POP: {service.pop}</span>
            <span className="meta-item">Bandwidth: {formatBandwidth(service.bandwidth)}</span>
            {getStatusBadge(service.status)}
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab serviceId={serviceId} service={service} onRefresh={loadService} />}
        {activeTab === "interfaces" && <InterfacesTab serviceId={serviceId} />}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
