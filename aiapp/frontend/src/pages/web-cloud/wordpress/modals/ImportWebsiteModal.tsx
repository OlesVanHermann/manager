// ============================================================
// WORDPRESS MODAL: IMPORT WEBSITE
// ============================================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../../../services/api';
import type { ImportWebsiteParams } from '../wordpress.types';
import './Modals.css';

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BASE_PATH = '/managedCMS/resource';
const API_OPTIONS = { apiVersion: 'v2' as const };

export function ImportWebsiteModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  const [formData, setFormData] = useState<ImportWebsiteParams>({
    domain: '',
    ftpUrl: '',
    ftpUser: '',
    ftpPassword: '',
    dbUrl: '',
    dbUser: '',
    dbPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleChange = (field: keyof ImportWebsiteParams, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.domain || !formData.ftpUrl || !formData.ftpUser || !formData.ftpPassword) return;

    setLoading(true);
    setError(null);

    try {
      await apiClient.post(`${BASE_PATH}/${serviceName}/website/import`, formData, API_OPTIONS);
      onSuccess();
      setFormData({ domain: '', ftpUrl: '', ftpUser: '', ftpPassword: '', dbUrl: '', dbUser: '', dbPassword: '' });
      setStep(1);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ domain: '', ftpUrl: '', ftpUser: '', ftpPassword: '', dbUrl: '', dbUser: '', dbPassword: '' });
    setError(null);
    setStep(1);
    onClose();
  };

  const canGoNext = () => {
    if (step === 1) return !!formData.domain;
    if (step === 2) return !!formData.ftpUrl && !!formData.ftpUser && !!formData.ftpPassword;
    return true;
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t('import.title')}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="modal-error">{error}</div>}

            {/* Steps Indicator */}
            <div className="modal-steps">
              <div className={`modal-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <span className="modal-step-number">1</span>
                <span className="modal-step-label">{t('import.stepDomain')}</span>
              </div>
              <div className="modal-step-line" />
              <div className={`modal-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                <span className="modal-step-number">2</span>
                <span className="modal-step-label">{t('import.stepFtp')}</span>
              </div>
              <div className="modal-step-line" />
              <div className={`modal-step ${step >= 3 ? 'active' : ''}`}>
                <span className="modal-step-number">3</span>
                <span className="modal-step-label">{t('import.stepDatabase')}</span>
              </div>
            </div>

            {/* Step 1: Domain */}
            {step === 1 && (
              <div className="modal-step-content">
                <div className="form-group">
                  <label>{t('import.domain')} *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.domain}
                    onChange={e => handleChange('domain', e.target.value)}
                    placeholder="example.com"
                    required
                  />
                  <span className="form-hint">{t('import.domainHint')}</span>
                </div>
              </div>
            )}

            {/* Step 2: FTP */}
            {step === 2 && (
              <div className="modal-step-content">
                <div className="form-group">
                  <label>{t('import.ftpUrl')} *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.ftpUrl}
                    onChange={e => handleChange('ftpUrl', e.target.value)}
                    placeholder="ftp://ftp.example.com/www"
                    required
                  />
                  <span className="form-hint">{t('import.ftpUrlHint')}</span>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('import.ftpUser')} *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.ftpUser}
                      onChange={e => handleChange('ftpUser', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('import.ftpPassword')} *</label>
                    <input
                      type="password"
                      className="form-input"
                      value={formData.ftpPassword}
                      onChange={e => handleChange('ftpPassword', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Database */}
            {step === 3 && (
              <div className="modal-step-content">
                <div className="modal-info">
                  <span className="modal-info-icon">ℹ️</span>
                  <p>{t('import.dbOptional')}</p>
                </div>
                <div className="form-group">
                  <label>{t('import.dbUrl')}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.dbUrl || ''}
                    onChange={e => handleChange('dbUrl', e.target.value)}
                    placeholder="mysql://host:3306/database"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('import.dbUser')}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.dbUser || ''}
                      onChange={e => handleChange('dbUser', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('import.dbPassword')}</label>
                    <input
                      type="password"
                      className="form-input"
                      value={formData.dbPassword || ''}
                      onChange={e => handleChange('dbPassword', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-btn modal-btn-secondary" onClick={handleClose}>
              {t('common.cancel')}
            </button>
            {step > 1 && (
              <button
                type="button"
                className="modal-btn modal-btn-outline"
                onClick={() => setStep(s => s - 1)}
              >
                ← {t('common.previous')}
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                className="modal-btn modal-btn-primary"
                onClick={() => setStep(s => s + 1)}
                disabled={!canGoNext()}
              >
                {t('common.next')} →
              </button>
            ) : (
              <button type="submit" className="modal-btn modal-btn-primary" disabled={loading}>
                {loading ? '...' : t('import.start')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ImportWebsiteModal;
