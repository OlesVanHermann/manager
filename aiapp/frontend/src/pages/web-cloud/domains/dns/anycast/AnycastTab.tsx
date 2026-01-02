// ============================================================
import "./AnycastTab.css";
// TAB: ANYCAST - Commander DNS Anycast pour le domaine
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { anycastService } from "./AnycastTab.service";

interface Props {
  domain: string;
  zoneName: string;
  onNavigateToDnsServers?: () => void;
}

interface AnycastStatus {
  active: boolean;
  expirationDate?: string;
}

interface AnycastPrice {
  duration: string;
  priceHT: number;
  priceTTC: number;
  currency: string;
}

// ============ ICONS ============

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const RocketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

// ============ COMPOSANT PRINCIPAL ============

export function AnycastTab({ domain, zoneName, onNavigateToDnsServers }: Props) {
  const { t } = useTranslation("web-cloud/domains/anycast");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [status, setStatus] = useState<AnycastStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stepper
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState("P1Y");
  const [prices, setPrices] = useState<AnycastPrice[]>([]);
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // ---------- LOAD DATA ----------
  const loadStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [statusData, pricesData] = await Promise.all([
        // getAnycastStatus uses /domain/{domain}/option (domain-level)
        anycastService.getAnycastStatus(domain),
        // getAnycastPrices uses /order/domain/zone/{zoneName}/dnsAnycast (zone-level)
        anycastService.getAnycastPrices(zoneName),
      ]);
      setStatus(statusData);
      setPrices(pricesData);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [domain, zoneName]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // ---------- ORDER ----------
  const handleOrder = async () => {
    try {
      setOrdering(true);
      await anycastService.orderAnycast(zoneName, selectedDuration);
      setOrderSuccess(true);
      // Reload status after a delay
      setTimeout(() => loadStatus(), 3000);
    } catch (err) {
      setError(String(err));
    } finally {
      setOrdering(false);
    }
  };

  // ---------- HELPERS ----------
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency || "EUR",
    }).format(price);
  };

  const selectedPrice = prices.find((p) => p.duration === selectedDuration);

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="anycast-loading">
        <div className="anycast-skeleton" style={{ height: 200 }} />
        <div className="anycast-skeleton" style={{ height: 300 }} />
      </div>
    );
  }

  // ---------- RENDER ACTIVE ----------
  if (status?.active) {
    return (
      <div className="anycast-tab">
        <button className="anycast-back-link" onClick={onNavigateToDnsServers}>
          <ArrowLeftIcon /> {t("backToDnsServers")}
        </button>

        <div className="anycast-active-banner">
          <div className="anycast-active-icon">
            <ShieldCheckIcon />
          </div>
          <div className="anycast-active-content">
            <h3>{t("activeTitle")}</h3>
            <p>{t("activeDescription", { domain })}</p>
            {status.expirationDate && (
              <p className="anycast-expiration">
                {t("expiresOn")}: {new Date(status.expirationDate).toLocaleDateString("fr-FR")}
              </p>
            )}
          </div>
        </div>

        <div className="anycast-info-panel">
          <h4>{t("benefitsTitle")}</h4>
          <div className="anycast-benefits">
            <div className="anycast-benefit">
              <RocketIcon />
              <div>
                <h5>{t("benefitPerformanceTitle")}</h5>
                <p>{t("benefitPerformanceDesc")}</p>
              </div>
            </div>
            <div className="anycast-benefit">
              <ShieldCheckIcon />
              <div>
                <h5>{t("benefitAvailabilityTitle")}</h5>
                <p>{t("benefitAvailabilityDesc")}</p>
              </div>
            </div>
            <div className="anycast-benefit">
              <GlobeIcon />
              <div>
                <h5>{t("benefitCoverageTitle")}</h5>
                <p>{t("benefitCoverageDesc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- RENDER ORDER FORM ----------
  return (
    <div className="anycast-tab">
      <button className="anycast-back-link" onClick={onNavigateToDnsServers}>
        <ArrowLeftIcon /> {t("backToDnsServers")}
      </button>

      <h2 className="anycast-title">{t("orderTitle")}</h2>

      <div className="anycast-description">
        <p>
          {t("orderDescription1")} <strong>{domain}</strong> {t("orderDescription2")}
        </p>
        <p className="anycast-notice">{t("activationNotice")}</p>
        <p className="anycast-notice">{t("propagationNotice")}</p>
      </div>

      {error && <div className="anycast-error">{error}</div>}

      {/* No prices available - cannot order */}
      {prices.length === 0 && !orderSuccess && (
        <div className="anycast-info-message">
          <p>{t("noPricesAvailable", { defaultValue: "L'option DNS Anycast n'est pas disponible pour cette zone actuellement." })}</p>
        </div>
      )}

      {orderSuccess ? (
        <div className="anycast-success">
          <CheckIcon />
          <div>
            <h3>{t("orderSuccessTitle")}</h3>
            <p>{t("orderSuccessDesc")}</p>
          </div>
        </div>
      ) : prices.length > 0 ? (
        <div className="anycast-order-layout">
          {/* Stepper */}
          <div className="anycast-stepper">
            {/* Step 1 */}
            <div className={`anycast-step ${currentStep === 1 ? "active" : currentStep > 1 ? "completed" : ""}`}>
              <div className="anycast-step-header">
                <h3>{t("step1Title")}</h3>
              </div>
              <div className="anycast-step-content">
                {prices.map((price) => (
                  <div
                    key={price.duration}
                    className={`anycast-duration-card ${selectedDuration === price.duration ? "selected" : ""}`}
                    onClick={() => setSelectedDuration(price.duration)}
                  >
                    <div className="anycast-duration-info">
                      <span className="anycast-duration-label">
                        {t(`duration.${price.duration}`, { defaultValue: price.duration })}
                      </span>
                      <span className="anycast-duration-price">
                        {formatPrice(price.priceHT, price.currency)} {t("perYear")}
                      </span>
                    </div>
                    {selectedDuration === price.duration && (
                      <div className="anycast-duration-check">
                        <CheckIcon />
                      </div>
                    )}
                  </div>
                ))}

                <div className="anycast-step-actions">
                  <button
                    className="anycast-btn-primary"
                    onClick={() => setCurrentStep(2)}
                    disabled={!selectedPrice}
                  >
                    {t("next")} →
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`anycast-step ${currentStep === 2 ? "active" : currentStep < 2 ? "inactive" : ""}`}>
              <div className="anycast-step-header">
                <h3>{t("step2Title")}</h3>
              </div>
              {currentStep >= 2 && selectedPrice && (
                <div className="anycast-step-content">
                  <div className="anycast-summary">
                    <div className="anycast-summary-row">
                      <span>{t("priceHT")}:</span>
                      <span>{formatPrice(selectedPrice.priceHT, selectedPrice.currency)}</span>
                    </div>
                    <div className="anycast-summary-row">
                      <span>{t("priceTTC")}:</span>
                      <span>{formatPrice(selectedPrice.priceTTC, selectedPrice.currency)}</span>
                    </div>
                  </div>

                  <div className="anycast-step-actions">
                    <button className="anycast-btn-secondary" onClick={() => setCurrentStep(1)}>
                      ← {t("previous")}
                    </button>
                    <button
                      className="anycast-btn-primary"
                      onClick={handleOrder}
                      disabled={ordering}
                    >
                      {ordering ? tCommon("loading") : t("confirmOrder")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Panel */}
          <div className="anycast-info-panel">
            <h4>{t("benefitsTitle")}</h4>
            <div className="anycast-benefits">
              <div className="anycast-benefit">
                <RocketIcon />
                <div>
                  <h5>{t("benefitPerformanceTitle")}</h5>
                  <p>{t("benefitPerformanceDesc")}</p>
                </div>
              </div>
              <div className="anycast-benefit">
                <ShieldCheckIcon />
                <div>
                  <h5>{t("benefitAvailabilityTitle")}</h5>
                  <p>{t("benefitAvailabilityDesc")}</p>
                </div>
              </div>
              <div className="anycast-benefit">
                <GlobeIcon />
                <div>
                  <h5>{t("benefitCoverageTitle")}</h5>
                  <p>{t("benefitCoverageDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AnycastTab;
