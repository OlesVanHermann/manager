// ############################################################
// #  HOUSING/PAGE - COMPOSANT PAGE STRICTEMENT ISOLÉ         #
// #  CSS LOCAL : ./index.css                                 #
// #  I18N LOCAL : bare-metal/housing/page                    #
// #  SERVICE LOCAL : Intégré dans ce fichier                 #
// #  CLASSES CSS : .housing-page-*                           #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import { ovhApi } from "../../../services/api";
import GeneralTab from "./tabs/general/GeneralTab.tsx";
import TasksTab from "./tabs/tasks/TasksTab.tsx";
import type { HousingInfo } from "./housing.types";
import "./HousingPage.css";

// ============================================================
// SERVICE LOCAL - Intégré dans la page (pas de fichier séparé)
// ============================================================
const pageService = {
  getHousing: (id: string): Promise<HousingInfo> =>
    ovhApi.get<HousingInfo>(`/dedicated/housing/${id}`),
};

// ============================================================
// Composant Principal
// ============================================================
export default function HousingPage() {
  const { t } = useTranslation("bare-metal/housing/page");
  const { t: tCommon } = useTranslation("common");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";
  const [housing, setHousing] = useState<HousingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "tasks", label: t("tabs.tasks") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (serviceId) {
      loadHousing();
    } else {
      setLoading(false);
    }
  }, [serviceId]);

  const loadHousing = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pageService.getHousing(serviceId);
      setHousing(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (!serviceId) {
    return (
      <div className="housing-page-container">
        <div className="housing-page-empty">
          <h2>{t("noService.title")}</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="housing-page-container">
        <div className="housing-page-loading">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="housing-page-container">
        <div className="housing-page-error">
          <p>{error}</p>
          <button className="housing-page-btn-primary" onClick={loadHousing}>
            {t("error.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="housing-page-container">
      <header className="housing-page-header">
        <h1>🏢 {housing?.name}</h1>
        {housing && (
          <div className="housing-page-meta">
            <span className="housing-page-meta-item">{housing.datacenter}</span>
            <span className="housing-page-meta-item">Rack: {housing.rack}</span>
            <span className="housing-page-meta-item">{housing.networkBandwidth} Mbps</span>
          </div>
        )}
      </header>
      <div className="housing-page-tabs">
        <TabButtons />
      </div>
      <div className="housing-page-tab-content">
        {activeTab === "general" && (
          <GeneralTab serviceId={serviceId} housing={housing} onRefresh={loadHousing} />
        )}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
