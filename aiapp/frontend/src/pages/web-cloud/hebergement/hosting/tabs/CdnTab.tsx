// ============================================================
// HOSTING TAB: CDN - Content Delivery Network
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Hosting, CdnStatus } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  details?: Hosting | null;
}

/** Onglet CDN - Gestion du Content Delivery Network. */
export function CdnTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [cdnStatus, setCdnStatus] = useState<CdnStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadCdnStatus = useCallback(async () => {
    try {
      setLoading(true);
      const status = await hostingService.getCdnStatus(serviceName);
      setCdnStatus(status);
    } catch {
      setCdnStatus(null);
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    loadCdnStatus();
  }, [loadCdnStatus]);

  const handleFlushCache = async () => {
    if (!confirm(t("cdn.confirmFlush"))) return;
    try {
      setActionLoading(true);
      await hostingService.flushCdnCache(serviceName);
      alert(t("cdn.flushSuccess"));
    } catch (err) {
      alert(String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateCdn = async () => {
    const orderUrl = `https://www.ovh.com/manager/#/web/hosting/${serviceName}/cdn`;
    window.open(orderUrl, '_blank');
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  const hasCdn = details?.hasCdn || cdnStatus?.active;

  return (
    <div className="cdn-tab">
      <div className="tab-header">
        <div>
          <h3>{t("cdn.title")}</h3>
          <p className="tab-description">{t("cdn.description")}</p>
        </div>
        {hasCdn && (
          <button
            className="btn btn-secondary"
            onClick={handleFlushCache}
            disabled={actionLoading}
          >
            {actionLoading ? "..." : t("cdn.flushCache")}
          </button>
        )}
      </div>

      {hasCdn ? (
        <div className="cdn-active-card">
          <div className="cdn-status">
            <div className="status-icon enabled">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
            </div>
            <div className="status-text">
              <span className="status-label enabled">{t("cdn.active")}</span>
              <span className="status-description">{t("cdn.activeDesc")}</span>
            </div>
          </div>

          {cdnStatus && (
            <div className="cdn-details">
              <div className="info-item">
                <label>{t("cdn.type")}</label>
                <span className="badge success">{cdnStatus.type || 'CDN Basic'}</span>
              </div>
              <div className="info-item">
                <label>{t("cdn.status")}</label>
                <span className="badge info">{cdnStatus.status || 'active'}</span>
              </div>
            </div>
          )}

          <div className="cdn-features">
            <h4>{t("cdn.features")}</h4>
            <ul>
              <li>✓ {t("cdn.featureCache")}</li>
              <li>✓ {t("cdn.featureGeo")}</li>
              <li>✓ {t("cdn.featureDdos")}</li>
              <li>✓ {t("cdn.featureCompression")}</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="cdn-inactive-card">
          <div className="cdn-status">
            <div className="status-icon disabled">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" /></svg>
            </div>
            <div className="status-text">
              <span className="status-label disabled">{t("cdn.inactive")}</span>
              <span className="status-description">{t("cdn.inactiveDesc")}</span>
            </div>
          </div>

          <div className="cdn-promo">
            <h4>{t("cdn.whyActivate")}</h4>
            <ul>
              <li>{t("cdn.benefit1")}</li>
              <li>{t("cdn.benefit2")}</li>
              <li>{t("cdn.benefit3")}</li>
            </ul>
            <button className="btn btn-primary" onClick={handleActivateCdn}>
              {t("cdn.activate")}
            </button>
          </div>
        </div>
      )}

      <div className="info-box">
        <h4>{t("cdn.whatIs")}</h4>
        <p>{t("cdn.explanation")}</p>
      </div>
    </div>
  );
}

export default CdnTab;
