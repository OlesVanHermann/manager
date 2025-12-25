// ============================================================
import "./LocalSeoTab.css";
// HOSTING TAB: LOCAL SEO - Visibilité Pro
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { localseoService } from "./LocalSeoTab.service";
import type { LocalSeoLocation } from "../../hosting.types";

interface Props { serviceName: string; }

export function LocalSeoTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.localseo");
  const [locations, setLocations] = useState<LocalSeoLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await localseoService.listLocalSeoLocations(serviceName).catch(() => []);
      if (ids.length > 0) {
        const data = await Promise.all(ids.map(id => localseoService.getLocalSeoLocation(serviceName, id)));
        setLocations(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleOrder = () => {
    window.open(`https://www.ovhcloud.com/fr/web-hosting/options/visibility-pro/`, "_blank");
  };

  const handleTest = () => {
    window.open(`https://www.ovhcloud.com/fr/web-hosting/options/visibility-pro/check/`, "_blank");
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" style={{ height: "300px" }} /></div>;

  // Si pas d'abonnement, afficher la promo
  if (locations.length === 0) {
    return (
      <div className="localseo-tab">
        <div className="tab-header">
          <div>
            <h3>{t("localSeo.title")}</h3>
            <p className="tab-description">{t("localSeo.description")}</p>
          </div>
        </div>

        {/* Promo banner */}
        <div className="promo-card">
          <div className="promo-content">
            <h4>{t("localSeo.promoTitle")}</h4>
            <p>{t("localSeo.promoDesc")}</p>

            <div className="promo-features">
              <div className="feature-item">
                <span className="feature-icon">📍</span>
                <span>{t("localSeo.feature1")}</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔄</span>
                <span>{t("localSeo.feature2")}</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>{t("localSeo.feature3")}</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⭐</span>
                <span>{t("localSeo.feature4")}</span>
              </div>
            </div>

            <div className="promo-actions">
              <button className="btn btn-primary" onClick={handleOrder}>
                {t("localSeo.order")}
              </button>
              <button className="btn btn-secondary" onClick={handleTest}>
                Tester ma visibilité
              </button>
            </div>
          </div>

          <div className="promo-info">
            <h5>{t("localSeo.whatIs")}</h5>
            <p>{t("localSeo.explanation")}</p>
          </div>
        </div>
      </div>
    );
  }

  // Si abonnement actif, afficher la liste des établissements
  return (
    <div className="localseo-tab">
      <div className="tab-header">
        <div>
          <h3>{t("localSeo.title")}</h3>
          <p className="tab-description">{t("localSeo.description")}</p>
        </div>
        <div className="tab-actions">
          <button className="btn btn-primary btn-sm" onClick={handleOrder}>
            + {t("localSeo.order")}
          </button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>{t("localSeo.location")}</th>
            <th>{t("localSeo.offer")}</th>
            <th>{t("localSeo.country")}</th>
            <th>{t("localSeo.status")}</th>
            <th>{t("localSeo.since")}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map(loc => (
            <tr key={loc.id}>
              <td className="font-medium">{loc.name || loc.id}</td>
              <td>{loc.offer || "Standard"}</td>
              <td>{loc.country || "FR"}</td>
              <td>
                <span className={`badge ${loc.status === "active" ? "success" : "warning"}`}>
                  {loc.status === "active" ? "Actif" : loc.status}
                </span>
              </td>
              <td>{loc.creationDate ? new Date(loc.creationDate).toLocaleDateString("fr-FR") : "-"}</td>
              <td>
                <div className="action-buttons">
                  <a 
                    href={`https://www.ovhcloud.com/manager/#/web/hosting/${serviceName}/local-seo/${loc.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-icon"
                    title={t("localSeo.manage")}
                  >🔗</a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LocalSeoTab;
