import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ovhGet } from "../../../services/api";
import type { IpLoadBalancing, IpLoadBalancingServiceInfos, LbWithDetails } from "./load-balancer.types";
import FarmsTab from "./tabs/farms/FarmsTab.tsx";
import FrontendsTab from "./tabs/frontends/FrontendsTab.tsx";
import "./LoadBalancerPage.css";

interface Tab { id: string; labelKey: string; }

export default function LoadBalancerPage() {
  const { t } = useTranslation("network/load-balancer/index");
  const { t: tCommon } = useTranslation("common");
  const [lbs, setLbs] = useState<LbWithDetails[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("farms");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs: Tab[] = [{ id: "farms", labelKey: "tabs.farms" }, { id: "frontends", labelKey: "tabs.frontends" }];

  const loadLbs = useCallback(async () => {
    try {
      setLoading(true);
      const names = await ovhGet<string[]>("/ipLoadbalancing");
      const list: LbWithDetails[] = names.map(serviceName => ({ serviceName, loading: true }));
      setLbs(list);
      if (names.length > 0 && !selected) setSelected(names[0]);
      for (const name of names) {
        try {
          const [details, serviceInfos] = await Promise.all([ovhGet<IpLoadBalancing>(`/ipLoadbalancing/${name}`), ovhGet<IpLoadBalancingServiceInfos>(`/ipLoadbalancing/${name}/serviceInfos`)]);
          setLbs(prev => prev.map(lb => lb.serviceName === name ? { ...lb, details, serviceInfos, loading: false } : lb));
        } catch { setLbs(prev => prev.map(lb => lb.serviceName === name ? { ...lb, loading: false } : lb)); }
      }
    } finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { loadLbs(); }, []);

  const filtered = lbs.filter(lb => lb.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) || lb.details?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()));
  const current = lbs.find(lb => lb.serviceName === selected);

  const renderTab = () => {
    if (!selected) return null;
    switch (activeTab) {
      case "farms": return <FarmsTab serviceName={selected} />;
      case "frontends": return <FrontendsTab serviceName={selected} />;
      default: return null;
    }
  };

  return (
    <div className="lb-page">
      <aside className="lb-sidebar">
        <div className="sidebar-header"><h2>{t("title")}</h2><span className="count-badge">{lbs.length}</span></div>
        <div className="sidebar-search"><input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <div className="lb-list">
          {loading && lbs.length === 0 ? (<div className="loading-state"><div className="skeleton-item" /></div>) : filtered.length === 0 ? (<div className="empty-state">{tCommon("empty.title")}</div>) : (
            filtered.map((lb) => (
              <button key={lb.serviceName} className={`lb-item ${selected === lb.serviceName ? "active" : ""}`} onClick={() => setSelected(lb.serviceName)}>
                <div className={`lb-status-dot ${lb.details?.state === "ok" ? "running" : "warning"}`} />
                <div className="lb-info">
                  <span className="lb-name">{lb.details?.displayName || lb.serviceName}</span>
                  {lb.details && <span className="lb-meta">{lb.details.zone?.join(", ")} | {lb.details.offer}</span>}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>
      <main className="lb-main">
        {selected && current ? (
          <>
            <header className="page-header">
              <div>
                <h1>{current.details?.displayName || selected}</h1>
                {current.details && <p className="page-description">IP: {current.details.ipLoadbalancing} | Zones: {current.details.zone?.join(", ")} | <span className={`state-text ${current.details.state === "ok" ? "running" : "warning"}`}>{current.details.state}</span></p>}
              </div>
              <button className="btn-refresh" onClick={loadLbs}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>{tCommon("actions.refresh")}</button>
            </header>
            <div className="tabs-container"><div className="tabs-list">{tabs.map((tab) => (<button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
            <div className="tab-content">{renderTab()}</div>
          </>
        ) : (<div className="no-selection"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg><p>{t("selectLb")}</p></div>)}
      </main>
    </div>
  );
}
