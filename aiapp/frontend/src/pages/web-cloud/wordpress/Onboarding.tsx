// ============================================================
// WORDPRESS - Onboarding (aucun service)
// ============================================================

import { useTranslation } from 'react-i18next';

interface OnboardingProps {
  onCreate?: () => void;
  onImport?: () => void;
}

export function Onboarding({ onCreate, onImport }: OnboardingProps) {
  const { t } = useTranslation('web-cloud/wordpress/index');

  const handleOrder = () => {
    window.open('https://www.ovhcloud.com/fr/web-hosting/wordpress-hosting/', '_blank');
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-content">
        <div className="onboarding-icon">🌐</div>
        <h1>{t('onboarding.title')}</h1>
        <p className="onboarding-description">{t('onboarding.description')}</p>

        {/* Features */}
        <div className="onboarding-features">
          <div className="feature-item">
            <span className="feature-icon">🚀</span>
            <div className="feature-text">
              <strong>{t('onboarding.features.performance')}</strong>
              <span>{t('onboarding.features.performanceDesc')}</span>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <div className="feature-text">
              <strong>{t('onboarding.features.security')}</strong>
              <span>{t('onboarding.features.securityDesc')}</span>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <div className="feature-text">
              <strong>{t('onboarding.features.updates')}</strong>
              <span>{t('onboarding.features.updatesDesc')}</span>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💾</span>
            <div className="feature-text">
              <strong>{t('onboarding.features.backups')}</strong>
              <span>{t('onboarding.features.backupsDesc')}</span>
            </div>
          </div>
        </div>

        {/* Offers */}
        <div className="onboarding-offers">
          <h3>{t('onboarding.offers.title')}</h3>
          <div className="offers-grid">
            <div className="offer-card">
              <div className="offer-name">Start</div>
              <div className="offer-price">4,99 €/mois</div>
              <ul className="offer-features">
                <li>10 Go stockage</li>
                <li>SSL inclus</li>
                <li>Backup quotidien</li>
              </ul>
            </div>
            <div className="offer-card recommended">
              <div className="offer-badge">{t('onboarding.offers.recommended')}</div>
              <div className="offer-name">Pro</div>
              <div className="offer-price">9,99 €/mois</div>
              <ul className="offer-features">
                <li>50 Go stockage</li>
                <li>SSL + CDN</li>
                <li>Backup quotidien</li>
              </ul>
            </div>
            <div className="offer-card">
              <div className="offer-name">Business</div>
              <div className="offer-price">19,99 €/mois</div>
              <ul className="offer-features">
                <li>100 Go stockage</li>
                <li>SSL + CDN + Staging</li>
                <li>Backup horaire</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="onboarding-actions">
          {onCreate && (
            <button className="btn btn-primary btn-lg" onClick={onCreate}>
              + {t('onboarding.createSite')}
            </button>
          )}
          {onImport && (
            <button className="btn btn-outline btn-lg" onClick={onImport}>
              {t('onboarding.importSite')}
            </button>
          )}
          <button className="btn btn-secondary btn-lg" onClick={handleOrder}>
            {t('onboarding.order')}
          </button>
        </div>

        <div className="onboarding-help">
          <a
            href="https://help.ovhcloud.com/csm/fr-web-hosting-wordpress"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('onboarding.learnMore')}
          </a>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
