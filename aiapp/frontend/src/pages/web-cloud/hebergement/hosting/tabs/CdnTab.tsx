// ============================================================
// HOSTING TAB: CDN - Content Delivery Network (sans redirection)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Hosting } from "../../../../../services/web-cloud.hosting";

interface Props { 
  serviceName: string; 
  details?: Hosting;
}

/** Modal pour activer le CDN. */
function ActivateCdnModal({ serviceName, isOpen, onClose, onSuccess }: {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [cdnType, setCdnType] = useState<"basic" | "security" | "advanced">("basic");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleActivate = async () => {
    setLoading(true);
    try {
      await hostingService.orderCdn(serviceName, cdnType);
      alert("Commande CDN en cours de traitement...");
      onSuccess();
      onClose();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Activer le CDN</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="info-banner">
            <span className="info-icon">ℹ</span>
            <p>Le CDN accélère votre site en distribuant le contenu depuis des serveurs proches de vos visiteurs.</p>
          </div>

          <div className="form-group">
            <label className="form-label">Type de CDN</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="cdnType" value="basic" checked={cdnType === "basic"} onChange={() => setCdnType("basic")} />
                <div>
                  <strong>CDN Basic</strong>
                  <span className="text-muted">Cache statique et compression</span>
                </div>
              </label>
              <label className="radio-label">
                <input type="radio" name="cdnType" value="security" checked={cdnType === "security"} onChange={() => setCdnType("security")} />
                <div>
                  <strong>CDN Security</strong>
                  <span className="text-muted">+ Protection DDoS avancée</span>
                </div>
              </label>
              <label className="radio-label">
                <input type="radio" name="cdnType" value="advanced" checked={cdnType === "advanced"} onChange={() => setCdnType("advanced")} />
                <div>
                  <strong>CDN Advanced</strong>
                  <span className="text-muted">+ Règles personnalisées</span>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={handleActivate} disabled={loading}>
            {loading ? "Activation..." : "Activer le CDN"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Onglet CDN avec état et actions. */
export function CdnTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [cdnInfo, setCdnInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [flushing, setFlushing] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);

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

  const isCdnActive = details?.hasCdn || cdnInfo?.status === "active";

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

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
          <section className="cdn-status cdn-active">
            <div className="status-icon">✓</div>
            <div className="status-content">
              <h4>{t("cdn.active")}</h4>
              <p>{t("cdn.activeDesc")}</p>
            </div>
          </section>

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

          <section className="cdn-features">
            <h4>{t("cdn.features")}</h4>
            <ul className="features-list">
              <li>✓ {t("cdn.featureCache")}</li>
              <li>✓ {t("cdn.featureGeo")}</li>
              <li>✓ {t("cdn.featureDdos")}</li>
              <li>✓ {t("cdn.featureCompression")}</li>
            </ul>
          </section>

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
          <section className="cdn-status cdn-inactive">
            <div className="status-icon">○</div>
            <div className="status-content">
              <h4>{t("cdn.inactive")}</h4>
              <p>{t("cdn.inactiveDesc")}</p>
            </div>
          </section>

          <section className="cdn-promo">
            <h4>{t("cdn.whyActivate")}</h4>
            <ul className="benefits-list">
              <li>🚀 {t("cdn.benefit1")}</li>
              <li>📈 {t("cdn.benefit2")}</li>
              <li>🛡️ {t("cdn.benefit3")}</li>
            </ul>
          </section>

          <section className="cdn-info-box">
            <h4>{t("cdn.whatIs")}</h4>
            <p>{t("cdn.explanation")}</p>
          </section>

          {/* SANS REDIRECTION - Modal native */}
          <section className="cdn-actions">
            <button className="btn btn-primary" onClick={() => setShowActivateModal(true)}>
              {t("cdn.activate")}
            </button>
          </section>
        </>
      )}

      <ActivateCdnModal
        serviceName={serviceName}
        isOpen={showActivateModal}
        onClose={() => setShowActivateModal(false)}
        onSuccess={loadCdnInfo}
      />
    </div>
  );
}

export default CdnTab;
