// ============================================================
// HOSTING TAB: CDN - Content Delivery Network
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Hosting } from "../../../../../services/web-cloud.hosting";

interface Props { 
  serviceName: string; 
  details?: Hosting;
}

/** Onglet CDN avec état et actions. */
export function CdnTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [cdnInfo, setCdnInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [flushing, setFlushing] = useState(false);

  // ---------- LOAD ----------
  const loadCdnInfo = useCallback(async () => {
    try {
      setLoading(true);
      const info = await hostingService.getCdnInfo(serviceName).catch(() => null);
      setCdnInfo(info);
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadCdnInfo(); }, [loadCdnInfo]);

  // ---------- HANDLERS ----------
  const handleFlushCache = async () => {
    if (!confirm(t("cdn.confirmFlush"))) return;
    setFlushing(true);
    try {
      await hostingService.flushCdnCache(serviceName);
      alert(t("cdn.flushSuccess"));
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setFlushing(false);
    }
  };

  const isCdnActive = details?.cdn === "active" || cdnInfo?.status === "active";

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  // ---------- RENDER ----------
  return (
    <div className="cdn-tab">
      <div className="tab-header">
        <div>
          <h3>{t("cdn.title")}</h3>
          <p className="tab-description">{t("cdn.description")}</p>
        </div>
      </div>

      {isCdnActive ? (
        <>
          {/* CDN Active */}
          <section className="cdn-status cdn-active">
            <div className="status-icon">✓</div>
            <div className="status-content">
              <h4>{t("cdn.active")}</h4>
              <p>{t("cdn.activeDesc")}</p>
            </div>
          </section>

          {/* CDN Info */}
          {cdnInfo && (
            <section className="cdn-details">
              <h4>Informations CDN</h4>
              <div className="info-grid-2col">
                <div className="info-item">
                  <label>{t("cdn.type")}</label>
                  <span>{cdnInfo.type || "Basic"}</span>
                </div>
                <div className="info-item">
                  <label>{t("cdn.status")}</label>
                  <span className="badge success">{cdnInfo.status || "Actif"}</span>
                </div>
              </div>
            </section>
          )}

          {/* CDN Features */}
          <section className="cdn-features">
            <h4>{t("cdn.features")}</h4>
            <ul className="features-list">
              <li>✓ {t("cdn.featureCache")}</li>
              <li>✓ {t("cdn.featureGeo")}</li>
              <li>✓ {t("cdn.featureDdos")}</li>
              <li>✓ {t("cdn.featureCompression")}</li>
            </ul>
          </section>

          {/* Actions */}
          <section className="cdn-actions">
            <button 
              className="btn btn-warning" 
              onClick={handleFlushCache}
              disabled={flushing}
            >
              {flushing ? "Purge en cours..." : `🗑 ${t("cdn.flushCache")}`}
            </button>
          </section>
        </>
      ) : (
        <>
          {/* CDN Inactive */}
          <section className="cdn-status cdn-inactive">
            <div className="status-icon">○</div>
            <div className="status-content">
              <h4>{t("cdn.inactive")}</h4>
              <p>{t("cdn.inactiveDesc")}</p>
            </div>
          </section>

          {/* Why activate */}
          <section className="cdn-promo">
            <h4>{t("cdn.whyActivate")}</h4>
            <ul className="benefits-list">
              <li>🚀 {t("cdn.benefit1")}</li>
              <li>📈 {t("cdn.benefit2")}</li>
              <li>🛡️ {t("cdn.benefit3")}</li>
            </ul>
          </section>

          {/* What is CDN */}
          <section className="cdn-info-box">
            <h4>{t("cdn.whatIs")}</h4>
            <p>{t("cdn.explanation")}</p>
          </section>

          {/* Activate link */}
          <section className="cdn-actions">
            <a 
              href={`https://www.ovh.com/manager/#/web/hosting/${serviceName}/cdn`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              {t("cdn.activate")} ↗
            </a>
          </section>
        </>
      )}
    </div>
  );
}

export default CdnTab;
