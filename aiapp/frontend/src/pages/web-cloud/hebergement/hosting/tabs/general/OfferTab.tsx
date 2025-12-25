// ============================================================
// OFFER TAB - Changement d'offre hébergement
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { generalService } from "./GeneralTab.service";

interface OfferTabProps {
  serviceName: string;
}

interface AvailableOffer {
  planCode: string;
  name: string;
  price: string;
  priceWithTax: string;
  features: string[];
}

interface OrderSummary {
  offer: string;
  duration: string;
  priceHT: string;
  priceTTC: string;
  contracts: { name: string; url: string }[];
}

type Step = "offer" | "duration" | "contracts" | "summary";

export function OfferTab({ serviceName }: OfferTabProps) {
  const { t } = useTranslation("web-cloud/hosting/tabs/offer");
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("offer");
  const [currentOffer, setCurrentOffer] = useState<string>("");
  const [availableOffers, setAvailableOffers] = useState<AvailableOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<AvailableOffer | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [agreeContracts, setAgreeContracts] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [ordering, setOrdering] = useState(false);

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      const hosting = await generalService.getHosting(serviceName);
      setCurrentOffer(hosting.offer || "");
      const offers = await generalService.getAvailableOffers(serviceName);
      setAvailableOffers(offers || []);
    } catch (err) {
      console.error("[OfferTab] Error:", err);
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadOffers(); }, [loadOffers]);

  const handleSelectOffer = (offer: AvailableOffer) => {
    setSelectedOffer(offer);
    setStep("duration");
  };

  const handleSelectDuration = (duration: string) => {
    setSelectedDuration(duration);
    setStep("contracts");
  };

  const handleAcceptContracts = () => {
    setAgreeContracts(true);
    setOrderSummary({
      offer: selectedOffer?.name || "",
      duration: selectedDuration,
      priceHT: selectedOffer?.price || "0,00 €",
      priceTTC: selectedOffer?.priceWithTax || "0,00 €",
      contracts: []
    });
    setStep("summary");
  };

  const handleOrder = async () => {
    try {
      setOrdering(true);
      await generalService.orderUpgrade(serviceName, selectedOffer!.planCode, selectedDuration);
      alert(t("orderSuccess"));
    } catch (err) {
      console.error("[OfferTab] Order error:", err);
      alert(t("orderError"));
    } finally {
      setOrdering(false);
    }
  };

  const handleBack = () => {
    if (step === "duration") setStep("offer");
    else if (step === "contracts") setStep("duration");
    else if (step === "summary") setStep("contracts");
  };

  if (loading) {
    return (
      <div className="offer-tab">
        <div className="loading-state">
          <div className="spinner" />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="offer-tab">
      <div className="tab-header">
        {step !== "offer" && (
          <button className="btn btn-back" onClick={handleBack}>
            ← {t("back")}
          </button>
        )}
        <h3>{t("title")}</h3>
        <p className="text-muted">{t("description")}</p>
      </div>

      {/* Stepper */}
      <div className="stepper">
        <div className={`step ${step === "offer" ? "active" : ""}`}>1. {t("steps.offer")}</div>
        <div className={`step ${step === "duration" ? "active" : ""}`}>2. {t("steps.duration")}</div>
        <div className={`step ${step === "contracts" ? "active" : ""}`}>3. {t("steps.contracts")}</div>
        <div className={`step ${step === "summary" ? "active" : ""}`}>4. {t("steps.summary")}</div>
      </div>

      {/* Step: Offer */}
      {step === "offer" && (
        <div className="step-content">
          {availableOffers.length === 0 ? (
            <div className="alert alert-warning">{t("noOffersAvailable")}</div>
          ) : (
            <div className="offers-grid">
              {availableOffers.map((offer) => (
                <div 
                  key={offer.planCode} 
                  className={`offer-card ${offer.planCode === currentOffer ? "current" : ""}`}
                  onClick={() => handleSelectOffer(offer)}
                >
                  <h4>{offer.name}</h4>
                  <div className="offer-price">{offer.priceWithTax}/mois</div>
                  <ul className="offer-features">
                    {offer.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                  {offer.planCode === currentOffer && (
                    <span className="badge badge-info">{t("currentOffer")}</span>
                  )}
                  <button className="btn btn-primary">{t("selectOffer")}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step: Duration */}
      {step === "duration" && selectedOffer && (
        <div className="step-content">
          <h4>{t("selectDuration")}</h4>
          <div className="duration-options">
            {["12", "24", "36"].map(months => (
              <label key={months} className="radio-card">
                <input
                  type="radio"
                  name="duration"
                  value={months}
                  checked={selectedDuration === months}
                  onChange={() => handleSelectDuration(months)}
                />
                <span>{months} {t("months")}</span>
              </label>
            ))}
          </div>
          <button 
            className="btn btn-primary mt-4"
            disabled={!selectedDuration}
            onClick={() => setStep("contracts")}
          >
            {t("continue")}
          </button>
        </div>
      )}

      {/* Step: Contracts */}
      {step === "contracts" && (
        <div className="step-content">
          <h4>{t("acceptContracts")}</h4>
          <div className="contracts-list">
            <p>{t("contractsDescription")}</p>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeContracts}
                onChange={(e) => setAgreeContracts(e.target.checked)}
              />
              {t("agreeToContracts")}
            </label>
          </div>
          <button 
            className="btn btn-primary mt-4"
            disabled={!agreeContracts}
            onClick={handleAcceptContracts}
          >
            {t("continue")}
          </button>
        </div>
      )}

      {/* Step: Summary */}
      {step === "summary" && orderSummary && (
        <div className="step-content">
          <h4>{t("orderSummary")}</h4>
          <table className="summary-table">
            <tbody>
              <tr>
                <td>{t("offer")}</td>
                <td className="text-right font-medium">{orderSummary.offer}</td>
              </tr>
              <tr>
                <td>{t("duration")}</td>
                <td className="text-right">{orderSummary.duration} {t("months")}</td>
              </tr>
              <tr>
                <td>{t("priceHT")}</td>
                <td className="text-right">{orderSummary.priceHT}</td>
              </tr>
              <tr className="total-row">
                <td>{t("priceTTC")}</td>
                <td className="text-right font-bold">{orderSummary.priceTTC}</td>
              </tr>
            </tbody>
          </table>
          <div className="alert alert-info mt-4">
            {t("orderInfo")}
          </div>
          <button 
            className="btn btn-primary mt-4"
            onClick={handleOrder}
            disabled={ordering}
          >
            {ordering ? t("ordering") : t("confirmOrder")}
          </button>
        </div>
      )}
    </div>
  );
}

export default OfferTab;
