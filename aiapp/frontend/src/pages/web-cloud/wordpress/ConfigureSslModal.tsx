// ============================================================
// WORDPRESS MODAL: CONFIGURE SSL
// ============================================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { domainsService } from './domains/DomainsTab.service';
import type { SslConfig } from './wordpress.types';
import './Modals.css';

interface Props {
  serviceName: string;
  domain: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConfigureSslModal({ serviceName, domain, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  const [certificateType, setCertificateType] = useState<'letsEncrypt' | 'custom'>('letsEncrypt');
  const [forceHttps, setForceHttps] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const config: SslConfig = { certificateType, forceHttps };
      await domainsService.configureSsl(serviceName, domain, config);
      onSuccess();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCertificateType('letsEncrypt');
    setForceHttps(true);
    setError(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t('ssl.modal.title', { domain })}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="modal-error">{error}</div>}

            {/* Certificate type */}
            <div className="form-group">
              <label>{t('ssl.modal.certificateType')}</label>
              <div className="radio-group">
                <label className="radio-item">
                  <input
                    type="radio"
                    name="certificateType"
                    checked={certificateType === 'letsEncrypt'}
                    onChange={() => setCertificateType('letsEncrypt')}
                  />
                  <div className="radio-content">
                    <strong>{t('ssl.modal.letsEncrypt')}</strong>
                    <span>{t('ssl.modal.letsEncryptDesc')}</span>
                  </div>
                </label>
                <label className="radio-item">
                  <input
                    type="radio"
                    name="certificateType"
                    checked={certificateType === 'custom'}
                    onChange={() => setCertificateType('custom')}
                  />
                  <div className="radio-content">
                    <strong>{t('ssl.modal.custom')}</strong>
                    <span>{t('ssl.modal.customDesc')}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Force HTTPS */}
            <div className="form-group">
              <label>{t('ssl.modal.forceHttps')}</label>
              <div className="radio-group">
                <label className="radio-item">
                  <input
                    type="radio"
                    name="forceHttps"
                    checked={forceHttps === true}
                    onChange={() => setForceHttps(true)}
                  />
                  <div className="radio-content">
                    <strong>{t('ssl.modal.forceHttpsYes')}</strong>
                    <span>{t('ssl.modal.forceHttpsYesDesc')}</span>
                  </div>
                </label>
                <label className="radio-item">
                  <input
                    type="radio"
                    name="forceHttps"
                    checked={forceHttps === false}
                    onChange={() => setForceHttps(false)}
                  />
                  <div className="radio-content">
                    <strong>{t('ssl.modal.forceHttpsNo')}</strong>
                    <span>{t('ssl.modal.forceHttpsNoDesc')}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Info */}
            <div className="modal-info">
              <p>{t('ssl.modal.info')}</p>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-btn modal-btn-secondary" onClick={handleClose}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="modal-btn modal-btn-primary" disabled={loading}>
              {loading ? '...' : t('ssl.modal.activate')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfigureSslModal;
