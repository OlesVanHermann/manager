// ============================================================
// HOSTING TAB: BOOST - Performances temporaires
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Hosting } from "../../../../../services/web-cloud.hosting";

interface Props { 
  serviceName: string; 
  details?: Hosting;
}

/** Onglet Boost avec activation/désactivation. */
export function BoostTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [boostInfo, setBoostInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  // ---------- LOAD ----------
  const loadBoostInfo = useCallback(async () => {
    try {
      setLoading(true);
      const info = await hostingService.getBoostInfo(serviceName).catch(() => null);
      setBoostInfo(info);
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadBoostInfo(); }, [loadBoostInfo]);

  // ---------- HANDLERS ----------
  const handleDeactivate = async () => {
    if (!confirm(t("boost.confirmDeactivate"))) return;
    setToggling(true);
    try {
      await hostingService.deactivateBoost(serviceName);
      loadBoostInfo();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setToggling(false);
    }
  };

  const isBoostActive = details?.boostOffer || boostInfo?.offer;

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  // ---------- RENDER ----------
  return (
    <div className="boost-tab">
      <div className="tab-header">
        <div>
          <h3>{t("boost.title")}</h3>
          <p className="tab-description">{t("boost.description")}</p>
        </div>
      </div>

      {isBoostActive ? (
        <>
          {/* Boost Active */}
          <section className="boost-status boost-active">
            <div className="status-icon">⚡</div>
            <div className="status-content">
              <h4>{t("boost.active")}</h4>
              <p>{t("boost.currentOffer")}: <strong>{details?.boostOffer || boostInfo?.offer || "Performance"}</strong></p>
            </div>
          </section>

          {/* Boost Features */}
          <section className="boost-features">
            <h4>Avantages actifs</h4>
            <ul className="features-list">
              <li>⚡ {t("boost.featureCpu")}</li>
              <li>📊 {t("boost.featureRam")}</li>
              <li>🔝 {t("boost.featurePriority")}</li>
            </ul>
          </section>

          {/* Actions */}
          <section className="boost-actions">
            <button 
              className="btn btn-warning" 
              onClick={handleDeactivate}
              disabled={toggling}
            >
              {toggling ? "Désactivation..." : t("boost.deactivate")}
            </button>
          </section>
        </>
      ) : (
        <>
          {/* Boost Inactive */}
          <section className="boost-status boost-inactive">
            <div className="status-icon">○</div>
            <div className="status-content">
              <h4>Boost non activé</h4>
              <p>Augmentez temporairement les performances de votre hébergement.</p>
            </div>
          </section>

          {/* What is Boost */}
          <section className="boost-info-box">
            <h4>{t("boost.whatIs")}</h4>
            <p>{t("boost.explanation")}</p>
          </section>

          {/* Features preview */}
          <section className="boost-features">
            <h4>Avec le Boost, vous bénéficiez de :</h4>
            <ul className="features-list">
              <li>⚡ {t("boost.featureCpu")}</li>
              <li>📊 {t("boost.featureRam")}</li>
              <li>🔝 {t("boost.featurePriority")}</li>
            </ul>
          </section>

          {/* Note */}
          <section className="boost-note">
            <h4>{t("boost.note")}</h4>
            <p>{t("boost.noteDesc")}</p>
          </section>

          {/* Order link */}
          <section className="boost-actions">
            <a 
              href={`https://www.ovh.com/manager/#/web/hosting/${serviceName}/boost`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              {t("boost.order")} ↗
            </a>
          </section>
        </>
      )}
    </div>
  );
}

export default BoostTab;
