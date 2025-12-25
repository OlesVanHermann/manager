// ============================================================
// NASHA - Page principale (défactorisée)
// Imports DIRECTS - pas de barrel file
// Service page ISOLÉ - pas d'import depuis les tabs
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import { nashaPageService } from "./nasha.service";
import GeneralTab from "./tabs/general/GeneralTab.tsx";
import PartitionsTab from "./tabs/partitions/PartitionsTab.tsx";
import SnapshotsTab from "./tabs/snapshots/SnapshotsTab.tsx";
import AccessesTab from "./tabs/accesses/AccessesTab.tsx";
import TasksTab from "./tabs/tasks/TasksTab.tsx";
import type { NashaInfo } from "./nasha.types";
import "./styles.css";

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
    if (serviceId) {
      loadNasha();
    } else {
      setLoading(false);
    }
  }, [serviceId]);

  const loadNasha = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await nashaPageService.getNasha(serviceId);
      setNasha(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  // Helper LOCAL - dupliqué volontairement (défactorisation)
  const getStatusClass = (status: string): string => {
    const classes: Record<string, string> = {
      ok: "badge-success",
      degraded: "badge-warning",
      error: "badge-error",
    };
    return classes[status] || "";
  };

  if (!serviceId) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <h2>{t("noService.title")}</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-state">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="error-state">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadNasha}>
            {t("error.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content nasha-page">
      <header className="page-header">
        <h1>💾 {nasha?.customName || nasha?.serviceName}</h1>
        {nasha && (
          <div className="service-meta">
            <span className="meta-item">Datacenter: {nasha.datacenter}</span>
            <span className="meta-item">IP: {nasha.ip}</span>
            <span className={`status-badge ${getStatusClass(nasha.status)}`}>
              {t(`status.${nasha.status}`)}
            </span>
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && (
          <GeneralTab serviceId={serviceId} nasha={nasha} onRefresh={loadNasha} />
        )}
        {activeTab === "partitions" && <PartitionsTab serviceId={serviceId} />}
        {activeTab === "snapshots" && <SnapshotsTab serviceId={serviceId} />}
        {activeTab === "accesses" && <AccessesTab serviceId={serviceId} />}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
