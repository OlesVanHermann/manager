// ============================================================
// OFFICE 365 - Page principale
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { officeService, OfficeTenant } from "../../../services/office.service";
import { UsersTab, DomainsTab, TasksTab } from "./tabs";
import "../styles.css";

interface Tab { id: string; labelKey: string; }
interface TenantWithDetails { serviceName: string; details?: OfficeTenant; loading: boolean; }

export default function OfficePage() {
  const { t } = useTranslation("web-cloud/office/index");
  const { t: tCommon } = useTranslation("common");
  const [tenants, setTenants] = useState<TenantWithDetails[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs: Tab[] = [
    { id: "users", labelKey: "tabs.users" },
    { id: "domains", labelKey: "tabs.domains" },
    { id: "tasks", labelKey: "tabs.tasks" },
  ];

  const loadTenants = useCallback(async () => {
    try {
      setLoading(true);
      const names = await officeService.listTenants();
      const list: TenantWithDetails[] = names.map(serviceName => ({ serviceName, loading: true }));
      setTenants(list);
      if (names.length > 0 && !selected) setSelected(names[0]);
      for (const name of names) {
        try {
          const details = await officeService.getTenant(name);
          setTenants(prev => prev.map(t => t.serviceName === name ? { ...t, details, loading: false } : t));
        } catch { setTenants(prev => prev.map(t => t.serviceName === name ? { ...t, loading: false } : t)); }
      }
    } finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { loadTenants(); }, []);

  const filtered = tenants.filter(t => t.serviceName.toLowerCase().includes(searchQuery.toLowerCase()));
  const current = tenants.find(t => t.serviceName === selected);

  const renderTab = () => {
    if (!selected) return null;
    switch (activeTab) {
      case "users": return <UsersTab serviceName={selected} />;
      case "domains": return <DomainsTab serviceName={selected} />;
      case "tasks": return <TasksTab serviceName={selected} />;
      default: return null;
    }
  };

  return (
    <div className="email-page">
      <aside className="email-sidebar">
        <div className="sidebar-header"><h2>{t("title")}</h2><span className="count-badge">{tenants.length}</span></div>
        <div className="sidebar-search"><input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <div className="email-list">
          {loading && tenants.length === 0 ? (<div className="loading-state"><div className="skeleton-item" /></div>) : filtered.length === 0 ? (<div className="empty-state">{tCommon("empty.title")}</div>) : (
            filtered.map((t) => (
              <button key={t.serviceName} className={`email-item ${selected === t.serviceName ? "active" : ""}`} onClick={() => setSelected(t.serviceName)}>
                <div className="email-icon office"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg></div>
                <div className="email-info"><span className="email-name">{t.serviceName}</span>{t.details && <span className="email-meta">{t.details.displayName}</span>}</div>
              </button>
            ))
          )}
        </div>
      </aside>
      <main className="email-main">
        {selected && current ? (
          <>
            <header className="page-header">
              <div><h1>{current.details?.displayName || selected}</h1><p className="page-description">Microsoft 365 | {current.details?.status}</p></div>
              <button className="btn-refresh" onClick={loadTenants}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>{tCommon("actions.refresh")}</button>
            </header>
            <div className="tabs-container"><div className="tabs-list">{tabs.map((tab) => (<button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
            <div className="tab-content">{renderTab()}</div>
          </>
        ) : (<div className="no-selection"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18" /></svg><p>{t("selectTenant")}</p></div>)}
      </main>
    </div>
  );
}
