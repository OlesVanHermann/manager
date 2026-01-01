// ============================================================
// OVERTHEBOX PAGE - Container avec 5 tabs NAV3
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ovhApi } from "../../../../services/api";
import type { OverTheBoxService } from "./overthebox.types";
import { GeneralTab } from "./GeneralTab";
import { RemotesTab } from "./RemotesTab";
import { ConfigureTab } from "./ConfigureTab";
import { LogsTab } from "./LogsTab";
import { TasksTab } from "./TasksTab";
import "./overthebox.css";

interface OverTheBoxPageProps {
  serviceName: string;
}

type TabId = "general" | "remotes" | "configure" | "logs" | "tasks";

async function getService(serviceName: string): Promise<OverTheBoxService> {
  return ovhApi.get<OverTheBoxService>(`/overTheBox/${serviceName}`);
}

export default function OverTheBoxPage({ serviceName }: OverTheBoxPageProps) {
  const { t } = useTranslation("web-cloud/access/overthebox/index");

  const [service, setService] = useState<OverTheBoxService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("general");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getService(serviceName);
        setService(data);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  const tabs: { id: TabId; labelKey: string }[] = [
    { id: "general", labelKey: "tabs.general" },
    { id: "remotes", labelKey: "tabs.remotes" },
    { id: "configure", labelKey: "tabs.configure" },
    { id: "logs", labelKey: "tabs.logs" },
    { id: "tasks", labelKey: "tabs.tasks" },
  ];

  if (loading) {
    return (
      <div className="overthebox-page">
        <div className="overthebox-loading">
          <div className="spinner" />
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="overthebox-page">
        <div className="overthebox-error">
          <p>{t("error")}: {error}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active": return "#10B981";
      case "suspended": return "#EF4444";
      case "pending": return "#F59E0B";
      default: return "#9CA3AF";
    }
  };

  return (
    <div className="overthebox-page">
      {/* Header */}
      <div className="overthebox-header">
        <div className="overthebox-header-left">
          <h1 className="overthebox-title">{serviceName}</h1>
          <div className="overthebox-subtitle">
            <span className="otb-badge">OverTheBox</span>
            <span className="separator">·</span>
            <span
              className="status-indicator"
              style={{ color: getStatusColor(service.status) }}
            >
              ● {service.status}
            </span>
          </div>
        </div>
        <div className="overthebox-header-actions">
          <button className="btn-secondary" onClick={() => console.log("[OverTheBoxPage] Action clicked: reboot", serviceName)}>{t("actions.reboot")}</button>
          <button className="btn-secondary" onClick={() => console.log("[OverTheBoxPage] Action clicked: logs", serviceName)}>{t("actions.logs")}</button>
        </div>
      </div>

      {/* NAV3 Tabs */}
      <div className="overthebox-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`overthebox-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab.id);
            }}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="overthebox-content">
        {activeTab === "general" && (
          <GeneralTab serviceName={serviceName} details={service} />
        )}
        {activeTab === "remotes" && (
          <RemotesTab serviceName={serviceName} />
        )}
        {activeTab === "configure" && (
          <ConfigureTab serviceName={serviceName} />
        )}
        {activeTab === "logs" && (
          <LogsTab serviceName={serviceName} />
        )}
        {activeTab === "tasks" && (
          <TasksTab serviceName={serviceName} />
        )}
      </div>
    </div>
  );
}
