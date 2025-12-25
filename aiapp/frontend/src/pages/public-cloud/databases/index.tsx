// ============================================================
// DATABASES - Managed Databases OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as dbService from "../../../services/public-cloud.databases";
import GeneralTab from "./tabs/GeneralTab";
import UsersTab from "./tabs/UsersTab";
import BackupsTab from "./tabs/BackupsTab";
import MetricsTab from "./tabs/MetricsTab";
import "./styles.css";

interface DatabaseInfo { id: string; description: string; engine: string; version: string; plan: string; status: string; region: string; nodeNumber: number; flavor: string; }

export default function DatabasesPage() {
  const { t } = useTranslation("public-cloud/databases/index");
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const engine = searchParams.get("engine") || "";
  const serviceId = searchParams.get("id") || "";

  const [database, setDatabase] = useState<DatabaseInfo | null>(null);
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
    if (!projectId || !engine || !serviceId) { setLoading(false); return; }
    loadDatabase();
  }, [projectId, engine, serviceId]);

  const loadDatabase = async () => {
    try { setLoading(true); setError(null); const data = await dbService.getDatabase(projectId, engine, serviceId); setDatabase(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { READY: "badge-success", PENDING: "badge-warning", ERROR: "badge-error", UPDATING: "badge-info" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  const getEngineIcon = (eng: string) => {
    const icons: Record<string, string> = { mongodb: "🍃", mysql: "🐬", postgresql: "🐘", redis: "🔴", kafka: "📨", opensearch: "🔍" };
    return icons[eng] || "🗄️";
  };

  if (!projectId || !engine || !serviceId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadDatabase}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content public-cloud-page">
      <header className="page-header">
        <h1>{getEngineIcon(database?.engine || "")} {database?.description || serviceId}</h1>
        {database && (
          <div className="service-meta">
            <span className="meta-item">{database.engine} {database.version}</span>
            <span className="meta-item">{database.plan}</span>
            <span className="meta-item">{database.nodeNumber} node(s)</span>
            {getStatusBadge(database.status)}
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab projectId={projectId} engine={engine} serviceId={serviceId} database={database} onRefresh={loadDatabase} />}
        {activeTab === "users" && <UsersTab projectId={projectId} engine={engine} serviceId={serviceId} />}
        {activeTab === "backups" && <BackupsTab projectId={projectId} engine={engine} serviceId={serviceId} />}
        {activeTab === "metrics" && <MetricsTab projectId={projectId} engine={engine} serviceId={serviceId} />}
      </div>
    </div>
  );
}
