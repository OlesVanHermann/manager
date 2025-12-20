// ============================================================
// SERVICE LIST PAGE - Composant générique liste + détail
// ============================================================

import { useTranslation } from "react-i18next";
import type { ServiceListPageProps } from "./types";
import "../styles.css";

/** Composant générique affichant une liste de services avec panneau de détail. */
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

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="service-list-page">
        <div className="service-list-header">
          <h1>{t(titleKey)}</h1>
          <p>{t(descriptionKey)}</p>
        </div>
        <div className="empty-state">
          <p>{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  // ---------- RENDER ERROR ----------
  if (error) {
    return (
      <div className="service-list-page">
        <div className="service-list-header">
          <h1>{t(titleKey)}</h1>
          <p>{t(descriptionKey)}</p>
        </div>
        <div className="empty-state">
          <p className="status-badge error">{error}</p>
        </div>
      </div>
    );
  }

  // ---------- RENDER EMPTY ----------
  if (services.length === 0) {
    return (
      <div className="service-list-page">
        <div className="service-list-header">
          <h1>{t(titleKey)}</h1>
          <p>{t(descriptionKey)}</p>
        </div>
        <div className="empty-state">
          {emptyIcon && <div className="empty-state-icon">{emptyIcon}</div>}
          <h3>{t(emptyTitleKey)}</h3>
          <p>{t(emptyDescriptionKey)}</p>
          {guidesUrl && (
            <a href={guidesUrl} target="_blank" rel="noopener noreferrer" className="guides-link">
              {tCommon("actions.viewGuides")} →
            </a>
          )}
        </div>
      </div>
    );
  }

  // ---------- RENDER LIST ----------
  return (
    <div className="service-list-page">
      <div className="service-list-header">
        <h1>{t(titleKey)}</h1>
        <p>{t(descriptionKey)}</p>
        {guidesUrl && (
          <a href={guidesUrl} target="_blank" rel="noopener noreferrer" className="guides-link">
            {tCommon("actions.viewGuides")} →
          </a>
        )}
      </div>
      <div className="service-list-content">
        <div className="service-list-sidebar">
          <div className="section-header" style={{ padding: "var(--space-3) var(--space-4)" }}>
            <span className="section-count">{services.length} {t("serviceUnit")}</span>
          </div>
          {services.map((service) => (
            <div
              key={service.id}
              className={`service-item ${selectedService === service.id ? "selected" : ""}`}
              onClick={() => onSelectService(service.id)}
            >
              <div className="service-item-name">{service.name}</div>
              {service.type && <div className="service-item-type">{service.type}</div>}
            </div>
          ))}
        </div>
        <div className="service-list-main">
          {selectedService ? (
            children
          ) : (
            <div className="empty-state">
              {emptyIcon && <div className="empty-state-icon">{emptyIcon}</div>}
              <h3>{t(emptyTitleKey)}</h3>
              <p>{t(emptyDescriptionKey)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
