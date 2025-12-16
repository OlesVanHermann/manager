// ============================================================
// ZIMBRA - Page principale
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { zimbraService, ZimbraService as ZimbraServiceType } from "../../../services/web-cloud.zimbra";
import { AccountsTab, DomainsTab, AliasesTab, TasksTab } from "./tabs";
import "../styles.css";

interface Tab { id: string; labelKey: string; }
interface ServiceWithDetails { id: string; details?: ZimbraServiceType; loading: boolean; }

export default function ZimbraPage() {
  const { t } = useTranslation("web-cloud/zimbra/index");
  const { t: tCommon } = useTranslation("common");
  const [services, setServices] = useState<ServiceWithDetails[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("accounts");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs: Tab[] = [
    { id: "accounts", labelKey: "tabs.accounts" },
    { id: "domains", labelKey: "tabs.domains" },
    { id: "aliases", labelKey: "tabs.aliases" },
    { id: "tasks", labelKey: "tabs.tasks" },
  ];

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await zimbraService.listServices();
      const list: ServiceWithDetails[] = ids.map(id => ({ id, loading: true }));
      setServices(list);
      if (ids.length > 0 && !selected) setSelected(ids[0]);
      for (const id of ids) {
        try {
          const details = await zimbraService.getService(id);
          setServices(prev => prev.map(s => s.id === id ? { ...s, details, loading: false } : s));
        } catch { setServices(prev => prev.map(s => s.id === id ? { ...s, loading: false } : s)); }
      }
    } finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { loadServices(); }, []);

  const filtered = services.filter(s => s.id.toLowerCase().includes(searchQuery.toLowerCase()));
  const current = services.find(s => s.id === selected);

  const renderTab = () => {
    if (!selected) return null;
    switch (activeTab) {
      case "accounts": return <AccountsTab serviceId={selected} />;
      case "domains": return <DomainsTab serviceId={selected} />;
      case "aliases": return <AliasesTab serviceId={selected} />;
      case "tasks": return <TasksTab serviceId={selected} />;
      default: return null;
    }
  };

  return (
    <div className="email-page">
      <aside className="email-sidebar">
        <div className="sidebar-header"><h2>{t("title")}</h2><span className="count-badge">{services.length}</span></div>
        <div className="sidebar-search"><input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <div className="email-list">
          {loading && services.length === 0 ? (<div className="loading-state"><div className="skeleton-item" /></div>) : filtered.length === 0 ? (<div className="empty-state">{tCommon("empty.title")}</div>) : (
            filtered.map((s) => (
              <button key={s.id} className={`email-item ${selected === s.id ? "active" : ""}`} onClick={() => setSelected(s.id)}>
                <div className="email-icon zimbra"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg></div>
                <div className="email-info"><span className="email-name">{s.id}</span>{s.details && <span className="email-meta">{s.details.offer} | {s.details.numberOfAccounts} comptes</span>}</div>
              </button>
            ))
          )}
        </div>
      </aside>
      <main className="email-main">
        {selected && current ? (
          <>
            <header className="page-header">
              <div><h1>{selected}</h1>{current.details && <p className="page-description">Zimbra {current.details.offer} | {current.details.numberOfAccounts} comptes | {current.details.status}</p>}</div>
              <button className="btn-refresh" onClick={loadServices}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>{tCommon("actions.refresh")}</button>
            </header>
            <div className="tabs-container"><div className="tabs-list">{tabs.map((tab) => (<button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
            <div className="tab-content">{renderTab()}</div>
          </>
        ) : (<div className="no-selection"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75" /></svg><p>{t("selectService")}</p></div>)}
      </main>
    </div>
  );
}
