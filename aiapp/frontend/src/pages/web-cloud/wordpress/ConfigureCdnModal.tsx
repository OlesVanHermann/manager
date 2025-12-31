// ============================================================
// WORDPRESS MODAL: CONFIGURE CDN
// ============================================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { performanceService } from './performance/PerformanceTab.service';
import './Modals.css';

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConfigureCdnModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  const [action, setAction] = useState<'enable' | 'disable'>('enable');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (action === 'enable') {
        await performanceService.enableCdn(serviceName);
      } else {
        await performanceService.disableCdn(serviceName);
      }
      onSuccess();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAction('enable');
    setError(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t('cdn.modal.title')}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="modal-error">{error}</div>}

            {/* CDN Action */}
            <div className="form-group">
              <label>{t('cdn.modal.actionLabel')}</label>
              <div className="radio-group">
                <label className="radio-item">
                  <input
                    type="radio"
                    name="action"
                    checked={action === 'enable'}
                    onChange={() => setAction('enable')}
                  />
                  <div className="radio-content">
                    <strong>{t('cdn.modal.enable')}</strong>
                    <span>{t('cdn.modal.enableDesc')}</span>
                  </div>
                </label>
                <label className="radio-item">
                  <input
                    type="radio"
                    name="action"
                    checked={action === 'disable'}
                    onChange={() => setAction('disable')}
                  />
                  <div className="radio-content">
                    <strong>{t('cdn.modal.disable')}</strong>
                    <span>{t('cdn.modal.disableDesc')}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* CDN Features */}
            <div className="modal-features">
              <h4>{t('cdn.modal.features')}</h4>
              <ul>
                <li>{t('cdn.modal.feature1')}</li>
                <li>{t('cdn.modal.feature2')}</li>
                <li>{t('cdn.modal.feature3')}</li>
                <li>{t('cdn.modal.feature4')}</li>
              </ul>
            </div>

            {/* Warning for disable */}
            {action === 'disable' && (
              <div className="modal-warning">
                <p>{t('cdn.modal.disableWarning')}</p>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-btn modal-btn-secondary" onClick={handleClose}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="modal-btn modal-btn-primary" disabled={loading}>
              {loading ? '...' : t('cdn.modal.confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfigureCdnModal;
