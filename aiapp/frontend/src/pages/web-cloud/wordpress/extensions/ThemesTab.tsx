// ============================================================
// WORDPRESS SUB-TAB: THEMES (NAV4)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { extensionsService } from './Extensions.service';
import type { WordPressTheme } from '../wordpress.types';

interface Props {
  serviceName: string;
}

export function ThemesTab({ serviceName }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  const [themes, setThemes] = useState<WordPressTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadThemes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await extensionsService.listThemes(serviceName);
      setThemes(data || []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    loadThemes();
  }, [loadThemes]);

  const handleUpdate = async (themeName: string) => {
    setUpdating(themeName);
    try {
      await extensionsService.updateTheme(serviceName, themeName);
      alert(t('extensions.updateStarted'));
      loadThemes();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string, hasUpdate: boolean) => {
    if (hasUpdate) {
      return { className: 'ext-badge ext-badge-warning', label: t('extensions.updateAvailable') };
    }
    if (status === 'active') {
      return { className: 'ext-badge ext-badge-success', label: t('extensions.active') };
    }
    return { className: 'ext-badge ext-badge-inactive', label: t('extensions.inactive') };
  };

  if (loading) {
    return <div className="ext-loading">{t('common.loading')}</div>;
  }

  if (error) {
    return (
      <div className="ext-error">
        <p>{error}</p>
        <button className="ext-btn ext-btn-outline ext-btn-sm" onClick={loadThemes}>
          {t('common.retry')}
        </button>
      </div>
    );
  }

  const activeThemes = themes.filter(th => th.status === 'active');
  const inactiveThemes = themes.filter(th => th.status !== 'active');

  return (
    <div className="themes-subtab">
      {/* Header */}
      <div className="ext-header">
        <div>
          <p className="ext-count">
            {themes.length} {t('extensions.themesInstalled')}
          </p>
        </div>
        <button className="ext-btn ext-btn-outline ext-btn-sm" onClick={loadThemes}>
          {t('common.refresh')}
        </button>
      </div>

      {themes.length === 0 ? (
        <div className="ext-empty">
          <span className="ext-empty-icon">🎨</span>
          <h4>{t('extensions.noThemes')}</h4>
          <p>{t('extensions.noThemesHint')}</p>
        </div>
      ) : (
        <>
          {/* Active Themes */}
          {activeThemes.length > 0 && (
            <section className="ext-section">
              <h4 className="ext-section-title">{t('extensions.activeTheme')}</h4>
              <div className="ext-grid">
                {activeThemes.map(theme => (
                  <div key={theme.name} className="ext-card ext-card-active">
                    <div className="ext-card-header">
                      <div className="ext-card-icon">🎨</div>
                      <div className="ext-card-info">
                        <span className="ext-card-name">{theme.name}</span>
                        <span className="ext-card-version">v{theme.version}</span>
                      </div>
                      {getStatusBadge(theme.status, theme.hasUpdate).className && (
                        <span className={getStatusBadge(theme.status, theme.hasUpdate).className}>
                          {getStatusBadge(theme.status, theme.hasUpdate).label}
                        </span>
                      )}
                    </div>
                    {theme.hasUpdate && (
                      <div className="ext-card-actions">
                        <button
                          className="ext-btn ext-btn-sm ext-btn-primary"
                          onClick={() => handleUpdate(theme.name)}
                          disabled={updating === theme.name}
                        >
                          {updating === theme.name ? '...' : t('extensions.update')}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Inactive Themes */}
          {inactiveThemes.length > 0 && (
            <section className="ext-section">
              <h4 className="ext-section-title">{t('extensions.inactiveThemes')}</h4>
              <div className="ext-grid">
                {inactiveThemes.map(theme => (
                  <div key={theme.name} className="ext-card">
                    <div className="ext-card-header">
                      <div className="ext-card-icon">🎨</div>
                      <div className="ext-card-info">
                        <span className="ext-card-name">{theme.name}</span>
                        <span className="ext-card-version">v{theme.version}</span>
                      </div>
                      {theme.hasUpdate && (
                        <span className="ext-badge ext-badge-warning">
                          {t('extensions.updateAvailable')}
                        </span>
                      )}
                    </div>
                    {theme.hasUpdate && (
                      <div className="ext-card-actions">
                        <button
                          className="ext-btn ext-btn-sm ext-btn-outline"
                          onClick={() => handleUpdate(theme.name)}
                          disabled={updating === theme.name}
                        >
                          {updating === theme.name ? '...' : t('extensions.update')}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Info Banner */}
      <div className="ext-info">
        <span className="ext-info-icon">💡</span>
        <p>{t('extensions.themesTip')}</p>
      </div>
    </div>
  );
}

export default ThemesTab;
