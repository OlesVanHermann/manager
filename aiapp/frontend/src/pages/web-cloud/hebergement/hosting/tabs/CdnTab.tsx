// ============================================================
// HOSTING TAB: CDN - Content Delivery Network
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Hosting, CdnInfo } from "../../../../../services/web-cloud.hosting";

interface Props { 
  serviceName: string;
  details?: Hosting;
}

export function CdnTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [hosting, setHosting] = useState<Hosting | null>(details || null);
  const [cdnInfo, setCdnInfo] = useState<CdnInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [hostingData, cdn] = await Promise.all([
        details ? Promise.resolve(details) : hostingService.getHosting(serviceName),
        hostingService.getCdnInfo(serviceName).catch(() => null)
      ]);
      setHosting(hostingData);
      setCdnInfo(cdn);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [serviceName, details]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleFlushCache = async () => {
    if (!confirm(t("cdn.confirmFlush"))) return;
    setActionLoading(true);
    try {
      await hostingService.flushCdn(serviceName);
      alert(t("cdn.flushSuccess"));
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = () => {
    window.open(`https://www.ovhcloud.com/fr/web-hosting/options/cdn/`, "_blank");
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" style={{ height: "300px" }} /></div>;

  const hasCdn = hosting?.hasCdn || cdnInfo?.status === "active";

  return (
    <div className="cdn-tab">
      <div className="tab-header">
        <div>
          <h3>{t("cdn.title")}</h3>
          <p className="tab-description">{t("cdn.description")}</p>
        </div>
      </div>

      {hasCdn ? (
        // CDN actif
        <div className="cdn-active">
          <div className="cdn-status-card success">
            <div className="status-icon">🚀</div>
            <div className="status-content">
              <h4>{t("cdn.active")}</h4>
              <p>{t("cdn.activeDesc")}</p>
            </div>
            <div className="status-actions">
              <button 
                className="btn btn-secondary"
                onClick={handleFlushCache}
                disabled={actionLoading}
              >
                {actionLoading ? t("cdn.flushing") : t("cdn.flushCache")}
              </button>
            </div>
          </div>

          <div className="cdn-features">
            <h4>{t("cdn.features")}</h4>
            <div className="features-grid">
              <div className="feature-card">
                <span className="feature-icon">📦</span>
                <span>{t("cdn.featureCache")}</span>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🌍</span>
                <span>{t("cdn.featureGeo")}</span>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🛡️</span>
                <span>{t("cdn.featureDdos")}</span>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🗜️</span>
                <span>{t("cdn.featureCompression")}</span>
              </div>
            </div>
          </div>

          {cdnInfo && (
            <div className="cdn-details">
              <h4>Détails</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">{t("cdn.type")}</span>
                  <span className="info-value">{cdnInfo.type || "CDN Basic"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t("cdn.domain")}</span>
                  <span className="info-value">{cdnInfo.domain || serviceName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t("cdn.status")}</span>
                  <span className="badge success">{t("cdn.enabled")}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // CDN inactif - Promo
        <div className="cdn-inactive">
          <div className="cdn-status-card inactive">
            <div className="status-icon">💤</div>
            <div className="status-content">
              <h4>{t("cdn.inactive")}</h4>
              <p>{t("cdn.inactiveDesc")}</p>
            </div>
          </div>

          <div className="cdn-promo">
            <div className="promo-content">
              <h4>{t("cdn.whyActivate")}</h4>
              <ul className="benefits-list">
                <li>⚡ {t("cdn.benefit1")}</li>
                <li>📈 {t("cdn.benefit2")}</li>
                <li>🛡️ {t("cdn.benefit3")}</li>
              </ul>
              <button className="btn btn-primary" onClick={handleActivate}>
                {t("cdn.activate")}
              </button>
            </div>

            <div className="promo-info">
              <h5>{t("cdn.whatIs")}</h5>
              <p>{t("cdn.explanation")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CdnTab;
