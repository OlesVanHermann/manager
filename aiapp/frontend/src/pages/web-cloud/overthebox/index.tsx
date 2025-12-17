// ============================================================
// OVERTHEBOX - Agrégation de liens Internet
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as otbService from "../../../services/web-cloud.overthebox";
import GeneralTab from "./tabs/GeneralTab";
import RemotesTab from "./tabs/RemotesTab";
import TasksTab from "./tabs/TasksTab";
import "../styles.css";

interface OtbInfo {
  serviceName: string;
  customerDescription?: string;
  status: string;
  releaseChannel: string;
  systemVersion?: string;
  tunnelMode: string;
}

export default function OverTheBoxPage() {
  const { t } = useTranslation("web-cloud/overthebox/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [otb, setOtb] = useState<OtbInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "remotes", label: t("tabs.remotes") },
    { id: "tasks", label: t("tabs.tasks") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!serviceId) { setLoading(false); return; }
    loadOtb();
  }, [serviceId]);

  const loadOtb = async () => {
    try { setLoading(true); setError(null); const data = await otbService.getOverTheBox(serviceId); setOtb(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { active: "badge-success", inactive: "badge-error", creating: "badge-warning" };
    return <span className={`status-badge ${classes[status] || ""}`}>{t(`status.${status}`)}</span>;
  };

  if (!serviceId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadOtb}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content web-cloud-page">
      <header className="page-header">
        <h1>📡 {otb?.customerDescription || otb?.serviceName}</h1>
        {otb && (
          <div className="service-meta">
            <span className="meta-item">Canal: {otb.releaseChannel}</span>
            {otb.systemVersion && <span className="meta-item">Version: {otb.systemVersion}</span>}
            {getStatusBadge(otb.status)}
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab serviceId={serviceId} otb={otb} onRefresh={loadOtb} />}
        {activeTab === "remotes" && <RemotesTab serviceId={serviceId} />}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
