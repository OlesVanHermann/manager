// ============================================================
// HOSTING TAB: BOOST - Booster mon offre
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Hosting } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  details?: Hosting | null;
}

interface BoostOffer {
  offer: string;
  price: string;
  duration: string;
}

const BOOST_OFFERS: BoostOffer[] = [
  { offer: "STARTER", price: "2,99 €", duration: "7 jours" },
  { offer: "PERFORMANCE_1", price: "9,99 €", duration: "7 jours" },
  { offer: "PERFORMANCE_2", price: "14,99 €", duration: "7 jours" },
];

/** Onglet Boost - Améliorer temporairement les performances. */
export function BoostTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [loading, setLoading] = useState(false);
  const [currentBoost, setCurrentBoost] = useState<string | null>(null);

  useEffect(() => {
    if (details?.boostOffer) {
      setCurrentBoost(details.boostOffer);
    }
  }, [details]);

  const handleOrderBoost = async (offer: string) => {
    const orderUrl = `https://www.ovh.com/manager/#/web/hosting/${serviceName}/boost`;
    window.open(orderUrl, '_blank');
  };

  const handleDeactivateBoost = async () => {
    if (!confirm(t("boost.confirmDeactivate"))) return;
    try {
      setLoading(true);
      await hostingService.deactivateBoost(serviceName);
      setCurrentBoost(null);
    } catch (err) {
      alert(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="boost-tab">
      <div className="tab-header">
        <div>
          <h3>{t("boost.title")}</h3>
          <p className="tab-description">{t("boost.description")}</p>
        </div>
      </div>

      {currentBoost ? (
        <div className="boost-active-card">
          <div className="boost-status">
            <div className="status-icon enabled">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
            </div>
            <div className="status-text">
              <span className="status-label enabled">{t("boost.active")}</span>
              <span className="status-description">{t("boost.currentOffer")}: {currentBoost}</span>
            </div>
          </div>
          <button
            className="btn btn-danger"
            onClick={handleDeactivateBoost}
            disabled={loading}
          >
            {loading ? "..." : t("boost.deactivate")}
          </button>
        </div>
      ) : (
        <>
          <div className="boost-info-box">
            <h4>{t("boost.whatIs")}</h4>
            <p>{t("boost.explanation")}</p>
          </div>

          <div className="boost-offers">
            {BOOST_OFFERS.map((offer) => (
              <div key={offer.offer} className="boost-offer-card">
                <div className="offer-header">
                  <span className="offer-name">{offer.offer}</span>
                  <span className="offer-price">{offer.price}</span>
                </div>
                <div className="offer-duration">{offer.duration}</div>
                <ul className="offer-features">
                  <li>{t("boost.featureCpu")}</li>
                  <li>{t("boost.featureRam")}</li>
                  <li>{t("boost.featurePriority")}</li>
                </ul>
                <button
                  className="btn btn-primary"
                  onClick={() => handleOrderBoost(offer.offer)}
                >
                  {t("boost.order")}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="info-box" style={{ marginTop: 'var(--space-6)' }}>
        <h4>{t("boost.note")}</h4>
        <p>{t("boost.noteDesc")}</p>
      </div>
    </div>
  );
}

export default BoostTab;
