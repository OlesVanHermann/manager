// ============================================================
// SERVICE LIST PAGE - Layout avec NAV2 + Left Panel + Right Panel
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import type { ServiceListPageProps } from "./types";
import "../styles.css";

// NAV2 Items
const NAV2_ITEMS = [
  { id: "home", path: "/web-cloud", label: "Accueil", exact: true },
  { id: "domains", path: "/web-cloud/domains", label: "Domaines & DNS" },
  { id: "hosting", path: "/web-cloud/hosting", label: "Hebergement" },
  { id: "emails", path: "/web-cloud/emails", label: "Emails & Collab" },
  { id: "voip", path: "/web-cloud/voip", label: "VoIP" },
  { id: "access", path: "/web-cloud/access", label: "Acces" },
];

interface ServiceWithStatus {
  id: string;
  name: string;
  type?: string;
  status?: "active" | "expired" | "suspended";
}

/** Composant générique avec NAV2 + liste services + panneau détail. */
export function ServiceListPage({
  titleKey,
  descriptionKey,
  guidesUrl,
  i18nNamespace,
  services,
  loading,
  error,
  selectedService,
  onSelectService,
  emptyIcon,
  emptyTitleKey,
  emptyDescriptionKey,
  children,
}: ServiceListPageProps) {
  const { t } = useTranslation(i18nNamespace);
  const { t: tCommon } = useTranslation("common");
  const location = useLocation();
  const navigate = useNavigate();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Determine active NAV2 item
  const activeNav2 = useMemo(() => {
    for (const item of NAV2_ITEMS) {
      if (item.exact && location.pathname === item.path) return item.id;
      if (!item.exact && location.pathname.startsWith(item.path)) return item.id;
    }
    return "home";
  }, [location.pathname]);

  // Filter and paginate services
  const filteredServices = useMemo(() => {
    let result = services as ServiceWithStatus[];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.id.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== "all") {
      result = result.filter(s => s.status === statusFilter);
    }
    
    return result;
  }, [services, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Status badge renderer
  const renderStatusBadge = (status?: string) => {
    const statusClass = status || "active";
    const statusLabel = status === "expired" ? "Expiré" : status === "suspended" ? "Suspendu" : "Actif";
    return <span className={`service-status-badge ${statusClass}`}>{statusLabel}</span>;
  };

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="service-list-page">
        <Nav2Bar activeId={activeNav2} guidesUrl={guidesUrl} />
        <div className="service-list-content">
          <div className="service-list-sidebar">
            <div className="sidebar-search">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Rechercher..." disabled />
              </div>
            </div>
            <div className="empty-state">
              <p>{tCommon("loading")}</p>
            </div>
          </div>
          <div className="service-list-main">
            <div className="empty-state">
              <p>{tCommon("loading")}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- RENDER ERROR ----------
  if (error) {
    return (
      <div className="service-list-page">
        <Nav2Bar activeId={activeNav2} guidesUrl={guidesUrl} />
        <div className="service-list-content">
          <div className="service-list-sidebar" />
          <div className="service-list-main">
            <div className="empty-state">
              <p style={{ color: "#991B1B" }}>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- RENDER EMPTY ----------
  if (services.length === 0) {
    return (
      <div className="service-list-page">
        <Nav2Bar activeId={activeNav2} guidesUrl={guidesUrl} />
        <div className="service-list-content">
          <div className="service-list-sidebar">
            <div className="sidebar-search">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Rechercher..." disabled />
              </div>
            </div>
            <div className="sidebar-filter">
              <span className="filter-dropdown">Filtrer par statut ▾</span>
              <span className="service-count">0 services</span>
            </div>
          </div>
          <div className="service-list-main">
            <div className="empty-state">
              {emptyIcon && <div style={{ fontSize: "3rem", marginBottom: "16px" }}>{emptyIcon}</div>}
              <h3>{t(emptyTitleKey)}</h3>
              <p>{t(emptyDescriptionKey)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- RENDER LIST ----------
  return (
    <div className="service-list-page">
      <Nav2Bar activeId={activeNav2} guidesUrl={guidesUrl} />
      
      <div className="service-list-content">
        {/* LEFT PANEL */}
        <div className="service-list-sidebar">
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
          
          <div className="sidebar-filter">
            <span className="filter-dropdown">Filtrer par statut ▾</span>
            <span className="service-count">{filteredServices.length} services</span>
          </div>
          
          <div className="service-items">
            {paginatedServices.map((service) => (
              <div
                key={service.id}
                className={`service-item ${selectedService === service.id ? "selected" : ""}`}
                onClick={() => onSelectService(service.id)}
              >
                <div className="service-icon">🌐</div>
                <div className="service-info">
                  <div className="service-item-name">{service.name}</div>
                  {service.type && <div className="service-item-type">{service.type}</div>}
                </div>
                {renderStatusBadge((service as ServiceWithStatus).status)}
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="sidebar-pagination">
              <span className="pagination-info">Page {currentPage}/{totalPages}</span>
              <div className="pagination-buttons">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  const page = currentPage <= 2 ? i + 1 : currentPage - 1 + i;
                  if (page > totalPages) return null;
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
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="service-list-main">
          {selectedService ? children : (
            <div className="empty-state">
              {emptyIcon && <div style={{ fontSize: "3rem", marginBottom: "16px" }}>{emptyIcon}</div>}
              <h3>{t(emptyTitleKey)}</h3>
              <p>{t(emptyDescriptionKey)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// NAV2 Component
function Nav2Bar({ activeId, guidesUrl }: { activeId: string; guidesUrl?: string }) {
  const navigate = useNavigate();
  
  return (
    <div className="nav2-bar">
      <div className="nav2-items">
        {NAV2_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`nav2-item ${activeId === item.id ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </div>
        ))}
      </div>
      {guidesUrl && (
        <a href={guidesUrl} target="_blank" rel="noopener noreferrer" className="nav2-guides">
          📖 Guides
        </a>
      )}
    </div>
  );
}
