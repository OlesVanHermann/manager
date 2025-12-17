// ============================================================
// VRACK SERVICES - vRack Services OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as vrackServicesService from "../../../services/network.vrack-services";
import GeneralTab from "./tabs/GeneralTab";
import SubnetsTab from "./tabs/SubnetsTab";
import EndpointsTab from "./tabs/EndpointsTab";
import "../styles.css";

interface VrackServicesInfo {
  id: string;
  displayName?: string;
  productStatus: string;
  region: string;
  createdAt: string;
}

export default function VrackServicesPage() {
  const { t } = useTranslation("network/vrack-services/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [service, setService] = useState<VrackServicesInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "subnets", label: t("tabs.subnets") },
    { id: "endpoints", label: t("tabs.endpoints") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!serviceId) { setLoading(false); return; }
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    try { setLoading(true); setError(null); const data = await vrackServicesService.getService(serviceId); setService(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { READY: "badge-success", CREATING: "badge-warning", ERROR: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (!serviceId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadService}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content network-page">
      <header className="page-header">
        <h1>🌐 {service?.displayName || service?.id}</h1>
        {service && (
          <div className="service-meta">
            <span className="meta-item">Région: {service.region}</span>
            {getStatusBadge(service.productStatus)}
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab serviceId={serviceId} service={service} onRefresh={loadService} />}
        {activeTab === "subnets" && <SubnetsTab serviceId={serviceId} />}
        {activeTab === "endpoints" && <EndpointsTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
