// ============================================================
// WORDPRESS - Onboarding (aucun service)
// ============================================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type OfferType = 'start' | 'pro' | 'business';

interface OnboardingProps {
  onCreate?: (offer?: OfferType) => void;
  onImport?: () => void;
}

export function Onboarding({ onCreate, onImport }: OnboardingProps) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  const [selectedOffer, setSelectedOffer] = useState<OfferType>('pro'); // Pro par défaut (recommandé)

  const handleOrder = () => {
    window.open('https://www.ovhcloud.com/fr/web-hosting/wordpress-hosting/', '_blank');
  };

  const handleCreate = () => {
    if (onCreate) onCreate(selectedOffer);
  };

  return (
    <div className="wp-onboarding-container">
      <div className="wp-onboarding-content">
        <div className="wp-onboarding-icon">🌐</div>
        <h1>{t('onboarding.title')}</h1>
        <p className="wp-onboarding-description">{t('onboarding.description')}</p>

        {/* Features */}
        <div className="wp-onboarding-features">
          <div className="wp-feature-item">
            <span className="wp-feature-icon">🚀</span>
            <div className="wp-feature-text">
              <strong>{t('onboarding.features.performance')}</strong>
              <span>{t('onboarding.features.performanceDesc')}</span>
            </div>
          </div>
          <div className="wp-feature-item">
            <span className="wp-feature-icon">🔒</span>
            <div className="wp-feature-text">
              <strong>{t('onboarding.features.security')}</strong>
              <span>{t('onboarding.features.securityDesc')}</span>
            </div>
          </div>
          <div className="wp-feature-item">
            <span className="wp-feature-icon">🔄</span>
            <div className="wp-feature-text">
              <strong>{t('onboarding.features.updates')}</strong>
              <span>{t('onboarding.features.updatesDesc')}</span>
            </div>
          </div>
          <div className="wp-feature-item">
            <span className="wp-feature-icon">💾</span>
            <div className="wp-feature-text">
              <strong>{t('onboarding.features.backups')}</strong>
              <span>{t('onboarding.features.backupsDesc')}</span>
            </div>
          </div>
        </div>

        {/* Offers */}
        <div className="wp-onboarding-offers">
          <h3>{t('onboarding.offers.title')}</h3>
          <div className="wp-offers-grid">
            <div
              className={`wp-offer-card ${selectedOffer === 'start' ? 'selected' : ''}`}
              onClick={() => setSelectedOffer('start')}
            >
              <div className="wp-offer-name">{t('onboarding.offers.start.title')}</div>
              <div className="wp-offer-price">{t('onboarding.offers.start.price')}</div>
              <ul className="wp-offer-features">
                {(t('onboarding.offers.start.features', { returnObjects: true }) as string[]).map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
            <div
              className={`wp-offer-card recommended ${selectedOffer === 'pro' ? 'selected' : ''}`}
              onClick={() => setSelectedOffer('pro')}
            >
              <div className="wp-offer-badge">{t('onboarding.offers.recommended')}</div>
              <div className="wp-offer-name">{t('onboarding.offers.pro.title')}</div>
              <div className="wp-offer-price">{t('onboarding.offers.pro.price')}</div>
              <ul className="wp-offer-features">
                {(t('onboarding.offers.pro.features', { returnObjects: true }) as string[]).map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
            <div
              className={`wp-offer-card ${selectedOffer === 'business' ? 'selected' : ''}`}
              onClick={() => setSelectedOffer('business')}
            >
              <div className="wp-offer-name">{t('onboarding.offers.business.title')}</div>
              <div className="wp-offer-price">{t('onboarding.offers.business.price')}</div>
              <ul className="wp-offer-features">
                {(t('onboarding.offers.business.features', { returnObjects: true }) as string[]).map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="wp-onboarding-actions">
          {onCreate && (
            <button className="wp-btn wp-btn-primary wp-btn-lg" onClick={handleCreate}>
              + {t('onboarding.createSite')}
            </button>
          )}
          {onImport && (
            <button className="wp-btn wp-btn-outline wp-btn-lg" onClick={onImport}>
              {t('onboarding.importSite')}
            </button>
          )}
          <button className="wp-btn wp-btn-secondary wp-btn-lg" onClick={handleOrder}>
            {t('onboarding.order')}
          </button>
        </div>

        <div className="wp-onboarding-help">
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
