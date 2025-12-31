// ============================================================
// FORWARD CONFIG MODAL - Configuration des renvois d'appel
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

type ForwardType = 'unconditional' | 'noReply' | 'busy';

export function ForwardConfigModal({ billingAccount, serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation('web-cloud/voip/modals');
  const [forwardType, setForwardType] = useState<ForwardType>('unconditional');
  const [destination, setDestination] = useState('');
  const [noReplyDelay, setNoReplyDelay] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && billingAccount && serviceName) {
      modalsService.getForwardConfig(billingAccount, serviceName)
        .then(config => {
          // Parse existing config
        })
        .catch(() => {
          // Default values
        });
    }
  }, [isOpen, billingAccount, serviceName]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!destination.trim()) return;

    setLoading(true);
    setError('');

    try {
      const config: Record<string, string | number> = {};

      if (forwardType === 'unconditional') {
        config.forwardUnconditional = destination;
      } else if (forwardType === 'noReply') {
        config.forwardNoReply = destination;
        config.noReplyDelay = noReplyDelay;
      } else if (forwardType === 'busy') {
        config.forwardBusy = destination;
      }

      await modalsService.updateForwardConfig(billingAccount, serviceName, config);
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDestination('');
    setError('');
    onClose();
  };

  return (
    <div className="voip-modal-overlay" onClick={handleClose}>
      <div className="voip-modal" onClick={e => e.stopPropagation()}>
        <div className="voip-modal-header">
          <h3>{t('forward.title')}</h3>
          <button className="voip-modal-close" onClick={handleClose}>✕</button>
        </div>

        <div className="voip-modal-body">
          <div className="voip-modal-info">
            <span className="voip-modal-info-icon">📞</span>
            <p>{t('forward.info')}</p>
          </div>

          <div className="voip-form-group">
            <label className="voip-form-label">{t('forward.type')}</label>
            <select
              className="voip-form-select"
              value={forwardType}
              onChange={e => setForwardType(e.target.value as ForwardType)}
            >
              <option value="unconditional">{t('forward.types.unconditional')}</option>
              <option value="noReply">{t('forward.types.noReply')}</option>
              <option value="busy">{t('forward.types.busy')}</option>
            </select>
          </div>

          <div className="voip-form-group">
            <label className="voip-form-label">{t('forward.destination')}</label>
            <input
              type="tel"
              className="voip-form-input"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder={t('forward.destinationPlaceholder')}
            />
            <p className="voip-form-hint">{t('forward.destinationHint')}</p>
          </div>

          {forwardType === 'noReply' && (
            <div className="voip-form-group">
              <label className="voip-form-label">{t('forward.delay')}</label>
              <select
                className="voip-form-select"
                value={noReplyDelay}
                onChange={e => setNoReplyDelay(parseInt(e.target.value))}
              >
                <option value="10">10 {t('common.seconds')}</option>
                <option value="15">15 {t('common.seconds')}</option>
                <option value="20">20 {t('common.seconds')}</option>
                <option value="25">25 {t('common.seconds')}</option>
                <option value="30">30 {t('common.seconds')}</option>
              </select>
            </div>
          )}

          {error && <p className="voip-form-error">{error}</p>}
        </div>

        <div className="voip-modal-footer">
          <button className="voip-btn-cancel" onClick={handleClose}>
            {t('common.cancel')}
          </button>
          <button
            className="voip-btn-confirm"
            onClick={handleSubmit}
            disabled={loading || !destination.trim()}
          >
            {loading ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForwardConfigModal;
