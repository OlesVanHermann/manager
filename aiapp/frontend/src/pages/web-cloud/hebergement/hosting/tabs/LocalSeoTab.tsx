// ============================================================
// HOSTING TAB: LOCAL SEO - Visibilité Pro
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, LocalSeoLocation } from "../../../../../services/web-cloud.hosting";

interface Props { serviceName: string; }

/** Onglet Visibilité Pro (Local SEO). */
export function LocalSeoTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [locations, setLocations] = useState<LocalSeoLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLocations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await hostingService.getLocalSeoLocations(serviceName);
      setLocations(data || []);
    } catch (err) { 
      // Local SEO peut ne pas être disponible
      setLocations([]);
    }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const handleTerminate = async (locationId: string) => {
    if (!confirm(t("localSeo.confirmTerminate"))) return;
    try {
      await hostingService.terminateLocalSeo(serviceName, locationId);
      loadLocations();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleActivate = () => {
    const orderUrl = `https://www.ovh.com/manager/#/web/hosting/${serviceName}/local-seo`;
    window.open(orderUrl, '_blank');
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="localseo-tab">
      <div className="tab-header">
        <div>
          <h3>{t("localSeo.title")}</h3>
          <p className="tab-description">{t("localSeo.description")}</p>
        </div>
      </div>

      {locations.length === 0 ? (
        <div className="localseo-promo">
          <div className="promo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="64" height="64"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
          </div>
          <h4>{t("localSeo.promoTitle")}</h4>
          <p>{t("localSeo.promoDesc")}</p>
          
          <div className="promo-features">
            <div className="promo-feature">
              <span className="feature-icon">📍</span>
              <span>{t("localSeo.feature1")}</span>
            </div>
            <div className="promo-feature">
              <span className="feature-icon">⭐</span>
              <span>{t("localSeo.feature2")}</span>
            </div>
            <div className="promo-feature">
              <span className="feature-icon">📈</span>
              <span>{t("localSeo.feature3")}</span>
            </div>
            <div className="promo-feature">
              <span className="feature-icon">🔍</span>
              <span>{t("localSeo.feature4")}</span>
            </div>
          </div>

          <button className="btn btn-primary btn-lg" onClick={handleActivate}>
            {t("localSeo.activate")}
          </button>
        </div>
      ) : (
        <div className="localseo-locations">
          {locations.map(loc => (
            <div key={loc.id} className="location-card">
              <div className="location-header">
                <div className="location-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                </div>
                <div className="location-info">
                  <h4>{loc.name}</h4>
                  <span className="location-address">{loc.address}</span>
                </div>
                <span className={`badge ${loc.status === 'active' ? 'success' : 'warning'}`}>{loc.status}</span>
              </div>
              
              <div className="location-details">
                <div><label>{t("localSeo.offer")}</label><span>{loc.offer}</span></div>
                <div><label>{t("localSeo.country")}</label><span>{loc.country}</span></div>
                {loc.creation && <div><label>{t("localSeo.since")}</label><span>{new Date(loc.creation).toLocaleDateString()}</span></div>}
              </div>

              <div className="location-actions">
                <a href={`https://www.ovh.com/manager/#/web/hosting/${serviceName}/local-seo/${loc.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                  {t("localSeo.manage")}
                </a>
                <button className="btn btn-danger btn-sm" onClick={() => handleTerminate(loc.id)}>
                  {t("localSeo.terminate")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="info-box">
        <h4>{t("localSeo.whatIs")}</h4>
        <p>{t("localSeo.explanation")}</p>
      </div>
    </div>
  );
}

export default LocalSeoTab;
