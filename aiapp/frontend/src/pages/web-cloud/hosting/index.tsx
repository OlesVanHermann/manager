// ============================================================
// HOSTING - Page principale avec liste et tabs
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Hosting, HostingServiceInfos } from "../../../services/web-cloud.hosting";
import { GeneralTab, MultisiteTab, FtpTab, DatabaseTab, CronTab, SslTab, RuntimesTab, EnvvarsTab, LogsTab, EmailsTab, ModulesTab, TasksTab } from "./tabs";
import "../styles.css";
import "./styles.css";

// ============================================================
// TYPES
// ============================================================

interface Tab { id: string; labelKey: string; }

interface HostingWithDetails {
  serviceName: string;
  details?: Hosting;
  serviceInfos?: HostingServiceInfos;
  loading: boolean;
  error?: string;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

/** Page Hebergements - Liste des hebergements avec details et onglets. */
export default function HostingPage() {
  const { t } = useTranslation("web-cloud/hosting/index");
  const { t: tCommon } = useTranslation("common");

  const [hostings, setHostings] = useState<HostingWithDetails[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs: Tab[] = [
    { id: "general", labelKey: "tabs.general" },
    { id: "multisite", labelKey: "tabs.multisite" },
    { id: "ftp", labelKey: "tabs.ftp" },
    { id: "database", labelKey: "tabs.database" },
    { id: "cron", labelKey: "tabs.cron" },
    { id: "modules", labelKey: "tabs.modules" },
    { id: "ssl", labelKey: "tabs.ssl" },
    { id: "runtimes", labelKey: "tabs.runtimes" },
    { id: "envvars", labelKey: "tabs.envvars" },
    { id: "logs", labelKey: "tabs.logs" },
    { id: "emails", labelKey: "tabs.emails" },
    { id: "tasks", labelKey: "tabs.tasks" },
  ];

  // ---------- LOAD HOSTINGS ----------
  const loadHostings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const names = await hostingService.listHostings();
      const list: HostingWithDetails[] = names.map(serviceName => ({ serviceName, loading: true }));
      setHostings(list);
      if (names.length > 0 && !selected) setSelected(names[0]);
      for (let i = 0; i < names.length; i += 5) {
        const batch = names.slice(i, i + 5);
        await Promise.all(batch.map(async (serviceName) => {
          try {
            const [details, serviceInfos] = await Promise.all([hostingService.getHosting(serviceName), hostingService.getServiceInfos(serviceName)]);
            setHostings(prev => prev.map(h => h.serviceName === serviceName ? { ...h, details, serviceInfos, loading: false } : h));
          } catch (err) {
            setHostings(prev => prev.map(h => h.serviceName === serviceName ? { ...h, loading: false, error: String(err) } : h));
          }
        }));
      }
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { loadHostings(); }, []);

  const filtered = hostings.filter(h => h.serviceName.toLowerCase().includes(searchQuery.toLowerCase()));
  const current = hostings.find(h => h.serviceName === selected);

  const renderTabContent = () => {
    if (!selected || !current) return null;
    switch (activeTab) {
      case "general": return <GeneralTab serviceName={selected} details={current.details} serviceInfos={current.serviceInfos} loading={current.loading} />;
      case "multisite": return <MultisiteTab serviceName={selected} />;
      case "ftp": return <FtpTab serviceName={selected} details={current.details} />;
      case "database": return <DatabaseTab serviceName={selected} />;
      case "cron": return <CronTab serviceName={selected} />;
      case "modules": return <ModulesTab serviceName={selected} />;
      case "ssl": return <SslTab serviceName={selected} />;
      case "runtimes": return <RuntimesTab serviceName={selected} />;
      case "envvars": return <EnvvarsTab serviceName={selected} />;
      case "logs": return <LogsTab serviceName={selected} details={current.details} />;
      case "emails": return <EmailsTab serviceName={selected} />;
      case "tasks": return <TasksTab serviceName={selected} />;
      default: return null;
    }
  };

  const getQuotaPercent = (h: HostingWithDetails) => {
    if (!h.details?.quotaSize || !h.details?.quotaUsed) return 0;
    return Math.round((h.details.quotaUsed.value / h.details.quotaSize.value) * 100);
  };

  return (
    <div className="hosting-page">
      <aside className="hosting-sidebar">
        <div className="sidebar-header">
          <h2>{t("title")}</h2>
          <span className="hosting-count">{hostings.length}</span>
        </div>
        <div className="sidebar-search">
          <input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="hosting-list">
          {loading && hostings.length === 0 ? (
            <div className="loading-state"><div className="skeleton-item" /><div className="skeleton-item" /><div className="skeleton-item" /></div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">{tCommon("empty.title")}</div>
          ) : (
            filtered.map((h) => (
              <button key={h.serviceName} className={`hosting-item ${selected === h.serviceName ? "active" : ""}`} onClick={() => setSelected(h.serviceName)}>
                <div className="hosting-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228" /></svg>
                </div>
                <div className="hosting-info">
                  <span className="hosting-name">{h.serviceName}</span>
                  {h.loading ? <span className="hosting-status loading">{tCommon("loading")}</span> : h.details ? <span className="hosting-offer">{h.details.offer}</span> : null}
                </div>
                {h.details && <div className="quota-mini-badge" style={{ '--percent': `${getQuotaPercent(h)}%` } as React.CSSProperties}><span>{getQuotaPercent(h)}%</span></div>}
              </button>
            ))
          )}
        </div>
      </aside>

      <main className="hosting-main">
        {selected && current ? (
          <>
            <header className="page-header">
              <div>
                <h1>{selected}</h1>
                {current.details && <p className="page-description">{current.details.offer} | {current.details.cluster} | {current.details.state === 'active' ? '✓ Actif' : '⚠ ' + current.details.state}</p>}
              </div>
              <button className="btn-refresh" onClick={loadHostings}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                {tCommon("actions.refresh")}
              </button>
            </header>
            <div className="tabs-container"><div className="tabs-list">{tabs.map((tab) => (<button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
            <div className="tab-content">{renderTabContent()}</div>
          </>
        ) : (
          <div className="no-selection">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228" /></svg>
            <p>{t("selectHosting")}</p>
          </div>
        )}
      </main>
    </div>
  );
}
