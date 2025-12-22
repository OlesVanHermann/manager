// ============================================================
// HOSTING TAB: CDN - Content Delivery Network
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Hosting } from "../../../../../services/web-cloud.hosting";

interface Props { 
  serviceName: string; 
  details?: Hosting;
}

/** Onglet CDN avec activation et purge cache. */
export function CdnTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [flushing, setFlushing] = useState(false);

  const hasCdn = details?.hasCdn || false;

  const handleFlushCache = async () => {
    if (!confirm(t("cdn.confirmFlush"))) return;
    try {
      setFlushing(true);
      await hostingService.flushCdn(serviceName);
      alert(t("cdn.flushSuccess"));
    } catch (err) {
      alert(String(err));
    } finally {
      setFlushing(false);
    }
  };

  const handleActivate = () => {
    window.open(`https://www.ovh.com/manager/#/web/hosting/${serviceName}/cdn/order`, '_blank');
  };

  return (
    <div className="cdn-tab">
      <div className="tab-header">
        <div>
          <h3>{t("cdn.title")}</h3>
          <p className="tab-description">{t("cdn.description")}</p>
        </div>
      </div>

      {hasCdn ? (
        <>
          {/* CDN Actif */}
          <div className="status-card success">
            <div className="status-icon">✓</div>
            <div className="status-content">
              <h4>{t("cdn.active")}</h4>
              <p>{t("cdn.activeDesc")}</p>
            </div>
          </div>

          {/* Infos CDN */}
          <section className="info-section">
            <div className="info-grid">
              <div className="info-item">
                <label>{t("cdn.type")}</label>
                <span>CDN Basic</span>
              </div>
              <div className="info-item">
                <label>{t("cdn.status")}</label>
                <span className="badge success">Actif</span>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-4)' }}>
              <button 
                className="btn btn-secondary"
                onClick={handleFlushCache}
                disabled={flushing}
              >
                {flushing ? "Purge en cours..." : t("cdn.flushCache")}
              </button>
            </div>
          </section>

          {/* Fonctionnalités */}
          <section className="features-section">
            <h4>{t("cdn.features")}</h4>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>{t("cdn.featureCache")}</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌍</span>
                <span>{t("cdn.featureGeo")}</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🛡️</span>
                <span>{t("cdn.featureDdos")}</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📦</span>
                <span>{t("cdn.featureCompression")}</span>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* CDN Inactif */}
          <div className="status-card inactive">
            <div className="status-icon">○</div>
            <div className="status-content">
              <h4>{t("cdn.inactive")}</h4>
              <p>{t("cdn.inactiveDesc")}</p>
            </div>
          </div>

          {/* Promotion */}
          <section className="promo-section">
            <h4>{t("cdn.whyActivate")}</h4>
            <ul className="benefits-list">
              <li>✓ {t("cdn.benefit1")}</li>
              <li>✓ {t("cdn.benefit2")}</li>
              <li>✓ {t("cdn.benefit3")}</li>
            </ul>
            <button className="btn btn-primary" onClick={handleActivate}>
              {t("cdn.activate")}
            </button>
          </section>

          {/* Explication */}
          <section className="info-section" style={{ marginTop: 'var(--space-6)' }}>
            <h4>{t("cdn.whatIs")}</h4>
            <p>{t("cdn.explanation")}</p>
          </section>
        </>
      )}
    </div>
  );
}

export default CdnTab;
