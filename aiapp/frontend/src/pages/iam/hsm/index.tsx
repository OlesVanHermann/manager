// ============================================================
// HSM PAGE - Hardware Security Module OVHcloud
// NAV1: iam | NAV2: hsm | Tabs: general, partitions, tasks
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { ovhGet } from "../../../services/api";
import type { Hsm } from "./hsm.types";
import GeneralTab from "./tabs/general/GeneralTab";
import PartitionsTab from "./tabs/partitions/PartitionsTab";
import TasksTab from "./tabs/tasks/TasksTab";
import "./HsmPage.css";

type HsmTab = "general" | "partitions" | "tasks";

async function getHsm(serviceName: string): Promise<Hsm> {
  return ovhGet<Hsm>(`/dedicated/nasha/${serviceName}`);
}

export default function HsmPage() {
  const { t } = useTranslation("iam/hsm/general");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";
  const [activeTab, setActiveTab] = useState<HsmTab>("general");
  const [info, setInfo] = useState<Hsm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs: { id: HsmTab; label: string }[] = [
    { id: "general", label: t("tabs.general") },
    { id: "partitions", label: t("tabs.partitions") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

  useEffect(() => {
    if (!serviceId) { setLoading(false); return; }
    loadInfo();
  }, [serviceId]);

  const loadInfo = async () => {
    try {
      setLoading(true); setError(null);
      const data = await getHsm(serviceId);
      setInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const getStateBadgeClass = (state: string): string => {
    const classes: Record<string, string> = { ok: "hsm-badge-success", degraded: "hsm-badge-warning", error: "hsm-badge-error", pending: "hsm-badge-info" };
    return classes[state] || "";
  };

  if (!serviceId) {
    return (<div className="hsm-page-container"><div className="hsm-empty-state"><h2>{t("noService.title")}</h2><p>{t("noService.description")}</p></div></div>);
  }
  if (loading) {
    return (<div className="hsm-page-container"><div className="hsm-loading-state">{t("loading")}</div></div>);
  }
  if (error) {
    return (<div className="hsm-page-container"><div className="hsm-error-state"><h2>{t("error.title")}</h2><p>{error}</p><button className="btn btn-primary" onClick={loadInfo}>{t("error.retry")}</button></div></div>);
  }

  return (
    <div className="hsm-page-container">
      <header className="hsm-page-header">
        <div>
          <h1>{info?.name || serviceId}</h1>
          {info && (<div className="hsm-service-meta"><span className="hsm-meta-item">Modèle: {info.model}</span><span className="hsm-meta-item">Région: {info.region}</span><span className="hsm-meta-item">IP: {info.ip}</span><span className={`hsm-status-badge ${getStateBadgeClass(info.state)}`}>{t(`states.${info.state}`)}</span></div>)}
        </div>
      </header>
      <div className="hsm-tabs-container">
        <div className="hsm-tabs-header">
          {tabs.map((tab) => (<button key={tab.id} className={`hsm-tab-button ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>))}
        </div>
        <div className="hsm-tabs-content">
          {activeTab === "general" && <GeneralTab serviceId={serviceId} info={info} onRefresh={loadInfo} />}
          {activeTab === "partitions" && <PartitionsTab serviceId={serviceId} />}
          {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
        </div>
      </div>
    </div>
  );
}
