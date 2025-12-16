// ============================================================
// PRIVATE DATABASE - Page principale
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService, PrivateDatabase, PrivateDatabaseServiceInfos } from "../../../services/web-cloud.private-database";
import { GeneralTab, DatabasesTab, UsersTab, WhitelistTab, TasksTab } from "./tabs";
import "../styles.css";
import "./styles.css";

interface Tab { id: string; labelKey: string; }
interface DbWithDetails { serviceName: string; details?: PrivateDatabase; serviceInfos?: PrivateDatabaseServiceInfos; loading: boolean; error?: string; }

export default function PrivateDatabasePage() {
  const { t } = useTranslation("web-cloud/private-database/index");
  const { t: tCommon } = useTranslation("common");
  const [dbs, setDbs] = useState<DbWithDetails[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs: Tab[] = [
    { id: "general", labelKey: "tabs.general" },
    { id: "databases", labelKey: "tabs.databases" },
    { id: "users", labelKey: "tabs.users" },
    { id: "whitelist", labelKey: "tabs.whitelist" },
    { id: "tasks", labelKey: "tabs.tasks" },
  ];

  const loadDbs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const names = await privateDatabaseService.listDatabases();
      const list: DbWithDetails[] = names.map(serviceName => ({ serviceName, loading: true }));
      setDbs(list);
      if (names.length > 0 && !selected) setSelected(names[0]);
      for (let i = 0; i < names.length; i += 5) {
        const batch = names.slice(i, i + 5);
        await Promise.all(batch.map(async (serviceName) => {
          try {
            const [details, serviceInfos] = await Promise.all([privateDatabaseService.getDatabase(serviceName), privateDatabaseService.getServiceInfos(serviceName)]);
            setDbs(prev => prev.map(d => d.serviceName === serviceName ? { ...d, details, serviceInfos, loading: false } : d));
          } catch (err) {
            setDbs(prev => prev.map(d => d.serviceName === serviceName ? { ...d, loading: false, error: String(err) } : d));
          }
        }));
      }
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { loadDbs(); }, []);

  const filtered = dbs.filter(d => d.serviceName.toLowerCase().includes(searchQuery.toLowerCase()));
  const current = dbs.find(d => d.serviceName === selected);

  const renderTab = () => {
    if (!selected || !current) return null;
    switch (activeTab) {
      case "general": return <GeneralTab serviceName={selected} details={current.details} serviceInfos={current.serviceInfos} loading={current.loading} />;
      case "databases": return <DatabasesTab serviceName={selected} />;
      case "users": return <UsersTab serviceName={selected} />;
      case "whitelist": return <WhitelistTab serviceName={selected} />;
      case "tasks": return <TasksTab serviceName={selected} />;
      default: return null;
    }
  };

  const getDbIcon = (type?: string) => {
    const colors: Record<string, string> = { mysql: '#00758f', postgresql: '#336791', redis: '#dc382d', mongodb: '#47a248' };
    return <div className="db-type-icon" style={{ background: colors[type || ''] || '#6b7280' }}>{type?.charAt(0).toUpperCase() || 'D'}</div>;
  };

  return (
    <div className="private-db-page">
      <aside className="db-sidebar">
        <div className="sidebar-header"><h2>{t("title")}</h2><span className="db-count">{dbs.length}</span></div>
        <div className="sidebar-search"><input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
        <div className="db-list">
          {loading && dbs.length === 0 ? (
            <div className="loading-state"><div className="skeleton-item" /><div className="skeleton-item" /></div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">{tCommon("empty.title")}</div>
          ) : (
            filtered.map((d) => (
              <button key={d.serviceName} className={`db-item ${selected === d.serviceName ? "active" : ""}`} onClick={() => setSelected(d.serviceName)}>
                {getDbIcon(d.details?.type)}
                <div className="db-info">
                  <span className="db-name">{d.serviceName}</span>
                  {d.details && <span className="db-meta">{d.details.type} {d.details.version} | {d.details.state}</span>}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>
      <main className="db-main">
        {selected && current ? (
          <>
            <header className="page-header">
              <div>
                <h1>{selected}</h1>
                {current.details && <p className="page-description">{current.details.type} {current.details.version} | {current.details.datacenter} | {current.details.state}</p>}
              </div>
              <button className="btn-refresh" onClick={loadDbs}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>{tCommon("actions.refresh")}</button>
            </header>
            <div className="tabs-container"><div className="tabs-list">{tabs.map((tab) => (<button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
            <div className="tab-content">{renderTab()}</div>
          </>
        ) : (
          <div className="no-selection"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" /></svg><p>{t("selectDatabase")}</p></div>
        )}
      </main>
    </div>
  );
}
