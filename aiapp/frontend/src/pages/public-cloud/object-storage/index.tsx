// ============================================================
// OBJECT STORAGE - S3-compatible Storage OVHcloud Public Cloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import { getContainer, formatSize } from "./tabs/GeneralTab.service";
import type { Container } from "./object-storage.types";
import GeneralTab from "./tabs/GeneralTab";
import ObjectsTab from "./tabs/ObjectsTab";
import UsersTab from "./tabs/UsersTab";

export default function ObjectStoragePage() {
  const { t } = useTranslation("public-cloud/object-storage/index");
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const containerId = searchParams.get("id") || "";
  const region = searchParams.get("region") || "";

  const [container, setContainer] = useState<Container | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "objects", label: t("tabs.objects") },
    { id: "users", label: t("tabs.users") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!projectId || !containerId || !region) {
      setLoading(false);
      return;
    }
    loadContainer();
  }, [projectId, containerId, region]);

  const loadContainer = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getContainer(projectId, region, containerId);
      setContainer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (!projectId || !containerId) {
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
          <button className="btn btn-primary" onClick={loadContainer}>{t("error.retry")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content public-cloud-page">
      <header className="page-header">
        <h1>🪣 {container?.name}</h1>
        {container && (
          <div className="service-meta">
            <span className="meta-item">{container.region}</span>
            <span className="meta-item">{formatSize(container.storedBytes)}</span>
            <span className="meta-item">{container.storedObjects} {t("objects")}</span>
            <span className={`status-badge ${container.containerType === "public" ? "badge-warning" : "badge-success"}`}>
              {container.containerType}
            </span>
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
