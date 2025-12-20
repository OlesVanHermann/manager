// ============================================================
// DOMAINS & DNS - Page combinée domaines + zones DNS
// NAV3: Domaines | Zones DNS
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { domainsService, Domain, DomainServiceInfos } from "../../../services/web-cloud.domains";
import { dnsZonesService } from "../../../services/web-cloud.dns-zones";
import { GeneralTab, DnsTab, ZoneTab, RedirectionTab, DnssecTab, GlueTab, DynHostTab, TasksTab } from "../domains/tabs";
import { RecordsTab, HistoryTab, TasksTab as ZoneTasksTab } from "../dns-zones/tabs";
import "../styles.css";

// ============================================================
// TYPES
// ============================================================

type ProductType = "domains" | "dns-zones";

interface Tab { id: string; labelKey: string; }

interface DomainWithDetails {
  name: string;
  details?: Domain;
  serviceInfos?: DomainServiceInfos;
  loading: boolean;
  error?: string;
}

interface ZoneWithDetails {
  name: string;
  hasDnsAnycast: boolean;
  loading: boolean;
  error?: string;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

/** Page Domaines & DNS - Combine domaines et zones DNS avec navigation NAV3. */
export default function DomainsDnsPage() {
  const { t } = useTranslation("web-cloud/domains-dns/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- NAV3 STATE ----------
  const [activeProduct, setActiveProduct] = useState<ProductType>("domains");

  // ---------- DOMAINS STATE ----------
  const [domains, setDomains] = useState<DomainWithDetails[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [domainTab, setDomainTab] = useState("general");
  const [domainsLoading, setDomainsLoading] = useState(true);

  // ---------- ZONES STATE ----------
  const [zones, setZones] = useState<ZoneWithDetails[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [zoneTab, setZoneTab] = useState("records");
  const [zonesLoading, setZonesLoading] = useState(true);

  // ---------- COMMON STATE ----------
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const domainTabs: Tab[] = [
    { id: "general", labelKey: "domains.tabs.general" },
    { id: "dns", labelKey: "domains.tabs.dns" },
    { id: "zone", labelKey: "domains.tabs.zone" },
    { id: "redirection", labelKey: "domains.tabs.redirection" },
    { id: "dnssec", labelKey: "domains.tabs.dnssec" },
    { id: "glue", labelKey: "domains.tabs.glue" },
    { id: "dynhost", labelKey: "domains.tabs.dynhost" },
    { id: "tasks", labelKey: "domains.tabs.tasks" },
  ];

  const zoneTabs: Tab[] = [
    { id: "records", labelKey: "zones.tabs.records" },
    { id: "history", labelKey: "zones.tabs.history" },
    { id: "tasks", labelKey: "zones.tabs.tasks" },
  ];

  // ---------- LOAD DOMAINS ----------
  const loadDomains = useCallback(async () => {
    try {
      setDomainsLoading(true);
      setError(null);
      const domainNames = await domainsService.listDomains();
      const domainsWithDetails: DomainWithDetails[] = domainNames.map(name => ({ name, loading: true }));
      setDomains(domainsWithDetails);
      if (domainNames.length > 0 && !selectedDomain) setSelectedDomain(domainNames[0]);
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
      setDomainsLoading(false);
    }
  }, [selectedDomain]);

  // ---------- LOAD ZONES ----------
  const loadZones = useCallback(async () => {
    try {
      setZonesLoading(true);
      const zoneNames = await dnsZonesService.listZones();
      const zonesWithDetails: ZoneWithDetails[] = zoneNames.map(name => ({ name, hasDnsAnycast: false, loading: true }));
      setZones(zonesWithDetails);
      if (zoneNames.length > 0 && !selectedZone) setSelectedZone(zoneNames[0]);
      for (let i = 0; i < zoneNames.length; i += 5) {
        const batch = zoneNames.slice(i, i + 5);
        await Promise.all(batch.map(async (name) => {
          try {
            const details = await dnsZonesService.getZone(name);
            setZones(prev => prev.map(z => z.name === name ? { ...z, hasDnsAnycast: details.hasDnsAnycast, loading: false } : z));
          } catch (err) {
            setZones(prev => prev.map(z => z.name === name ? { ...z, loading: false, error: String(err) } : z));
          }
        }));
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setZonesLoading(false);
    }
  }, [selectedZone]);

  useEffect(() => { loadDomains(); loadZones(); }, []);

  // ---------- FILTERED LISTS ----------
  const filteredDomains = domains.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredZones = zones.filter(z => z.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const currentDomain = domains.find(d => d.name === selectedDomain);
  const currentZone = zones.find(z => z.name === selectedZone);

  // ---------- RENDER DOMAIN TAB ----------
  const renderDomainTab = () => {
    if (!selectedDomain || !currentDomain) return null;
    switch (domainTab) {
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

  // ---------- RENDER ZONE TAB ----------
  const renderZoneTab = () => {
    if (!selectedZone) return null;
    switch (zoneTab) {
      case "records": return <RecordsTab zone={selectedZone} />;
      case "history": return <HistoryTab zone={selectedZone} />;
      case "tasks": return <ZoneTasksTab zone={selectedZone} />;
      default: return null;
    }
  };

  return (
    <div className="domains-page">
      {/* NAV3 - Product Selector */}
      <div className="nav3-bar">
        <button className={`nav3-btn ${activeProduct === "domains" ? "active" : ""}`} onClick={() => setActiveProduct("domains")}>
          {t("nav.domains")} <span className="count">{domains.length}</span>
        </button>
        <button className={`nav3-btn ${activeProduct === "dns-zones" ? "active" : ""}`} onClick={() => setActiveProduct("dns-zones")}>
          {t("nav.zones")} <span className="count">{zones.length}</span>
        </button>
      </div>

      {/* Sidebar */}
      <aside className="domains-sidebar">
        <div className="sidebar-header">
          <h2>{activeProduct === "domains" ? t("domains.title") : t("zones.title")}</h2>
        </div>
        <div className="sidebar-search">
          <input type="text" placeholder={t("searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="domains-list">
          {activeProduct === "domains" ? (
            domainsLoading && domains.length === 0 ? (
              <div className="loading-state"><div className="skeleton-item" /><div className="skeleton-item" /><div className="skeleton-item" /></div>
            ) : filteredDomains.length === 0 ? (
              <div className="empty-state">{tCommon("empty.title")}</div>
            ) : (
              filteredDomains.map((domain) => (
                <button key={domain.name} className={`domain-item ${selectedDomain === domain.name ? "active" : ""}`} onClick={() => setSelectedDomain(domain.name)}>
                  <div className="domain-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" /></svg>
                  </div>
                  <div className="domain-info">
                    <span className="domain-name">{domain.name}</span>
                    {domain.loading ? <span className="domain-status loading">{tCommon("loading")}</span> : domain.serviceInfos ? <span className="domain-expiry">Exp: {new Date(domain.serviceInfos.expiration).toLocaleDateString()}</span> : null}
                  </div>
                  {domain.details && <span className={`lock-badge ${domain.details.transferLockStatus}`}>{domain.details.transferLockStatus === 'locked' ? '🔒' : '🔓'}</span>}
                </button>
              ))
            )
          ) : (
            zonesLoading && zones.length === 0 ? (
              <div className="loading-state"><div className="skeleton-item" /><div className="skeleton-item" /><div className="skeleton-item" /></div>
            ) : filteredZones.length === 0 ? (
              <div className="empty-state">{tCommon("empty.title")}</div>
            ) : (
              filteredZones.map((zone) => (
                <button key={zone.name} className={`domain-item ${selectedZone === zone.name ? "active" : ""}`} onClick={() => setSelectedZone(zone.name)}>
                  <div className="domain-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" /></svg>
                  </div>
                  <div className="domain-info">
                    <span className="domain-name">{zone.name}</span>
                    {zone.hasDnsAnycast && <span className="badge success">Anycast</span>}
                  </div>
                </button>
              ))
            )
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="domains-main">
        {activeProduct === "domains" ? (
          selectedDomain && currentDomain ? (
            <>
              <header className="page-header">
                <div>
                  <h1>{selectedDomain}</h1>
                  {currentDomain.details && <p className="page-description">{t("domains.offer")}: {currentDomain.details.offer} | DNS: {currentDomain.details.nameServerType}</p>}
                </div>
                <button className="btn-refresh" onClick={loadDomains}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                  {tCommon("actions.refresh")}
                </button>
              </header>
              <div className="tabs-container"><div className="tabs-list">{domainTabs.map((tab) => (<button key={tab.id} className={`tab-btn ${domainTab === tab.id ? "active" : ""}`} onClick={() => setDomainTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
              <div className="tab-content">{renderDomainTab()}</div>
            </>
          ) : (
            <div className="no-selection">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" /></svg>
              <p>{t("domains.selectDomain")}</p>
            </div>
          )
        ) : (
          selectedZone ? (
            <>
              <header className="page-header">
                <div>
                  <h1>{selectedZone}</h1>
                  <p className="page-description">{t("zones.description")}</p>
                </div>
                <button className="btn-refresh" onClick={loadZones}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                  {tCommon("actions.refresh")}
                </button>
              </header>
              <div className="tabs-container"><div className="tabs-list">{zoneTabs.map((tab) => (<button key={tab.id} className={`tab-btn ${zoneTab === tab.id ? "active" : ""}`} onClick={() => setZoneTab(tab.id)}>{t(tab.labelKey)}</button>))}</div></div>
              <div className="tab-content">{renderZoneTab()}</div>
            </>
          ) : (
            <div className="no-selection">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" /></svg>
              <p>{t("zones.selectZone")}</p>
            </div>
          )
        )}
      </main>
    </div>
  );
}
