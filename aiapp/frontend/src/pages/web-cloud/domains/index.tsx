// ============================================================
// DOMAINS PAGE - Liste unifiée Domaines + Zones DNS
// ============================================================

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { domainsPageService } from "./domains.service";
import { ServiceItemBadge } from "./components/ServiceItemBadge";
import type { Domain, DomainServiceInfos, DnsZone } from "./domains.types";

// Import direct des tabs (pas de barrel file)
import { GeneralTab } from "./tabs/general/GeneralTab.tsx";
import { ZoneTab } from "./tabs/zone/ZoneTab.tsx";
import { DnsServersTab } from "./tabs/dnsservers/DnsServersTab.tsx";
import { RedirectionTab } from "./tabs/redirection/RedirectionTab.tsx";
import { DynHostTab } from "./tabs/dynhost/DynHostTab.tsx";
import { GlueTab } from "./tabs/glue/GlueTab.tsx";
import { DnssecTab } from "./tabs/dnssec/DnssecTab.tsx";
import { TasksTab } from "./tabs/tasks/TasksTab.tsx";
import { AlldomTab } from "./tabs/alldom/AlldomTab.tsx";
import { ContactsTab } from "./tabs/contacts/ContactsTab.tsx";

// ============ ICONS ============

const GlobeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

// ============ TYPES ============

type ServiceEntryType = "domain-and-zone" | "domain-only" | "zone-only";

interface DomainZoneEntry {
  id: string;
  type: ServiceEntryType;
  hasDomain: boolean;
  hasZone: boolean;
}

interface TabDef {
  id: string;
  labelKey: string;
  condition: (entry: DomainZoneEntry) => boolean;
}

// ============ TABS DEFINITION ============

const ALL_TABS: TabDef[] = [
  { id: "general", labelKey: "tabs.general", condition: (e) => e.hasDomain },
  { id: "zone", labelKey: "tabs.zone", condition: (e) => e.hasZone },
  { id: "dns-servers", labelKey: "tabs.dnsServers", condition: (e) => e.hasDomain },
  { id: "redirections", labelKey: "tabs.redirections", condition: (e) => e.hasDomain },
  { id: "dynhost", labelKey: "tabs.dynhost", condition: (e) => e.hasZone },
  { id: "glue", labelKey: "tabs.glue", condition: (e) => e.hasDomain },
  { id: "dnssec", labelKey: "tabs.dnssec", condition: (e) => e.hasDomain },
  { id: "contacts", labelKey: "tabs.contacts", condition: (e) => e.hasDomain },
  { id: "tasks", labelKey: "tabs.tasks", condition: () => true },
  { id: "alldom", labelKey: "tabs.alldom", condition: () => true },
];

// ============ COMPOSANT PRINCIPAL ============

/** Page unifiée Domaines & Zones DNS avec liste à gauche et détails à droite. */
export default function DomainsPage() {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [entries, setEntries] = useState<DomainZoneEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [searchQuery, setSearchQuery] = useState("");

  // ---------- LOAD LIST (remplace useDomainZoneList) ----------
  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [domains, zones] = await Promise.all([
        domainsPageService.listDomains(),
        domainsPageService.listZones(),
      ]);

      const domainSet = new Set(domains);
      const zoneSet = new Set(zones);
      const allNames = new Set([...domains, ...zones]);

      const list: DomainZoneEntry[] = [];

      for (const name of allNames) {
        const hasDomain = domainSet.has(name);
        const hasZone = zoneSet.has(name);

        let type: ServiceEntryType;
        if (hasDomain && hasZone) type = "domain-and-zone";
        else if (hasDomain) type = "domain-only";
        else type = "zone-only";

        list.push({ id: name, type, hasDomain, hasZone });
      }

      list.sort((a, b) => a.id.localeCompare(b.id));
      setEntries(list);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // ---------- SELECTED ENTRY ----------
  const selectedEntry = useMemo(
    () => entries.find((e) => e.id === selectedId) || null,
    [entries, selectedId]
  );

  // ---------- DOMAIN DETAILS STATE ----------
  const [domainDetails, setDomainDetails] = useState<Domain | null>(null);
  const [serviceInfos, setServiceInfos] = useState<DomainServiceInfos | null>(null);
  const [zoneDetails, setZoneDetails] = useState<DnsZone | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ---------- AUTO-SELECT FIRST ----------
  useEffect(() => {
    if (entries.length > 0 && !selectedId) {
      setSelectedId(entries[0].id);
    }
  }, [entries, selectedId]);

  // ---------- LOAD DETAILS ----------
  useEffect(() => {
    if (!selectedEntry) {
      setDomainDetails(null);
      setServiceInfos(null);
      setZoneDetails(null);
      return;
    }

    const loadDetails = async () => {
      setDetailLoading(true);
      try {
        const [domain, infos, zone] = await Promise.all([
          selectedEntry.hasDomain ? domainsPageService.getDomain(selectedEntry.id) : Promise.resolve(null),
          selectedEntry.hasDomain ? domainsPageService.getServiceInfos(selectedEntry.id) : Promise.resolve(null),
          selectedEntry.hasZone ? domainsPageService.getZone(selectedEntry.id) : Promise.resolve(null),
        ]);
        setDomainDetails(domain);
        setServiceInfos(infos);
        setZoneDetails(zone);
      } catch {
        setDomainDetails(null);
        setServiceInfos(null);
        setZoneDetails(null);
      } finally {
        setDetailLoading(false);
      }
    };

    loadDetails();
  }, [selectedEntry]);

  // ---------- RESET TAB ON SELECTION CHANGE ----------
  useEffect(() => {
    if (selectedEntry) {
      const availableTabs = ALL_TABS.filter((tab) => tab.condition(selectedEntry));
      if (availableTabs.length > 0 && !availableTabs.find((t) => t.id === activeTab)) {
        setActiveTab(availableTabs[0].id);
      }
    }
  }, [selectedEntry, activeTab]);

  // ---------- FILTERED ENTRIES ----------
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter((e) => e.id.toLowerCase().includes(q));
  }, [entries, searchQuery]);

  // ---------- AVAILABLE TABS ----------
  const availableTabs = useMemo(() => {
    if (!selectedEntry) return [];
    return ALL_TABS.filter((tab) => tab.condition(selectedEntry));
  }, [selectedEntry]);

  // ---------- REFRESH HANDLER ----------
  const handleRefresh = useCallback(async () => {
    if (!selectedEntry) return;
    setDomainDetails(null);
    setServiceInfos(null);
    const [d, s] = await Promise.all([
      domainsPageService.getDomain(selectedEntry.id),
      domainsPageService.getServiceInfos(selectedEntry.id),
    ]);
    setDomainDetails(d);
    setServiceInfos(s);
  }, [selectedEntry]);

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="service-list-page">
        <div className="service-list-header">
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>
        </div>
        <div className="empty-state">
          <p>{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  // ---------- RENDER ERROR ----------
  if (error) {
    return (
      <div className="service-list-page">
        <div className="service-list-header">
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>
        </div>
        <div className="empty-state">
          <p className="status-badge error">{error}</p>
        </div>
      </div>
    );
  }

  // ---------- RENDER EMPTY ----------
  if (entries.length === 0) {
    return (
      <div className="service-list-page">
        <div className="service-list-header">
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon"><GlobeIcon /></div>
          <h3>{t("empty.title")}</h3>
          <p>{t("empty.description")}</p>
          <a href="https://help.ovhcloud.com/csm/fr-domains" target="_blank" rel="noopener noreferrer" className="guides-link">
            {tCommon("actions.viewGuides")} →
          </a>
        </div>
      </div>
    );
  }

  // ---------- RENDER TAB CONTENT ----------
  const renderTabContent = () => {
    if (!selectedEntry) return null;

    switch (activeTab) {
      case "general":
        return <GeneralTab domain={selectedEntry.id} details={domainDetails || undefined} serviceInfos={serviceInfos || undefined} loading={detailLoading} onRefresh={handleRefresh} onTabChange={setActiveTab} />;
      case "zone":
        return <ZoneTab zoneName={selectedEntry.id} />;
      case "dns-servers":
        return <DnsServersTab domain={selectedEntry.id} />;
      case "redirections":
        return <RedirectionTab domain={selectedEntry.id} nameServerType={domainDetails?.nameServerType} />;
      case "dynhost":
        return <DynHostTab zoneName={selectedEntry.id} />;
      case "glue":
        return <GlueTab domain={selectedEntry.id} />;
      case "dnssec":
        return <DnssecTab domain={selectedEntry.id} />;
      case "contacts":
        return <ContactsTab domain={selectedEntry.id} serviceInfos={serviceInfos || undefined} />;
      case "tasks":
      case "alldom":
        return <AlldomTab />;
        return <TasksTab name={selectedEntry.id} hasDomain={selectedEntry.hasDomain} hasZone={selectedEntry.hasZone} />;
      default:
        return null;
    }
  };

  // ---------- RENDER ----------
  return (
    <div className="service-list-page">
      <div className="service-list-header">
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
        <a href="https://help.ovhcloud.com/csm/fr-domains" target="_blank" rel="noopener noreferrer" className="guides-link">
          {tCommon("actions.viewGuides")} →
        </a>
      </div>
      <div className="service-list-content">
        <div className="service-list-sidebar">
          <div className="sidebar-search">
            <input
              type="text"
              placeholder={tCommon("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="section-header" style={{ padding: "var(--space-3) var(--space-4)" }}>
            <span className="section-count">{filteredEntries.length} {t("serviceUnit")}</span>
          </div>
          <div className="service-list-items">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className={`service-item ${selectedId === entry.id ? "selected" : ""}`}
                onClick={() => setSelectedId(entry.id)}
              >
                <div className="service-item-content">
                  <div className="service-item-name">{entry.id}</div>
                  <ServiceItemBadge hasDomain={entry.hasDomain} hasZone={entry.hasZone} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="service-list-main">
          {selectedEntry ? (
            <div className="detail-card">
              <div className="detail-card-header">
                <h2>{selectedEntry.id}</h2>
                <div className="header-badges">
                  {selectedEntry.hasDomain && domainDetails && (
                    <span className={`badge ${domainDetails.transferLockStatus === "locked" ? "success" : "warning"}`}>
                      {domainDetails.transferLockStatus === "locked" ? "🔒" : "🔓"} {domainDetails.transferLockStatus}
                    </span>
                  )}
                  {selectedEntry.hasZone && zoneDetails?.dnssecSupported && (
                    <span className="badge info">🔐 DNSSEC</span>
                  )}
                </div>
              </div>
              <div className="detail-tabs">
                {availableTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`detail-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {t(tab.labelKey)}
                  </button>
                ))}
              </div>
              <div className="detail-tab-content">
                {renderTabContent()}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><GlobeIcon /></div>
              <h3>{t("empty.selectTitle")}</h3>
              <p>{t("empty.selectDescription")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
