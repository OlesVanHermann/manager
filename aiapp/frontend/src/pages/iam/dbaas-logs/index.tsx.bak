// ============================================================
// DBAAS-LOGS - Logs Data Platform OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as logsService from "../../../services/iam.dbaas-logs";
import StreamsTab from "./tabs/StreamsTab";
import DashboardsTab from "./tabs/DashboardsTab";
import IndicesTab from "./tabs/IndicesTab";
import InputsTab from "./tabs/InputsTab";
import AliasesTab from "./tabs/AliasesTab";
import "./styles.css";

// ============================================================
// TYPES
// ============================================================

interface LogsServiceInfo {
  serviceName: string;
  displayName?: string;
  cluster: string;
  region: string;
  state: string;
  plan: string;
  createdAt: string;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

/** Page de gestion d'un service Logs Data Platform. Streams, dashboards, indices, inputs et aliases. */
export default function DbaasLogsPage() {
  const { t } = useTranslation("iam/dbaas-logs/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  // ---------- STATE ----------
  const [info, setInfo] = useState<LogsServiceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- TABS ----------
  const tabs = [
    { id: "streams", label: t("tabs.streams") },
    { id: "dashboards", label: t("tabs.dashboards") },
    { id: "indices", label: t("tabs.indices") },
    { id: "inputs", label: t("tabs.inputs") },
    { id: "aliases", label: t("tabs.aliases") },
  ];
  const { activeTab, setActiveTab, TabButtons } = useTabs(tabs, "streams");

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
      const data = await logsService.getService(serviceId);
      setInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getStateBadge = (state: string) => {
    const classes: Record<string, string> = {
      RUNNING: "badge-success",
      PENDING: "badge-warning",
      DISABLED: "badge-secondary",
      ERROR: "badge-error",
    };
    return <span className={`status-badge ${classes[state] || ""}`}>{t(`states.${state}`)}</span>;
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
    <div className="page-content dbaas-logs-page">
      <header className="page-header">
        <h1>{info?.displayName || info?.serviceName || serviceId}</h1>
        {info && (
          <div className="service-meta">
            <span className="meta-item">Cluster: {info.cluster}</span>
            <span className="meta-item">Région: {info.region}</span>
            <span className="meta-item">Plan: {info.plan}</span>
            <span className="meta-item">{getStateBadge(info.state)}</span>
          </div>
        )}
      </header>

      <TabButtons />

      <div className="tab-content">
        {activeTab === "streams" && <StreamsTab serviceId={serviceId} />}
        {activeTab === "dashboards" && <DashboardsTab serviceId={serviceId} />}
        {activeTab === "indices" && <IndicesTab serviceId={serviceId} />}
        {activeTab === "inputs" && <InputsTab serviceId={serviceId} />}
        {activeTab === "aliases" && <AliasesTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
