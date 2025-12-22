// ============================================================
// HOSTING ONBOARDING - Page d'accueil sans hébergement
// ============================================================

import { useTranslation } from "react-i18next";

/** Page affichée quand l'utilisateur n'a pas d'hébergement. */
export function HostingOnboarding() {
  const { t } = useTranslation("web-cloud/hosting/index");

  const handleOrder = () => {
    window.open("https://www.ovhcloud.com/fr/web-hosting/", "_blank");
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-content">
        <div className="onboarding-icon">🌐</div>
        <h1>Hébergement Web</h1>
        <p className="onboarding-description">
          Hébergez vos sites web, applications et bases de données sur une infrastructure performante et sécurisée.
        </p>

        <div className="features-list">
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Performance</h3>
            <p>Serveurs optimisés avec SSD NVMe et cache intégré pour des temps de chargement ultra-rapides.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Sécurité</h3>
            <p>Certificats SSL gratuits, firewall applicatif et sauvegardes automatiques incluses.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📦</span>
            <h3>Modules en 1 clic</h3>
            <p>Installez WordPress, PrestaShop, Joomla et plus de 60 CMS en quelques clics.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📧</span>
            <h3>Emails inclus</h3>
            <p>Créez des adresses email professionnelles avec votre nom de domaine.</p>
          </div>
        </div>

        <div className="onboarding-actions">
          <button className="btn btn-primary btn-lg" onClick={handleOrder}>
            Commander un hébergement
          </button>
          <a 
            href="https://help.ovhcloud.com/csm/fr-web-hosting" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary btn-lg"
          >
            Consulter les guides
          </a>
        </div>

        <div className="pricing-info">
          <p>À partir de <strong>2,99€ HT/mois</strong></p>
          <span className="pricing-note">Nom de domaine offert la première année</span>
        </div>
      </div>
    </div>
  );
}

export default HostingOnboarding;
