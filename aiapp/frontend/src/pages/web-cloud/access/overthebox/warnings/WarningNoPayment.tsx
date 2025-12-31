// ============================================================
// WARNING NO PAYMENT - Pas de moyen de paiement
// ============================================================

import { useTranslation } from "react-i18next";
import "./Warnings.css";

interface WarningNoPaymentProps {
  onBack: () => void;
}

export function WarningNoPayment({ onBack }: WarningNoPaymentProps) {
  const { t } = useTranslation("web-cloud/access/overthebox/warnings");

  const handleAddPayment = () => {
    window.location.href = "/billing/payment-methods/add";
  };

  return (
    <div className="otb-warning-page">
      <div className="otb-warning-container">
        <div className="otb-warning-icon warning-payment">
          💳
        </div>
        <h2 className="otb-warning-title">{t("noPayment.title")}</h2>
        <p className="otb-warning-description">{t("noPayment.description")}</p>

        <div className="otb-warning-info">
          <h4>{t("noPayment.acceptedMethods")}</h4>
          <div className="payment-methods">
            <div className="payment-method">
              <span className="method-icon">💳</span>
              <span>{t("noPayment.card")}</span>
            </div>
            <div className="payment-method">
              <span className="method-icon">🏦</span>
              <span>{t("noPayment.sepa")}</span>
            </div>
            <div className="payment-method">
              <span className="method-icon">📱</span>
              <span>{t("noPayment.paypal")}</span>
            </div>
          </div>
        </div>

        <div className="otb-warning-actions">
          <button className="btn-secondary" onClick={onBack}>
            {t("common.back")}
          </button>
          <button className="btn-primary" onClick={handleAddPayment}>
            {t("noPayment.addPayment")}
          </button>
        </div>
      </div>
    </div>
  );
}
