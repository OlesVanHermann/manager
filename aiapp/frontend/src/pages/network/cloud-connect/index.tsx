// ============================================================
// CLOUD CONNECT - OVHcloud Connect (liaison dédiée)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import { ovhGet } from "../../../services/api";
import type { CloudConnectInfo } from "./cloud-connect.types";

// Imports isolés par tab (sous-dossiers)
import GeneralTab from "./tabs/general/GeneralTab.tsx";
import InterfacesTab from "./tabs/interfaces/InterfacesTab.tsx";
import TasksTab from "./tabs/tasks/TasksTab.tsx";

// CSS local pour la page
import "./CloudConnectPage.css";

export default function CloudConnectPage() {
  const { t } = useTranslation("network/cloud-connect/page");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [service, setService] = useState<CloudConnectInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "interfaces", label: t("tabs.interfaces") },
    { id: "tasks", label: t("tabs.tasks") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ovhGet<CloudConnectInfo>(`/ovhCloudConnect/${serviceId}`);
      setService(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const formatBandwidth = (mbps: number): string => {
    return mbps >= 1000 ? `${mbps / 1000} Gbps` : `${mbps} Mbps`;
  };

  const getStatusBadgeClass = (status: string): string => {
    const classes: Record<string, string> = {
      active: "cloudconnect-badge-success",
      init: "cloudconnect-badge-warning",
      disabled: "cloudconnect-badge-error",
    };
    return classes[status] || "";
  };

  if (!serviceId) {
    return (
      <div className="cloudconnect-page">
        <div className="cloudconnect-empty">
          <h2>{t("noService.title")}</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cloudconnect-page">
        <div className="cloudconnect-loading">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cloudconnect-page">
        <div className="cloudconnect-error">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadService}>
            {t("error.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cloudconnect-page">
      <header className="cloudconnect-header">
        <h1>🔗 {service?.description || t("title")}</h1>
        {service && (
          <div className="cloudconnect-meta">
            <span className="cloudconnect-meta-item">POP: {service.pop}</span>
            <span className="cloudconnect-meta-item">
              Bandwidth: {formatBandwidth(service.bandwidth)}
            </span>
            <span
              className={`cloudconnect-status-badge ${getStatusBadgeClass(service.status)}`}
            >
              {t(`status.${service.status}`)}
            </span>
          </div>
        )}
      </header>

      <TabButtons />

      <div className="cloudconnect-tab-content">
        {activeTab === "general" && (
          <GeneralTab
            serviceId={serviceId}
            service={service}
            onRefresh={loadService}
          />
        )}
        {activeTab === "interfaces" && <InterfacesTab serviceId={serviceId} />}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
