// ============================================================
// WORDPRESS MODAL: CREATE WEBSITE
// Aligné sur OLD_MANAGER API v2 - POST /managedCMS/resource/{serviceName}/website
// Payload: PostCreatePayload avec targetSpec.creation
// Versions PHP et langues chargées via API
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { wordpressApi } from './wordpress.api';
import type { PostCreatePayload, CreateWebsiteFormData, PHPVersion, AvailableLanguage } from './wordpress.types';
import './Modals.css';

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateWebsiteModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');

  // Form state
  const [formData, setFormData] = useState<CreateWebsiteFormData>({
    adminLogin: '',
    adminPassword: '',
    language: 'fr_FR',
    url: '',
    phpVersion: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // API data
  const [phpVersions, setPhpVersions] = useState<PHPVersion[]>([]);
  const [languages, setLanguages] = useState<AvailableLanguage[]>([]);
  const [loadingRef, setLoadingRef] = useState(true);

  // Charger les références au montage
  useEffect(() => {
    if (!isOpen) return;

    const loadReferences = async () => {
      setLoadingRef(true);
      try {
        const [versions, langs] = await Promise.all([
          wordpressApi.getSupportedPHPVersions(),
          wordpressApi.getAvailableLanguages(),
        ]);
        setPhpVersions(versions || []);
        setLanguages(langs || []);

        // Définir la version PHP par défaut (la plus récente)
        if (versions && versions.length > 0) {
          setFormData(prev => ({
            ...prev,
            phpVersion: versions[versions.length - 1],
          }));
        }
      } catch (err) {
        console.error('Erreur chargement références:', err);
        // Fallback hardcodé si l'API échoue
        setPhpVersions(['8.0', '8.1', '8.2']);
        setLanguages([
          { code: 'fr_FR', name: 'Français' },
          { code: 'en_US', name: 'English (US)' },
          { code: 'en_GB', name: 'English (UK)' },
          { code: 'de_DE', name: 'Deutsch' },
          { code: 'es_ES', name: 'Español' },
        ]);
        setFormData(prev => ({ ...prev, phpVersion: '8.2' }));
      } finally {
        setLoadingRef(false);
      }
    };

    loadReferences();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof CreateWebsiteFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.adminLogin || !formData.adminPassword) return;

    setLoading(true);
    setError(null);

    try {
      // Construire le payload selon OLD MANAGER (PostCreatePayload)
      const payload: PostCreatePayload = {
        targetSpec: {
          creation: {
            adminLogin: formData.adminLogin,
            adminPassword: formData.adminPassword,
            cms: 'WORDPRESS',
            cmsSpecific: {
              wordpress: {
                language: formData.language,
                url: formData.url || undefined,
              },
            },
            phpVersion: formData.phpVersion,
          },
        },
      };

      await wordpressApi.createWebsite(serviceName, payload);
      onSuccess();
      resetForm();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      adminLogin: '',
      adminPassword: '',
      language: 'fr_FR',
      url: '',
      phpVersion: phpVersions.length > 0 ? phpVersions[phpVersions.length - 1] : '8.2',
    });
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t('website.createTitle') || 'Créer un site WordPress'}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="modal-error">{error}</div>}

            {loadingRef ? (
              <div className="modal-loading">{t('common.loading') || 'Chargement...'}</div>
            ) : (
              <>
                {/* Admin Credentials */}
                <div className="form-section">
                  <h4>{t('website.adminCredentials') || 'Identifiants administrateur'}</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t('website.adminLogin') || 'Email administrateur'} *</label>
                      <input
                        type="email"
                        className="form-input"
                        value={formData.adminLogin}
                        onChange={e => handleChange('adminLogin', e.target.value)}
                        placeholder="admin@example.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('website.adminPassword') || 'Mot de passe'} *</label>
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
                      <span className="form-hint">
                        {t('website.passwordHint') || 'Minimum 8 caractères, avec majuscules et chiffres'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PHP Version */}
                <div className="form-group">
                  <label>{t('website.phpVersion') || 'Version PHP'} *</label>
                  <select
                    className="form-select"
                    value={formData.phpVersion}
                    onChange={e => handleChange('phpVersion', e.target.value)}
                    required
                  >
                    {phpVersions.map(version => (
                      <option key={version} value={version}>
                        PHP {version}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language */}
                <div className="form-group">
                  <label>{t('website.language') || 'Langue'}</label>
                  <select
                    className="form-select"
                    value={formData.language}
                    onChange={e => handleChange('language', e.target.value)}
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Info */}
                <div className="modal-info">
                  <span className="modal-info-icon">ℹ️</span>
                  <p>{t('website.createInfo') || 'Un nouveau site WordPress sera créé avec ces paramètres. Vous pourrez le configurer après la création.'}</p>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-btn modal-btn-secondary" onClick={handleClose}>
              {t('common.cancel') || 'Annuler'}
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-primary"
              disabled={loading || loadingRef || !formData.adminLogin || !formData.adminPassword}
            >
              {loading ? '...' : (t('website.create') || 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateWebsiteModal;
