// ============================================================
// SIDEBAR - New Manager OVHcloud
// Layout: Header → Search → Liste (TOUS + ressources) → Pagination
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { icons, Resource } from "./navigationTree";
import "./styles.css";

interface SidebarProps {
  resources: Resource[];
  selectedResourceId?: string;
  onResourceSelect: (resource: Resource | null) => void;
  onHomeClick: () => void;
}

type ViewMode = "list" | "grid";

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const path = icons[name];
  if (!path) return null;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function Sidebar({ resources, selectedResourceId, onResourceSelect, onHomeClick }: SidebarProps) {
  const { t } = useTranslation('navigation');
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(true);
  const itemsPerPage = 15;

  // Filtrer les ressources par recherche
  const filteredResources = useMemo(() => {
    if (!searchQuery.trim()) return resources;
    const query = searchQuery.toLowerCase();
    return resources.filter((r) => r.name.toLowerCase().includes(query) || r.type.toLowerCase().includes(query));
  }, [resources, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / itemsPerPage));
  const paginatedResources = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredResources.slice(start, start + itemsPerPage);
  }, [filteredResources, currentPage, itemsPerPage]);

  // Reset page quand la recherche change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Clic sur TOUS
  const handleTousClick = () => {
    setShowAll(true);
    onResourceSelect(null);
  };

  // Clic sur une ressource
  const handleResourceClick = (resource: Resource) => {
    setShowAll(false);
    onResourceSelect(resource);
  };

  return (
    <aside className="new-sidebar">
      {/* Header: Home + View buttons */}
      <div className="sidebar-header">
        <button className="header-btn home-btn" onClick={onHomeClick} title={t('sections.home.dashboard')}>
          <Icon name="home" className="header-icon" />
        </button>
        <div className="header-divider" />
        <button
          className={`header-btn ${viewMode === "list" ? "active" : ""}`}
          onClick={() => setViewMode("list")}
          title={t('sidebar.viewList', { defaultValue: 'Vue liste' })}
        >
          <Icon name="list" className="header-icon" />
        </button>
        <button
          className={`header-btn ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => setViewMode("grid")}
          title={t('sidebar.viewGrid', { defaultValue: 'Vue grille' })}
        >
          <Icon name="grid" className="header-icon" />
        </button>
      </div>

      {/* Search - EN HAUT */}
      <div className="sidebar-search">
        <div className="search-input-wrapper">
          <Icon name="search" className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={t('sidebar.search')}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Liste des ressources */}
      <div className="sidebar-content">
        <div className="resources-header">
          <span className="resources-label">{t('sidebar.list', { defaultValue: 'Liste:' })}</span>
        </div>
        <ul className={`resources-list ${viewMode}`}>
          {/* TOUS - toujours en premier */}
          <li>
            <button
              className={`resource-item tous-item ${showAll ? "selected" : ""}`}
              onClick={handleTousClick}
            >
              <span className="resource-name">{t('sidebar.all')}</span>
            </button>
          </li>
          {/* Ressources dynamiques */}
          {paginatedResources.map((resource) => (
            <li key={resource.id}>
              <button
                className={`resource-item ${!showAll && selectedResourceId === resource.id ? "selected" : ""}`}
                onClick={() => handleResourceClick(resource)}
              >
                <span className={`resource-status ${resource.status || "ok"}`} />
                <span className="resource-name">{resource.name}</span>
              </button>
            </li>
          ))}
          {/* Message si aucun résultat */}
          {paginatedResources.length === 0 && searchQuery && (
            <li className="no-results">
              <span>{t('sidebar.noResults')}</span>
            </li>
          )}
        </ul>
      </div>

      {/* Pagination */}
      <div className="sidebar-pagination">
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
        >
          <Icon name="chevronLeft" className="pagination-icon" />
        </button>
        <span className="pagination-info">{currentPage}</span>
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
        >
          <Icon name="chevronRight" className="pagination-icon" />
        </button>
      </div>
    </aside>
  );
}

export { Icon };
export type { Resource };
