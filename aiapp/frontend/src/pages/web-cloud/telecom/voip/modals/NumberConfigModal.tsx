// ============================================================
// NUMBER CONFIG MODAL - Configuration d'un numéro
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { modalsService } from './modals.service';
import './modals.css';

interface Props {
  billingAccount: string;
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const FEATURE_TYPES = [
  'redirect',
  'ddi',
  'conference',
  'svi',
  'easyHunting',
  'miniPabx',
  'voicemail',
  'contactCenterSolution',
];

export function NumberConfigModal({ billingAccount, serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation('web-cloud/telecom/voip/modals');
  const [description, setDescription] = useState('');
  const [featureType, setFeatureType] = useState('redirect');
  const [loading, setLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && billingAccount && serviceName) {
      setLoadingConfig(true);
      modalsService.getNumberConfig(billingAccount, serviceName)
        .then(config => {
          setDescription(config.description || '');
          setFeatureType(config.featureType || 'redirect');
        })
        .catch(() => {
          // Keep defaults
        })
        .finally(() => setLoadingConfig(false));
    }
  }, [isOpen, billingAccount, serviceName]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      await modalsService.updateNumberConfig(billingAccount, serviceName, {
        description: description.trim(),
      });

      // If feature type changed, call changeFeatureType
      await modalsService.changeNumberFeature(billingAccount, serviceName, featureType);

      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <div className="voip-modal-overlay" onClick={handleClose}>
      <div className="voip-modal" onClick={e => e.stopPropagation()}>
        <div className="voip-modal-header">
          <h3>{t('numberConfig.title')}</h3>
          <button className="voip-modal-close" onClick={handleClose}>✕</button>
        </div>

        <div className="voip-modal-body">
          {loadingConfig ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              {t('common.loading')}
            </div>
          ) : (
            <>
              <p style={{ marginBottom: '1rem' }}>
                {t('numberConfig.number')}: <strong>{serviceName}</strong>
              </p>

              <div className="voip-form-group">
                <label className="voip-form-label">{t('numberConfig.description')}</label>
                <input
                  type="text"
                  className="voip-form-input"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={t('numberConfig.descriptionPlaceholder')}
                />
              </div>

              <div className="voip-form-group">
                <label className="voip-form-label">{t('numberConfig.featureType')}</label>
                <select
                  className="voip-form-select"
                  value={featureType}
                  onChange={e => setFeatureType(e.target.value)}
                >
                  {FEATURE_TYPES.map(type => (
                    <option key={type} value={type}>
                      {t(`numberConfig.features.${type}`)}
                    </option>
                  ))}
                </select>
                <p className="voip-form-hint">{t('numberConfig.featureHint')}</p>
              </div>

              <div className="voip-modal-info">
                <span className="voip-modal-info-icon">⚠️</span>
                <p>{t('numberConfig.warning')}</p>
              </div>

              {error && <p className="voip-form-error">{error}</p>}
            </>
          )}
        </div>

        <div className="voip-modal-footer">
          <button className="voip-btn-cancel" onClick={handleClose}>
            {t('common.cancel')}
          </button>
          <button
            className="voip-btn-confirm"
            onClick={handleSubmit}
            disabled={loading || loadingConfig}
          >
            {loading ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NumberConfigModal;
