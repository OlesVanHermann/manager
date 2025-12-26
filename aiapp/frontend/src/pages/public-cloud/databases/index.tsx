// ============================================================
// DATABASES - Public Cloud Databases OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import { getDatabase } from "./tabs/GeneralTab.service";
import type { Database } from "./databases.types";
import GeneralTab from "./tabs/GeneralTab";
import UsersTab from "./tabs/UsersTab";
import BackupsTab from "./tabs/BackupsTab";
import MetricsTab from "./tabs/MetricsTab";

export default function DatabasesPage() {
  const { t } = useTranslation("public-cloud/databases/index");
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const engine = searchParams.get("engine") || "";
  const dbId = searchParams.get("id") || "";

  const [db, setDb] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "users", label: t("tabs.users") },
    { id: "backups", label: t("tabs.backups") },
    { id: "metrics", label: t("tabs.metrics") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!projectId || !engine || !dbId) {
      setLoading(false);
      return;
    }
    loadDatabase();
  }, [projectId, engine, dbId]);

  const loadDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDatabase(projectId, engine, dbId);
      setDb(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      READY: "badge-success",
      PENDING: "badge-warning",
      ERROR: "badge-error",
    };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (!projectId || !engine || !dbId) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <h2>{t("noService.title")}</h2>
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
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadDatabase}>{t("error.retry")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content public-cloud-page">
      <header className="page-header">
        <h1>🗄️ {db?.description || db?.id}</h1>
        {db && (
          <div className="service-meta">
            <span className="meta-item">{db.engine} {db.version}</span>
            <span className="meta-item">{db.plan}</span>
            <span className="meta-item">{db.nodes?.length || 0} nodes</span>
            {getStatusBadge(db.status)}
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab projectId={projectId} engine={engine} dbId={dbId} db={db} onRefresh={loadDatabase} />}
        {activeTab === "users" && <UsersTab projectId={projectId} engine={engine} dbId={dbId} />}
        {activeTab === "backups" && <BackupsTab projectId={projectId} engine={engine} dbId={dbId} />}
        {activeTab === "metrics" && <MetricsTab projectId={projectId} engine={engine} dbId={dbId} />}
      </div>
    </div>
  );
}
