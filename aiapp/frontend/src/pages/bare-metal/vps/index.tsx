// ============================================================
// VPS - Page principale
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { vpsService, Vps, VpsServiceInfos } from "../../../services/bare-metal.vps";
import { GeneralTab, IpsTab, DisksTab, SnapshotTab, TasksTab } from "./tabs";
import "./styles.css";

interface Tab { id: string; labelKey: string; }
interface VpsWithDetails { name: string; details?: Vps; serviceInfos?: VpsServiceInfos; loading: boolean; }

export default function VpsPage() {
  const { t } = useTranslation("bare-metal/vps/index");
  const { t: tCommon } = useTranslation("common");
  const [vpsList, setVpsList] = useState<VpsWithDetails[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [acting, setActing] = useState(false);

  const tabs: Tab[] = [
    { id: "general", labelKey: "tabs.general" },
    { id: "ips", labelKey: "tabs.ips" },
    { id: "disks", labelKey: "tabs.disks" },
    { id: "snapshot", labelKey: "tabs.snapshot" },
    { id: "tasks", labelKey: "tabs.tasks" },
  ];

  const loadVps = useCallback(async () => {
    try {
      setLoading(true);
      const names = await vpsService.listVps();
      const list: VpsWithDetails[] = names.map(name => ({ name, loading: true }));
      setVpsList(list);
      if (names.length > 0 && !selected) setSelected(names[0]);
      for (let i = 0; i < names.length; i += 5) {
        const batch = names.slice(i, i + 5);
        await Promise.all(batch.map(async (name) => {
          try {
            const [details, serviceInfos] = await Promise.all([vpsService.getVps(name), vpsService.getServiceInfos(name)]);
            setVpsList(prev => prev.map(v => v.name === name ? { ...v, details, serviceInfos, loading: false } : v));
          } catch { setVpsList(prev => prev.map(v => v.name === name ? { ...v, loading: false } : v)); }
        }));
      }
    } finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { loadVps(); }, []);

  const filtered = vpsList.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const current = vpsList.find(v => v.name === selected);

  const handleAction = async (action: 'reboot' | 'start' | 'stop' | 'rescue') => {
    if (!selected || !current) return;
    const messages: Record<string, string> = { reboot: t("actions.confirmReboot"), start: t("actions.confirmStart"), stop: t("actions.confirmStop"), rescue: t("actions.confirmRescue") };
    if (!confirm(messages[action])) return;
    try {
      setActing(true);
      if (action === 'reboot') await vpsService.reboot(selected);
      else if (action === 'start') await vpsService.start(selected);
      else if (action === 'stop') await vpsService.stop(selected);
      else if (action === 'rescue') await vpsService.setRescueMode(selected, current.details?.netbootMode !== 'rescue');
      setTimeout(loadVps, 2000);
    } finally { setActing(false); }
  };

  const renderTab = () => {
    if (!selected || !current) return null;
    switch (activeTab) {
      case "general": return <GeneralTab serviceName={selected} details={current.details} serviceInfos={current.serviceInfos} loading={current.loading} />;
      case "ips": return <IpsTab serviceName={selected} />;
      case "disks": return <DisksTab serviceName={selected} />;
      case "snapshot": return <SnapshotTab serviceName={selected} />;
      case "tasks": return <TasksTab serviceName={selected} />;
      default: return null;
    }
  };

  const getStateClass = (state?: string) => {
    const map: Record<string, string> = { running: 'running', stopped: 'stopped', rebooting: 'warning', rescued: 'rescue' };
    return map[state || ''] || '';
  };

  return (
    <div className="vps-page">
      <aside className="vps-sidebar">
        <div className="sidebar-header"><h2>{t("title")}</h2><span className="count-badge">{vpsList.length}</span></div>
        <div className="sidebar-search"><input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <div className="vps-list">
          {loading && vpsList.length === 0 ? (<div className="loading-state"><div className="skeleton-item" /></div>) : filtered.length === 0 ? (<div className="empty-state">{tCommon("empty.title")}</div>) : (
            filtered.map((v) => (
              <button key={v.name} className={`vps-item ${selected === v.name ? "active" : ""}`} onClick={() => setSelected(v.name)}>
                <div className={`vps-status-dot ${getStateClass(v.details?.state)}`} />
                <div className="vps-info">
                  <span className="vps-name">{v.details?.displayName || v.name}</span>
                  {v.details && <span className="vps-meta">{v.details.model?.name} | {v.details.zone}</span>}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>
      <main className="vps-main">
        {selected && current ? (
          <>
            <header className="page-header">
              <div>
                <h1>{current.details?.displayName || selected}</h1>
                {current.details && <p className="page-description">{current.details.model?.name} | {current.details.zone} | <span className={`state-text ${getStateClass(current.details.state)}`}>{current.details.state}</span></p>}
              </div>
              <div className="header-actions">
                <button className="btn-action" onClick={() => handleAction('reboot')} disabled={acting || current.details?.state === 'stopped'}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>{t("actions.reboot")}</button>
                {current.details?.state === 'stopped' ? (
                  <button className="btn-action success" onClick={() => handleAction('start')} disabled={acting}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>{t("actions.start")}</button>
                ) : (
                  <button className="btn-action danger" onClick={() => handleAction('stop')} disabled={acting}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" /></svg>{t("actions.stop")}</button>
                )}
                <button className={`btn-action ${current.details?.netbootMode === 'rescue' ? 'warning' : ''}`} onClick={() => handleAction('rescue')} disabled={acting}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796a3.765 3.765 0 00-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 01-1.388.88m2.268-2.268l4.138 3.448m0 0a9.027 9.027 0 01-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0l-3.448-4.138m3.448 4.138a9.014 9.014 0 01-9.424 0m5.976-4.138a3.765 3.765 0 01-2.528 0m0 0a3.736 3.736 0 01-1.388-.88 3.737 3.737 0 01-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 01-1.652-1.306 9.027 9.027 0 01-1.306-1.652m0 0l4.138-3.448M4.33 16.712a9.014 9.014 0 010-9.424m4.138 5.976a3.765 3.765 0 010-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 011.388-.88M7.288 4.33l3.448 4.138m0 0a3.765 3.765 0 012.528 0m-2.528 0L7.288 4.33" /></svg>{current.details?.netbootMode === 'rescue' ? t("actions.exitRescue") : t("actions.rescue")}</button>
                <button className="btn-refresh" onClick={loadVps}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg></button>
              </div>
            </header>
            <div className="tabs-container"><div className="tabs-list">{tabs.map((tab) => (<button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
            <div className="tab-content">{renderTab()}</div>
          </>
        ) : (<div className="no-selection"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7" /></svg><p>{t("selectVps")}</p></div>)}
      </main>
    </div>
  );
}
