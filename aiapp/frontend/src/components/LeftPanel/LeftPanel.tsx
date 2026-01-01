// ============================================================
// COMPOSANT LeftPanel - Sidebar reutilisable
// Ref: prompt_target_sidecar_left.txt
// ============================================================

import "./LeftPanel.css";
import React from "react";

// ============ ICONS ============

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

// ============ TYPES ============

export interface FilterOption {
  value: string;
  label: string;
}

export interface Nav3Group {
  id: string;
  label: string;
}

export interface LeftPanelProps<T> {
  // Data
  items: T[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;

  // Render
  renderItem: (item: T, isSelected: boolean) => React.ReactNode;
  getItemId: (item: T) => string;

  // Search
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  searchPlaceholder?: string;

  // Filter
  filterOptions?: FilterOption[];
  filterValue?: string;
  onFilterChange?: (v: string) => void;

  // NAV3 Selector
  nav3Groups?: Nav3Group[];
  activeNav3?: string;
  onNav3Change?: (id: string) => void;

  // Pagination
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (p: number) => void;
  showPagination?: boolean;

  // State
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  itemCount?: number;
  itemLabel?: string; // "services", "domaines", etc.
}

// ============ COMPOSANT ============

export function LeftPanel<T>({
  items,
  selectedId,
  onSelect,
  renderItem,
  getItemId,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  filterOptions,
  filterValue = "all",
  onFilterChange,
  nav3Groups,
  activeNav3,
  onNav3Change,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showPagination = false,
  loading = false,
  error = null,
  emptyMessage = "Aucun element",
  emptyIcon,
  itemCount,
  itemLabel = "elements",
}: LeftPanelProps<T>) {
  // -------- Loading --------
  if (loading) {
    return (
      <div className="lp-container">
        <div className="lp-search">
          <div className="lp-skeleton" style={{ height: 14, width: "100%" }} />
        </div>
        <div className="lp-loading">
          <div className="lp-skeleton" />
          <div className="lp-skeleton" />
          <div className="lp-skeleton" />
        </div>
      </div>
    );
  }

  // -------- Error --------
  if (error) {
    return (
      <div className="lp-container">
        <div className="lp-error">{error}</div>
      </div>
    );
  }

  // -------- Render --------
  return (
    <div className="lp-container">
      {/* NAV3 Selector - EN HAUT */}
      {nav3Groups && nav3Groups.length > 0 && onNav3Change && (
        <div className="lp-nav3-selector">
          {nav3Groups.map((group) => (
            <button
              key={group.id}
              className={`lp-nav3-btn ${activeNav3 === group.id ? "active" : ""}`}
              onClick={() => onNav3Change(group.id)}
            >
              {group.label}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      {onSearchChange && (
        <div className="lp-search">
          <SearchIcon />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}

      {/* Filter + Count */}
      {(filterOptions || itemCount !== undefined) && (
        <div className="lp-filter-row">
          {filterOptions && onFilterChange ? (
            <select
              className="lp-filter-select"
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <span />
          )}
          {itemCount !== undefined && (
            <span className="lp-count">
              {itemCount} {itemLabel}
            </span>
          )}
        </div>
      )}

      {/* List */}
      <div className="lp-list">
        {items.length === 0 ? (
          <div className="lp-empty">
            {emptyIcon}
            <span className="lp-empty-text">{emptyMessage}</span>
          </div>
        ) : (
          items.map((item) => {
            const id = getItemId(item);
            const isSelected = id === selectedId;
            return (
              <div
                key={id}
                className={`lp-item ${isSelected ? "selected" : ""}`}
                onClick={() => onSelect(id)}
              >
                {renderItem(item, isSelected)}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && onPageChange && (
        <div className="lp-pagination">
          <button
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeftIcon />
          </button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                className={pageNum === currentPage ? "active" : ""}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRightIcon />
          </button>
        </div>
      )}
    </div>
  );
}

// ============ SUB-COMPONENTS FOR RENDERING ============

export interface LeftPanelItemContentProps {
  icon?: React.ReactNode;
  name: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant: "active" | "success" | "warning" | "expiring" | "error" | "expired" | "info" | "neutral";
  };
  extBadge?: string;
}

export function LeftPanelItemContent({
  icon,
  name,
  subtitle,
  badge,
  extBadge,
}: LeftPanelItemContentProps) {
  return (
    <>
      {icon && <span className="lp-item-icon">{icon}</span>}
      <div className="lp-item-content">
        <div className="lp-item-name">{name}</div>
        {subtitle && <div className="lp-item-subtitle">{subtitle}</div>}
      </div>
      {extBadge && <span className="lp-ext-badge">.{extBadge}</span>}
      {badge && (
        <span className={`lp-badge ${badge.variant}`}>{badge.text}</span>
      )}
    </>
  );
}

export default LeftPanel;
