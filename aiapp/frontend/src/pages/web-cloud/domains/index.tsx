// ============================================================
// DOMAINS - Page principale avec liste et tabs
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { domainsService, Domain, DomainServiceInfos } from "../../../services/domains.service";
import { GeneralTab, DnsTab, ZoneTab, RedirectionTab, DnssecTab, GlueTab, DynHostTab, TasksTab } from "./tabs";
import "../styles.css";
import "./styles.css";

// ============================================================
// TYPES
// ============================================================

interface Tab { id: string; labelKey: string; }

interface DomainWithDetails {
  name: string;
  details?: Domain;
  serviceInfos?: DomainServiceInfos;
  loading: boolean;
  error?: string;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

/** Page Domaines - Liste des domaines avec details et onglets. */
export default function DomainsPage() {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  const [domains, setDomains] = useState<DomainWithDetails[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs: Tab[] = [
    { id: "general", labelKey: "tabs.general" },
    { id: "dns", labelKey: "tabs.dns" },
    { id: "zone", labelKey: "tabs.zone" },
    { id: "redirection", labelKey: "tabs.redirection" },
    { id: "dnssec", labelKey: "tabs.dnssec" },
    { id: "glue", labelKey: "tabs.glue" },
    { id: "dynhost", labelKey: "tabs.dynhost" },
    { id: "tasks", labelKey: "tabs.tasks" },
  ];

  // ---------- LOAD DOMAINS ----------
  const loadDomains = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const domainNames = await domainsService.listDomains();
      const domainsWithDetails: DomainWithDetails[] = domainNames.map(name => ({ name, loading: true }));
      setDomains(domainsWithDetails);
      if (domainNames.length > 0 && !selectedDomain) setSelectedDomain(domainNames[0]);
      // Streaming: charge les details par batch de 5
      for (let i = 0; i < domainNames.length; i += 5) {
        const batch = domainNames.slice(i, i + 5);
        await Promise.all(batch.map(async (name) => {
          try {
            const [details, serviceInfos] = await Promise.all([domainsService.getDomain(name), domainsService.getServiceInfos(name)]);
            setDomains(prev => prev.map(d => d.name === name ? { ...d, details, serviceInfos, loading: false } : d));
          } catch (err) {
            setDomains(prev => prev.map(d => d.name === name ? { ...d, loading: false, error: String(err) } : d));
          }
        }));
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [selectedDomain]);

  useEffect(() => { loadDomains(); }, []);

  const filteredDomains = domains.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const currentDomain = domains.find(d => d.name === selectedDomain);

  // ---------- RENDER TAB CONTENT ----------
  const renderTabContent = () => {
    if (!selectedDomain || !currentDomain) return null;
    switch (activeTab) {
      case "general": return <GeneralTab domain={selectedDomain} details={currentDomain.details} serviceInfos={currentDomain.serviceInfos} loading={currentDomain.loading} />;
      case "dns": return <DnsTab domain={selectedDomain} />;
      case "zone": return <ZoneTab domain={selectedDomain} />;
      case "redirection": return <RedirectionTab domain={selectedDomain} />;
      case "dnssec": return <DnssecTab domain={selectedDomain} />;
      case "glue": return <GlueTab domain={selectedDomain} />;
      case "dynhost": return <DynHostTab domain={selectedDomain} />;
      case "tasks": return <TasksTab domain={selectedDomain} />;
      default: return null;
    }
  };

  return (
    <div className="domains-page">
      {/* Sidebar */}
      <aside className="domains-sidebar">
        <div className="sidebar-header">
          <h2>{t("title")}</h2>
          <span className="domain-count">{domains.length}</span>
        </div>
        <div className="sidebar-search">
          <input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="domains-list">
          {loading && domains.length === 0 ? (
            <div className="loading-state"><div className="skeleton-item" /><div className="skeleton-item" /><div className="skeleton-item" /></div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : filteredDomains.length === 0 ? (
            <div className="empty-state">{tCommon("empty.title")}</div>
          ) : (
            filteredDomains.map((domain) => (
              <button key={domain.name} className={`domain-item ${selectedDomain === domain.name ? "active" : ""}`} onClick={() => setSelectedDomain(domain.name)}>
                <div className="domain-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
                  </svg>
                </div>
                <div className="domain-info">
                  <span className="domain-name">{domain.name}</span>
                  {domain.loading ? <span className="domain-status loading">{tCommon("loading")}</span> : domain.serviceInfos ? <span className="domain-expiry">Exp: {new Date(domain.serviceInfos.expiration).toLocaleDateString()}</span> : null}
                </div>
                {domain.details && <span className={`lock-badge ${domain.details.transferLockStatus}`}>{domain.details.transferLockStatus === 'locked' ? '🔒' : '🔓'}</span>}
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="domains-main">
        {selectedDomain && currentDomain ? (
          <>
            <header className="page-header">
              <div>
                <h1>{selectedDomain}</h1>
                {currentDomain.details && <p className="page-description">{t("offer")}: {currentDomain.details.offer} | DNS: {currentDomain.details.nameServerType}</p>}
              </div>
              <button className="btn-refresh" onClick={loadDomains}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                {tCommon("actions.refresh")}
              </button>
            </header>
            <div className="tabs-container"><div className="tabs-list">{tabs.map((tab) => (<button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
            <div className="tab-content">{renderTabContent()}</div>
          </>
        ) : (
          <div className="no-selection">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" /></svg>
            <p>{t("selectDomain")}</p>
          </div>
        )}
      </main>
    </div>
  );
}
