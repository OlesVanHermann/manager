// ============================================================
// GENERAL TAB - Composant ISOLÉ (Fax)
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generalService } from './GeneralTab.service';
import type { FreefaxAccount } from '../../fax.types';
import './GeneralTab.css';

interface Props {
  serviceName: string;
}

export function GeneralTab({ serviceName }: Props) {
  const { t } = useTranslation('web-cloud/voip/fax/general');
  const [fax, setFax] = useState<FreefaxAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!serviceName) return;
      try {
        setLoading(true);
        setError(null);
        const data = await generalService.getFreefax(serviceName);
        setFax(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  // Helper pour la qualité
  const getQualityLabel = (quality: FreefaxAccount['faxQuality']): string => {
    return t(`quality.${quality}`);
  };

  if (loading) {
    return (
      <div className="fax-general-loading">
        <div className="fax-general-skeleton" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="general-fax-container">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!fax) {
    return (
      <div className="general-fax-container">
        <div className="general-fax-empty">
          <p>{t('empty')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="general-fax-container">
      <div className="general-fax-info-card">
        <div className="general-fax-header">
          <div className="general-fax-icon">📠</div>
          <div className="general-fax-title">
            <h3>{fax.number}</h3>
            <p>{fax.fromName || t('noName')}</p>
          </div>
        </div>

        <div className="general-fax-info-grid">
          <div className="general-fax-info-item">
            <label>{t('fields.number')}</label>
            <span className="general-fax-mono">{fax.number}</span>
          </div>
          <div className="general-fax-info-item">
            <label>{t('fields.fromName')}</label>
            <span>{fax.fromName || '-'}</span>
          </div>
          <div className="general-fax-info-item">
            <label>{t('fields.fromEmail')}</label>
            <span className="general-fax-mono">{fax.fromEmail || '-'}</span>
          </div>
          <div className="general-fax-info-item">
            <label>{t('fields.redirectionEmail')}</label>
            <span className="general-fax-mono">
              {fax.redirectionEmail.length > 0
                ? fax.redirectionEmail.join(', ')
                : '-'}
            </span>
          </div>
        </div>

        <div className="general-fax-settings-section">
          <h4>{t('settings.title')}</h4>
          <div className="general-fax-settings-grid">
            <div className="general-fax-setting-item">
              <label>{t('settings.quality')}</label>
              <span className={`general-fax-quality-badge general-fax-quality-${fax.faxQuality}`}>
                {getQualityLabel(fax.faxQuality)}
              </span>
            </div>
            <div className="general-fax-setting-item">
              <label>{t('settings.maxCall')}</label>
              <span>{fax.faxMaxCall}</span>
            </div>
            <div className="general-fax-setting-item">
              <label>{t('settings.tagLine')}</label>
              <span>{fax.faxTagLine || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralTab;
