// ============================================================
// WARNING NO SUBSCRIPTION - Aucun OTB (liste vide)
// ============================================================

import { useTranslation } from "react-i18next";
import "./Warnings.css";

interface WarningNoSubscriptionProps {
  onBack: () => void;
}

export function WarningNoSubscription({ onBack }: WarningNoSubscriptionProps) {
  const { t } = useTranslation("web-cloud/access/overthebox/warnings");

  const handleOrder = () => {
    window.location.href = "/order/overthebox";
  };

  return (
    <div className="otb-warning-page">
      <div className="otb-warning-container">
        <div className="otb-warning-icon warning-empty">
          📦
        </div>
        <h2 className="otb-warning-title">{t("noSubscription.title")}</h2>
        <p className="otb-warning-description">{t("noSubscription.description")}</p>

        <div className="otb-warning-benefits">
          <h4>{t("noSubscription.benefitsTitle")}</h4>
          <ul>
            <li>
              <span className="benefit-icon">⚡</span>
              <div>
                <strong>{t("noSubscription.benefit1Title")}</strong>
                <p>{t("noSubscription.benefit1Desc")}</p>
              </div>
            </li>
            <li>
              <span className="benefit-icon">🔄</span>
              <div>
                <strong>{t("noSubscription.benefit2Title")}</strong>
                <p>{t("noSubscription.benefit2Desc")}</p>
              </div>
            </li>
            <li>
              <span className="benefit-icon">🔒</span>
              <div>
                <strong>{t("noSubscription.benefit3Title")}</strong>
                <p>{t("noSubscription.benefit3Desc")}</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="otb-warning-actions">
          <button className="btn-secondary" onClick={onBack}>
            {t("common.back")}
          </button>
          <button className="btn-primary" onClick={handleOrder}>
            {t("noSubscription.order")}
          </button>
        </div>
      </div>
    </div>
  );
}
