// ============================================================
// CDN - Content Delivery Network OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import { ovhGet } from "../../../services/api";
import type { CdnInfo } from "./cdn.types";

// Imports isolés par tab (sous-dossiers)
import GeneralTab from "./tabs/general/GeneralTab.tsx";
import DomainsTab from "./tabs/domains/DomainsTab.tsx";
import StatisticsTab from "./tabs/statistics/StatisticsTab.tsx";
import TasksTab from "./tabs/tasks/TasksTab.tsx";

// CSS local pour la page (pas les tabs)
import "./CdnPage.css";

export default function CdnPage() {
  const { t } = useTranslation("network/cdn/page");
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
    if (!serviceId) {
      setLoading(false);
      return;
    }
    loadCdn();
  }, [serviceId]);

  const loadCdn = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ovhGet<CdnInfo>(`/cdn/dedicated/${serviceId}`);
      setCdn(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string): string => {
    const classes: Record<string, string> = {
      ok: "cdn-badge-success",
      suspended: "cdn-badge-error",
      installing: "cdn-badge-warning",
    };
    return classes[status] || "";
  };

  if (!serviceId) {
    return (
      <div className="cdn-page">
        <div className="cdn-empty">
          <h2>{t("noService.title")}</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cdn-page">
        <div className="cdn-loading">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cdn-page">
        <div className="cdn-error">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadCdn}>
            {t("error.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cdn-page">
      <header className="cdn-header">
        <h1>🚀 CDN - {cdn?.serviceName}</h1>
        {cdn && (
          <div className="cdn-meta">
            <span className="cdn-meta-item">Offre: {cdn.offer}</span>
            <span className="cdn-meta-item">Anycast: {cdn.anycast}</span>
            <span className={`cdn-status-badge ${getStatusBadgeClass(cdn.status)}`}>
              {t(`status.${cdn.status}`)}
            </span>
          </div>
        )}
      </header>

      <TabButtons />

      <div className="cdn-tab-content">
        {activeTab === "general" && (
          <GeneralTab serviceId={serviceId} cdn={cdn} onRefresh={loadCdn} />
        )}
        {activeTab === "domains" && <DomainsTab serviceId={serviceId} />}
        {activeTab === "statistics" && <StatisticsTab serviceId={serviceId} />}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
