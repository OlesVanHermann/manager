// ============================================================
// REGISTRY - Container Registry OVHcloud (Harbor)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as registryService from "../../../services/public-cloud.registry";
import GeneralTab from "./tabs/GeneralTab";
import ImagesTab from "./tabs/ImagesTab";
import UsersTab from "./tabs/UsersTab";
import "./styles.css";

interface RegistryInfo { id: string; name: string; region: string; status: string; url: string; size: number; createdAt: string; }

export default function RegistryPage() {
  const { t } = useTranslation("public-cloud/registry/index");
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const registryId = searchParams.get("id") || "";

  const [registry, setRegistry] = useState<RegistryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "images", label: t("tabs.images") },
    { id: "users", label: t("tabs.users") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!projectId || !registryId) { setLoading(false); return; }
    loadRegistry();
  }, [projectId, registryId]);

  const loadRegistry = async () => {
    try { setLoading(true); setError(null); const data = await registryService.getRegistry(projectId, registryId); setRegistry(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { READY: "badge-success", INSTALLING: "badge-warning", ERROR: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  const formatSize = (bytes: number) => bytes >= 1e9 ? `${(bytes / 1e9).toFixed(2)} GB` : bytes >= 1e6 ? `${(bytes / 1e6).toFixed(2)} MB` : `${bytes} B`;

  if (!projectId || !registryId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadRegistry}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content public-cloud-page">
      <header className="page-header">
        <h1>📦 {registry?.name}</h1>
        {registry && (
          <div className="service-meta">
            <span className="meta-item">{registry.region}</span>
            <span className="meta-item">{formatSize(registry.size)}</span>
            {getStatusBadge(registry.status)}
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab projectId={projectId} registryId={registryId} registry={registry} onRefresh={loadRegistry} />}
        {activeTab === "images" && <ImagesTab projectId={projectId} registryId={registryId} />}
        {activeTab === "users" && <UsersTab projectId={projectId} registryId={registryId} />}
      </div>
    </div>
  );
}
