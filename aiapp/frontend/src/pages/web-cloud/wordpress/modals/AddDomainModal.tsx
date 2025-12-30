// ============================================================
// WORDPRESS MODAL: ADD DOMAIN
// ============================================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { domainsService } from '../tabs/domains/DomainsTab.service';

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddDomainModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  const [domain, setDomain] = useState('');
  const [type, setType] = useState<'alias' | 'multisite'>('alias');
  const [enableSsl, setEnableSsl] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) {
      setError(t('domains.modal.errorDomainRequired'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await domainsService.addDomain(serviceName, { domain: domain.trim(), type, enableSsl });
      onSuccess();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDomain('');
    setType('alias');
    setEnableSsl(true);
    setError(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t('domains.modal.addTitle')}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="modal-error">{error}</div>}

            {/* Domain input */}
            <div className="form-group">
              <label>{t('domains.modal.domainLabel')}</label>
              <input
                type="text"
                className="form-input"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="www.example.com"
                autoFocus
              />
            </div>

            {/* Type selection */}
            <div className="form-group">
              <label>{t('domains.modal.typeLabel')}</label>
              <div className="radio-group">
                <label className="radio-item">
                  <input
                    type="radio"
                    name="type"
                    checked={type === 'alias'}
                    onChange={() => setType('alias')}
                  />
                  <div className="radio-content">
                    <strong>{t('domains.modal.typeAlias')}</strong>
                    <span>{t('domains.modal.typeAliasDesc')}</span>
                  </div>
                </label>
                <label className="radio-item">
                  <input
                    type="radio"
                    name="type"
                    checked={type === 'multisite'}
                    onChange={() => setType('multisite')}
                  />
                  <div className="radio-content">
                    <strong>{t('domains.modal.typeMultisite')}</strong>
                    <span>{t('domains.modal.typeMultisiteDesc')}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* DNS Config Warning */}
            <div className="modal-warning">
              <h4>⚠️ {t('domains.modal.dnsWarningTitle')}</h4>
              <p>{t('domains.modal.dnsWarningDesc')}</p>
              <div className="dns-preview">
                <div className="dns-row">
                  <span className="dns-type">A</span>
                  <span className="dns-name">@</span>
                  <span className="dns-value">1.2.3.4</span>
                </div>
                <div className="dns-row">
                  <span className="dns-type">CNAME</span>
                  <span className="dns-name">www</span>
                  <span className="dns-value">mon-blog.fr.</span>
                </div>
              </div>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => {
                navigator.clipboard.writeText('A @ 1.2.3.4\nCNAME www mon-blog.fr.');
              }}>
                📋 {t('domains.copyConfig')}
              </button>
            </div>

            {/* SSL checkbox */}
            <div className="form-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={enableSsl}
                  onChange={e => setEnableSsl(e.target.checked)}
                />
                <span>{t('domains.modal.enableSsl')}</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '...' : t('domains.modal.addButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDomainModal;
