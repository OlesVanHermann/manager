// ============================================================
// MODAL - Order Pack (Commander un pack de licences)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EmailOffer } from "./types";
import { OfferBadge } from "./OfferBadge";
import { OFFER_CONFIG } from "./emails.constants";

interface OrderPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  domains: string[];
  onSubmit: (data: OrderPackData) => Promise<void>;
}

interface OrderPackData {
  offer: EmailOffer;
  quantity: number;
  scope: "single-domain" | "multi-domain";
  domain?: string;
  name: string;
}

const PRICING: Record<EmailOffer, { base: number; perLicense: number }> = {
  exchange: { base: 0, perLicense: 4.99 },
  "email-pro": { base: 0, perLicense: 2.99 },
  zimbra: { base: 0, perLicense: 3.99 },
  "mx-plan": { base: 0, perLicense: 0 },
};

// Remises volume
const VOLUME_DISCOUNTS = [
  { min: 1, max: 4, discount: 0 },
  { min: 5, max: 9, discount: 0.05 },
  { min: 10, max: 24, discount: 0.10 },
  { min: 25, max: 49, discount: 0.20 },
  { min: 50, max: Infinity, discount: 0.30 },
];

const getVolumeDiscount = (quantity: number): number => {
  const tier = VOLUME_DISCOUNTS.find(d => quantity >= d.min && quantity <= d.max);
  return tier?.discount || 0;
};

const QUICK_QUANTITIES = [5, 10, 25, 50];

/** Modal de commande d'un pack de licences. */
export function OrderPackModal({
  isOpen,
  onClose,
  domains,
  onSubmit,
}: OrderPackModalProps) {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const [offer, setOffer] = useState<EmailOffer>("exchange");
  const [quantity, setQuantity] = useState(5);
  const [scope, setScope] = useState<"single-domain" | "multi-domain">("single-domain");
  const [domain, setDomain] = useState(domains[0] || "");
  const [name, setName] = useState("");

  const pricing = PRICING[offer];
  const discount = getVolumeDiscount(quantity);
  const discountedPrice = pricing.perLicense * (1 - discount);
  const monthlyTotal = quantity * discountedPrice;
  const originalTotal = quantity * pricing.perLicense;

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim()) {
      setError(t("orderPack.errors.nameRequired"));
      return;
    }

    if (scope === "single-domain" && !domain) {
      setError(t("orderPack.errors.domainRequired"));
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        offer,
        quantity,
        scope,
        domain: scope === "single-domain" ? domain : undefined,
        name,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("orderPack.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setOffer("exchange");
    setQuantity(5);
    setScope("single-domain");
    setName("");
    setError(null);
    onClose();
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t("orderPack.title")}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="modal-error">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          {/* Progress steps */}
          <div className="wizard-steps">
            <div className={`wizard-step ${step >= 1 ? "active" : ""}`}>
              <span className="step-number">1</span>
              <span className="step-label">{t("orderPack.steps.offer")}</span>
            </div>
            <div className={`wizard-step ${step >= 2 ? "active" : ""}`}>
              <span className="step-number">2</span>
              <span className="step-label">{t("orderPack.steps.config")}</span>
            </div>
            <div className={`wizard-step ${step >= 3 ? "active" : ""}`}>
              <span className="step-number">3</span>
              <span className="step-label">{t("orderPack.steps.confirm")}</span>
            </div>
          </div>

          {/* Step 1: Choose offer */}
          {step === 1 && (
            <div className="wizard-content">
              <h3 className="wizard-title">{t("orderPack.step1.title")}</h3>

              {/* Offer cards */}
              <div className="offer-cards">
                {(["exchange", "email-pro", "zimbra"] as EmailOffer[]).map((o) => (
                  <div
                    key={o}
                    className={`offer-card-select ${offer === o ? "selected" : ""}`}
                    onClick={() => setOffer(o)}
                  >
                    <div className="offer-card-radio">
                      <span className={`radio-dot ${offer === o ? "active" : ""}`} />
                    </div>
                    <OfferBadge offer={o} />
                    <div className="offer-card-content">
                      <h4>{OFFER_CONFIG[o].label}</h4>
                      <p className="offer-desc">{t(`orderPack.offers.${o}`)}</p>
                    </div>
                    <div className="offer-card-price">
                      <span className="price-value">{PRICING[o].perLicense.toFixed(2)} €</span>
                      <span className="price-unit">/licence/mois</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quantity selector with quick buttons */}
              <div className="form-group">
                <label className="form-label">{t("orderPack.fields.quantity")}</label>
                <div className="quantity-row">
                  <div className="quantity-selector">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={loading || quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="qty-input"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      min={1}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>
                  <div className="quick-qty-buttons">
                    {QUICK_QUANTITIES.map((q) => (
                      <button
                        key={q}
                        type="button"
                        className={`quick-qty-btn ${quantity === q ? "selected" : ""}`}
                        onClick={() => setQuantity(q)}
                        disabled={loading}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Volume discount box */}
              {discount > 0 && (
                <div className="discount-box">
                  <span className="discount-icon">✨</span>
                  <div className="discount-content">
                    <span className="discount-title">
                      {t("orderPack.discount.applied", { percent: Math.round(discount * 100) })}
                    </span>
                    <span className="discount-detail">
                      {quantity} × {discountedPrice.toFixed(2)} € = {monthlyTotal.toFixed(2)} €/mois
                      <span className="discount-original">(au lieu de {originalTotal.toFixed(2)} €)</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Price summary */}
              <div className="price-summary">
                <div className="price-summary-left">
                  <span className="price-label">{t("orderPack.summary.monthlyTotal")}</span>
                  <span className="price-offer">{quantity} × {OFFER_CONFIG[offer].label}</span>
                </div>
                <div className="price-summary-right">
                  <span className="price-total">{monthlyTotal.toFixed(2)} €</span>
                  <span className="price-period">/mois</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Configure pack */}
          {step === 2 && (
            <div className="wizard-content">
              <h3 className="wizard-title">{t("orderPack.step2.title")}</h3>

              <div className="form-group">
                <label className="form-label">{t("orderPack.fields.name")}</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("orderPack.placeholders.name")}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t("orderPack.fields.quantity")}</label>
                <div className="quantity-selector">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(5, quantity - 5))}
                    disabled={loading || quantity <= 5}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="qty-input"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(5, Number(e.target.value)))}
                    min={5}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity(quantity + 5)}
                    disabled={loading}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t("orderPack.fields.scope")}</label>
                <div className="scope-options">
                  <label className={`scope-option ${scope === "single-domain" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="scope"
                      checked={scope === "single-domain"}
                      onChange={() => setScope("single-domain")}
                      disabled={loading}
                    />
                    <div>
                      <span className="scope-title">{t("orderPack.scope.single")}</span>
                      <span className="scope-desc">{t("orderPack.scope.singleDesc")}</span>
                    </div>
                  </label>
                  <label className={`scope-option ${scope === "multi-domain" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="scope"
                      checked={scope === "multi-domain"}
                      onChange={() => setScope("multi-domain")}
                      disabled={loading}
                    />
                    <div>
                      <span className="scope-title">{t("orderPack.scope.multi")}</span>
                      <span className="scope-desc">{t("orderPack.scope.multiDesc")}</span>
                    </div>
                  </label>
                </div>
              </div>

              {scope === "single-domain" && (
                <div className="form-group">
                  <label className="form-label">{t("orderPack.fields.domain")}</label>
                  <select
                    className="form-select"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    disabled={loading}
                  >
                    {domains.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="wizard-content">
              <h3 className="wizard-title">{t("orderPack.step3.title")}</h3>

              <div className="order-summary">
                <div className="summary-row">
                  <span className="summary-label">{t("orderPack.summary.pack")}</span>
                  <span className="summary-value">{name}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">{t("orderPack.summary.offer")}</span>
                  <span className="summary-value"><OfferBadge offer={offer} /></span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">{t("orderPack.summary.quantity")}</span>
                  <span className="summary-value">{quantity} {t("orderPack.summary.licenses")}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">{t("orderPack.summary.scope")}</span>
                  <span className="summary-value">
                    {scope === "single-domain" ? domain : t("orderPack.scope.multi")}
                  </span>
                </div>
                <div className="summary-row total">
                  <span className="summary-label">{t("orderPack.summary.total")}</span>
                  <span className="summary-value">{monthlyTotal.toFixed(2)} €/mois HT</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step > 1 && (
            <button type="button" className="btn btn-outline" onClick={handleBack} disabled={loading}>
              {t("common.back")}
            </button>
          )}
          <button type="button" className="btn btn-outline" onClick={handleClose} disabled={loading}>
            {t("common.cancel")}
          </button>
          <button type="button" className="btn btn-primary" onClick={handleNext} disabled={loading}>
            {step === 3
              ? (loading ? t("common.ordering") : t("orderPack.submit"))
              : t("common.next")}
          </button>
        </div>
      </div>
    </div>
  );
}
