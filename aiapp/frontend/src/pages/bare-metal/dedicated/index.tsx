// ============================================================
// DEDICATED SERVER - Page principale
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { dedicatedService, DedicatedServer, DedicatedServerServiceInfos, DedicatedServerHardware } from "../../../services/bare-metal.dedicated";
import { GeneralTab, NetworkTab, IpmiTab, InterventionsTab, TasksTab } from "./tabs";
import "./styles.css";

interface Tab { id: string; labelKey: string; }
interface ServerWithDetails { name: string; details?: DedicatedServer; serviceInfos?: DedicatedServerServiceInfos; hardware?: DedicatedServerHardware; loading: boolean; }

export default function DedicatedPage() {
  const { t } = useTranslation("bare-metal/dedicated/index");
  const { t: tCommon } = useTranslation("common");
  const [servers, setServers] = useState<ServerWithDetails[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [acting, setActing] = useState(false);

  const tabs: Tab[] = [
    { id: "general", labelKey: "tabs.general" },
    { id: "network", labelKey: "tabs.network" },
    { id: "ipmi", labelKey: "tabs.ipmi" },
    { id: "interventions", labelKey: "tabs.interventions" },
    { id: "tasks", labelKey: "tabs.tasks" },
  ];

  const loadServers = useCallback(async () => {
    try {
      setLoading(true);
      const names = await dedicatedService.listServers();
      const list: ServerWithDetails[] = names.map(name => ({ name, loading: true }));
      setServers(list);
      if (names.length > 0 && !selected) setSelected(names[0]);
      for (let i = 0; i < names.length; i += 3) {
        const batch = names.slice(i, i + 3);
        await Promise.all(batch.map(async (name) => {
          try {
            const [details, serviceInfos, hardware] = await Promise.all([dedicatedService.getServer(name), dedicatedService.getServiceInfos(name), dedicatedService.getHardware(name).catch(() => undefined)]);
            setServers(prev => prev.map(s => s.name === name ? { ...s, details, serviceInfos, hardware, loading: false } : s));
          } catch { setServers(prev => prev.map(s => s.name === name ? { ...s, loading: false } : s)); }
        }));
      }
    } finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { loadServers(); }, []);

  const filtered = servers.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const current = servers.find(s => s.name === selected);

  const handleReboot = async () => {
    if (!selected || !confirm(t("actions.confirmReboot"))) return;
    try { setActing(true); await dedicatedService.reboot(selected); setTimeout(loadServers, 2000); }
    finally { setActing(false); }
  };

  const renderTab = () => {
    if (!selected || !current) return null;
    switch (activeTab) {
      case "general": return <GeneralTab serviceName={selected} details={current.details} serviceInfos={current.serviceInfos} hardware={current.hardware} loading={current.loading} />;
      case "network": return <NetworkTab serviceName={selected} />;
      case "ipmi": return <IpmiTab serviceName={selected} />;
      case "interventions": return <InterventionsTab serviceName={selected} />;
      case "tasks": return <TasksTab serviceName={selected} />;
      default: return null;
    }
  };

  const getPowerClass = (state?: string) => state === 'poweron' ? 'running' : 'stopped';

  return (
    <div className="dedicated-page">
      <aside className="dedicated-sidebar">
        <div className="sidebar-header"><h2>{t("title")}</h2><span className="count-badge">{servers.length}</span></div>
        <div className="sidebar-search"><input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <div className="server-list">
          {loading && servers.length === 0 ? (<div className="loading-state"><div className="skeleton-item" /></div>) : filtered.length === 0 ? (<div className="empty-state">{tCommon("empty.title")}</div>) : (
            filtered.map((s) => (
              <button key={s.name} className={`server-item ${selected === s.name ? "active" : ""}`} onClick={() => setSelected(s.name)}>
                <div className={`server-status-dot ${getPowerClass(s.details?.powerState)}`} />
                <div className="server-info">
                  <span className="server-name">{s.name}</span>
                  {s.details && <span className="server-meta">{s.details.commercialRange} | {s.details.datacenter}</span>}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>
      <main className="dedicated-main">
        {selected && current ? (
          <>
            <header className="page-header">
              <div>
                <h1>{selected}</h1>
                {current.details && <p className="page-description">{current.details.commercialRange} | {current.details.datacenter} | <span className={`state-text ${getPowerClass(current.details.powerState)}`}>{current.details.powerState}</span></p>}
              </div>
              <div className="header-actions">
                <button className="btn-action" onClick={handleReboot} disabled={acting}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>{t("actions.reboot")}</button>
                <button className="btn-refresh" onClick={loadServers}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg></button>
              </div>
            </header>
            <div className="tabs-container"><div className="tabs-list">{tabs.map((tab) => (<button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
            <div className="tab-content">{renderTab()}</div>
          </>
        ) : (<div className="no-selection"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3" /></svg><p>{t("selectServer")}</p></div>)}
      </main>
    </div>
  );
}
