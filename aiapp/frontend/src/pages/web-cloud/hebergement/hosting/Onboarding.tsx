// ============================================================
// HOSTING ONBOARDING - Page quand aucun hébergement
// ============================================================

import { useTranslation } from "react-i18next";
import "./styles.css";

const ORDER_URL = "https://www.ovhcloud.com/fr/web-hosting/";
const GUIDES_URL = "https://help.ovhcloud.com/csm/fr-web-hosting";

/** Page d'onboarding affichée quand l'utilisateur n'a aucun hébergement. */
export function HostingOnboarding() {
  const { t } = useTranslation("web-cloud/hosting/index");

  const handleOrder = () => {
    window.open(ORDER_URL, "_blank");
  };

  const handleGuides = () => {
    window.open(GUIDES_URL, "_blank");
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-content">
        <div className="onboarding-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
            <line x1="6" y1="6" x2="6.01" y2="6"/>
            <line x1="6" y1="18" x2="6.01" y2="18"/>
          </svg>
        </div>

        <h1>{t("onboarding.title")}</h1>
        <p className="onboarding-description">{t("onboarding.description")}</p>

        <div className="onboarding-features">
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="feature-text">
              <h4>{t("onboarding.feature1Title")}</h4>
              <p>{t("onboarding.feature1Desc")}</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
            </div>
            <div className="feature-text">
              <h4>{t("onboarding.feature2Title")}</h4>
              <p>{t("onboarding.feature2Desc")}</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div className="feature-text">
              <h4>{t("onboarding.feature3Title")}</h4>
              <p>{t("onboarding.feature3Desc")}</p>
            </div>
          </div>
        </div>

        <div className="onboarding-actions">
          <button className="btn btn-primary btn-lg" onClick={handleOrder}>
            {t("onboarding.orderButton")}
          </button>
          <button className="btn btn-secondary btn-lg" onClick={handleGuides}>
            {t("onboarding.guidesButton")}
          </button>
        </div>

        <div className="onboarding-offers">
          <h3>{t("onboarding.offersTitle")}</h3>
          <div className="offers-grid">
            <div className="offer-card">
              <h4>Perso</h4>
              <p className="offer-price">2,99 €/mois</p>
              <ul>
                <li>100 Go d'espace</li>
                <li>1 site web</li>
                <li>SSL gratuit</li>
              </ul>
            </div>
            <div className="offer-card popular">
              <span className="popular-badge">{t("onboarding.popular")}</span>
              <h4>Pro</h4>
              <p className="offer-price">6,99 €/mois</p>
              <ul>
                <li>250 Go d'espace</li>
                <li>5 sites web</li>
                <li>SSL gratuit + CDN</li>
              </ul>
            </div>
            <div className="offer-card">
              <h4>Performance</h4>
              <p className="offer-price">12,99 €/mois</p>
              <ul>
                <li>500 Go d'espace</li>
                <li>Sites illimités</li>
                <li>SSL + CDN + Boost</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostingOnboarding;
