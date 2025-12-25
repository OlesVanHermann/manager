// ============================================================
// METRICS PAGE - Observability Platform OVHcloud
// 3 tabs: General | Tokens | Tasks
// Service inliné - CSS isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { ovhGet } from "../../../services/api";
import type { MetricsService } from "./metrics.types";
import GeneralTab from "./tabs/general/GeneralTab";
import TokensTab from "./tabs/tokens/TokensTab";
import TasksTab from "./tabs/tasks/TasksTab";
import "./MetricsPage.css";

// ============ TYPES ============

type MetricsTab = "general" | "tokens" | "tasks";

// ============ SERVICE (INLINÉ) ============

async function getService(serviceName: string): Promise<MetricsService> {
  return ovhGet<MetricsService>(`/metrics/${serviceName}`);
}

// ============ COMPOSANT ============

export default function MetricsPage() {
  const { t } = useTranslation("iam/metrics/general");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [activeTab, setActiveTab] = useState<MetricsTab>("general");
  const [info, setInfo] = useState<MetricsService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- TABS CONFIG ----------
  const tabs: { id: MetricsTab; label: string }[] = [
    { id: "general", label: t("tabs.general") },
    { id: "tokens", label: t("tabs.tokens") },
    { id: "tasks", label: t("tabs.tasks") },
  ];

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
      const data = await getService(serviceId);
      setInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getStatusBadgeClass = (status: string): string => {
    const classes: Record<string, string> = {
      alive: "metricspage-badge-success",
      pending: "metricspage-badge-warning",
      dead: "metricspage-badge-error",
    };
    return classes[status] || "";
  };

  // ---------- RENDER ----------
  if (!serviceId) {
    return (
      <div className="metricspage-container">
        <div className="metricspage-empty-state">
          <h2>{t("noService.title")}</h2>
          <p>{t("noService.description")}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="metricspage-container">
        <div className="metricspage-loading-state">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="metricspage-container">
        <div className="metricspage-error-state">
          <h2>{t("error.title")}</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadInfo}>
            {t("error.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="metricspage-container">
      <header className="metricspage-header">
        <div>
          <h1>{info?.displayName || info?.serviceName || serviceId}</h1>
          {info && (
            <div className="metricspage-service-meta">
              <span className="metricspage-meta-item">Type: {info.type}</span>
              <span className="metricspage-meta-item">Région: {info.region}</span>
              <span className={`metricspage-status-badge ${getStatusBadgeClass(info.status)}`}>
                {t(`status.${info.status}`)}
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="metricspage-tabs-container">
        <div className="metricspage-tabs-header">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`metricspage-tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="metricspage-tabs-content">
          {activeTab === "general" && <GeneralTab serviceId={serviceId} info={info} onRefresh={loadInfo} />}
          {activeTab === "tokens" && <TokensTab serviceId={serviceId} />}
          {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
        </div>
      </div>
    </div>
  );
}
