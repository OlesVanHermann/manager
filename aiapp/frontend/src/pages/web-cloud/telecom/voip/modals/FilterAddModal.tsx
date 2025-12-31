// ============================================================
// FILTER ADD MODAL - Ajouter un filtre d'appel
// ============================================================

import { useState } from 'react';
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

type FilterType = 'whitelist' | 'blacklist';

export function FilterAddModal({ billingAccount, serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation('web-cloud/telecom/voip/modals');
  const [filterType, setFilterType] = useState<FilterType>('blacklist');
  const [callerNumber, setCallerNumber] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!callerNumber.trim()) return;

    setLoading(true);
    setError('');

    try {
      await modalsService.addCallFilter(billingAccount, serviceName, {
        type: filterType,
        callerIdNumber: callerNumber.trim(),
        description: description.trim() || undefined,
      });
      onSuccess();
      handleClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCallerNumber('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <div className="voip-modal-overlay" onClick={handleClose}>
      <div className="voip-modal" onClick={e => e.stopPropagation()}>
        <div className="voip-modal-header">
          <h3>{t('filter.title')}</h3>
          <button className="voip-modal-close" onClick={handleClose}>✕</button>
        </div>

        <div className="voip-modal-body">
          <div className="voip-form-group">
            <label className="voip-form-label">{t('filter.type')}</label>
            <select
              className="voip-form-select"
              value={filterType}
              onChange={e => setFilterType(e.target.value as FilterType)}
            >
              <option value="blacklist">{t('filter.types.blacklist')}</option>
              <option value="whitelist">{t('filter.types.whitelist')}</option>
            </select>
            <p className="voip-form-hint">
              {filterType === 'blacklist'
                ? t('filter.blacklistHint')
                : t('filter.whitelistHint')}
            </p>
          </div>

          <div className="voip-form-group">
            <label className="voip-form-label">{t('filter.number')}</label>
            <input
              type="tel"
              className="voip-form-input"
              value={callerNumber}
              onChange={e => setCallerNumber(e.target.value)}
              placeholder={t('filter.numberPlaceholder')}
            />
            <p className="voip-form-hint">{t('filter.numberHint')}</p>
          </div>

          <div className="voip-form-group">
            <label className="voip-form-label">{t('filter.description')}</label>
            <input
              type="text"
              className="voip-form-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={t('filter.descriptionPlaceholder')}
            />
          </div>

          {error && <p className="voip-form-error">{error}</p>}
        </div>

        <div className="voip-modal-footer">
          <button className="voip-btn-cancel" onClick={handleClose}>
            {t('common.cancel')}
          </button>
          <button
            className="voip-btn-confirm"
            onClick={handleSubmit}
            disabled={loading || !callerNumber.trim()}
          >
            {loading ? t('common.adding') : t('common.add')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterAddModal;
