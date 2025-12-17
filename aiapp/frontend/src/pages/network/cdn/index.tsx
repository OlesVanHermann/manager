// ============================================================
// CDN - Content Delivery Network OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as cdnService from "../../../services/network.cdn";
import GeneralTab from "./tabs/GeneralTab";
import DomainsTab from "./tabs/DomainsTab";
import StatisticsTab from "./tabs/StatisticsTab";
import TasksTab from "./tabs/TasksTab";
import "../styles.css";

interface CdnInfo {
  serviceName: string;
  offer: string;
  anycast: string;
  status: string;
}

export default function CdnPage() {
  const { t } = useTranslation("network/cdn/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [cdn, setCdn] = useState<CdnInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "domains", label: t("tabs.domains") },
    { id: "statistics", label: t("tabs.statistics") },
    { id: "tasks", label: t("tabs.tasks") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!serviceId) { setLoading(false); return; }
    loadCdn();
  }, [serviceId]);

  const loadCdn = async () => {
    try { setLoading(true); setError(null); const data = await cdnService.getCdn(serviceId); setCdn(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { ok: "badge-success", suspended: "badge-error", installing: "badge-warning" };
    return <span className={`status-badge ${classes[status] || ""}`}>{t(`status.${status}`)}</span>;
  };

  if (!serviceId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadCdn}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content network-page">
      <header className="page-header">
        <h1>🚀 CDN - {cdn?.serviceName}</h1>
        {cdn && (
          <div className="service-meta">
            <span className="meta-item">Offre: {cdn.offer}</span>
            <span className="meta-item">Anycast: {cdn.anycast}</span>
            {getStatusBadge(cdn.status)}
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab serviceId={serviceId} cdn={cdn} onRefresh={loadCdn} />}
        {activeTab === "domains" && <DomainsTab serviceId={serviceId} />}
        {activeTab === "statistics" && <StatisticsTab serviceId={serviceId} />}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
