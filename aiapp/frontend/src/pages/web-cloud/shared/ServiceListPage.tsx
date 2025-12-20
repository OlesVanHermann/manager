// ============================================================
// SERVICE LIST PAGE - Template réutilisable style Billing
// ============================================================

import { useState, useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";

// ============ TYPES ============

export interface ServiceItem {
  id: string;
  name: string;
  type?: string;
  status?: string;
  expiration?: string;
  icon?: ReactNode;
}

export interface Tab {
  id: string;
  label: string;
  count?: number;
}

export interface ServiceListPageProps {
  titleKey: string;
  descriptionKey: string;
  guidesUrl?: string;
  i18nNamespace: string;
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  services: ServiceItem[];
  loading: boolean;
  error?: string | null;
  selectedService?: string | null;
  onSelectService: (id: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
  emptyIcon?: ReactNode;
  emptyTitleKey?: string;
  emptyDescriptionKey?: string;
}

// ============ ICONS ============

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const DefaultEmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
  </svg>
);

// ============ COMPOSANT ============

/** Template de page liste de services, style Billing. Header + tabs + toolbar + liste + détail. */
export function ServiceListPage({
  titleKey,
  descriptionKey,
  guidesUrl,
  i18nNamespace,
  tabs,
  activeTab,
  onTabChange,
  services,
  loading,
  error,
  selectedService,
  onSelectService,
  searchPlaceholder,
  children,
  emptyIcon,
  emptyTitleKey = "empty.title",
  emptyDescriptionKey = "empty.description",
}: ServiceListPageProps) {
  const { t } = useTranslation(i18nNamespace);
  const { t: tCommon } = useTranslation("common");

  const [search, setSearch] = useState("");

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // ---------- RENDER ----------
  return (
    <div className="service-list-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1>{t(titleKey)}</h1>
          <p className="page-subtitle">{t(descriptionKey)}</p>
        </div>
        {guidesUrl && (
          <a href={guidesUrl} target="_blank" rel="noopener noreferrer" className="guides-link">
            <BookIcon /> {tCommon("guides")}
          </a>
        )}
      </div>

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="tabs-container">
          <div className="tabs-list">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => onTabChange?.(tab.id)}
              >
                {tab.label}
                {tab.count !== undefined && <span className="tab-count">{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="service-list-content">
        {/* Sidebar liste */}
        <div className="service-list-sidebar">
          {/* Toolbar */}
          <div className="service-toolbar">
            <div className="search-box">
              <SearchIcon />
              <input
                type="text"
                placeholder={searchPlaceholder || tCommon("search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="service-count">
              {loading ? tCommon("loading") : `${filteredServices.length} ${t("serviceUnit")}`}
            </span>
          </div>

          {/* Liste */}
          {loading ? (
            <div className="service-list-loading">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-item" />
              ))}
            </div>
          ) : error ? (
            <div className="error-banner">{error}</div>
          ) : filteredServices.length === 0 ? (
            <div className="empty-state-mini">
              <p>{t("noResults")}</p>
            </div>
          ) : (
            <ul className="service-list">
              {filteredServices.map((service) => (
                <li
                  key={service.id}
                  className={`service-item ${selectedService === service.id ? "selected" : ""}`}
                  onClick={() => onSelectService(service.id)}
                >
                  <div className="service-item-main">
                    <span className="service-name">{service.name}</span>
                    {service.type && <span className="service-type">{service.type}</span>}
                  </div>
                  {service.expiration && (
                    <span className="service-expiration">Exp: {service.expiration}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Panel détail */}
        <div className="service-detail-panel">
          {selectedService ? (
            children
          ) : (
            <div className="empty-state">
              {emptyIcon || <DefaultEmptyIcon />}
              <h3>{t(emptyTitleKey)}</h3>
              <p>{t(emptyDescriptionKey)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceListPage;
