// ============================================================
// DOMAINS PAGE - Vue Liste (table) + Vue Détail (sidebar+panel)
// Basé sur target SVG: list.svg, dashboard.svg, general-informations.svg
// ============================================================

import "./domains.css";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { domainsPageService } from "./domains.service";
import type { Domain, DomainServiceInfos, DnsZone } from "./domains.types";

// Import des tabs
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

const GlobeIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
  </svg>
);

// ============ TYPES ============

type ServiceEntryType = "domain-and-zone" | "domain-only" | "zone-only";
type ViewMode = "list" | "detail";

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

// ============ MOCK DATA FOR DEMO ============

const getMockDomainData = (domain: string) => ({
  expiration: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR"),
  renewal: "Automatique",
  status: Math.random() > 0.2 ? "active" : Math.random() > 0.5 ? "expiring" : "expired",
  extension: domain.split(".").pop()?.toUpperCase() || "COM",
});

// ============ COMPOSANT PRINCIPAL ============

export default function DomainsPage() {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [entries, setEntries] = useState<DomainZoneEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // ---------- LOAD LIST ----------
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

  // ---------- HANDLERS ----------
  const handleSelectDomain = (id: string) => {
    setSelectedId(id);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedId(null);
  };

  const toggleRowSelection = (id: string) => {
    const newSet = new Set(selectedRows);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedRows(newSet);
  };

  const toggleAllSelection = () => {
    if (selectedRows.size === filteredEntries.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredEntries.map((e) => e.id)));
    }
  };

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
        return <TasksTab name={selectedEntry.id} hasDomain={selectedEntry.hasDomain} hasZone={selectedEntry.hasZone} />;
      case "alldom":
        return <AlldomTab />;
      default:
        return null;
    }
  };

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="domains-page">
        <div className="domains-header">
          <div>
            <h1>{t("title")}</h1>
            <p className="domains-header-desc">{t("description")}</p>
          </div>
        </div>
        <div className="domains-loading">{tCommon("loading")}</div>
      </div>
    );
  }

  // ---------- RENDER ERROR ----------
  if (error) {
    return (
      <div className="domains-page">
        <div className="domains-header">
          <div>
            <h1>{t("title")}</h1>
            <p className="domains-header-desc">{t("description")}</p>
          </div>
        </div>
        <div className="domains-empty">
          <div className="domains-status error">{error}</div>
        </div>
      </div>
    );
  }

  // ---------- RENDER EMPTY ----------
  if (entries.length === 0) {
    return (
      <div className="domains-page">
        <div className="domains-header">
          <div>
            <h1>{t("title")}</h1>
            <p className="domains-header-desc">{t("description")}</p>
          </div>
        </div>
        <div className="domains-empty">
          <div className="domains-empty-icon"><GlobeIcon size={48} /></div>
          <h3>{t("empty.title")}</h3>
          <p>{t("empty.description")}</p>
          <a href="https://help.ovhcloud.com/csm/fr-domains" target="_blank" rel="noopener noreferrer" className="domains-guides-link">
            {tCommon("actions.viewGuides")} →
          </a>
        </div>
      </div>
    );
  }

  // ---------- RENDER LIST VIEW ----------
  if (viewMode === "list") {
    return (
      <div className="domains-page">
        <div className="domains-header">
          <div>
            <h1>{t("title")}</h1>
            <p className="domains-header-desc">{t("description")}</p>
          </div>
          <a href="https://help.ovhcloud.com/csm/fr-domains" target="_blank" rel="noopener noreferrer" className="domains-guides-link">
            {tCommon("actions.viewGuides")} →
          </a>
        </div>

        <div className="domains-list-view">
          <div className="domains-toolbar">
            <div className="domains-toolbar-left">
              <a href="https://www.ovh.com/fr/order/domain/" target="_blank" rel="noopener noreferrer" className="domains-btn-primary">
                <PlusIcon /> {t("actions.orderDomain")}
              </a>
              <button className="domains-btn-outline">{t("actions.transferDomain")}</button>
            </div>
            <div className="domains-toolbar-right">
              <div className="domains-search">
                <SearchIcon />
                <input
                  type="text"
                  placeholder={tCommon("search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="domains-table-wrapper">
            <table className="domains-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      className="domains-checkbox"
                      checked={selectedRows.size === filteredEntries.length && filteredEntries.length > 0}
                      onChange={toggleAllSelection}
                    />
                  </th>
                  <th>{t("table.domain")}</th>
                  <th>{t("table.extension")}</th>
                  <th>{t("table.status")}</th>
                  <th>{t("table.expiration")}</th>
                  <th>{t("table.renewal")}</th>
                  <th style={{ width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => {
                  const mockData = getMockDomainData(entry.id);
                  return (
                    <tr key={entry.id}>
                      <td>
                        <input
                          type="checkbox"
                          className="domains-checkbox"
                          checked={selectedRows.has(entry.id)}
                          onChange={() => toggleRowSelection(entry.id)}
                        />
                      </td>
                      <td>
                        <span className="domains-name-cell" onClick={() => handleSelectDomain(entry.id)}>
                          {entry.id}
                        </span>
                      </td>
                      <td><span className="domains-extension">.{mockData.extension}</span></td>
                      <td>
                        <span className={`domains-status ${mockData.status}`}>
                          {mockData.status === "active" ? t("status.active") :
                           mockData.status === "expiring" ? t("status.expiring") : t("status.expired")}
                        </span>
                      </td>
                      <td>
                        <span className={`domains-date ${mockData.status === "expiring" ? "warning" : mockData.status === "expired" ? "error" : ""}`}>
                          {mockData.expiration}
                        </span>
                      </td>
                      <td className="domains-renewal">{mockData.renewal}</td>
                      <td>
                        <button className="domains-actions-btn" onClick={() => handleSelectDomain(entry.id)}>
                          <MoreIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="domains-pagination">
            <span>{filteredEntries.length} {t("serviceUnit")}</span>
            <div className="domains-pagination-pages">
              <span className="active">1</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- RENDER DETAIL VIEW ----------
  return (
    <div className="domains-page">
      <div className="domains-header">
        <div>
          <button className="domains-back-btn" onClick={handleBackToList}>
            <ChevronLeftIcon /> {t("actions.backToList")}
          </button>
          <h1>{t("title")}</h1>
          <p className="domains-header-desc">{t("description")}</p>
        </div>
        <a href="https://help.ovhcloud.com/csm/fr-domains" target="_blank" rel="noopener noreferrer" className="domains-guides-link">
          {tCommon("actions.viewGuides")} →
        </a>
      </div>

      <div className="domains-detail-view">
        {/* SIDEBAR */}
        <div className="domains-sidebar">
          <div className="domains-sidebar-search">
            <input
              type="text"
              placeholder={tCommon("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="domains-sidebar-filter">
            <span>{filteredEntries.length} {t("serviceUnit")}</span>
          </div>
          <div className="domains-sidebar-list">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className={`domains-sidebar-item ${selectedId === entry.id ? "selected" : ""}`}
                onClick={() => setSelectedId(entry.id)}
              >
                <span className="domains-sidebar-icon">🌐</span>
                <div className="domains-sidebar-info">
                  <div className="domains-sidebar-name">{entry.id}</div>
                  <div className="domains-sidebar-type">
                    {entry.type === "domain-and-zone" ? t("type.domainAndZone") :
                     entry.type === "domain-only" ? t("type.domainOnly") : t("type.zoneOnly")}
                  </div>
                  <span className="domains-sidebar-ext">.{entry.id.split(".").pop()?.toUpperCase()}</span>
                </div>
                <span className="domains-sidebar-badge">{t("status.active")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN PANEL */}
        <div className="domains-main-panel">
          {selectedEntry ? (
            <>
              <div className="domains-panel-header">
                <h2>{selectedEntry.id}</h2>
                {domainDetails && (
                  <span className={`domains-panel-badge ${domainDetails.transferLockStatus === "locked" ? "" : "warning"}`}>
                    {domainDetails.transferLockStatus === "locked" ? "🔒 Verrouillé" : "🔓 Déverrouillé"}
                  </span>
                )}
              </div>

              <div className="domains-nav3">
                {availableTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`domains-nav3-btn ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {t(tab.labelKey)}
                  </button>
                ))}
              </div>

              <div className="domains-tab-content">
                {renderTabContent()}
              </div>
            </>
          ) : (
            <div className="domains-empty">
              <div className="domains-empty-icon"><GlobeIcon size={48} /></div>
              <h3>{t("empty.selectTitle")}</h3>
              <p>{t("empty.selectDescription")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
