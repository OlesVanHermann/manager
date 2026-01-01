// ============================================================
// HOSTING PAGE - Layout complet avec sidebar + NAV2 + NAV3 + NAV4 + NAV5
// ============================================================
// NAV3: [Général] [Sites] [Offre] [Expert] (4 groupes)
// - [Général] 5 tabs: General, Statistiques, Logs(+NAV5), Modules, SEO
// - [Sites] 5 tabs: Multisite, SSL, FTP-SSH, BDD(+NAV5), CDN(+NAV5)
// - [Offre] 4 tabs: Offre, Changement, Migration, Résiliation
// - [Expert] 10 tabs: General, Boost, Indy, Emails, Variables, OvhConfig, Runtimes, Cron, Tâches, CloudDb
// ============================================================

import React, { useState, useEffect, useCallback, useMemo, Suspense, startTransition } from "react";
import { useTranslation } from "react-i18next";
import { generalService } from "./general/general/GeneralTab.service";
import type { Hosting } from "./hosting.types";
// Nav2Bar est dans le parent
import "./styles.css";

// ---------- LAZY LOADED COMPONENTS (par NAV5 ou NAV4 sans NAV5) ----------
const TAB_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  // ========== NAV3: [Général] - 5 tabs ==========
  "general": React.lazy(() => import("./general/general")),
  "statistics": React.lazy(() => import("./general/statistics")),
  // NAV4: Logs → NAV5 (2 sous-tabs)
  "logs.ovh": React.lazy(() => import("./general/logs")),
  "logs.user": React.lazy(() => import("./general/logs")), // TODO: créer UserLogsTab
  "modules": React.lazy(() => import("./general/modules")),
  "localseo": React.lazy(() => import("./general/seo")),

  // ========== NAV3: [Sites] - 5 tabs ==========
  "multisite": React.lazy(() => import("./sites/multisite")),
  "ssl": React.lazy(() => import("./sites/ssl")),
  "ftp": React.lazy(() => import("./expert/ftp")),
  // NAV4: BDD → NAV5 (3 sous-tabs)
  "database.list": React.lazy(() => import("./expert/database")),
  "database.statistics": React.lazy(() => import("./expert/database")), // TODO: créer DatabaseStatsTab
  "database.dumps": React.lazy(() => import("./expert/database")), // TODO: créer DatabaseDumpsTab
  // NAV4: CDN → NAV5 (2 sous-tabs)
  "cdn.status": React.lazy(() => import("./expert/cdn")),
  "cdn.settings": React.lazy(() => import("./expert/cdn")), // TODO: créer CdnSettingsTab

  // ========== NAV3: [Offre] - 4 tabs ==========
  "offer": React.lazy(() => import("./general/offer")),
  "change": React.lazy(() => import("./general/offer")), // TODO: créer ChangeTab
  "migration": React.lazy(() => import("./general/migration")),
  "terminate": React.lazy(() => import("./general/terminate")),

  // ========== NAV3: [Expert] - 10 tabs ==========
  "expert-general": React.lazy(() => import("./general/general")), // TODO: créer ExpertGeneralTab
  "boost": React.lazy(() => import("./expert/boost")),
  "indy": React.lazy(() => import("./general/indy")),
  "emails": React.lazy(() => import("./expert/emails")),
  "envvars": React.lazy(() => import("./expert/envvars")),
  "ovhconfig": React.lazy(() => import("./general/ovhconfig")),
  "runtimes": React.lazy(() => import("./expert/runtimes")),
  "cron": React.lazy(() => import("./expert/cron")),
  "tasks": React.lazy(() => import("./expert/tasks")),
  "clouddb": React.lazy(() => import("./expert/clouddb")),
};

// ---------- NAV3 GROUPS (4 groupes) ----------
const NAV3_GROUPS = [
  { id: "general", label: "Général" },
  { id: "sites", label: "Sites" },
  { id: "offer", label: "Offre" },
  { id: "expert", label: "Expert" },
];

// ---------- NAV4 DEFINITIONS (par groupe NAV3) ----------
type Nav4Tab = {
  id: string;
  label: string;
  group: string;
  type?: "tab" | "nav3link";
  hasNav5?: boolean;  // true si ce NAV4 a des sous-tabs NAV5
};

const NAV4_TABS: Nav4Tab[] = [
  // NAV3: [Général] - 5 tabs
  { id: "general", label: "General", group: "general" },
  { id: "statistics", label: "Statistiques", group: "general" },
  { id: "logs", label: "Logs", group: "general", hasNav5: true },
  { id: "modules", label: "Modules", group: "general" },
  { id: "localseo", label: "SEO", group: "general" },

  // NAV3: [Sites] - 5 tabs
  { id: "multisite", label: "Multisite", group: "sites" },
  { id: "ssl", label: "SSL", group: "sites" },
  { id: "ftp", label: "FTP-SSH", group: "sites" },
  { id: "database", label: "BDD", group: "sites", hasNav5: true },
  { id: "cdn", label: "CDN", group: "sites", hasNav5: true },

  // NAV3: [Offre] - 4 tabs
  { id: "offer", label: "Offre", group: "offer" },
  { id: "change", label: "Changement", group: "offer" },
  { id: "migration", label: "Migration", group: "offer" },
  { id: "terminate", label: "Résiliation", group: "offer" },

  // NAV3: [Expert] - 10 tabs
  { id: "expert-general", label: "General", group: "expert" },
  { id: "boost", label: "Boost", group: "expert" },
  { id: "indy", label: "Indy", group: "expert" },
  { id: "emails", label: "Emails", group: "expert" },
  { id: "envvars", label: "Variables", group: "expert" },
  { id: "ovhconfig", label: "OvhConfig", group: "expert" },
  { id: "runtimes", label: "Runtimes", group: "expert" },
  { id: "cron", label: "Cron", group: "expert" },
  { id: "tasks", label: "Tâches", group: "expert" },
  { id: "clouddb", label: "CloudDb", group: "expert" },
];

// ---------- NAV5 DEFINITIONS (sous-tabs par NAV4) ----------
type Nav5Tab = { id: string; label: string; nav4: string; componentKey: string };

const NAV5_TABS: Nav5Tab[] = [
  // NAV4: Logs → 2 NAV5 (NAV3: [Général])
  { id: "ovh", label: "Logs OVH", nav4: "logs", componentKey: "logs.ovh" },
  { id: "user", label: "User Logs", nav4: "logs", componentKey: "logs.user" },
  // NAV4: BDD → 3 NAV5 (NAV3: [Sites])
  { id: "list", label: "Liste", nav4: "database", componentKey: "database.list" },
  { id: "statistics", label: "Statistiques", nav4: "database", componentKey: "database.statistics" },
  { id: "dumps", label: "Dumps", nav4: "database", componentKey: "database.dumps" },
  // NAV4: CDN → 2 NAV5 (NAV3: [Sites])
  { id: "status", label: "État", nav4: "cdn", componentKey: "cdn.status" },
  { id: "settings", label: "Paramètres", nav4: "cdn", componentKey: "cdn.settings" },
];

// Helper: obtenir le premier NAV5 d'un NAV4
const getDefaultNav5 = (nav4Id: string): string | null => {
  const firstNav5 = NAV5_TABS.find(t => t.nav4 === nav4Id);
  return firstNav5?.id || null;
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export function HostingPage() {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting");

  // ---------- STATE ----------
  const [hostings, setHostings] = useState<Hosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeNav3, setActiveNav3] = useState("general");
  const [activeNav4, setActiveNav4] = useState("general"); // Premier tab de [Général]
  const [activeNav5, setActiveNav5] = useState<string | null>(null); // NAV5 actif (null si pas de NAV5)
  const [attachedDomains, setAttachedDomains] = useState<string[]>([]);

  // Sidebar state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ---------- LOAD SERVICES (une seule fois au mount) ----------
  useEffect(() => {
    let mounted = true;
    
    const load = async () => {
      try {
        setLoading(true);
        const names = await generalService.listHostings();
        const data = await Promise.all(names.map(n => generalService.getHosting(n)));
        if (mounted) {
          setHostings(data);
          if (data.length > 0) {
            setSelectedId(data[0].serviceName);
          }
        }
      } catch (err) {
        if (mounted) setError(String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    load();
    return () => { mounted = false; };
  }, []);

  // ---------- LOAD ATTACHED DOMAINS ----------
  useEffect(() => {
    if (!selectedId) return;
    generalService.listAttachedDomains(selectedId)
      .then(setAttachedDomains)
      .catch(() => setAttachedDomains([]));
  }, [selectedId]);

  // ---------- HANDLERS ----------
  const handleSelectService = useCallback((id: string) => {
    startTransition(() => {
      setSelectedId(id);
    });
  }, []);

  const handleRefresh = useCallback(async () => {
    if (!selectedId) return;
    try {
      const data = await generalService.getHosting(selectedId);
      setHostings(prev => prev.map(h => h.serviceName === selectedId ? data : h));
      const domains = await generalService.listAttachedDomains(selectedId);
      setAttachedDomains(domains);
    } catch {}
  }, [selectedId]);

  // ---------- NAV3 CHANGE HANDLER ----------
  const handleNav3Change = useCallback((groupId: string) => {
    setActiveNav3(groupId);
    // Auto-sélectionner le premier tab du nouveau groupe (pas un nav3link)
    const firstTab = NAV4_TABS.find(t => t.group === groupId && t.type !== "nav3link");
    if (firstTab) {
      setActiveNav4(firstTab.id);
      // Si ce NAV4 a des NAV5, sélectionner le premier
      const defaultNav5 = getDefaultNav5(firstTab.id);
      setActiveNav5(defaultNav5);
    }
  }, []);

  // ---------- NAV4 CHANGE HANDLER ----------
  const handleNav4Change = useCallback((nav4Id: string) => {
    console.log('[Hosting] NAV4: changement', { nav4Id });
    setActiveNav4(nav4Id);
    // Si ce NAV4 a des NAV5, sélectionner le premier
    const defaultNav5 = getDefaultNav5(nav4Id);
    setActiveNav5(defaultNav5);
  }, []);

  // ---------- NAV5 CHANGE HANDLER ----------
  const handleNav5Change = useCallback((nav5Id: string) => {
    console.log('[Hosting] NAV5: changement', { nav5Id, nav4: activeNav4 });
    setActiveNav5(nav5Id);
  }, [activeNav4]);

  // ---------- FILTERED NAV4 TABS (par NAV3 actif) ----------
  const filteredNav4Tabs = useMemo(() => {
    return NAV4_TABS.filter(tab => tab.group === activeNav3);
  }, [activeNav3]);

  // ---------- FILTERED NAV5 TABS (par NAV4 actif) ----------
  const filteredNav5Tabs = useMemo(() => {
    return NAV5_TABS.filter(tab => tab.nav4 === activeNav4);
  }, [activeNav4]);

  // ---------- CURRENT NAV4 INFO ----------
  const currentNav4 = useMemo(() => {
    return NAV4_TABS.find(t => t.id === activeNav4 && t.group === activeNav3);
  }, [activeNav4, activeNav3]);

  // ---------- FILTERING & PAGINATION ----------
  const filteredServices = useMemo(() => {
    if (!searchQuery) return hostings;
    const q = searchQuery.toLowerCase();
    return hostings.filter(h => 
      h.serviceName.toLowerCase().includes(q) || 
      (h.displayName || "").toLowerCase().includes(q)
    );
  }, [hostings, searchQuery]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ---------- COMPUTED ----------
  const selected = useMemo(() => {
    return hostings.find(h => h.serviceName === selectedId) || null;
  }, [hostings, selectedId]);

  const formatMultisites = (domains: string[], mainDomain: string) => {
    const others = domains.filter(d => d !== mainDomain && d !== `www.${mainDomain}`);
    if (others.length === 0) return null;
    if (others.length <= 3) return `(${others.join(", ")})`;
    return `(${others.slice(0, 2).join(", ")} +${others.length - 2})`;
  };

  // ---------- RENDER TAB CONTENT ----------
  const renderTabContent = () => {
    if (!selected) return null;

    // Déterminer la clé du composant à charger
    let componentKey: string;
    if (currentNav4?.hasNav5 && activeNav5) {
      // NAV4 avec NAV5: utiliser la clé composée nav4.nav5
      const nav5Tab = NAV5_TABS.find(t => t.nav4 === activeNav4 && t.id === activeNav5);
      componentKey = nav5Tab?.componentKey || activeNav4;
    } else {
      // NAV4 sans NAV5: utiliser directement l'id du NAV4
      componentKey = activeNav4;
    }

    const TabComponent = TAB_COMPONENTS[componentKey];
    if (!TabComponent) {
      return <div className="hosting-tab-error">Tab "{componentKey}" not found</div>;
    }

    return (
      <Suspense fallback={<div className="hosting-tab-loading">Chargement...</div>}>
        <TabComponent
          serviceName={selected.serviceName}
          details={selected}
          onTabChange={handleNav4Change}
          onNav5Change={handleNav5Change}
          activeNav5={activeNav5}
          onRefresh={handleRefresh}
        />
      </Suspense>
    );
  };

  // ---------- RENDER STATUS BADGE ----------
  const renderStatus = (state: string) => {
    const isActive = state === "active";
    return (
      <span className={`hosting-status-badge ${isActive ? "active" : "suspended"}`}>
        {isActive ? "Actif" : "Suspendu"}
      </span>
    );
  };

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="hosting-page">
        <div className="hosting-split">
          <div className="hosting-sidebar">
            {/* NAV3 Selector (disabled during loading) */}
            <div className="hosting-nav3-selector">
              {NAV3_GROUPS.map(group => (
                <button
                  key={group.id}
                  className={`hosting-nav3-btn ${group.id === "general" ? 'active' : ''}`}
                  disabled
                >
                  {group.label}
                </button>
              ))}
            </div>
            <div className="hosting-sidebar-search">
              <div className="hosting-search-wrapper">
                <span className="hosting-search-icon">🔍</span>
                <input type="text" placeholder="Rechercher..." disabled />
              </div>
            </div>
            <div className="hosting-empty-state"><p>Chargement...</p></div>
          </div>
          <div className="hosting-main">
            <div className="hosting-empty-state"><p>Chargement...</p></div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- RENDER ERROR ----------
  if (error) {
    return (
      <div className="hosting-page">
        <div className="hosting-split">
          <div className="hosting-sidebar" />
          <div className="hosting-main">
            <div className="hosting-empty-state" style={{ color: "#991B1B" }}>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  const multisitesText = selected ? formatMultisites(attachedDomains, selected.serviceName) : null;

  // ---------- RENDER ----------
  return (
    <div className="hosting-page">
      {/* NAV2 */}

      <div className="hosting-split">
        {/* ========== SIDEBAR ========== */}
        <div className="hosting-sidebar">
          {/* NAV3 Selector */}
          <div className="hosting-nav3-selector">
            {NAV3_GROUPS.map(group => (
              <button
                key={group.id}
                className={`hosting-nav3-btn ${activeNav3 === group.id ? 'active' : ''}`}
                onClick={() => handleNav3Change(group.id)}
              >
                {group.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="hosting-sidebar-search">
            <div className="hosting-search-wrapper">
              <span className="hosting-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Filter info */}
          <div className="hosting-sidebar-filter">
            <span className="hosting-filter-dropdown">Filtrer ▾</span>
            <span className="hosting-service-count">{filteredServices.length} services</span>
          </div>

          {/* List */}
          <div className="hosting-service-items">
            {paginatedServices.length === 0 ? (
              <div className="hosting-empty-state"><p>Aucun hébergement</p></div>
            ) : (
              paginatedServices.map((h) => (
                <div
                  key={h.serviceName}
                  className={`hosting-service-item ${selectedId === h.serviceName ? "selected" : ""}`}
                  onClick={() => handleSelectService(h.serviceName)}
                >
                  <div className="hosting-service-icon">🌐</div>
                  <div className="hosting-service-info">
                    <div className="hosting-service-name">{h.displayName || h.serviceName}</div>
                    <div className="hosting-service-type">{h.offer || "Hébergement"}</div>
                  </div>
                  {renderStatus(h.state)}
                </div>
              ))
            )}
          </div>

          {/* Pagination - TOUJOURS VISIBLE si > 1 page */}
          {totalPages > 1 && (
            <div className="hosting-sidebar-pagination">
              <span className="hosting-pagination-info">Page {currentPage}/{totalPages}</span>
              <div className="hosting-pagination-buttons">
                <button
                  className="hosting-pagination-btn"
                  onClick={() => { console.log('[Hosting] Sidebar: page précédente'); setCurrentPage(p => Math.max(1, p - 1)); }}
                  disabled={currentPage === 1}
                >‹</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      className={`hosting-pagination-btn ${currentPage === page ? "active" : ""}`}
                      onClick={() => { console.log('[Hosting] Sidebar: page', { page }); setCurrentPage(page); }}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  className="hosting-pagination-btn"
                  onClick={() => { console.log('[Hosting] Sidebar: page suivante'); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                  disabled={currentPage === totalPages}
                >›</button>
              </div>
            </div>
          )}
        </div>

        {/* ========== MAIN CONTENT ========== */}
        <div className="hosting-main">
          {selected ? (
            <div className="hosting-detail">
              {/* Header: Nom + aliases */}
              <div className="hosting-detail-header">
                <h2>{selected.displayName || selected.serviceName}</h2>
                {multisitesText && (
                  <span className="hosting-multisites-list" title={attachedDomains.join(", ")}>
                    {multisitesText}
                  </span>
                )}
              </div>

              {/* NAV4 Tabs (filtrés par NAV3) */}
              <div className="hosting-tabs">
                {filteredNav4Tabs.map(tab => (
                  <button
                    key={`${tab.group}-${tab.id}`}
                    className={`hosting-tab-btn ${activeNav4 === tab.id ? 'active' : ''}`}
                    onClick={() => handleNav4Change(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* NAV5 Sub-tabs (si le NAV4 actif a des sous-tabs) */}
              {currentNav4?.hasNav5 && filteredNav5Tabs.length > 0 && (
                <div className="hosting-nav5-tabs">
                  {filteredNav5Tabs.map((tab, index) => (
                    <button
                      key={tab.id}
                      className={`hosting-nav5-btn ${activeNav5 === tab.id ? 'active' : ''}`}
                      onClick={() => handleNav5Change(tab.id)}
                    >
                      {index === 0 && activeNav5 === tab.id ? `[${tab.label}]` : tab.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Tab Content */}
              <div className="hosting-tab-content">
                {renderTabContent()}
              </div>
            </div>
          ) : (
            <div className="hosting-empty">
              <div className="hosting-empty-icon">🌐</div>
              <h3>Sélectionnez un hébergement</h3>
              <p>Choisissez un service dans la liste pour voir ses détails.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HostingPage;
