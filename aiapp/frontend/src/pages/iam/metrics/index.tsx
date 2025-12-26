// ============================================================
// METRICS PAGE - Observability Platform OVHcloud
// NAV1: iam | NAV2: metrics | Tabs: general, tokens, tasks
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { ovhGet } from "../../../services/api";
import type { MetricsService } from "./metrics.types";
import GeneralTab from "./tabs/general/GeneralTab";
import TokensTab from "./tabs/tokens/TokensTab";
import TasksTab from "./tabs/tasks/TasksTab";
import "./MetricsPage.css";

type MetricsTab = "general" | "tokens" | "tasks";

async function getService(serviceName: string): Promise<MetricsService> {
  return ovhGet<MetricsService>(`/metrics/${serviceName}`);
}

export default function MetricsPage() {
  const { t } = useTranslation("iam/metrics/general");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";
  const [activeTab, setActiveTab] = useState<MetricsTab>("general");
  const [info, setInfo] = useState<MetricsService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs: { id: MetricsTab; label: string }[] = [
    { id: "general", label: t("tabs.general") },
    { id: "tokens", label: t("tabs.tokens") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  useEffect(() => {
    if (!serviceId) { setLoading(false); return; }
    loadInfo();
  }, [serviceId]);

  const loadInfo = async () => {
    try {
      setLoading(true); setError(null);
      const data = await getService(serviceId);
      setInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string): string => {
    const classes: Record<string, string> = { alive: "metrics-badge-success", pending: "metrics-badge-warning", dead: "metrics-badge-error" };
    return classes[status] || "";
  };

  if (!serviceId) {
    return (<div className="metrics-page-container"><div className="metrics-empty-state"><h2>{t("noService.title")}</h2><p>{t("noService.description")}</p></div></div>);
  }
  if (loading) {
    return (<div className="metrics-page-container"><div className="metrics-loading-state">{t("loading")}</div></div>);
  }
  if (error) {
    return (<div className="metrics-page-container"><div className="metrics-error-state"><h2>{t("error.title")}</h2><p>{error}</p><button className="btn btn-primary" onClick={loadInfo}>{t("error.retry")}</button></div></div>);
  }

  return (
    <div className="metrics-page-container">
      <header className="metrics-page-header">
        <div>
          <h1>{info?.displayName || info?.serviceName || serviceId}</h1>
          {info && (<div className="metrics-service-meta"><span className="metrics-meta-item">Type: {info.type}</span><span className="metrics-meta-item">Région: {info.region}</span><span className={`metrics-status-badge ${getStatusBadgeClass(info.status)}`}>{t(`status.${info.status}`)}</span></div>)}
        </div>
      </header>
      <div className="metrics-tabs-container">
        <div className="metrics-tabs-header">
          {tabs.map((tab) => (<button key={tab.id} className={`metrics-tab-button ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>))}
        </div>
        <div className="metrics-tabs-content">
          {activeTab === "general" && <GeneralTab serviceId={serviceId} info={info} onRefresh={loadInfo} />}
          {activeTab === "tokens" && <TokensTab serviceId={serviceId} />}
          {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
        </div>
      </div>
    </div>
  );
}
