// ============================================================
// VRACK - Page principale
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { networkService, Vrack, VrackServiceInfos } from "../../../services/network.service";
import { ServicesTab, TasksTab } from "./tabs";
import "./styles.css";

interface Tab { id: string; labelKey: string; }
interface VrackWithDetails { name: string; details?: Vrack; serviceInfos?: VrackServiceInfos; loading: boolean; }

export default function VrackPage() {
  const { t } = useTranslation("network/vrack/index");
  const { t: tCommon } = useTranslation("common");
  const [vracks, setVracks] = useState<VrackWithDetails[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("services");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs: Tab[] = [
    { id: "services", labelKey: "tabs.services" },
    { id: "tasks", labelKey: "tabs.tasks" },
  ];

  const loadVracks = useCallback(async () => {
    try {
      setLoading(true);
      const names = await networkService.listVracks();
      const list: VrackWithDetails[] = names.map(name => ({ name, loading: true }));
      setVracks(list);
      if (names.length > 0 && !selected) setSelected(names[0]);
      for (const name of names) {
        try {
          const [details, serviceInfos] = await Promise.all([networkService.getVrack(name), networkService.getVrackServiceInfos(name)]);
          setVracks(prev => prev.map(v => v.name === name ? { ...v, details, serviceInfos, loading: false } : v));
        } catch { setVracks(prev => prev.map(v => v.name === name ? { ...v, loading: false } : v)); }
      }
    } finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { loadVracks(); }, []);

  const filtered = vracks.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.details?.description?.toLowerCase().includes(searchQuery.toLowerCase()));
  const current = vracks.find(v => v.name === selected);

  const renderTab = () => {
    if (!selected) return null;
    switch (activeTab) {
      case "services": return <ServicesTab serviceName={selected} />;
      case "tasks": return <TasksTab serviceName={selected} />;
      default: return null;
    }
  };

  return (
    <div className="vrack-page">
      <aside className="vrack-sidebar">
        <div className="sidebar-header"><h2>{t("title")}</h2><span className="count-badge">{vracks.length}</span></div>
        <div className="sidebar-search"><input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <div className="vrack-list">
          {loading && vracks.length === 0 ? (<div className="loading-state"><div className="skeleton-item" /></div>) : filtered.length === 0 ? (<div className="empty-state">{tCommon("empty.title")}</div>) : (
            filtered.map((v) => (
              <button key={v.name} className={`vrack-item ${selected === v.name ? "active" : ""}`} onClick={() => setSelected(v.name)}>
                <div className="vrack-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg></div>
                <div className="vrack-info"><span className="vrack-name">{v.name}</span>{v.details?.description && <span className="vrack-desc">{v.details.description}</span>}</div>
              </button>
            ))
          )}
        </div>
      </aside>
      <main className="vrack-main">
        {selected && current ? (
          <>
            <header className="page-header">
              <div><h1>{selected}</h1>{current.details?.description && <p className="page-description">{current.details.description}</p>}</div>
              <button className="btn-refresh" onClick={loadVracks}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>{tCommon("actions.refresh")}</button>
            </header>
            <div className="tabs-container"><div className="tabs-list">{tabs.map((tab) => (<button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
            <div className="tab-content">{renderTab()}</div>
          </>
        ) : (<div className="no-selection"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg><p>{t("selectVrack")}</p></div>)}
      </main>
    </div>
  );
}
