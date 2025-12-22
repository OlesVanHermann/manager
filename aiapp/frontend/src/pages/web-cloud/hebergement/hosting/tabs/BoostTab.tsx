// ============================================================
// HOSTING TAB: BOOST - Performance temporaire
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Hosting } from "../../../../../services/web-cloud.hosting";

interface Props { 
  serviceName: string; 
  details?: Hosting;
}

/** Onglet Boost pour performances temporaires. */
export function BoostTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [deactivating, setDeactivating] = useState(false);

  const hasBoost = !!details?.boostOffer;
  const boostOffer = details?.boostOffer || '';

  const handleDeactivate = async () => {
    if (!confirm(t("boost.confirmDeactivate"))) return;
    try {
      setDeactivating(true);
      // TODO: API call to deactivate boost
      await new Promise(r => setTimeout(r, 1000));
      alert("Boost désactivé");
      window.location.reload();
    } catch (err) {
      alert(String(err));
    } finally {
      setDeactivating(false);
    }
  };

  const handleOrder = () => {
    window.open(`https://www.ovh.com/manager/#/web/hosting/${serviceName}/boost/order`, '_blank');
  };

  return (
    <div className="boost-tab">
      <div className="tab-header">
        <div>
          <h3>{t("boost.title")}</h3>
          <p className="tab-description">{t("boost.description")}</p>
        </div>
      </div>

      {hasBoost ? (
        <>
          {/* Boost Actif */}
          <div className="status-card success">
            <div className="status-icon">⚡</div>
            <div className="status-content">
              <h4>{t("boost.active")}</h4>
              <p>{t("boost.currentOffer")}: <strong>{boostOffer}</strong></p>
            </div>
          </div>

          {/* Actions */}
          <section className="info-section">
            <button 
              className="btn btn-danger"
              onClick={handleDeactivate}
              disabled={deactivating}
            >
              {deactivating ? "Désactivation..." : t("boost.deactivate")}
            </button>
          </section>

          {/* Explication */}
          <section className="info-section" style={{ marginTop: 'var(--space-6)' }}>
            <h4>{t("boost.whatIs")}</h4>
            <p>{t("boost.explanation")}</p>
          </section>
        </>
      ) : (
        <>
          {/* Boost Inactif - Promotion */}
          <section className="promo-section">
            <h4>{t("boost.whatIs")}</h4>
            <p style={{ marginBottom: 'var(--space-4)' }}>{t("boost.explanation")}</p>

            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">🚀</span>
                <span>{t("boost.featureCpu")}</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💾</span>
                <span>{t("boost.featureRam")}</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>{t("boost.featurePriority")}</span>
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleOrder} style={{ marginTop: 'var(--space-4)' }}>
              {t("boost.order")}
            </button>
          </section>

          {/* Note */}
          <div className="info-banner" style={{ marginTop: 'var(--space-4)' }}>
            <span className="info-icon">ℹ</span>
            <div>
              <p><strong>{t("boost.note")}</strong></p>
              <p>{t("boost.noteDesc")}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BoostTab;
