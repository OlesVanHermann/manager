// ============================================================
// NASHA - NAS-HA OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as nashaService from "../../../services/bare-metal.nasha";
import GeneralTab from "./tabs/GeneralTab";
import PartitionsTab from "./tabs/PartitionsTab";
import SnapshotsTab from "./tabs/SnapshotsTab";
import AccessesTab from "./tabs/AccessesTab";
import TasksTab from "./tabs/TasksTab";
import "./styles.css";

interface NashaInfo {
  serviceName: string;
  customName?: string;
  datacenter: string;
  ip: string;
  zpoolSize: number;
  zpoolCapacity: number;
  monitored: boolean;
  status: string;
}

export default function NashaPage() {
  const { t } = useTranslation("bare-metal/nasha/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [nasha, setNasha] = useState<NashaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "partitions", label: t("tabs.partitions") },
    { id: "snapshots", label: t("tabs.snapshots") },
    { id: "accesses", label: t("tabs.accesses") },
    { id: "tasks", label: t("tabs.tasks") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!serviceId) { setLoading(false); return; }
    loadNasha();
  }, [serviceId]);

  const loadNasha = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await nashaService.getNasha(serviceId);
      setNasha(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { ok: "badge-success", degraded: "badge-warning", error: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{t(`status.${status}`)}</span>;
  };

  if (!serviceId) {
    return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2><p>{t("noService.description")}</p></div></div>;
  }

  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadNasha}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content nasha-page">
      <header className="page-header">
        <h1>💾 {nasha?.customName || nasha?.serviceName}</h1>
        {nasha && (
          <div className="service-meta">
            <span className="meta-item">Datacenter: {nasha.datacenter}</span>
            <span className="meta-item">IP: {nasha.ip}</span>
            {getStatusBadge(nasha.status)}
          </div>
        )}
      </header>

      <TabButtons />

      <div className="tab-content">
        {activeTab === "general" && <GeneralTab serviceId={serviceId} nasha={nasha} onRefresh={loadNasha} />}
        {activeTab === "partitions" && <PartitionsTab serviceId={serviceId} />}
        {activeTab === "snapshots" && <SnapshotsTab serviceId={serviceId} />}
        {activeTab === "accesses" && <AccessesTab serviceId={serviceId} />}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
