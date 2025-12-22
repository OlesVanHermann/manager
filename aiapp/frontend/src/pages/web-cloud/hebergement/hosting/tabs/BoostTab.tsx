// ============================================================
// HOSTING TAB: BOOST - Performances temporaires (sans redirection)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Hosting } from "../../../../../services/web-cloud.hosting";

interface Props { 
  serviceName: string; 
  details?: Hosting;
}

/** Modal pour activer le Boost. */
function ActivateBoostModal({ serviceName, availableOffers, isOpen, onClose, onSuccess }: {
  serviceName: string;
  availableOffers: any[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [selectedOffer, setSelectedOffer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (availableOffers.length > 0 && !selectedOffer) {
      setSelectedOffer(availableOffers[0].offer);
    }
  }, [availableOffers, selectedOffer]);

  if (!isOpen) return null;

  const handleActivate = async () => {
    if (!selectedOffer) return;
    setLoading(true);
    try {
      await hostingService.activateBoost(serviceName, selectedOffer);
      alert("Boost activé avec succès !");
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
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Activer le Boost</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="info-banner">
            <span className="info-icon">⚡</span>
            <p>Le Boost augmente temporairement les ressources de votre hébergement pour absorber les pics de trafic.</p>
          </div>

          {availableOffers.length === 0 ? (
            <div className="empty-state">
              <p>Aucune offre Boost disponible pour votre hébergement.</p>
            </div>
          ) : (
            <div className="offers-grid">
              {availableOffers.map(offer => (
                <div 
                  key={offer.offer}
                  className={`offer-card ${selectedOffer === offer.offer ? "selected" : ""}`}
                  onClick={() => setSelectedOffer(offer.offer)}
                >
                  <h4>{offer.offer}</h4>
                  <p className="offer-desc">Boost de performance</p>
                  {offer.price && (
                    <p className="offer-price">{offer.price.text}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button 
            className="btn btn-primary" 
            onClick={handleActivate} 
            disabled={loading || !selectedOffer || availableOffers.length === 0}
          >
            {loading ? "Activation..." : "Activer le Boost"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Onglet Boost avec activation/désactivation. */
export function BoostTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [boostInfo, setBoostInfo] = useState<any>(null);
  const [availableOffers, setAvailableOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);

  const loadBoostInfo = useCallback(async () => {
    try {
      setLoading(true);
      const [info, offers] = await Promise.all([
        hostingService.getBoostInfo(serviceName).catch(() => null),
        hostingService.getAvailableBoostOffers(serviceName).catch(() => [])
      ]);
      setBoostInfo(info);
      setAvailableOffers(offers || []);
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadBoostInfo(); }, [loadBoostInfo]);

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
          <section className="boost-status boost-active">
            <div className="status-icon">⚡</div>
            <div className="status-content">
              <h4>{t("boost.active")}</h4>
              <p>{t("boost.currentOffer")}: <strong>{details?.boostOffer || boostInfo?.offer || "Performance"}</strong></p>
            </div>
          </section>

          <section className="boost-features">
            <h4>Avantages actifs</h4>
            <ul className="features-list">
              <li>⚡ {t("boost.featureCpu")}</li>
              <li>📊 {t("boost.featureRam")}</li>
              <li>🔝 {t("boost.featurePriority")}</li>
            </ul>
          </section>

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
          <section className="boost-status boost-inactive">
            <div className="status-icon">○</div>
            <div className="status-content">
              <h4>Boost non activé</h4>
              <p>Augmentez temporairement les performances de votre hébergement.</p>
            </div>
          </section>

          <section className="boost-info-box">
            <h4>{t("boost.whatIs")}</h4>
            <p>{t("boost.explanation")}</p>
          </section>

          <section className="boost-features">
            <h4>Avec le Boost, vous bénéficiez de :</h4>
            <ul className="features-list">
              <li>⚡ {t("boost.featureCpu")}</li>
              <li>📊 {t("boost.featureRam")}</li>
              <li>🔝 {t("boost.featurePriority")}</li>
            </ul>
          </section>

          <section className="boost-note">
            <h4>{t("boost.note")}</h4>
            <p>{t("boost.noteDesc")}</p>
          </section>

          {/* SANS REDIRECTION - Modal native */}
          <section className="boost-actions">
            <button className="btn btn-primary" onClick={() => setShowActivateModal(true)}>
              {t("boost.activate")}
            </button>
          </section>
        </>
      )}

      <ActivateBoostModal
        serviceName={serviceName}
        availableOffers={availableOffers}
        isOpen={showActivateModal}
        onClose={() => setShowActivateModal(false)}
        onSuccess={loadBoostInfo}
      />
    </div>
  );
}

export default BoostTab;
