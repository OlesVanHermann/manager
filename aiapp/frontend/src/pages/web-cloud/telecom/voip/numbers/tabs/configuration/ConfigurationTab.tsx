// ============================================================
// NUMBER CONFIGURATION TAB - Configuration du numéro
// Target: target_.web-cloud.voip.number.configuration.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { numbersService } from '../../numbers.service';
import { Tile, InfoRow, Badge, EmptyState } from '../../../components/RightPanel';
import type { TelephonyNumber } from '../../../voip.types';
import type { NumberConfiguration, NumberConference } from '../../numbers.types';
import './ConfigurationTab.css';

interface ConfigurationTabProps {
  billingAccount: string;
  serviceName: string;
  number: TelephonyNumber;
}

export function ConfigurationTab({ billingAccount, serviceName, number }: ConfigurationTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/numbers/configuration');
  const [conference, setConference] = useState<NumberConference | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfiguration();
  }, [billingAccount, serviceName, number.featureType]);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      if (number.featureType === 'conference') {
        const conf = await numbersService.getConference(billingAccount, serviceName);
        setConference(conf);
      }
    } catch {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  const featureConfigs: Record<string, React.ReactNode> = {
    redirect: (
      <Tile title={t('redirect.title')}>
        <p className="config-description">{t('redirect.description')}</p>
        <div className="redirect-form">
          <label>{t('redirect.destination')}</label>
          <input
            type="tel"
            placeholder={t('redirect.placeholder')}
            className="config-input"
          />
          <button className="btn btn-primary">{t('actions.save')}</button>
        </div>
      </Tile>
    ),

    conference: (
      <Tile title={t('conference.title')}>
        <p className="config-description">{t('conference.description')}</p>
        {conference && (
          <>
            <InfoRow label={t('conference.pin')} value={conference.pin || '-'} />
            <InfoRow
              label={t('conference.record')}
              value={conference.recordStatus ? t('common.yes') : t('common.no')}
            />
            <InfoRow label={t('conference.language')} value={conference.language} />
            <InfoRow label={t('conference.reportEmail')} value={conference.reportEmail || '-'} />
          </>
        )}
        <div className="config-actions">
          <button className="btn btn-secondary">{t('conference.changePin')}</button>
          <button className="btn btn-secondary">{t('conference.settings')}</button>
        </div>
      </Tile>
    ),

    ivr: (
      <Tile title={t('ivr.title')}>
        <p className="config-description">{t('ivr.description')}</p>
        <div className="ivr-visual">
          <div className="ivr-node">
            <span className="ivr-key">Accueil</span>
            <span className="ivr-action">→ Menu principal</span>
          </div>
          <div className="ivr-node">
            <span className="ivr-key">1</span>
            <span className="ivr-action">→ Service commercial</span>
          </div>
          <div className="ivr-node">
            <span className="ivr-key">2</span>
            <span className="ivr-action">→ Support technique</span>
          </div>
        </div>
        <button className="btn btn-primary">{t('ivr.editMenu')}</button>
      </Tile>
    ),

    voicemail: (
      <Tile title={t('voicemail.title')}>
        <p className="config-description">{t('voicemail.description')}</p>
        <div className="config-actions">
          <button className="btn btn-secondary">{t('voicemail.changeGreeting')}</button>
          <button className="btn btn-secondary">{t('voicemail.changePassword')}</button>
          <button className="btn btn-secondary">{t('voicemail.settings')}</button>
        </div>
      </Tile>
    ),

    ddi: (
      <Tile title={t('ddi.title')}>
        <p className="config-description">{t('ddi.description')}</p>
        <InfoRow label={t('ddi.destination')} value="-" />
        <button className="btn btn-primary">{t('ddi.configure')}</button>
      </Tile>
    ),
  };

  if (loading) {
    return (
      <div className="number-configuration-tab">
        <div className="voip-skeleton voip-skeleton-tile" />
      </div>
    );
  }

  return (
    <div className="number-configuration-tab">
      {/* Type de configuration actuel */}
      <Tile title={t('current.title')}>
        <div className="current-config">
          <div className="current-icon">
            {number.featureType === 'redirect' && '➡️'}
            {number.featureType === 'conference' && '👥'}
            {number.featureType === 'ivr' && '🔢'}
            {number.featureType === 'voicemail' && '📧'}
            {number.featureType === 'ddi' && '📞'}
            {!['redirect', 'conference', 'ivr', 'voicemail', 'ddi'].includes(number.featureType) && '⚙️'}
          </div>
          <div className="current-info">
            <Badge type="success">{t(`feature.${number.featureType}`)}</Badge>
            <p>{t(`feature.${number.featureType}Description`)}</p>
          </div>
        </div>
      </Tile>

      {/* Configuration spécifique au type */}
      {featureConfigs[number.featureType] || (
        <Tile title={t('generic.title')}>
          <p className="config-description">{t('generic.description')}</p>
        </Tile>
      )}

      {/* Changer de type */}
      <Tile title={t('change.title')}>
        <p className="config-description">{t('change.description')}</p>
        <div className="feature-grid">
          {['redirect', 'conference', 'ivr', 'voicemail', 'ddi'].map((feature) => (
            <button
              key={feature}
              className={`feature-btn ${number.featureType === feature ? 'active' : ''}`}
              disabled={number.featureType === feature}
            >
              <span className="feature-icon">
                {feature === 'redirect' && '➡️'}
                {feature === 'conference' && '👥'}
                {feature === 'ivr' && '🔢'}
                {feature === 'voicemail' && '📧'}
                {feature === 'ddi' && '📞'}
              </span>
              <span className="feature-label">{t(`feature.${feature}`)}</span>
            </button>
          ))}
        </div>
      </Tile>
    </div>
  );
}
