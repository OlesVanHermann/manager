// ============================================================
// DBAAS-LOGS PAGE - Logs Data Platform (LDP)
// 5 tabs: Streams | Dashboards | Indices | Inputs | Aliases
// Service inliné - CSS isolé - IMPORTS DIRECTS (pas de barrel)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import StreamsTab from "./tabs/streams/StreamsTab";
import DashboardsTab from "./tabs/dashboards/DashboardsTab";
import IndicesTab from "./tabs/indices/IndicesTab";
import InputsTab from "./tabs/inputs/InputsTab";
import AliasesTab from "./tabs/aliases/AliasesTab";
import "./DbaasLogsPage.css";

// ============ TYPES ============

type DbaasLogsTab = "streams" | "dashboards" | "indices" | "inputs" | "aliases";

// ============ COMPOSANT ============

export default function DbaasLogsPage() {
  const { t } = useTranslation("iam/dbaas-logs");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [activeTab, setActiveTab] = useState<DbaasLogsTab>("streams");

  // ---------- TABS CONFIG ----------
  const tabs: { id: DbaasLogsTab; label: string }[] = [
    { id: "streams", label: t("tabs.streams") },
    { id: "dashboards", label: t("tabs.dashboards") },
    { id: "indices", label: t("tabs.indices") },
    { id: "inputs", label: t("tabs.inputs") },
    { id: "aliases", label: t("tabs.aliases") },
  ];

  // ---------- RENDER ----------
  if (!serviceId) {
    return (
      <div className="dbaaslogspage-container">
        <div className="dbaaslogspage-empty-state">
          <h3>{t("noService.title")}</h3>
          <p>{t("noService.description")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dbaaslogspage-container">
      <div className="dbaaslogspage-header">
        <h1>{t("title")}</h1>
        <div className="dbaaslogspage-service-info">
          <span>Service: {serviceId}</span>
        </div>
      </div>

      <div className="dbaaslogspage-tabs-container">
        <div className="dbaaslogspage-tabs-header">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`dbaaslogspage-tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="dbaaslogspage-tabs-content">
          {activeTab === "streams" && <StreamsTab serviceId={serviceId} />}
          {activeTab === "dashboards" && <DashboardsTab serviceId={serviceId} />}
          {activeTab === "indices" && <IndicesTab serviceId={serviceId} />}
          {activeTab === "inputs" && <InputsTab serviceId={serviceId} />}
          {activeTab === "aliases" && <AliasesTab serviceId={serviceId} />}
        </div>
      </div>
    </div>
  );
}
