// ============================================================
// DNS ZONES - Page principale
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { dnsZonesService, DnsZone, DnsZoneServiceInfos } from "../../../services/dns-zones.service";
import { RecordsTab, HistoryTab, TasksTab } from "./tabs";
import "../styles.css";
import "./styles.css";

interface Tab { id: string; labelKey: string; }
interface ZoneWithDetails { name: string; details?: DnsZone; serviceInfos?: DnsZoneServiceInfos; loading: boolean; error?: string; }

export default function DnsZonesPage() {
  const { t } = useTranslation("web-cloud/dns-zones/index");
  const { t: tCommon } = useTranslation("common");
  const [zones, setZones] = useState<ZoneWithDetails[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("records");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs: Tab[] = [
    { id: "records", labelKey: "tabs.records" },
    { id: "history", labelKey: "tabs.history" },
    { id: "tasks", labelKey: "tabs.tasks" },
  ];

  const loadZones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const names = await dnsZonesService.listZones();
      const list: ZoneWithDetails[] = names.map(name => ({ name, loading: true }));
      setZones(list);
      if (names.length > 0 && !selected) setSelected(names[0]);
      for (let i = 0; i < names.length; i += 5) {
        const batch = names.slice(i, i + 5);
        await Promise.all(batch.map(async (name) => {
          try {
            const details = await dnsZonesService.getZone(name);
            setZones(prev => prev.map(z => z.name === name ? { ...z, details, loading: false } : z));
          } catch (err) {
            setZones(prev => prev.map(z => z.name === name ? { ...z, loading: false, error: String(err) } : z));
          }
        }));
      }
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { loadZones(); }, []);

  const filtered = zones.filter(z => z.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const current = zones.find(z => z.name === selected);

  const renderTab = () => {
    if (!selected) return null;
    switch (activeTab) {
      case "records": return <RecordsTab zoneName={selected} />;
      case "history": return <HistoryTab zoneName={selected} />;
      case "tasks": return <TasksTab zoneName={selected} />;
      default: return null;
    }
  };

  return (
    <div className="dns-zones-page">
      <aside className="zones-sidebar">
        <div className="sidebar-header"><h2>{t("title")}</h2><span className="zone-count">{zones.length}</span></div>
        <div className="sidebar-search"><input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <div className="zones-list">
          {loading && zones.length === 0 ? (
            <div className="loading-state"><div className="skeleton-item" /><div className="skeleton-item" /></div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">{tCommon("empty.title")}</div>
          ) : (
            filtered.map((z) => (
              <button key={z.name} className={`zone-item ${selected === z.name ? "active" : ""}`} onClick={() => setSelected(z.name)}>
                <div className="zone-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7" /></svg></div>
                <div className="zone-info">
                  <span className="zone-name">{z.name}</span>
                  {z.details && <span className="zone-ns">{z.details.nameServers?.length || 0} NS</span>}
                </div>
                {z.details?.hasDnsAnycast && <span className="anycast-badge">Anycast</span>}
              </button>
            ))
          )}
        </div>
      </aside>
      <main className="zones-main">
        {selected && current ? (
          <>
            <header className="page-header">
              <div>
                <h1>{selected}</h1>
                {current.details && <p className="page-description">{current.details.nameServers?.join(', ') || 'N/A'}</p>}
              </div>
              <button className="btn-refresh" onClick={loadZones}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>{tCommon("actions.refresh")}</button>
            </header>
            <div className="tabs-container"><div className="tabs-list">{tabs.map((tab) => (<button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
            <div className="tab-content">{renderTab()}</div>
          </>
        ) : (
          <div className="no-selection"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5" /></svg><p>{t("selectZone")}</p></div>
        )}
      </main>
    </div>
  );
}
