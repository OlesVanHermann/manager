// ============================================================
// WORDPRESS MODAL: IMPORT WEBSITE (2 étapes)
// Aligné sur OLD_MANAGER:
// - Step 1: POST /managedCMS/resource/{serviceName}/website avec PostImportPayload
// - Step 2: PUT /managedCMS/resource/{serviceName}/task/{taskId} avec sélection
// ============================================================

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { wordpressApi } from './wordpress.api';
import type {
  PostImportPayload,
  ImportWebsiteFormData,
  ManagedWordpressWebsiteDetails,
  ImportSelection,
} from './wordpress.types';
import './Modals.css';

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 1 | 2;

export function ImportWebsiteModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');

  // State global
  const [step, setStep] = useState<Step>(1);
  const [websiteId, setWebsiteId] = useState<string | null>(null);
  const [websiteDetails, setWebsiteDetails] = useState<ManagedWordpressWebsiteDetails | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 form
  const [formData, setFormData] = useState<ImportWebsiteFormData>({
    adminLogin: '',
    adminPassword: '',
    adminURL: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 form (sélection)
  const [selection, setSelection] = useState<ImportSelection>({
    plugins: [],
    themes: [],
    wholeDatabase: true,
    media: true,
    posts: false,
    pages: false,
    comments: false,
    tags: false,
    users: false,
  });

  // Polling pour attendre les données d'import
  const pollForImportData = useCallback(async (wsId: string) => {
    let attempts = 0;
    const maxAttempts = 10;
    const interval = 3000;

    const poll = async (): Promise<boolean> => {
      attempts++;
      try {
        const details = await wordpressApi.getWebsite(serviceName, wsId);
        const importData = details.currentState?.import?.checkResult?.cmsSpecific?.wordpress;

        if (importData) {
          setWebsiteDetails(details);
          // Récupérer le taskId depuis currentTasks
          const task = details.currentTasks?.find(t => t.status === 'WAITING_USER_INPUT');
          if (task) {
            setTaskId(task.id);
          }

          // Initialiser la sélection avec les données d'import
          setSelection({
            plugins: importData.plugins.map(p => ({ ...p, enabled: true })),
            themes: importData.themes.map(t => ({ ...t, active: true })),
            wholeDatabase: true,
            media: true,
            posts: false,
            pages: false,
            comments: false,
            tags: false,
            users: false,
          });
          return true;
        }
      } catch (err) {
        console.error('Polling error:', err);
      }

      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, interval));
        return poll();
      }
      return false;
    };

    return poll();
  }, [serviceName]);

  // Reset au close
  const resetState = () => {
    setStep(1);
    setWebsiteId(null);
    setWebsiteDetails(null);
    setTaskId(null);
    setLoading(false);
    setError(null);
    setFormData({ adminLogin: '', adminPassword: '', adminURL: '' });
    setSelection({
      plugins: [],
      themes: [],
      wholeDatabase: true,
      media: true,
      posts: false,
      pages: false,
      comments: false,
      tags: false,
      users: false,
    });
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  // Step 1: Soumission des credentials
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.adminLogin || !formData.adminPassword || !formData.adminURL) return;

    setLoading(true);
    setError(null);

    try {
      const payload: PostImportPayload = {
        targetSpec: {
          import: {
            adminLogin: formData.adminLogin,
            adminPassword: formData.adminPassword,
            adminURL: formData.adminURL,
            cms: 'WORDPRESS',
          },
        },
      };

      const response = await wordpressApi.importWebsite(serviceName, payload);
      const wsId = response.id;
      setWebsiteId(wsId);

      // Attendre que les données d'import soient disponibles
      const success = await pollForImportData(wsId);
      if (success) {
        setStep(2);
      } else {
        setError(t('import.timeout') || 'Timeout: impossible de récupérer les données du site');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Soumission de la sélection
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId) {
      setError('Task ID manquant');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await wordpressApi.updateTask(serviceName, taskId, {
        inputs: {
          'import.cmsSpecific.wordpress.selection': selection,
        },
      });
      onSuccess();
      resetState();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // Helpers pour Step 2
  const togglePlugin = (index: number) => {
    setSelection(prev => ({
      ...prev,
      plugins: prev.plugins.map((p, i) =>
        i === index ? { ...p, enabled: !p.enabled } : p
      ),
    }));
  };

  const toggleTheme = (index: number) => {
    setSelection(prev => ({
      ...prev,
      themes: prev.themes.map((t, i) =>
        i === index ? { ...t, active: !t.active } : t
      ),
    }));
  };

  const toggleAllPlugins = (enabled: boolean) => {
    setSelection(prev => ({
      ...prev,
      plugins: prev.plugins.map(p => ({ ...p, enabled })),
    }));
  };

  const toggleAllThemes = (active: boolean) => {
    setSelection(prev => ({
      ...prev,
      themes: prev.themes.map(t => ({ ...t, active })),
    }));
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container modal-xl" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {step === 1
              ? (t('import.title') || 'Importer un site WordPress')
              : (t('import.step2Title') || 'Sélectionner les éléments à importer')}
          </h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        {step === 1 ? (
          // STEP 1: Credentials
          <form onSubmit={handleStep1Submit}>
            <div className="modal-body">
              {error && <div className="modal-error">{error}</div>}

              <div className="modal-info">
                <span className="modal-info-icon">ℹ️</span>
                <p>{t('import.info') || 'Entrez les informations de connexion de votre site WordPress existant.'}</p>
              </div>

              <div className="form-group">
                <label>{t('import.adminURL') || 'URL du site'} *</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.adminURL}
                  onChange={e => setFormData(prev => ({ ...prev, adminURL: e.target.value }))}
                  placeholder="https://example.com/wp-admin"
                  required
                />
                <span className="form-hint">{t('import.adminURLHint') || "L'URL de connexion à l'admin WordPress"}</span>
              </div>

              <div className="form-section">
                <h4>{t('import.credentials') || 'Identifiants WordPress'}</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('import.adminLogin') || 'Identifiant'} *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.adminLogin}
                      onChange={e => setFormData(prev => ({ ...prev, adminLogin: e.target.value }))}
                      placeholder="admin"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('import.adminPassword') || 'Mot de passe'} *</label>
                    <div className="form-input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        value={formData.adminPassword}
                        onChange={e => setFormData(prev => ({ ...prev, adminPassword: e.target.value }))}
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
                  </div>
                </div>
              </div>

              <div className="modal-warning">
                <span className="modal-warning-icon">⚠️</span>
                <p>{t('import.warning') || 'Assurez-vous que le plugin OVH Migration est installé sur votre site source.'}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="modal-btn modal-btn-secondary" onClick={handleClose}>
                {t('common.cancel') || 'Annuler'}
              </button>
              <button
                type="submit"
                className="modal-btn modal-btn-primary"
                disabled={loading || !formData.adminURL || !formData.adminLogin || !formData.adminPassword}
              >
                {loading ? (t('import.analyzing') || 'Analyse en cours...') : (t('import.continue') || 'Continuer')}
              </button>
            </div>
          </form>
        ) : (
          // STEP 2: Sélection
          <form onSubmit={handleStep2Submit}>
            <div className="modal-body">
              {error && <div className="modal-error">{error}</div>}

              <p className="import-step2-desc">
                {t('import.step2Desc') || 'Sélectionnez les éléments que vous souhaitez importer depuis votre site source.'}
              </p>

              <div className="import-selection-grid">
                {/* Plugins */}
                <div className="import-selection-card">
                  <div className="import-selection-header">
                    <h4>{t('import.plugins') || 'Plugins'}</h4>
                    <label className="import-select-all">
                      <input
                        type="checkbox"
                        checked={selection.plugins.every(p => p.enabled)}
                        onChange={e => toggleAllPlugins(e.target.checked)}
                      />
                      {t('import.selectAll') || 'Tout sélectionner'}
                    </label>
                  </div>
                  <div className="import-selection-list">
                    {selection.plugins.length === 0 ? (
                      <div className="import-selection-empty">{t('import.noPlugins') || 'Aucun plugin détecté'}</div>
                    ) : (
                      selection.plugins.map((plugin, index) => (
                        <label key={plugin.name} className="import-selection-item">
                          <input
                            type="checkbox"
                            checked={plugin.enabled}
                            onChange={() => togglePlugin(index)}
                          />
                          <span>{plugin.name}</span>
                          <span className="import-selection-version">v{plugin.version}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Themes */}
                <div className="import-selection-card">
                  <div className="import-selection-header">
                    <h4>{t('import.themes') || 'Thèmes'}</h4>
                    <label className="import-select-all">
                      <input
                        type="checkbox"
                        checked={selection.themes.every(t => t.active)}
                        onChange={e => toggleAllThemes(e.target.checked)}
                      />
                      {t('import.selectAll') || 'Tout sélectionner'}
                    </label>
                  </div>
                  <div className="import-selection-list">
                    {selection.themes.length === 0 ? (
                      <div className="import-selection-empty">{t('import.noThemes') || 'Aucun thème détecté'}</div>
                    ) : (
                      selection.themes.map((theme, index) => (
                        <label key={theme.name} className="import-selection-item">
                          <input
                            type="checkbox"
                            checked={theme.active}
                            onChange={() => toggleTheme(index)}
                          />
                          <span>{theme.name}</span>
                          <span className="import-selection-version">v{theme.version}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Media */}
                <div className="import-selection-card">
                  <div className="import-selection-header">
                    <h4>{t('import.media') || 'Médias'}</h4>
                  </div>
                  <label className="import-selection-item">
                    <input
                      type="checkbox"
                      checked={selection.media}
                      onChange={e => setSelection(prev => ({ ...prev, media: e.target.checked }))}
                    />
                    <span>{t('import.allMedia') || 'Importer tous les médias'}</span>
                  </label>
                </div>
              </div>

              {/* Database */}
              <div className="import-database-section">
                <h4>{t('import.database') || 'Base de données'}</h4>
                <div className="import-database-options">
                  <label className="import-radio-option">
                    <input
                      type="radio"
                      name="database"
                      checked={selection.wholeDatabase}
                      onChange={() => setSelection(prev => ({ ...prev, wholeDatabase: true }))}
                    />
                    <div>
                      <strong>{t('import.wholeDatabase') || 'Base de données complète'}</strong>
                      <span>{t('import.wholeDatabaseDesc') || 'Importer toutes les tables de la base de données'}</span>
                    </div>
                  </label>
                  <label className="import-radio-option">
                    <input
                      type="radio"
                      name="database"
                      checked={!selection.wholeDatabase}
                      onChange={() => setSelection(prev => ({ ...prev, wholeDatabase: false }))}
                    />
                    <div>
                      <strong>{t('import.selectiveDatabase') || 'Sélection partielle'}</strong>
                      <span>{t('import.selectiveDatabaseDesc') || 'Choisir les éléments à importer'}</span>
                    </div>
                  </label>
                </div>

                {!selection.wholeDatabase && (
                  <div className="import-database-items">
                    <label className="import-selection-item">
                      <input
                        type="checkbox"
                        checked={selection.posts}
                        onChange={e => setSelection(prev => ({ ...prev, posts: e.target.checked }))}
                      />
                      <span>{t('import.posts') || 'Articles'}</span>
                    </label>
                    <label className="import-selection-item">
                      <input
                        type="checkbox"
                        checked={selection.pages}
                        onChange={e => setSelection(prev => ({ ...prev, pages: e.target.checked }))}
                      />
                      <span>{t('import.pages') || 'Pages'}</span>
                    </label>
                    <label className="import-selection-item">
                      <input
                        type="checkbox"
                        checked={selection.comments}
                        onChange={e => setSelection(prev => ({ ...prev, comments: e.target.checked }))}
                      />
                      <span>{t('import.comments') || 'Commentaires'}</span>
                    </label>
                    <label className="import-selection-item">
                      <input
                        type="checkbox"
                        checked={selection.tags}
                        onChange={e => setSelection(prev => ({ ...prev, tags: e.target.checked }))}
                      />
                      <span>{t('import.tags') || 'Tags et catégories'}</span>
                    </label>
                    <label className="import-selection-item">
                      <input
                        type="checkbox"
                        checked={selection.users}
                        onChange={e => setSelection(prev => ({ ...prev, users: e.target.checked }))}
                      />
                      <span>{t('import.users') || 'Utilisateurs'}</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="modal-warning">
                <span className="modal-warning-icon">⚠️</span>
                <p>{t('import.step2Warning') || "L'import peut prendre plusieurs minutes selon la taille de votre site."}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="modal-btn modal-btn-secondary" onClick={() => setStep(1)}>
                {t('common.back') || 'Retour'}
              </button>
              <button
                type="submit"
                className="modal-btn modal-btn-primary"
                disabled={loading || selection.themes.filter(t => t.active).length === 0}
              >
                {loading ? '...' : (t('import.start') || "Lancer l'import")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ImportWebsiteModal;
