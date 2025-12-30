// ============================================================
// WORDPRESS MODAL: CREATE WEBSITE
// ============================================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../../../services/api';
import type { CreateWebsiteParams } from '../wordpress.types';

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BASE_PATH = '/managedCMS/resource';
const API_OPTIONS = { apiVersion: 'v2' as const };

export function CreateWebsiteModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  const [formData, setFormData] = useState<CreateWebsiteParams>({
    domain: '',
    adminEmail: '',
    adminPassword: '',
    language: 'fr_FR',
    title: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof CreateWebsiteParams, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.domain || !formData.adminEmail || !formData.adminPassword) return;

    setLoading(true);
    setError(null);

    try {
      await apiClient.post(`${BASE_PATH}/${serviceName}/website`, formData, API_OPTIONS);
      onSuccess();
      setFormData({ domain: '', adminEmail: '', adminPassword: '', language: 'fr_FR', title: '' });
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ domain: '', adminEmail: '', adminPassword: '', language: 'fr_FR', title: '' });
    setError(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t('website.createTitle')}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="modal-error">{error}</div>}

            {/* Domain */}
            <div className="form-group">
              <label>{t('website.domain')} *</label>
              <input
                type="text"
                className="form-input"
                value={formData.domain}
                onChange={e => handleChange('domain', e.target.value)}
                placeholder="example.com"
                required
              />
              <span className="form-hint">{t('website.domainHint')}</span>
            </div>

            {/* Title */}
            <div className="form-group">
              <label>{t('website.title')}</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={e => handleChange('title', e.target.value)}
                placeholder={t('website.titlePlaceholder')}
              />
            </div>

            {/* Admin Credentials */}
            <div className="form-section">
              <h4>{t('website.adminCredentials')}</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('website.adminEmail')} *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.adminEmail}
                    onChange={e => handleChange('adminEmail', e.target.value)}
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('website.adminPassword')} *</label>
                  <div className="form-input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      value={formData.adminPassword}
                      onChange={e => handleChange('adminPassword', e.target.value)}
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="form-input-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <span className="form-hint">{t('website.passwordHint')}</span>
                </div>
              </div>
            </div>

            {/* Language */}
            <div className="form-group">
              <label>{t('website.language')}</label>
              <select
                className="form-select"
                value={formData.language}
                onChange={e => handleChange('language', e.target.value)}
              >
                <option value="fr_FR">Français</option>
                <option value="en_US">English (US)</option>
                <option value="en_GB">English (UK)</option>
                <option value="de_DE">Deutsch</option>
                <option value="es_ES">Español</option>
                <option value="it_IT">Italiano</option>
                <option value="pt_PT">Português</option>
                <option value="nl_NL">Nederlands</option>
                <option value="pl_PL">Polski</option>
              </select>
            </div>

            {/* Info */}
            <div className="modal-info">
              <span className="modal-info-icon">ℹ️</span>
              <p>{t('website.createInfo')}</p>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '...' : t('website.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateWebsiteModal;
