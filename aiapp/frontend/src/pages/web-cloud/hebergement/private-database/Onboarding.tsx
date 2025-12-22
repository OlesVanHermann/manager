// ============================================================
// PRIVATE DATABASE - Onboarding (aucun service)
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { OrderCloudDbModal } from "./components";

export function Onboarding() {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [showOrder, setShowOrder] = useState(false);

  return (
    <div className="onboarding-page">
      <div className="onboarding-content">
        <div className="onboarding-icon">🗄️</div>
        <h1>{t("onboarding.title")}</h1>
        <p>{t("onboarding.description")}</p>

        <div className="onboarding-features">
          <div className="feature-item">
            <span className="feature-icon">🚀</span>
            <div className="feature-text">
              <strong>{t("onboarding.features.performance.title")}</strong>
              <span>{t("onboarding.features.performance.description")}</span>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <div className="feature-text">
              <strong>{t("onboarding.features.security.title")}</strong>
              <span>{t("onboarding.features.security.description")}</span>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📈</span>
            <div className="feature-text">
              <strong>{t("onboarding.features.scalability.title")}</strong>
              <span>{t("onboarding.features.scalability.description")}</span>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <div className="feature-text">
              <strong>{t("onboarding.features.backup.title")}</strong>
              <span>{t("onboarding.features.backup.description")}</span>
            </div>
          </div>
        </div>

        <div className="db-types-showcase">
          <div className="db-type">
            <span className="db-icon">🐬</span>
            <span>MySQL</span>
          </div>
          <div className="db-type">
            <span className="db-icon">🦭</span>
            <span>MariaDB</span>
          </div>
          <div className="db-type">
            <span className="db-icon">🐘</span>
            <span>PostgreSQL</span>
          </div>
          <div className="db-type">
            <span className="db-icon">🔴</span>
            <span>Redis</span>
          </div>
        </div>

        <div className="onboarding-actions">
          <button className="btn btn-primary btn-lg" onClick={() => setShowOrder(true)}>
            {t("onboarding.order")}
          </button>
          <a
            href="https://help.ovhcloud.com/csm/fr-web-cloud-databases"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-lg"
          >
            {t("onboarding.learnMore")}
          </a>
        </div>
      </div>

      <OrderCloudDbModal
        isOpen={showOrder}
        onClose={() => setShowOrder(false)}
      />
    </div>
  );
}

export default Onboarding;
