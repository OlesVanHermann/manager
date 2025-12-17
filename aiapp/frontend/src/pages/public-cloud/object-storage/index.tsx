// ============================================================
// OBJECT STORAGE - S3-compatible Storage OVHcloud Public Cloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as objectStorageService from "../../../services/public-cloud.object-storage";
import GeneralTab from "./tabs/GeneralTab";
import ObjectsTab from "./tabs/ObjectsTab";
import UsersTab from "./tabs/UsersTab";
import "../styles.css";

interface ContainerInfo {
  name: string;
  region: string;
  storedBytes: number;
  storedObjects: number;
  staticUrl?: string;
  containerType: string;
}

export default function ObjectStoragePage() {
  const { t } = useTranslation("public-cloud/object-storage/index");
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const containerId = searchParams.get("id") || "";
  const region = searchParams.get("region") || "";

  const [container, setContainer] = useState<ContainerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "objects", label: t("tabs.objects") },
    { id: "users", label: t("tabs.users") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!projectId || !containerId || !region) { setLoading(false); return; }
    loadContainer();
  }, [projectId, containerId, region]);

  const loadContainer = async () => {
    try { setLoading(true); setError(null); const data = await objectStorageService.getContainer(projectId, region, containerId); setContainer(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(2)} TB`;
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
    if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(2)} KB`;
    return `${bytes} B`;
  };

  if (!projectId || !containerId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadContainer}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content public-cloud-page">
      <header className="page-header">
        <h1>🪣 {container?.name}</h1>
        {container && (
          <div className="service-meta">
            <span className="meta-item">{container.region}</span>
            <span className="meta-item">{formatSize(container.storedBytes)}</span>
            <span className="meta-item">{container.storedObjects} {t("objects")}</span>
            <span className={`status-badge ${container.containerType === "public" ? "badge-warning" : "badge-success"}`}>{container.containerType}</span>
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab projectId={projectId} region={region} containerId={containerId} container={container} onRefresh={loadContainer} />}
        {activeTab === "objects" && <ObjectsTab projectId={projectId} region={region} containerId={containerId} />}
        {activeTab === "users" && <UsersTab projectId={projectId} />}
      </div>
    </div>
  );
}
