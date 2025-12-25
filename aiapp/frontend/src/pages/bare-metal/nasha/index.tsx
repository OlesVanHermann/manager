// ############################################################
// #  NASHA/PAGE - COMPOSANT PAGE STRICTEMENT ISOLÉ           #
// #  CSS LOCAL : ./NashaPage.css                             #
// #  I18N LOCAL : bare-metal/nasha/page                      #
// #  SERVICE LOCAL : Intégré dans ce fichier                 #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import { ovhApi } from "../../../services/api";
import GeneralTab from "./tabs/general/GeneralTab.tsx";
import PartitionsTab from "./tabs/partitions/PartitionsTab.tsx";
import SnapshotsTab from "./tabs/snapshots/SnapshotsTab.tsx";
import AccessesTab from "./tabs/accesses/AccessesTab.tsx";
import TasksTab from "./tabs/tasks/TasksTab.tsx";
import type { NashaInfo } from "./nasha.types";
import "./index.css";

// ============================================================
// SERVICE LOCAL - Intégré dans la page (pas de fichier séparé)
// ============================================================
const pageService = {
  getNasha: (serviceName: string): Promise<NashaInfo> =>
    ovhApi.get<NashaInfo>(`/dedicated/nasha/${serviceName}`),
};

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// ============================================================
const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    ok: "nasha-page-badge-success",
    degraded: "nasha-page-badge-warning",
    error: "nasha-page-badge-error",
  };
  return classes[status] || "";
};

// ============================================================
// Composant Principal
// ============================================================
export default function NashaPage() {
  const { t } = useTranslation("bare-metal/nasha/page");
  const { t: tCommon } = useTranslation("common");
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
      const data = await pageService.getNasha(serviceId);
      setNasha(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (!serviceId) {
    return (
      <div className="nasha-page-container">
        <div className="nasha-page-empty">
          <h2>{t("noService.title")}</h2>
          <p>{t("noService.description")}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="nasha-page-container">
        <div className="nasha-page-loading">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nasha-page-container">
        <div className="nasha-page-error">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadNasha}>
            {t("error.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nasha-page-container">
      <header className="nasha-page-header">
        <h1>💾 {nasha?.customName || nasha?.serviceName}</h1>
        {nasha && (
          <div className="nasha-page-meta">
            <span className="nasha-page-meta-item">Datacenter: {nasha.datacenter}</span>
            <span className="nasha-page-meta-item">IP: {nasha.ip}</span>
            <span className={`nasha-page-status-badge ${getStatusClass(nasha.status)}`}>
              {t(`status.${nasha.status}`)}
            </span>
          </div>
        )}
      </header>
      <div className="nasha-page-tabs">
        <TabButtons />
      </div>
      <div className="nasha-page-tab-content">
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
