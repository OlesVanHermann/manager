// ============================================================
// LINE PASSWORD MODAL - Changer le mot de passe SIP
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

export function LinePasswordModal({ billingAccount, serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation('web-cloud/telecom/voip/modals');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isValid = password.length >= 8 && password === confirm;

  const handleSubmit = async () => {
    if (!isValid) return;

    setLoading(true);
    setError('');

    try {
      await modalsService.changeLinePassword(billingAccount, serviceName, password);
      onSuccess();
      onClose();
      setPassword('');
      setConfirm('');
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirm('');
    setError('');
    onClose();
  };

  return (
    <div className="voip-modal-overlay" onClick={handleClose}>
      <div className="voip-modal" onClick={e => e.stopPropagation()}>
        <div className="voip-modal-header">
          <h3>{t('linePassword.title')}</h3>
          <button className="voip-modal-close" onClick={handleClose}>✕</button>
        </div>

        <div className="voip-modal-body">
          <div className="voip-modal-info">
            <span className="voip-modal-info-icon">ℹ️</span>
            <p>{t('linePassword.info')}</p>
          </div>

          <p style={{ marginBottom: '1rem' }}>
            {t('linePassword.line')}: <strong>{serviceName}</strong>
          </p>

          <div className="voip-form-group">
            <label className="voip-form-label">{t('linePassword.newPassword')}</label>
            <input
              type="password"
              className="voip-form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t('linePassword.passwordPlaceholder')}
            />
            <p className="voip-form-hint">{t('linePassword.passwordHint')}</p>
          </div>

          <div className="voip-form-group">
            <label className="voip-form-label">{t('linePassword.confirmPassword')}</label>
            <input
              type="password"
              className="voip-form-input"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder={t('linePassword.confirmPlaceholder')}
            />
          </div>

          {password && confirm && password !== confirm && (
            <p className="voip-form-error">{t('linePassword.mismatch')}</p>
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
            disabled={loading || !isValid}
          >
            {loading ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LinePasswordModal;
