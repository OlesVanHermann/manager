// ============================================================
// HOSTING SIDEBAR - Composant ISOLÉ (ne re-render pas sur sélection)
// Fetch UNE SEULE FOIS au mount, utilise URL pour highlight
// ============================================================

import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { generalService } from "./general/general/GeneralTab.service";
import type { Hosting } from "./hosting.types";

// ============================================================
// INNER COMPONENT
// ============================================================

function HostingSidebarInner() {
  const { serviceName } = useParams<{ serviceName?: string }>();
  
  // State local - fetch UNE SEULE FOIS
  const [hostings, setHostings] = useState<Hosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch au mount UNIQUEMENT
  useEffect(() => {
    let mounted = true;
    
    const load = async () => {
      try {
        const names = await generalService.listHostings();
        const data = await Promise.all(names.map(n => generalService.getHosting(n)));
        if (mounted) {
          setHostings(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) setLoading(false);
      }
    };
    
    load();
    return () => { mounted = false; };
  }, []); // ← AUCUNE dépendance = fetch une seule fois

  // Filtrage
  const filteredServices = useMemo(() => {
    if (!searchQuery) return hostings;
    const q = searchQuery.toLowerCase();
    return hostings.filter(h => 
      h.serviceName.toLowerCase().includes(q) || 
      (h.displayName || "").toLowerCase().includes(q)
    );
  }, [hostings, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Status badge
  const renderStatus = (state: string) => {
    const isActive = state === "active";
    return (
      <span className={`service-status-badge ${isActive ? "active" : "suspended"}`}>
        {isActive ? "Actif" : "Suspendu"}
      </span>
    );
  };

  // ---------- RENDER ----------
  return (
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
        <span className="filter-dropdown">Filtrer par statut ▾</span>
        <span className="service-count">{filteredServices.length} services</span>
      </div>

      {/* List */}
      <div className="service-items">
        {loading ? (
          <div className="empty-state"><p>Chargement...</p></div>
        ) : paginatedServices.length === 0 ? (
          <div className="empty-state"><p>Aucun hébergement</p></div>
        ) : (
          paginatedServices.map((h) => (
            <Link
              key={h.serviceName}
              to={`/web-cloud/hosting/${h.serviceName}`}
              className={`service-item ${serviceName === h.serviceName ? "selected" : ""}`}
              onClick={() => console.log('[HostingSidebar] Sélection', { serviceName: h.serviceName, displayName: h.displayName })}
            >
              <div className="service-icon">🌐</div>
              <div className="service-info">
                <div className="service-item-name">{h.displayName || h.serviceName}</div>
                <div className="service-item-type">{h.offer || "Hébergement"}</div>
              </div>
              {renderStatus(h.state)}
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="sidebar-pagination">
          <span className="pagination-info">Page {currentPage}/{totalPages}</span>
          <div className="pagination-buttons">
            <button
              className="pagination-btn"
              onClick={() => { console.log('[HostingSidebar] Page précédente'); setCurrentPage(p => Math.max(1, p - 1)); }}
              disabled={currentPage === 1}
            >‹</button>
            {[...Array(Math.min(3, totalPages))].map((_, i) => {
              const page = currentPage <= 2 ? i + 1 : currentPage - 1 + i;
              if (page > totalPages) return null;
              return (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => { console.log('[HostingSidebar] Page', { page }); setCurrentPage(page); }}
                >{page}</button>
              );
            })}
            <button
              className="pagination-btn"
              onClick={() => { console.log('[HostingSidebar] Page suivante'); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
              disabled={currentPage === totalPages}
            >›</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrap avec React.memo - empêche TOUT re-render du parent
export const HostingSidebar = React.memo(HostingSidebarInner);
export default HostingSidebar;
