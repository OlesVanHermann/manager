// ============================================================
// BLOCK STORAGE - Public Cloud Block Storage OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import { getVolume, formatSize } from "./tabs/GeneralTab.service";
import type { Volume } from "./block-storage.types";
import GeneralTab from "./tabs/GeneralTab";
import SnapshotsTab from "./tabs/SnapshotsTab";

export default function BlockStoragePage() {
  const { t } = useTranslation("public-cloud/block-storage/index");
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const volumeId = searchParams.get("id") || "";

  const [volume, setVolume] = useState<Volume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "snapshots", label: t("tabs.snapshots") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!projectId || !volumeId) {
      setLoading(false);
      return;
    }
    loadVolume();
  }, [projectId, volumeId]);

  const loadVolume = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVolume(projectId, volumeId);
      setVolume(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      available: "badge-success",
      "in-use": "badge-info",
      error: "badge-error",
    };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (!projectId || !volumeId) {
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
          <button className="btn btn-primary" onClick={loadVolume}>{t("error.retry")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content public-cloud-page">
      <header className="page-header">
        <h1>💾 {volume?.name}</h1>
        {volume && (
          <div className="service-meta">
            <span className="meta-item">{volume.region}</span>
            <span className="meta-item">{formatSize(volume.size)}</span>
            <span className="meta-item">{volume.type}</span>
            {getStatusBadge(volume.status)}
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab projectId={projectId} volumeId={volumeId} volume={volume} onRefresh={loadVolume} />}
        {activeTab === "snapshots" && <SnapshotsTab projectId={projectId} volumeId={volumeId} />}
      </div>
    </div>
  );
}
