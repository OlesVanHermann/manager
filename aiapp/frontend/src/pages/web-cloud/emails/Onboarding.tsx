// ============================================================
// COMPOSANT - Onboarding (Premier lancement sans domaine)
// ============================================================

import { useTranslation } from "react-i18next";
import "./Onboarding.css";

interface OnboardingProps {
  onAddDomain: () => void;
  onOrderPack: () => void;
}

/** Écran d'onboarding affiché quand l'utilisateur n'a aucun domaine email. */
export function Onboarding({ onAddDomain, onOrderPack }: OnboardingProps) {
  const { t } = useTranslation("web-cloud/emails/onboarding");

  return (
    <div className="emails-onboarding">
      <div className="onboarding-content">
        <div className="onboarding-icon">📧</div>
        <h1 className="onboarding-title">{t("title")}</h1>
        <p className="onboarding-description">{t("description")}</p>

        <div className="onboarding-offers">
          <div className="offer-card">
            <div className="offer-card-icon" style={{ backgroundColor: "#F59E0B" }}>🟠</div>
            <h3 className="offer-card-title">Exchange</h3>
            <p className="offer-card-desc">{t("offers.exchange")}</p>
            <ul className="offer-card-features">
              <li>50 Go de stockage</li>
              <li>Calendrier partagé</li>
              <li>Double authentification</li>
              <li>Salles de réunion</li>
            </ul>
            <span className="offer-card-price">à partir de 4,99 €/mois</span>
          </div>

          <div className="offer-card">
            <div className="offer-card-icon" style={{ backgroundColor: "#3B82F6" }}>🔵</div>
            <h3 className="offer-card-title">Email Pro</h3>
            <p className="offer-card-desc">{t("offers.emailPro")}</p>
            <ul className="offer-card-features">
              <li>10 Go de stockage</li>
              <li>Alias illimités</li>
              <li>Signature HTML</li>
              <li>Délégation d'accès</li>
            </ul>
            <span className="offer-card-price">à partir de 2,99 €/mois</span>
          </div>

          <div className="offer-card">
            <div className="offer-card-icon" style={{ backgroundColor: "#8B5CF6" }}>🟣</div>
            <h3 className="offer-card-title">Zimbra</h3>
            <p className="offer-card-desc">{t("offers.zimbra")}</p>
            <ul className="offer-card-features">
              <li>10 Go de stockage</li>
              <li>Webmail collaboratif</li>
              <li>Partage de fichiers</li>
              <li>Calendrier intégré</li>
            </ul>
            <span className="offer-card-price">à partir de 3,99 €/mois</span>
          </div>

          <div className="offer-card offer-card-free">
            <div className="offer-card-icon" style={{ backgroundColor: "#6B7280" }}>⚪</div>
            <h3 className="offer-card-title">MX Plan</h3>
            <p className="offer-card-desc">{t("offers.mxPlan")}</p>
            <ul className="offer-card-features">
              <li>5 Go de stockage</li>
              <li>Inclus avec le domaine</li>
              <li>Webmail basique</li>
            </ul>
            <span className="offer-card-price">Gratuit</span>
          </div>
        </div>

        <div className="onboarding-actions">
          <button className="btn btn-primary btn-lg" onClick={onOrderPack}>
            {t("actions.orderPack")}
          </button>
          <button className="btn btn-outline btn-lg" onClick={onAddDomain}>
            {t("actions.addDomain")}
          </button>
        </div>

        <p className="onboarding-help">
          {t("help.needHelp")}{" "}
          <a href="https://docs.ovh.com/fr/emails/" target="_blank" rel="noopener noreferrer">
            {t("help.viewGuides")}
          </a>
        </p>
      </div>
    </div>
  );
}
