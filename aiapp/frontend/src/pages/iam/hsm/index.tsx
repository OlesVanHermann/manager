// ============================================================
// HSM - Hardware Security Module OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as hsmService from "./hsm.service";
import type { Hsm } from "./hsm.types";
import GeneralTab from "./tabs/GeneralTab.tsx";
import PartitionsTab from "./tabs/PartitionsTab.tsx";
import TasksTab from "./tabs/TasksTab.tsx";

export default function HsmPage() {
  const { t } = useTranslation("iam/hsm/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [info, setInfo] = useState<Hsm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "partitions", label: t("tabs.partitions") },
    { id: "tasks", label: t("tabs.tasks") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!serviceId) { setLoading(false); return; }
    loadInfo();
  }, [serviceId]);

  const loadInfo = async () => {
    try {
      setLoading(true); setError(null);
      const data = await hsmService.getHsm(serviceId);
      setInfo(data);
    } catch (err) { setError(err instanceof Error ? err.message : "Erreur inconnue"); }
    finally { setLoading(false); }
  };

  const getStateBadge = (state: string) => {
    const classes: Record<string, string> = { ok: "badge-success", degraded: "badge-warning", error: "badge-error", pending: "badge-info" };
    return <span className={`status-badge ${classes[state] || ""}`}>{t(`states.${state}`)}</span>;
  };

  if (!serviceId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2><p>{t("noService.description")}</p></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><h2>{t("error.title")}</h2><p>{error}</p><button className="btn btn-primary" onClick={loadInfo}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content hsm-page">
      <header className="page-header">
        <h1>{info?.name || serviceId}</h1>
        {info && (
          <div className="service-meta">
            <span className="meta-item">Modèle: {info.model}</span>
            <span className="meta-item">Région: {info.region}</span>
            <span className="meta-item">IP: {info.ip}</span>
            <span className="meta-item">{getStateBadge(info.state)}</span>
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab serviceId={serviceId} info={info} onRefresh={loadInfo} />}
        {activeTab === "partitions" && <PartitionsTab serviceId={serviceId} />}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
