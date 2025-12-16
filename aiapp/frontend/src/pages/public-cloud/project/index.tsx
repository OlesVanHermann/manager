// ============================================================
// PUBLIC CLOUD PROJECT - Page principale
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { cloudService, CloudProject, CloudProjectServiceInfos } from "../../../services/cloud.service";
import { InstancesTab, VolumesTab, SnapshotsTab, StorageTab, NetworksTab, SshKeysTab, QuotaTab } from "./tabs";
import "./styles.css";

interface Tab { id: string; labelKey: string; }
interface ProjectWithDetails { projectId: string; details?: CloudProject; serviceInfos?: CloudProjectServiceInfos; loading: boolean; }

export default function PublicCloudProjectPage() {
  const { t } = useTranslation("public-cloud/project/index");
  const { t: tCommon } = useTranslation("common");
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("instances");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs: Tab[] = [
    { id: "instances", labelKey: "tabs.instances" },
    { id: "volumes", labelKey: "tabs.volumes" },
    { id: "snapshots", labelKey: "tabs.snapshots" },
    { id: "storage", labelKey: "tabs.storage" },
    { id: "networks", labelKey: "tabs.networks" },
    { id: "sshkeys", labelKey: "tabs.sshkeys" },
    { id: "quota", labelKey: "tabs.quota" },
  ];

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await cloudService.listProjects();
      const list: ProjectWithDetails[] = ids.map(projectId => ({ projectId, loading: true }));
      setProjects(list);
      if (ids.length > 0 && !selected) setSelected(ids[0]);
      for (const projectId of ids) {
        try {
          const [details, serviceInfos] = await Promise.all([cloudService.getProject(projectId), cloudService.getServiceInfos(projectId)]);
          setProjects(prev => prev.map(p => p.projectId === projectId ? { ...p, details, serviceInfos, loading: false } : p));
        } catch { setProjects(prev => prev.map(p => p.projectId === projectId ? { ...p, loading: false } : p)); }
      }
    } finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { loadProjects(); }, []);

  const filtered = projects.filter(p => 
    p.projectId.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.details?.projectName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const current = projects.find(p => p.projectId === selected);

  const renderTab = () => {
    if (!selected) return null;
    switch (activeTab) {
      case "instances": return <InstancesTab projectId={selected} />;
      case "volumes": return <VolumesTab projectId={selected} />;
      case "snapshots": return <SnapshotsTab projectId={selected} />;
      case "storage": return <StorageTab projectId={selected} />;
      case "networks": return <NetworksTab projectId={selected} />;
      case "sshkeys": return <SshKeysTab projectId={selected} />;
      case "quota": return <QuotaTab projectId={selected} />;
      default: return null;
    }
  };

  return (
    <div className="cloud-project-page">
      <aside className="project-sidebar">
        <div className="sidebar-header"><h2>{t("title")}</h2><span className="count-badge">{projects.length}</span></div>
        <div className="sidebar-search"><input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <div className="project-list">
          {loading && projects.length === 0 ? (<div className="loading-state"><div className="skeleton-item" /></div>) : filtered.length === 0 ? (<div className="empty-state">{tCommon("empty.title")}</div>) : (
            filtered.map((p) => (
              <button key={p.projectId} className={`project-item ${selected === p.projectId ? "active" : ""}`} onClick={() => setSelected(p.projectId)}>
                <div className={`project-status-dot ${p.details?.status === 'ok' ? 'running' : 'warning'}`} />
                <div className="project-info">
                  <span className="project-name">{p.details?.projectName || p.projectId.slice(0, 8)}</span>
                  <span className="project-id">{p.projectId.slice(0, 8)}...</span>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>
      <main className="project-main">
        {selected && current ? (
          <>
            <header className="page-header">
              <div>
                <h1>{current.details?.projectName || selected}</h1>
                <p className="page-description">{current.details?.description || t("noDescription")} | <span className={`state-text ${current.details?.status === 'ok' ? 'running' : 'warning'}`}>{current.details?.status}</span></p>
              </div>
              <button className="btn-refresh" onClick={loadProjects}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>{tCommon("actions.refresh")}</button>
            </header>
            <div className="tabs-container"><div className="tabs-list">{tabs.map((tab) => (<button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
            <div className="tab-content">{renderTab()}</div>
          </>
        ) : (<div className="no-selection"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" /></svg><p>{t("selectProject")}</p></div>)}
      </main>
    </div>
  );
}
