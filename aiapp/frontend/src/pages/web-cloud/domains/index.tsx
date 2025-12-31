// ============================================================
// DOMAINS PAGE - NAV3 Groups (General / DNS / Expert)
// Ref: prompt_target_sidecar_left.txt + todo_web-cloud_domains.txt
// Layout: LEFT PANEL (280px) + RIGHT PANEL (tabs grouped by NAV3)
// ============================================================

import "./domains.css";
import React, { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { LeftPanel, LeftPanelItemContent, useLeftPanel } from "../../../components/LeftPanel";
import { domainsPageService } from "./domains.service";
import type { Domain, DomainServiceInfos, DnsZone } from "./domains.types";

// ============ LAZY LOADED TABS ============

// GENERAL group (./general/NAV4)
const GeneralTab = React.lazy(() => import("./general/GeneralTab").then(m => ({ default: m.GeneralTab })));
const ContactsTab = React.lazy(() => import("./general/contacts/ContactsTab").then(m => ({ default: m.ContactsTab })));
const AlldomTab = React.lazy(() => import("./general/alldom/AlldomTab").then(m => ({ default: m.AlldomTab })));

// DNS group (./dns/NAV4)
const DnsInfoTab = React.lazy(() => import("./dns/dns-info/DnsInfoTab").then(m => ({ default: m.DnsInfoTab })));
const DnsServersTab = React.lazy(() => import("./dns/dnsservers/DnsServersTab").then(m => ({ default: m.DnsServersTab })));
const ZoneTab = React.lazy(() => import("./dns/zone/ZoneTab").then(m => ({ default: m.ZoneTab })));
const DnssecTab = React.lazy(() => import("./dns/dnssec/DnssecTab").then(m => ({ default: m.DnssecTab })));
const SpfTab = React.lazy(() => import("./dns/spf/SpfTab").then(m => ({ default: m.SpfTab })));
const DkimTab = React.lazy(() => import("./dns/dkim/DkimTab").then(m => ({ default: m.DkimTab })));
const DmarcTab = React.lazy(() => import("./dns/dmarc/DmarcTab").then(m => ({ default: m.DmarcTab })));
const ArcTab = React.lazy(() => import("./dns/arc/ArcTab").then(m => ({ default: m.ArcTab })));
const BimiTab = React.lazy(() => import("./dns/bimi/BimiTab").then(m => ({ default: m.BimiTab })));
const CaaTab = React.lazy(() => import("./dns/caa/CaaTab").then(m => ({ default: m.CaaTab })));
const DynHostTab = React.lazy(() => import("./dns/dynhost/DynHostTab").then(m => ({ default: m.DynHostTab })));

// EXPERT group (./expert/NAV4)
const GlueTab = React.lazy(() => import("./expert/glue/GlueTab").then(m => ({ default: m.GlueTab })));
const TasksTab = React.lazy(() => import("./expert/tasks/TasksTab").then(m => ({ default: m.TasksTab })));

// ============ ICONS ============

const GlobeIcon = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ============ TYPES ============

type ServiceType = "domain" | "zone" | "both";
type Nav3Group = "general" | "dns" | "expert";

interface DomainEntry {
  name: string;
  type: ServiceType;
  hasDomain: boolean;
  hasZone: boolean;
  extension: string;
  status: "active" | "expiring" | "expired";
  expiration: string;
}

interface DomainDetails {
  domain: Domain | null;
  serviceInfos: DomainServiceInfos | null;
  zone: DnsZone | null;
}

interface TabDef {
  id: string;
  labelKey: string;
  group: Nav3Group;
  condition: (entry: DomainEntry) => boolean;
}

// ============ NAV3 GROUPS DEFINITION ============

const NAV3_GROUPS: { id: Nav3Group; labelKey: string }[] = [
  { id: "general", labelKey: "nav3.general" },
  { id: "dns", labelKey: "nav3.dns" },
  { id: "expert", labelKey: "nav3.expert" },
];

// ============ TABS DEFINITION (grouped by NAV3) ============

const ALL_TABS: TabDef[] = [
  // GENERAL group (3 tabs)
  { id: "general", labelKey: "tabs.general", group: "general", condition: (e) => e.hasDomain },
  { id: "contacts", labelKey: "tabs.contacts", group: "general", condition: (e) => e.hasDomain },
  { id: "alldom", labelKey: "tabs.alldom", group: "general", condition: () => true },

  // DNS group (11 tabs)
  { id: "dns-info", labelKey: "tabs.dnsInfo", group: "dns", condition: (e) => e.hasZone },
  { id: "dns-servers", labelKey: "tabs.dnsServers", group: "dns", condition: (e) => e.hasDomain },
  { id: "zone", labelKey: "tabs.zone", group: "dns", condition: (e) => e.hasZone },
  { id: "dnssec", labelKey: "tabs.dnssec", group: "dns", condition: (e) => e.hasDomain },
  { id: "spf", labelKey: "tabs.spf", group: "dns", condition: (e) => e.hasZone },
  { id: "dkim", labelKey: "tabs.dkim", group: "dns", condition: (e) => e.hasZone },
  { id: "dmarc", labelKey: "tabs.dmarc", group: "dns", condition: (e) => e.hasZone },
  { id: "arc", labelKey: "tabs.arc", group: "dns", condition: (e) => e.hasZone },
  { id: "bimi", labelKey: "tabs.bimi", group: "dns", condition: (e) => e.hasZone },
  { id: "caa", labelKey: "tabs.caa", group: "dns", condition: (e) => e.hasZone },
  { id: "dynhost", labelKey: "tabs.dynhost", group: "dns", condition: (e) => e.hasZone },

  // EXPERT group (2 tabs)
  { id: "glue", labelKey: "tabs.glue", group: "expert", condition: (e) => e.hasDomain },
  { id: "tasks", labelKey: "tabs.tasks", group: "expert", condition: () => true },
];

// ============ FILTER OPTIONS ============

const FILTER_OPTIONS = [
  { value: "all", label: "Tous" },
  { value: "domain", label: "Domaines" },
  { value: "zone", label: "Zones DNS" },
];

// ============ TAB SKELETON ============

const TabSkeleton = () => (
  <div className="dom-loading">
    <div className="dom-skeleton" style={{ height: 200 }} />
  </div>
);

// ============ NAV3 SELECTOR COMPONENT ============

interface Nav3SelectorProps {
  groups: { id: Nav3Group; labelKey: string }[];
  activeGroup: Nav3Group;
  onGroupChange: (group: Nav3Group) => void;
  t: (key: string) => string;
}

const Nav3Selector: React.FC<Nav3SelectorProps> = ({ groups, activeGroup, onGroupChange, t }) => (
  <div className="dom-nav3-selector">
    {groups.map((group) => (
      <button
        key={group.id}
        className={`dom-nav3-group-btn ${activeGroup === group.id ? "active" : ""}`}
        onClick={() => onGroupChange(group.id)}
      >
        {t(group.labelKey)}
      </button>
    ))}
  </div>
);

// ============ COMPOSANT PRINCIPAL ============

export default function DomainsPage() {
  const { t } = useTranslation("web-cloud/domains/index");

  // -------- NAV3 Group State --------
  const [activeNav3, setActiveNav3] = useState<Nav3Group>("general");

  // -------- useLeftPanel Hook --------
  const {
    items: entries,
    loading,
    error,
    selectedId: selectedName,
    selectedItem: selectedEntry,
    setSelectedId: setSelectedName,
    details,
    detailsLoading,
    searchQuery,
    setSearchQuery,
    filterValue: filterType,
    setFilterValue: setFilterType,
    paginatedItems,
    currentPage,
    totalPages,
    setCurrentPage,
    totalItems,
    refresh,
    refreshDetails,
  } = useLeftPanel<DomainEntry, DomainDetails>({
    fetchList: async () => {
      // 2 API calls paralleles (target pattern)
      const [domains, zones] = await Promise.all([
        domainsPageService.listDomains(),
        domainsPageService.listZones(),
      ]);

      const domainSet = new Set(domains);
      const zoneSet = new Set(zones);
      const allNames = new Set([...domains, ...zones]);

      const list: DomainEntry[] = [];

      for (const name of allNames) {
        const hasDomain = domainSet.has(name);
        const hasZone = zoneSet.has(name);
        const extension = name.split(".").pop() || "";

        // Dates simulees (en production: appel API lazy)
        const now = Date.now();
        const expDate = new Date(now + Math.random() * 365 * 24 * 60 * 60 * 1000);
        const daysUntilExp = Math.floor((expDate.getTime() - now) / (24 * 60 * 60 * 1000));

        let status: "active" | "expiring" | "expired" = "active";
        if (daysUntilExp < 0) status = "expired";
        else if (daysUntilExp < 30) status = "expiring";

        list.push({
          name,
          type: hasDomain && hasZone ? "both" : hasDomain ? "domain" : "zone",
          hasDomain,
          hasZone,
          extension: extension.toLowerCase(),
          status,
          expiration: expDate.toLocaleDateString("fr-FR"),
        });
      }

      list.sort((a, b) => a.name.localeCompare(b.name));
      return list;
    },

    fetchDetails: async (name: string) => {
      // Lazy load: 3 appels max on selection
      const [domain, serviceInfos, zone] = await Promise.all([
        domainsPageService.getDomain(name).catch(() => null),
        domainsPageService.getServiceInfos(name).catch(() => null),
        domainsPageService.getZone(name).catch(() => null),
      ]);

      return { domain, serviceInfos, zone };
    },

    getItemId: (entry) => entry.name,

    filterFn: (entry, query, filter) => {
      // Filter by type
      if (filter === "domain" && !entry.hasDomain) return false;
      if (filter === "zone" && (!entry.hasZone || entry.hasDomain)) return false;

      // Filter by search
      if (query.trim()) {
        return entry.name.toLowerCase().includes(query.toLowerCase());
      }
      return true;
    },

    cacheKey: "domains-list",
    cacheTTL: 60000, // 60s
    pageSize: 20,
  });

  // -------- Active Tab --------
  const [activeTab, setActiveTab] = useState<string>("general");

  // -------- Available Tabs for current NAV3 group --------
  const availableTabs = useMemo(() => {
    if (!selectedEntry) return [];
    return ALL_TABS.filter(
      (tab) => tab.group === activeNav3 && tab.condition(selectedEntry)
    );
  }, [selectedEntry, activeNav3]);

  // -------- Reset Tab on Selection or NAV3 change --------
  useEffect(() => {
    if (selectedEntry && availableTabs.length > 0) {
      if (!availableTabs.find((t) => t.id === activeTab)) {
        setActiveTab(availableTabs[0].id);
      }
    }
  }, [selectedEntry, availableTabs, activeTab]);

  // -------- Type Label --------
  const getTypeLabel = useCallback((entry: DomainEntry): string => {
    if (entry.hasDomain && entry.hasZone) return t("type.domainAndZone");
    if (entry.hasDomain) return t("type.domainOnly");
    return t("type.zoneOnly");
  }, [t]);

  // -------- Render Tab Content --------
  const renderTabContent = () => {
    if (!selectedEntry || !details) return null;

    const { domain, serviceInfos, zone } = details;

    switch (activeTab) {
      // GENERAL group
      case "general":
        return <GeneralTab domain={selectedEntry.name} details={domain || undefined} serviceInfos={serviceInfos || undefined} loading={detailsLoading} onRefresh={refreshDetails} onTabChange={setActiveTab} />;
      case "contacts":
        return <ContactsTab domain={selectedEntry.name} serviceInfos={serviceInfos || undefined} />;
      case "alldom":
        return <AlldomTab />;

      // DNS group
      case "dns-info":
        return <DnsInfoTab zoneName={selectedEntry.name} />;
      case "dns-servers":
        return <DnsServersTab domain={selectedEntry.name} />;
      case "zone":
        return <ZoneTab zoneName={selectedEntry.name} />;
      case "dnssec":
        return <DnssecTab domain={selectedEntry.name} />;
      case "spf":
        return <SpfTab zoneName={selectedEntry.name} />;
      case "dkim":
        return <DkimTab zoneName={selectedEntry.name} />;
      case "dmarc":
        return <DmarcTab zoneName={selectedEntry.name} />;
      case "arc":
        return <ArcTab zoneName={selectedEntry.name} />;
      case "bimi":
        return <BimiTab zoneName={selectedEntry.name} />;
      case "caa":
        return <CaaTab zoneName={selectedEntry.name} />;
      case "dynhost":
        return <DynHostTab zoneName={selectedEntry.name} />;

      // EXPERT group
      case "glue":
        return <GlueTab domain={selectedEntry.name} />;
      case "tasks":
        return <TasksTab name={selectedEntry.name} hasDomain={selectedEntry.hasDomain} hasZone={selectedEntry.hasZone} />;

      default:
        return null;
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="dom-page">
      <div className="dom-detail-container">
        {/* ============ LEFT PANEL ============ */}
        <LeftPanel
          items={paginatedItems}
          selectedId={selectedName}
          onSelect={setSelectedName}
          getItemId={(entry) => entry.name}
          renderItem={(entry, isSelected) => (
            <LeftPanelItemContent
              icon="🌐"
              name={entry.name}
              subtitle={getTypeLabel(entry)}
              badge={{
                text: entry.status === "active" ? t("status.active") :
                      entry.status === "expiring" ? t("status.expiring") : t("status.expired"),
                variant: entry.status,
              }}
              extBadge={entry.hasDomain ? entry.extension : undefined}
            />
          )}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={t("actions.searchPlaceholder")}
          filterOptions={FILTER_OPTIONS.map(opt => ({
            value: opt.value,
            label: t(`filter.${opt.value}`) || opt.label,
          }))}
          filterValue={filterType}
          onFilterChange={setFilterType}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showPagination={totalPages > 1}
          loading={loading}
          error={error}
          emptyMessage={t("empty.title")}
          emptyIcon={<GlobeIcon size={32} />}
          itemCount={totalItems}
          itemLabel={t("serviceUnit")}
          // NAV3 Selector
          nav3Groups={NAV3_GROUPS.map(g => ({ id: g.id, label: t(g.labelKey) }))}
          activeNav3={activeNav3}
          onNav3Change={(id) => setActiveNav3(id as Nav3Group)}
        />

        {/* ============ RIGHT PANEL ============ */}
        <div className="dom-main-panel">
          {selectedEntry ? (
            <>
              {/* Header */}
              <div className="dom-panel-header">
                <h2>{selectedEntry.name}</h2>
              </div>

              {/* NAV3: Tabs for current group */}
              <div className="dom-nav3">
                {availableTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`dom-nav3-btn ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {t(tab.labelKey)}
                  </button>
                ))}
              </div>

              {/* Tab Content with Suspense */}
              <div className="dom-tab-content">
                <Suspense fallback={<TabSkeleton />}>
                  {renderTabContent()}
                </Suspense>
              </div>
            </>
          ) : (
            <div className="dom-empty">
              <div className="dom-empty-icon"><GlobeIcon /></div>
              <h3>{t("empty.selectTitle")}</h3>
              <p>{t("empty.selectDescription")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
