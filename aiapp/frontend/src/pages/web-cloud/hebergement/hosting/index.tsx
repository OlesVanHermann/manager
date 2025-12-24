// ============================================================
// HOSTING PAGE - Layout complet avec sidebar + NAV2 + NAV3
// ============================================================

import React, { useState, useEffect, useCallback, useMemo, Suspense, startTransition } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { hostingService, Hosting } from "../../../../services/web-cloud.hosting";
// Nav2Bar est dans le parent
import "./styles.css";

// ---------- LAZY LOADED TABS ----------
const TAB_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  general: React.lazy(() => import("./tabs/general")),
  multisite: React.lazy(() => import("./tabs/multisite")),
  ftp: React.lazy(() => import("./tabs/ftp")),
  database: React.lazy(() => import("./tabs/database")),
  modules: React.lazy(() => import("./tabs/modules")),
  cron: React.lazy(() => import("./tabs/cron")),
  envvars: React.lazy(() => import("./tabs/envvars")),
  runtimes: React.lazy(() => import("./tabs/runtimes")),
  ssl: React.lazy(() => import("./tabs/ssl")),
  cdn: React.lazy(() => import("./tabs/cdn")),
  boost: React.lazy(() => import("./tabs/boost")),
  localseo: React.lazy(() => import("./tabs/localseo")),
  emails: React.lazy(() => import("./tabs/emails")),
  logs: React.lazy(() => import("./tabs/logs")),
  tasks: React.lazy(() => import("./tabs/tasks")),
};

// ---------- TAB DEFINITIONS (NAV3) ----------
const TABS = [
  { id: "general", label: "Home" },
  { id: "multisite", label: "Multisite" },
  { id: "ftp", label: "FTP-SSH" },
  { id: "modules", label: "Modules" },
  { id: "tasks", label: "Tâches" },
  { id: "emails", label: "Emails" },
  { id: "envvars", label: "Variables" },
  { id: "runtimes", label: "Runtimes" },
  { id: "ssl", label: "SSL" },
  { id: "cdn", label: "CDN" },
  { id: "boost", label: "Boost" },
  { id: "logs", label: "Logs" },
  { id: "database", label: "BDD" },
  { id: "clouddb", label: "BDD Cloud" },
  { id: "cron", label: "Cron" },
  { id: "localseo", label: "SEO" },
];

// ============================================================
// CLOUD DB TAB (inline pour l'instant)
// ============================================================
function CloudDbTab() {
  const navigate = useNavigate();
  return (
    <div className="clouddb-tab">
      <div className="info-bloc">
        <h3 className="bloc-title">Web Cloud Databases</h3>
        <p style={{ color: "#6B7280", marginBottom: "16px" }}>
          Gérez vos bases de données cloud privées (MySQL, PostgreSQL, MariaDB, Redis).
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate("/web-cloud/private-database")}
        >
          Accéder aux Cloud Databases
        </button>
      </div>
    </div>
  );
}

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
        const names = await hostingService.listHostings();
        const data = await Promise.all(names.map(n => hostingService.getHosting(n)));
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
    hostingService.listAttachedDomains(selectedId)
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
      const data = await hostingService.getHosting(selectedId);
      setHostings(prev => prev.map(h => h.serviceName === selectedId ? data : h));
      const domains = await hostingService.listAttachedDomains(selectedId);
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
    
    // Special case: CloudDB tab
    if (activeTab === "clouddb") {
      return <CloudDbTab />;
    }
    
    const TabComponent = TAB_COMPONENTS[activeTab];
    if (!TabComponent) return <div className="tab-error">Tab "{activeTab}" not found</div>;

    return (
      <Suspense fallback={<div className="tab-loading">Chargement...</div>}>
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
      <span className={`service-status-badge ${isActive ? "active" : "suspended"}`}>
        {isActive ? "Actif" : "Suspendu"}
      </span>
    );
  };

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="hosting-page">
        <div className="hosting-split">
          <div className="service-list-sidebar">
            <div className="sidebar-search">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Rechercher..." disabled />
              </div>
            </div>
            <div className="empty-state"><p>Chargement...</p></div>
          </div>
          <div className="hosting-main">
            <div className="empty-state"><p>Chargement...</p></div>
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
          <div className="service-list-sidebar" />
          <div className="hosting-main">
            <div className="empty-state" style={{ color: "#991B1B" }}>{error}</div>
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
        <div className="service-list-sidebar">
          {/* Search */}
          <div className="sidebar-search">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
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
          <div className="sidebar-filter">
            <span className="filter-dropdown">Filtrer ▾</span>
            <span className="service-count">{filteredServices.length} services</span>
          </div>

          {/* List */}
          <div className="service-items">
            {paginatedServices.length === 0 ? (
              <div className="empty-state"><p>Aucun hébergement</p></div>
            ) : (
              paginatedServices.map((h) => (
                <div
                  key={h.serviceName}
                  className={`service-item ${selectedId === h.serviceName ? "selected" : ""}`}
                  onClick={() => handleSelectService(h.serviceName)}
                >
                  <div className="service-icon">🌐</div>
                  <div className="service-info">
                    <div className="service-item-name">{h.displayName || h.serviceName}</div>
                    <div className="service-item-type">{h.offer || "Hébergement"}</div>
                  </div>
                  {renderStatus(h.state)}
                </div>
              ))
            )}
          </div>

          {/* Pagination - TOUJOURS VISIBLE si > 1 page */}
          {totalPages > 1 && (
            <div className="sidebar-pagination">
              <span className="pagination-info">Page {currentPage}/{totalPages}</span>
              <div className="pagination-buttons">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                      className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >›</button>
              </div>
            </div>
          )}
        </div>

        {/* ========== MAIN CONTENT ========== */}
        <div className="hosting-main">
          {selected ? (
            <div className="service-detail">
              {/* Header: Nom + aliases */}
              <div className="detail-header-domains">
                <h2>{selected.displayName || selected.serviceName}</h2>
                {multisitesText && (
                  <span className="multisites-list" title={attachedDomains.join(", ")}>
                    {multisitesText}
                  </span>
                )}
              </div>

              {/* NAV3 Tabs */}
              <div className="detail-header-tabs">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {renderTabContent()}
              </div>
            </div>
          ) : (
            <div className="hosting-empty">
              <div className="empty-icon">🌐</div>
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
