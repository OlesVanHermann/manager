// ============================================================
// CHANGE TAB - Wizard de changement d'offre en 3 étapes
// NAV3: Offre > NAV4: Changement d'offre
// Steps: 1. Sélection offre, 2. Configuration, 3. Paiement
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  changeService,
  type AvailableOffer,
  type OrderDetails,
} from "./ChangeTab.service";
import type { Hosting } from "../../hosting.types";
import "./ChangeTab.css";

interface ChangeTabProps {
  serviceName: string;
  details: Hosting;
  onRefresh?: () => void;
}

type Step = 1 | 2 | 3;

interface OfferFeatures {
  diskSize: number;
  traffic: string;
  emailsQuota: number;
  databasesCount: number;
  ftpUsersCount: number;
}

export function ChangeTab({ serviceName, details, onRefresh }: ChangeTabProps) {
  const { t } = useTranslation("web-cloud/hosting/index");

  // Wizard state
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Offers
  const [availableOffers, setAvailableOffers] = useState<AvailableOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<AvailableOffer | null>(null);
  const [offerFeatures, setOfferFeatures] = useState<Record<string, OfferFeatures>>({});

  // Step 2: Configuration
  const [duration, setDuration] = useState<string>("P1M");
  const [autoRenew, setAutoRenew] = useState(true);

  // Step 3: Payment
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [contractsAccepted, setContractsAccepted] = useState(false);
  const [autoPay, setAutoPay] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState<{ orderId: number; url: string } | null>(null);

  // Load available offers
  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const offers = await changeService.getAvailableOffers(serviceName);
      setAvailableOffers(offers);

      // Load features for each offer
      const featuresMap: Record<string, OfferFeatures> = {};
      for (const offer of offers.slice(0, 5)) {
        try {
          const caps = await changeService.getOfferCapabilities(offer.offer);
          featuresMap[offer.offer] = caps;
        } catch {
          // Fallback features
          featuresMap[offer.offer] = {
            diskSize: 0,
            traffic: "Illimité",
            emailsQuota: 0,
            databasesCount: 0,
            ftpUsersCount: 0,
          };
        }
      }
      setOfferFeatures(featuresMap);
    } catch (err) {
      setError("Impossible de charger les offres disponibles");
      console.error("[ChangeTab] Error loading offers:", err);
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  // Load order details when moving to step 3
  const loadOrderDetails = useCallback(async () => {
    if (!selectedOffer) return;

    try {
      setLoading(true);
      setError(null);

      const details = await changeService.getUpgradePlanDetails(
        serviceName,
        selectedOffer.offer
      );
      setOrderDetails(details);
    } catch (err) {
      setError("Impossible de charger les détails de la commande");
      console.error("[ChangeTab] Error loading order details:", err);
    } finally {
      setLoading(false);
    }
  }, [serviceName, selectedOffer]);

  // Handle step navigation
  const goToStep = (newStep: Step) => {
    if (newStep === 3) {
      loadOrderDetails();
    }
    setStep(newStep);
  };

  // Handle order execution
  const handleOrder = async () => {
    if (!selectedOffer || !contractsAccepted) return;

    try {
      setProcessing(true);
      setError(null);

      const result = await changeService.executeUpgrade(
        serviceName,
        selectedOffer.offer,
        1,
        autoPay
      );

      setSuccess(result);
      if (onRefresh) onRefresh();
    } catch (err) {
      setError("Erreur lors de la commande. Veuillez réessayer.");
      console.error("[ChangeTab] Order error:", err);
    } finally {
      setProcessing(false);
    }
  };

  // Format disk size
  const formatDisk = (gb: number) => {
    if (gb >= 1000) return `${(gb / 1000).toFixed(0)} To`;
    return `${gb} Go`;
  };

  // Loading state
  if (loading && step === 1) {
    return (
      <div className="changetab">
        <div className="changetab-skeleton">
          <div className="changetab-skeleton-stepper" />
          <div className="changetab-skeleton-grid">
            <div className="changetab-skeleton-card" />
            <div className="changetab-skeleton-card" />
            <div className="changetab-skeleton-card" />
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="changetab">
        <div className="changetab-success">
          <div className="changetab-success-icon">✓</div>
          <h3>Commande créée avec succès</h3>
          <p>
            Votre commande n°{success.orderId} a été créée. Vous allez être
            redirigé vers la page de paiement.
          </p>
          <a
            href={success.url}
            target="_blank"
            rel="noopener noreferrer"
            className="changetab-success-link"
          >
            Accéder au paiement
          </a>
        </div>
      </div>
    );
  }

  // No offers available
  if (!loading && availableOffers.length === 0) {
    return (
      <div className="changetab">
        <div className="changetab-empty">
          <div className="changetab-empty-icon">📦</div>
          <h3>Aucune offre disponible</h3>
          <p>
            Vous disposez déjà de l'offre la plus complète ou aucune migration
            n'est disponible pour votre hébergement.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="changetab">
      {/* Stepper */}
      <div className="changetab-stepper">
        <div className={`changetab-step ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
          <span className="changetab-step-number">{step > 1 ? "✓" : "1"}</span>
          <span className="changetab-step-label">Offre</span>
        </div>
        <div className={`changetab-step-connector ${step > 1 ? "completed" : ""}`} />
        <div className={`changetab-step ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
          <span className="changetab-step-number">{step > 2 ? "✓" : "2"}</span>
          <span className="changetab-step-label">Configuration</span>
        </div>
        <div className={`changetab-step-connector ${step > 2 ? "completed" : ""}`} />
        <div className={`changetab-step ${step >= 3 ? "active" : ""}`}>
          <span className="changetab-step-number">3</span>
          <span className="changetab-step-label">Paiement</span>
        </div>
      </div>

      {/* Content */}
      <div className="changetab-content">
        {/* Error */}
        {error && (
          <div className="changetab-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Step 1: Offer Selection */}
        {step === 1 && (
          <>
            {/* Current Offer */}
            <div className="changetab-current">
              <div className="changetab-current-label">Offre actuelle</div>
              <div className="changetab-current-value">
                <span className="changetab-current-name">{serviceName}</span>
                <span className="changetab-current-badge">
                  {details.offer || "Standard"}
                </span>
              </div>
            </div>

            {/* Available Offers */}
            <div className="changetab-offers-title">
              Choisissez votre nouvelle offre
            </div>
            <div className="changetab-offers-grid">
              {availableOffers.map((offer, index) => {
                const features = offerFeatures[offer.offer];
                const isSelected = selectedOffer?.offer === offer.offer;
                const isRecommended = index === 0;

                return (
                  <div
                    key={offer.offer}
                    className={`changetab-offer-card ${isSelected ? "selected" : ""} ${isRecommended ? "recommended" : ""}`}
                    onClick={() => setSelectedOffer(offer)}
                  >
                    <div className="changetab-offer-header">
                      <span className="changetab-offer-name">{offer.offer}</span>
                      <div className="changetab-offer-price">
                        <div className="changetab-offer-price-value">
                          {offer.price?.text || "—"}
                        </div>
                        <div className="changetab-offer-price-period">
                          /{offer.duration === "P1M" ? "mois" : "an"}
                        </div>
                      </div>
                    </div>

                    {features && (
                      <div className="changetab-offer-features">
                        <div className="changetab-offer-feature">
                          <span className="changetab-offer-feature-icon upgrade">↑</span>
                          <span>Espace disque : {formatDisk(features.diskSize)}</span>
                        </div>
                        <div className="changetab-offer-feature">
                          <span className="changetab-offer-feature-icon">✓</span>
                          <span>Trafic : {features.traffic}</span>
                        </div>
                        <div className="changetab-offer-feature">
                          <span className="changetab-offer-feature-icon">✓</span>
                          <span>{features.emailsQuota} comptes email</span>
                        </div>
                        <div className="changetab-offer-feature">
                          <span className="changetab-offer-feature-icon">✓</span>
                          <span>{features.databasesCount} bases de données</span>
                        </div>
                        <div className="changetab-offer-feature">
                          <span className="changetab-offer-feature-icon">✓</span>
                          <span>{features.ftpUsersCount} utilisateurs FTP</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="changetab-actions">
              <div />
              <button
                className="changetab-btn-next"
                disabled={!selectedOffer}
                onClick={() => goToStep(2)}
              >
                Continuer
              </button>
            </div>
          </>
        )}

        {/* Step 2: Configuration */}
        {step === 2 && (
          <>
            <div className="changetab-config-section">
              <h4>Durée d'engagement</h4>
              <label
                className={`changetab-config-option ${duration === "P1M" ? "selected" : ""}`}
                onClick={() => setDuration("P1M")}
              >
                <input
                  type="radio"
                  name="duration"
                  checked={duration === "P1M"}
                  onChange={() => setDuration("P1M")}
                />
                <div className="changetab-config-option-content">
                  <strong>Mensuel</strong>
                  <p>Paiement chaque mois, sans engagement</p>
                </div>
                <span className="changetab-config-option-price">
                  {selectedOffer?.price?.text || "—"}
                </span>
              </label>
              <label
                className={`changetab-config-option ${duration === "P1Y" ? "selected" : ""}`}
                onClick={() => setDuration("P1Y")}
              >
                <input
                  type="radio"
                  name="duration"
                  checked={duration === "P1Y"}
                  onChange={() => setDuration("P1Y")}
                />
                <div className="changetab-config-option-content">
                  <strong>Annuel</strong>
                  <p>Économisez jusqu'à 2 mois par rapport au mensuel</p>
                </div>
                <span className="changetab-config-option-price">—</span>
              </label>
            </div>

            <div className="changetab-config-section">
              <h4>Renouvellement</h4>
              <label
                className={`changetab-config-option ${autoRenew ? "selected" : ""}`}
                onClick={() => setAutoRenew(true)}
              >
                <input
                  type="radio"
                  name="renew"
                  checked={autoRenew}
                  onChange={() => setAutoRenew(true)}
                />
                <div className="changetab-config-option-content">
                  <strong>Renouvellement automatique</strong>
                  <p>Votre service sera renouvelé automatiquement à l'échéance</p>
                </div>
              </label>
              <label
                className={`changetab-config-option ${!autoRenew ? "selected" : ""}`}
                onClick={() => setAutoRenew(false)}
              >
                <input
                  type="radio"
                  name="renew"
                  checked={!autoRenew}
                  onChange={() => setAutoRenew(false)}
                />
                <div className="changetab-config-option-content">
                  <strong>Renouvellement manuel</strong>
                  <p>Vous serez notifié avant l'expiration pour renouveler</p>
                </div>
              </label>
            </div>

            {/* Actions */}
            <div className="changetab-actions">
              <button className="changetab-btn-back" onClick={() => goToStep(1)}>
                Retour
              </button>
              <button className="changetab-btn-next" onClick={() => goToStep(3)}>
                Continuer
              </button>
            </div>
          </>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <>
            {loading ? (
              <div className="changetab-skeleton">
                <div className="changetab-skeleton-card" style={{ height: 200 }} />
              </div>
            ) : (
              <>
                {/* Order Summary */}
                <div className="changetab-summary">
                  <div className="changetab-summary-header">
                    <h4>Récapitulatif de la commande</h4>
                  </div>
                  <div className="changetab-summary-body">
                    <div className="changetab-summary-row">
                      <span className="changetab-summary-label">Service</span>
                      <span className="changetab-summary-value">{serviceName}</span>
                    </div>
                    <div className="changetab-summary-row">
                      <span className="changetab-summary-label">Nouvelle offre</span>
                      <span className="changetab-summary-value">
                        {selectedOffer?.offer}
                      </span>
                    </div>
                    <div className="changetab-summary-row">
                      <span className="changetab-summary-label">Durée</span>
                      <span className="changetab-summary-value">
                        {duration === "P1M" ? "1 mois" : "1 an"}
                      </span>
                    </div>
                    <div className="changetab-summary-row">
                      <span className="changetab-summary-label">Renouvellement</span>
                      <span className="changetab-summary-value">
                        {autoRenew ? "Automatique" : "Manuel"}
                      </span>
                    </div>

                    {orderDetails?.details?.map((item, idx) => (
                      <div key={idx} className="changetab-summary-row">
                        <span className="changetab-summary-label">
                          {item.description}
                        </span>
                        <span className="changetab-summary-value">
                          {item.totalPrice?.text || "—"}
                        </span>
                      </div>
                    ))}

                    <div className="changetab-summary-total">
                      <span className="changetab-summary-total-label">Total TTC</span>
                      <span className="changetab-summary-total-value">
                        {orderDetails?.order?.prices?.withTax?.text ||
                          selectedOffer?.price?.text ||
                          "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contracts */}
                {orderDetails?.contracts && orderDetails.contracts.length > 0 && (
                  <div className="changetab-contracts">
                    <h4>Conditions générales</h4>
                    <div className="changetab-contracts-list">
                      {orderDetails.contracts.map((contract, idx) => (
                        <label key={idx} className="changetab-contract-item">
                          <input
                            type="checkbox"
                            checked={contractsAccepted}
                            onChange={(e) => setContractsAccepted(e.target.checked)}
                          />
                          <a href={contract.url} target="_blank" rel="noopener noreferrer">
                            {contract.name}
                          </a>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Options */}
                <div className="changetab-payment-options">
                  <h4>Mode de paiement</h4>
                  <label
                    className={`changetab-config-option ${!autoPay ? "selected" : ""}`}
                    onClick={() => setAutoPay(false)}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={!autoPay}
                      onChange={() => setAutoPay(false)}
                    />
                    <div className="changetab-config-option-content">
                      <strong>Paiement manuel</strong>
                      <p>Choisissez votre moyen de paiement sur la page de commande</p>
                    </div>
                  </label>
                  <label
                    className={`changetab-config-option ${autoPay ? "selected" : ""}`}
                    onClick={() => setAutoPay(true)}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={autoPay}
                      onChange={() => setAutoPay(true)}
                    />
                    <div className="changetab-config-option-content">
                      <strong>Paiement automatique</strong>
                      <p>Utiliser le moyen de paiement par défaut de votre compte</p>
                    </div>
                  </label>
                </div>

                {/* If no contracts from API, show a simple acceptance */}
                {(!orderDetails?.contracts || orderDetails.contracts.length === 0) && (
                  <div className="changetab-contracts">
                    <h4>Conditions générales</h4>
                    <div className="changetab-contracts-list">
                      <label className="changetab-contract-item">
                        <input
                          type="checkbox"
                          checked={contractsAccepted}
                          onChange={(e) => setContractsAccepted(e.target.checked)}
                        />
                        <span style={{ fontSize: 13, color: "#78350F" }}>
                          J'accepte les conditions générales d'utilisation OVHcloud
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="changetab-actions">
                  <button className="changetab-btn-back" onClick={() => goToStep(2)}>
                    Retour
                  </button>
                  <button
                    className="changetab-btn-next"
                    disabled={!contractsAccepted || processing}
                    onClick={handleOrder}
                  >
                    {processing ? "Traitement en cours..." : "Valider la commande"}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ChangeTab;
