// ============================================================
// COMPOSANT - LeftPanel (Panel gauche avec NAV3 toggle)
// NAV3: [General] [Packs] au-dessus de la recherche
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Nav3Mode, EmailDomain, EmailLicense, EmailOffer } from "../../types";
import { OFFER_CONFIG, NAV3_CONFIG } from "./emails.constants";
import { DomainView } from "./DomainView";
import { LicenseView } from "./LicenseView";
import "./LeftPanel.css";

interface LeftPanelProps {
  nav3Mode: Nav3Mode;
  onNav3ModeChange: (mode: Nav3Mode) => void;
  domains: EmailDomain[];
  licenses: EmailLicense[];
  selectedDomain: string | null;
  selectedLicense: string | null;
  onSelectDomain: (name: string) => void;
  onSelectLicense: (id: string) => void;
  loading: boolean;
  onAddDomain?: () => void;
  onOrderPack?: () => void;
}

const ITEMS_PER_PAGE = 10;

/** Panel gauche avec NAV3 toggle [General] / [Packs] et liste des items. */
export function LeftPanel({
  nav3Mode,
  onNav3ModeChange,
  domains,
  licenses,
  selectedDomain,
  selectedLicense,
  onSelectDomain,
  onSelectLicense,
  loading,
  onAddDomain,
  onOrderPack,
}: LeftPanelProps) {
  const { t } = useTranslation("web-cloud/emails/index");

  // ---------- STATE ----------
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [offerFilter, setOfferFilter] = useState<EmailOffer | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // ---------- FILTERING ----------

  const filteredDomains = useMemo(() => {
    let result = domains;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(d => d.name.toLowerCase().includes(query));
    }

    // Filter by offer
    if (offerFilter) {
      result = result.filter(d => d.offers.includes(offerFilter));
    }

    return result;
  }, [domains, searchQuery, offerFilter]);

  const filteredLicenses = useMemo(() => {
    if (!searchQuery) return licenses;
    const query = searchQuery.toLowerCase();
    return licenses.filter(l => l.name.toLowerCase().includes(query));
  }, [licenses, searchQuery]);

  // ---------- PAGINATION ----------

  const items = nav3Mode === "general" ? filteredDomains : filteredLicenses;
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedDomains = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDomains.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDomains, currentPage]);

  // Reset page when search/filter changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (offer: EmailOffer | null) => {
    setOfferFilter(offer);
    setCurrentPage(1);
    setShowFilterMenu(false);
  };

  const handleNav3ModeChange = (mode: Nav3Mode) => {
    onNav3ModeChange(mode);
    setCurrentPage(1);
    setSearchQuery("");
    setOfferFilter(null);
  };

  // ---------- RENDER PAGINATION ----------

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage, "...", totalPages);
    }

    return (
      <div className="left-panel-pagination">
        <span className="pagination-info">
          {t("leftPanel.page", { current: currentPage, total: totalPages })}
        </span>
        <div className="pagination-buttons">
          <button
            className="pagination-btn"
            onClick={() => {
              setCurrentPage(p => Math.max(1, p - 1));
            }}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          {pages.map((page, i) => (
            page === "..." ? (
              <span key={`ellipsis-${i}`} className="pagination-ellipsis">...</span>
            ) : (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => {
                  setCurrentPage(page);
                }}
              >
                {page}
              </button>
            )
          ))}
          <button
            className="pagination-btn"
            onClick={() => {
              setCurrentPage(p => Math.min(totalPages, p + 1));
            }}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      </div>
    );
  };

  // ---------- RENDER SKELETON ----------

  const renderSkeleton = () => (
    <div className="left-panel-loading">
      <div className="skeleton-item-full">
        <div className="skeleton skeleton-icon" />
        <div className="skeleton-content">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-subtitle" />
        </div>
      </div>
      <div className="skeleton-item-full">
        <div className="skeleton skeleton-icon" />
        <div className="skeleton-content">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-subtitle" />
        </div>
      </div>
      <div className="skeleton-item-full">
        <div className="skeleton skeleton-icon" />
        <div className="skeleton-content">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-subtitle" />
        </div>
      </div>
      <div className="skeleton-item-full">
        <div className="skeleton skeleton-icon" />
        <div className="skeleton-content">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-subtitle" />
        </div>
      </div>
    </div>
  );

  return (
    <aside className="emails-left-panel">
      {/* ---------- NAV3 TOGGLE [General] [Packs] ---------- */}
      <div className="nav3-toggle">
        {NAV3_CONFIG.map((nav3) => (
          <button
            key={nav3.id}
            className={`nav3-toggle-btn ${nav3Mode === nav3.id ? "active" : ""}`}
            onClick={() => handleNav3ModeChange(nav3.id)}
          >
            <span className="nav3-toggle-icon">{nav3.icon}</span>
            {t(nav3.labelKey)}
          </button>
        ))}
      </div>

      {/* ---------- RECHERCHE ---------- */}
      <div className="left-panel-search">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder={nav3Mode === "general" ? t("leftPanel.searchDomain") : t("leftPanel.searchPack")}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => handleSearchChange("")}>×</button>
          )}
        </div>
      </div>

      {/* ---------- FILTER BAR ---------- */}
      <div className="left-panel-filter">
        {nav3Mode === "general" && (
          <div className="filter-dropdown-container">
            <button
              className={`filter-dropdown-btn ${offerFilter ? "active" : ""}`}
              onClick={() => {
                setShowFilterMenu(!showFilterMenu);
              }}
            >
              {offerFilter ? OFFER_CONFIG[offerFilter].label : t("leftPanel.filter")} ▾
            </button>
            {showFilterMenu && (
              <div className="filter-dropdown-menu">
                <button
                  className={`filter-option ${!offerFilter ? "active" : ""}`}
                  onClick={() => handleFilterChange(null)}
                >
                  {t("leftPanel.allOffers")}
                </button>
                {(Object.keys(OFFER_CONFIG) as EmailOffer[]).map(offer => (
                  <button
                    key={offer}
                    className={`filter-option ${offerFilter === offer ? "active" : ""}`}
                    onClick={() => handleFilterChange(offer)}
                  >
                    <span className="offer-dot" style={{ backgroundColor: OFFER_CONFIG[offer].color }} />
                    {OFFER_CONFIG[offer].label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <span className="item-count">
          {totalItems} {nav3Mode === "general" ? t("leftPanel.domains") : t("leftPanel.packs")}
        </span>
      </div>

      {/* ---------- CONTENU ---------- */}
      <div className="left-panel-content">
        {loading ? (
          renderSkeleton()
        ) : nav3Mode === "general" ? (
          <DomainView
            domains={paginatedDomains}
            selectedDomain={selectedDomain}
            onSelect={onSelectDomain}
          />
        ) : (
          <LicenseView
            licenses={filteredLicenses}
            selectedLicense={selectedLicense}
            onSelect={onSelectLicense}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        )}
      </div>

      {/* ---------- PAGINATION ---------- */}
      {!loading && renderPagination()}

      {/* ---------- ACTIONS ---------- */}
      <div className="left-panel-actions">
        {nav3Mode === "general" ? (
          <button className="btn btn-outline btn-add" onClick={() => {
            onAddDomain?.();
          }}>
            <span>+</span> {t("leftPanel.addDomain")}
          </button>
        ) : (
          <button className="btn btn-primary btn-add" onClick={() => {
            onOrderPack?.();
          }}>
            <span>+</span> {t("leftPanel.orderPack")}
          </button>
        )}
      </div>
    </aside>
  );
}

export { DomainView } from "./DomainView";
export { LicenseView } from "./LicenseView";
