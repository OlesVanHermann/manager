// ============================================================
// METRICS - Observability Platform OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as metricsService from "./metrics.service";
import type { MetricsService } from "./metrics.types";
import GeneralTab from "./tabs/GeneralTab.tsx";
import TokensTab from "./tabs/TokensTab.tsx";
import TasksTab from "./tabs/TasksTab.tsx";

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

/** Page de gestion d'un service Metrics. Tokens d'accès et configuration. */
export default function MetricsPage() {
  const { t } = useTranslation("iam/metrics/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  // ---------- STATE ----------
  const [info, setInfo] = useState<MetricsService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- TABS ----------
  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "tokens", label: t("tabs.tokens") },
    { id: "tasks", label: t("tabs.tasks") },
  ];
  const { activeTab, setActiveTab, TabButtons } = useTabs(tabs, "general");

  // ---------- EFFECTS ----------
  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }
    loadInfo();
  }, [serviceId]);

  // ---------- LOADERS ----------
  const loadInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await metricsService.getService(serviceId);
      setInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      alive: "badge-success",
      pending: "badge-warning",
      dead: "badge-error",
    };
    return <span className={`status-badge ${classes[status] || ""}`}>{t(`status.${status}`)}</span>;
  };

  // ---------- RENDER ----------
  if (!serviceId) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <h2>{t("noService.title")}</h2>
          <p>{t("noService.description")}</p>
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
          <h2>{t("error.title")}</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadInfo}>{t("error.retry")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content metrics-page">
      <header className="page-header">
        <h1>{info?.displayName || info?.serviceName || serviceId}</h1>
        {info && (
          <div className="service-meta">
            <span className="meta-item">Type: {info.type}</span>
            <span className="meta-item">Région: {info.region}</span>
            <span className="meta-item">{getStatusBadge(info.status)}</span>
          </div>
        )}
      </header>

      <TabButtons />

      <div className="tab-content">
        {activeTab === "general" && <GeneralTab serviceId={serviceId} info={info} onRefresh={loadInfo} />}
        {activeTab === "tokens" && <TokensTab serviceId={serviceId} />}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
