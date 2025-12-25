// ============================================================
// FAX PAGE - Composant avec imports LOCAUX
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { faxService } from './fax.service';
import type { FreefaxAccount } from './fax.types';
import './fax.css';

export default function FaxPage() {
  const { t } = useTranslation('web-cloud/fax/index');
  const { serviceName } = useParams<{ serviceName: string }>();
  const [fax, setFax] = useState<FreefaxAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!serviceName) return;
      try {
        setLoading(true);
        setError(null);
        const data = await faxService.getFreefax(serviceName);
        setFax(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div className="breadcrumb">
            <Link to="/web-cloud">{t('breadcrumb.webCloud')}</Link>
            <span>/</span>
            <Link to="/web-cloud/telecom">{t('breadcrumb.telecom')}</Link>
            <span>/</span>
            <span>{t('breadcrumb.fax')}</span>
          </div>
          <h1>{t('title')}</h1>
        </div>
        <div className="tab-loading">
          <div className="skeleton-block" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>{t('title')}</h1>
        </div>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!fax) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>{t('title')}</h1>
        </div>
        <div className="fax-empty">
          <p>{t('empty')}</p>
        </div>
      </div>
    );
  }

  // Helper pour la qualité
  const getQualityLabel = (quality: FreefaxAccount['faxQuality']): string => {
    const labels: Record<FreefaxAccount['faxQuality'], string> = {
      best: 'Optimale',
      high: 'Haute',
      normal: 'Normale',
    };
    return labels[quality] || quality;
  };

  return (
    <div className="page-container fax-page">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/web-cloud">{t('breadcrumb.webCloud')}</Link>
          <span>/</span>
          <Link to="/web-cloud/telecom">{t('breadcrumb.telecom')}</Link>
          <span>/</span>
          <span>{t('breadcrumb.fax')}</span>
        </div>
        <h1>{t('title')}</h1>
      </div>

      <div className="fax-info-card">
        <div className="fax-header">
          <div className="fax-icon">📠</div>
          <div className="fax-title">
            <h3>{fax.number}</h3>
            <p>{fax.fromName || t('noName')}</p>
          </div>
        </div>

        <div className="fax-info-grid">
          <div className="fax-info-item">
            <label>{t('fields.number')}</label>
            <span className="fax-mono">{fax.number}</span>
          </div>
          <div className="fax-info-item">
            <label>{t('fields.fromName')}</label>
            <span>{fax.fromName || '-'}</span>
          </div>
          <div className="fax-info-item">
            <label>{t('fields.fromEmail')}</label>
            <span className="fax-mono">{fax.fromEmail || '-'}</span>
          </div>
          <div className="fax-info-item">
            <label>{t('fields.redirectionEmail')}</label>
            <span className="fax-mono">
              {fax.redirectionEmail.length > 0
                ? fax.redirectionEmail.join(', ')
                : '-'}
            </span>
          </div>
        </div>

        <div className="fax-settings-section">
          <h4>{t('settings.title')}</h4>
          <div className="fax-settings-grid">
            <div className="fax-setting-item">
              <label>{t('settings.quality')}</label>
              <span className={`fax-quality-badge fax-quality-${fax.faxQuality}`}>
                {getQualityLabel(fax.faxQuality)}
              </span>
            </div>
            <div className="fax-setting-item">
              <label>{t('settings.maxCall')}</label>
              <span>{fax.faxMaxCall}</span>
            </div>
            <div className="fax-setting-item">
              <label>{t('settings.tagLine')}</label>
              <span>{fax.faxTagLine || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
