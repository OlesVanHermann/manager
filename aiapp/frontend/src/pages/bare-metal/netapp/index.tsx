// ############################################################
// #  NETAPP/PAGE - COMPOSANT PAGE STRICTEMENT ISOLÉ          #
// #  CSS LOCAL : ./NetappPage.css                            #
// #  I18N LOCAL : bare-metal/netapp/page                     #
// #  SERVICE LOCAL : Intégré dans ce fichier                 #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import { ovhApi } from "../../../services/api";
import GeneralTab from "./tabs/general/GeneralTab.tsx";
import VolumesTab from "./tabs/volumes/VolumesTab.tsx";
import SnapshotsTab from "./tabs/snapshots/SnapshotsTab.tsx";
import TasksTab from "./tabs/tasks/TasksTab.tsx";
import type { NetAppInfo } from "./netapp.types";
import "./index.css";

// ============================================================
// SERVICE LOCAL - Intégré dans la page (pas de fichier séparé)
// ============================================================
const pageService = {
  getNetApp: (id: string): Promise<NetAppInfo> =>
    ovhApi.get<NetAppInfo>(`/storage/netapp/${id}`),
};

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// ============================================================
const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    running: "netapp-page-badge-success",
    creating: "netapp-page-badge-warning",
    error: "netapp-page-badge-error",
  };
  return classes[status] || "";
};

// ============================================================
// Composant Principal
// ============================================================
export default function NetAppPage() {
  const { t } = useTranslation("bare-metal/netapp/page");
  const { t: tCommon } = useTranslation("common");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";
  const [netapp, setNetapp] = useState<NetAppInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "volumes", label: t("tabs.volumes") },
    { id: "snapshots", label: t("tabs.snapshots") },
    { id: "tasks", label: t("tabs.tasks") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (serviceId) {
      loadNetApp();
    } else {
      setLoading(false);
    }
  }, [serviceId]);

  const loadNetApp = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pageService.getNetApp(serviceId);
      setNetapp(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (!serviceId) {
    return (
      <div className="netapp-page-container">
        <div className="netapp-page-empty">
          <h2>{t("noService.title")}</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="netapp-page-container">
        <div className="netapp-page-loading">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="netapp-page-container">
        <div className="netapp-page-error">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadNetApp}>
            {t("error.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="netapp-page-container">
      <header className="netapp-page-header">
        <h1>🗃️ {netapp?.name || netapp?.id}</h1>
        {netapp && (
          <div className="netapp-page-meta">
            <span className="netapp-page-meta-item">Région: {netapp.region}</span>
            <span className="netapp-page-meta-item">Performance: {netapp.performanceLevel}</span>
            <span className={`netapp-page-status-badge ${getStatusClass(netapp.status)}`}>
              {t(`status.${netapp.status}`)}
            </span>
          </div>
        )}
      </header>
      <div className="netapp-page-tabs">
        <TabButtons />
      </div>
      <div className="netapp-page-tab-content">
        {activeTab === "general" && (
          <GeneralTab serviceId={serviceId} netapp={netapp} onRefresh={loadNetApp} />
        )}
        {activeTab === "volumes" && <VolumesTab serviceId={serviceId} />}
        {activeTab === "snapshots" && <SnapshotsTab serviceId={serviceId} />}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
