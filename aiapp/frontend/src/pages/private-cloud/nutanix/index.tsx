// ============================================================
// NUTANIX PAGE - Index avec imports isolés par tab
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";

// Types partagés (SEUL import partagé autorisé)
import type { NutanixCluster } from "./nutanix.types";

// Service isolé pour le chargement initial
import { generalService } from "./tabs/general/GeneralTab.service";

// Imports des composants TSX isolés
import GeneralTab from "./tabs/general/GeneralTab";
import NodesTab from "./tabs/nodes/NodesTab";
import IpsTab from "./tabs/ips/IpsTab";
import TasksTab from "./tabs/tasks/TasksTab";

/* ============================================================
   STYLES INLINE - Page container (anciennement nutanix.css)
   ============================================================ */
const pageStyles = `
.nutanix-page {
  padding: var(--space-4);
}

.nutanix-page-header {
  margin-bottom: var(--space-4);
}

.nutanix-page-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2) 0;
}

.nutanix-service-meta {
  display: flex;
  gap: var(--space-4);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  align-items: center;
  flex-wrap: wrap;
}

.nutanix-empty-state {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-text-secondary);
}

.nutanix-empty-state h2 {
  margin-bottom: var(--space-2);
  color: var(--color-text-primary);
}

.nutanix-loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-8);
  color: var(--color-text-secondary);
}

.nutanix-error-state {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-error-500);
}

.nutanix-error-state button {
  margin-top: var(--space-4);
}
`;

export default function NutanixPage() {
  const { t } = useTranslation("private-cloud/nutanix/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [cluster, setCluster] = useState<NutanixCluster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "nodes", label: t("tabs.nodes") },
    { id: "ips", label: t("tabs.ips") },
    { id: "tasks", label: t("tabs.tasks") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }
    loadCluster();
  }, [serviceId]);

  const loadCluster = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await generalService.getCluster(serviceId);
      setCluster(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      DEPLOYED: "badge-success",
      DEPLOYING: "badge-warning",
      ERROR: "badge-error",
    };
    return (
      <span className={`status-badge ${classes[status] || ""}`}>{status}</span>
    );
  };

  if (!serviceId) {
    return (
      <div className="page-content">
        <style>{pageStyles}</style>
        <div className="nutanix-empty-state">
          <h2>{t("noService.title")}</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-content">
        <style>{pageStyles}</style>
        <div className="nutanix-loading-state">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <style>{pageStyles}</style>
        <div className="nutanix-error-state">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadCluster}>
            {t("error.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content nutanix-page">
      <style>{pageStyles}</style>
      <header className="nutanix-page-header">
        <h1>🔷 {cluster?.targetSpec?.name || cluster?.serviceName}</h1>
        {cluster && (
          <div className="nutanix-service-meta">
            {getStatusBadge(cluster.status)}
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && (
          <GeneralTab
            serviceId={serviceId}
            cluster={cluster}
            onRefresh={loadCluster}
          />
        )}
        {activeTab === "nodes" && <NodesTab serviceId={serviceId} />}
        {activeTab === "ips" && <IpsTab serviceId={serviceId} />}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
