// ============================================================
// HOSTING PAGE - Layout complet avec sidebar + NAV2 + NAV3
// ============================================================

import React, { useState, useEffect, useCallback, useMemo, Suspense, startTransition } from "react";
import { useTranslation } from "react-i18next";
import { generalService } from "./general/general/GeneralTab.service";
import type { Hosting } from "./hosting.types";
// Nav2Bar est dans le parent
import "./styles.css";

// ---------- LAZY LOADED TABS ----------
const TAB_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  // NAV3: [Général]
  general: React.lazy(() => import("./general/general")),
  statistics: React.lazy(() => import("./general/statistics")),
  indy: React.lazy(() => import("./general/indy")),
  offer: React.lazy(() => import("./general/offer")),
  modules: React.lazy(() => import("./general/modules")),
  logs: React.lazy(() => import("./general/logs")),
  localseo: React.lazy(() => import("./general/seo")),
  // NAV3: [Sites]
  multisite: React.lazy(() => import("./sites/multisite")),
  ssl: React.lazy(() => import("./sites/ssl")),
  // NAV3: [Expert]
  ftp: React.lazy(() => import("./expert/ftp")),
  database: React.lazy(() => import("./expert/database")),
  clouddb: React.lazy(() => import("./expert/clouddb")),
  cdn: React.lazy(() => import("./expert/cdn")),
  boost: React.lazy(() => import("./expert/boost")),
  emails: React.lazy(() => import("./expert/emails")),
  envvars: React.lazy(() => import("./expert/envvars")),
  runtimes: React.lazy(() => import("./expert/runtimes")),
  cron: React.lazy(() => import("./expert/cron")),
  tasks: React.lazy(() => import("./expert/tasks")),
};

// ---------- TAB DEFINITIONS (NAV3/NAV4) ----------
const TABS = [
  // NAV3: [Général]
  { id: "general", label: "Home", group: "general" },
  { id: "statistics", label: "Statistiques", group: "general" },
  { id: "indy", label: "Indy", group: "general" },
  { id: "offer", label: "Offre", group: "general" },
  { id: "modules", label: "Modules", group: "general" },
  { id: "logs", label: "Logs", group: "general" },
  { id: "localseo", label: "SEO", group: "general" },
  // NAV3: [Sites]
  { id: "multisite", label: "Multisite", group: "sites" },
  { id: "ssl", label: "SSL", group: "sites" },
  // NAV3: [Expert]
  { id: "ftp", label: "FTP-SSH", group: "expert" },
  { id: "database", label: "BDD", group: "expert" },
  { id: "clouddb", label: "BDD Cloud", group: "expert" },
  { id: "cdn", label: "CDN", group: "expert" },
  { id: "boost", label: "Boost", group: "expert" },
  { id: "emails", label: "Emails", group: "expert" },
  { id: "envvars", label: "Variables", group: "expert" },
  { id: "runtimes", label: "Runtimes", group: "expert" },
  { id: "cron", label: "Cron", group: "expert" },
  { id: "tasks", label: "Tâches", group: "expert" },
];

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
  const [activeTab, setActiveTab] = useState("general");
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

    const TabComponent = TAB_COMPONENTS[activeTab];
    if (!TabComponent) return <div className="hosting-tab-error">Tab "{activeTab}" not found</div>;

    return (
      <Suspense fallback={<div className="hosting-tab-loading">Chargement...</div>}>
        <TabComponent
          serviceName={selected.serviceName}
          details={selected}
          onTabChange={setActiveTab}
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

              {/* NAV3 Tabs */}
              <div className="hosting-tabs">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    className={`hosting-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => { console.log('[Hosting] Tab: changement', { tabId: tab.id, tabLabel: tab.label, group: tab.group }); setActiveTab(tab.id); }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

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
