// ============================================================
// HSM PAGE - Hardware Security Module OVHcloud
// 3 tabs: General | Partitions | Tasks
// Service inliné - CSS isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { ovhGet } from "../../../services/api";
import type { Hsm } from "./hsm.types";
import GeneralTab from "./tabs/general/GeneralTab";
import PartitionsTab from "./tabs/partitions/PartitionsTab";
import TasksTab from "./tabs/tasks/TasksTab";
import "./HsmPage.css";

// ============ TYPES ============

type HsmTab = "general" | "partitions" | "tasks";

// ============ SERVICE (INLINÉ) ============

async function getHsm(serviceName: string): Promise<Hsm> {
  return ovhGet<Hsm>(`/dedicated/nasha/${serviceName}`);
}

// ============ COMPOSANT ============

export default function HsmPage() {
  const { t } = useTranslation("iam/hsm/general");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [activeTab, setActiveTab] = useState<HsmTab>("general");
  const [info, setInfo] = useState<Hsm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- TABS CONFIG ----------
  const tabs: { id: HsmTab; label: string }[] = [
    { id: "general", label: t("tabs.general") },
    { id: "partitions", label: t("tabs.partitions") },
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
      const data = await getHsm(serviceId);
      setInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getStateBadgeClass = (state: string): string => {
    const classes: Record<string, string> = {
      ok: "hsmpage-badge-success",
      degraded: "hsmpage-badge-warning",
      error: "hsmpage-badge-error",
      pending: "hsmpage-badge-info",
    };
    return classes[state] || "";
  };

  // ---------- RENDER ----------
  if (!serviceId) {
    return (
      <div className="hsmpage-container">
        <div className="hsmpage-empty-state">
          <h2>{t("noService.title")}</h2>
          <p>{t("noService.description")}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="hsmpage-container">
        <div className="hsmpage-loading-state">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hsmpage-container">
        <div className="hsmpage-error-state">
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
    <div className="hsmpage-container">
      <header className="hsmpage-header">
        <div>
          <h1>{info?.name || serviceId}</h1>
          {info && (
            <div className="hsmpage-service-meta">
              <span className="hsmpage-meta-item">Modèle: {info.model}</span>
              <span className="hsmpage-meta-item">Région: {info.region}</span>
              <span className="hsmpage-meta-item">IP: {info.ip}</span>
              <span className={`hsmpage-status-badge ${getStateBadgeClass(info.state)}`}>
                {t(`states.${info.state}`)}
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="hsmpage-tabs-container">
        <div className="hsmpage-tabs-header">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`hsmpage-tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="hsmpage-tabs-content">
          {activeTab === "general" && <GeneralTab serviceId={serviceId} info={info} onRefresh={loadInfo} />}
          {activeTab === "partitions" && <PartitionsTab serviceId={serviceId} />}
          {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
        </div>
      </div>
    </div>
  );
}
