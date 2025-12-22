// ============================================================
// MANAGED WORDPRESS - Onboarding (aucun service)
// ============================================================

import { useTranslation } from "react-i18next";

export function Onboarding() {
  const { t } = useTranslation("web-cloud/managed-wordpress/index");

  const handleOrder = () => {
    window.open("https://www.ovhcloud.com/fr/web-hosting/wordpress-hosting/", "_blank");
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-content">
        <div className="onboarding-icon">📝</div>
        <h1>{t("onboarding.title")}</h1>
        <p>{t("onboarding.description")}</p>
        
        <div className="onboarding-features">
          <div className="feature-item">
            <span className="feature-icon">🚀</span>
            <span>{t("onboarding.features.performance")}</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <span>{t("onboarding.features.security")}</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <span>{t("onboarding.features.updates")}</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💾</span>
            <span>{t("onboarding.features.backups")}</span>
          </div>
        </div>

        <div className="onboarding-actions">
          <button className="btn btn-primary btn-lg" onClick={handleOrder}>
            {t("onboarding.order")}
          </button>
          <a 
            href="https://help.ovhcloud.com/csm/fr-web-hosting-wordpress" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary btn-lg"
          >
            {t("onboarding.learnMore")}
          </a>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
