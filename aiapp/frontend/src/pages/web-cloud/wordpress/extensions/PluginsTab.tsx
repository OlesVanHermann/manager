// ============================================================
// WORDPRESS SUB-TAB: PLUGINS (NAV4)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { extensionsService } from './Extensions.service';
import type { WordPressPlugin } from '../wordpress.types';

interface Props {
  serviceName: string;
}

export function PluginsTab({ serviceName }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  const [plugins, setPlugins] = useState<WordPressPlugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [updatingAll, setUpdatingAll] = useState(false);

  const loadPlugins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await extensionsService.listPlugins(serviceName);
      setPlugins(data || []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    loadPlugins();
  }, [loadPlugins]);

  const handleUpdate = async (pluginName: string) => {
    setActionLoading(`update-${pluginName}`);
    try {
      await extensionsService.updatePlugin(serviceName, pluginName);
      alert(t('extensions.updateStarted'));
      loadPlugins();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateAll = async () => {
    const pluginsWithUpdate = plugins.filter(p => p.hasUpdate);
    if (pluginsWithUpdate.length === 0) return;

    if (!confirm(t('extensions.confirmUpdateAll', { count: pluginsWithUpdate.length }))) return;

    setUpdatingAll(true);
    try {
      await extensionsService.updateAllPlugins(serviceName);
      alert(t('extensions.updateAllStarted'));
      loadPlugins();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setUpdatingAll(false);
    }
  };

  const handleTogglePlugin = async (plugin: WordPressPlugin) => {
    const action = plugin.status === 'active' ? 'deactivate' : 'activate';
    setActionLoading(`${action}-${plugin.name}`);
    try {
      if (action === 'activate') {
        await extensionsService.activatePlugin(serviceName, plugin.name);
      } else {
        await extensionsService.deactivatePlugin(serviceName, plugin.name);
      }
      loadPlugins();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  const pluginsWithUpdate = plugins.filter(p => p.hasUpdate).length;
  const activePlugins = plugins.filter(p => p.status === 'active');
  const inactivePlugins = plugins.filter(p => p.status !== 'active');

  if (loading) {
    return <div className="ext-loading">{t('common.loading')}</div>;
  }

  if (error) {
    return (
      <div className="ext-error">
        <p>{error}</p>
        <button className="ext-btn ext-btn-outline ext-btn-sm" onClick={loadPlugins}>
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="plugins-subtab">
      {/* Header */}
      <div className="ext-header">
        <div>
          <p className="ext-count">
            {plugins.length} {t('extensions.pluginsInstalled')}
            {pluginsWithUpdate > 0 && (
              <span className="ext-update-count">
                ({pluginsWithUpdate} {t('extensions.updatesAvailable')})
              </span>
            )}
          </p>
        </div>
        <div className="ext-header-actions">
          {pluginsWithUpdate > 0 && (
            <button
              className="ext-btn ext-btn-primary ext-btn-sm"
              onClick={handleUpdateAll}
              disabled={updatingAll}
            >
              {updatingAll ? '...' : t('extensions.updateAll')}
            </button>
          )}
          <button className="ext-btn ext-btn-outline ext-btn-sm" onClick={loadPlugins}>
            {t('common.refresh')}
          </button>
        </div>
      </div>

      {plugins.length === 0 ? (
        <div className="ext-empty">
          <span className="ext-empty-icon">🔌</span>
          <h4>{t('extensions.noPlugins')}</h4>
          <p>{t('extensions.noPluginsHint')}</p>
        </div>
      ) : (
        <>
          {/* Active Plugins */}
          {activePlugins.length > 0 && (
            <section className="ext-section">
              <h4 className="ext-section-title">
                {t('extensions.activePlugins')} ({activePlugins.length})
              </h4>
              <div className="ext-list">
                {activePlugins.map(plugin => (
                  <div key={plugin.name} className="ext-list-item">
                    <div className="ext-list-icon">🔌</div>
                    <div className="ext-list-info">
                      <span className="ext-list-name">{plugin.name}</span>
                      <span className="ext-list-version">v{plugin.version}</span>
                    </div>
                    <div className="ext-list-status">
                      {plugin.hasUpdate && (
                        <span className="ext-badge ext-badge-warning">
                          {t('extensions.updateAvailable')}
                        </span>
                      )}
                      <span className="ext-badge ext-badge-success">
                        {t('extensions.active')}
                      </span>
                    </div>
                    <div className="ext-list-actions">
                      {plugin.hasUpdate && (
                        <button
                          className="ext-btn ext-btn-xs ext-btn-primary"
                          onClick={() => handleUpdate(plugin.name)}
                          disabled={actionLoading === `update-${plugin.name}`}
                          title={t('extensions.update')}
                        >
                          {actionLoading === `update-${plugin.name}` ? '...' : '⬆️'}
                        </button>
                      )}
                      <button
                        className="ext-btn ext-btn-xs ext-btn-outline"
                        onClick={() => handleTogglePlugin(plugin)}
                        disabled={actionLoading === `deactivate-${plugin.name}`}
                        title={t('extensions.deactivate')}
                      >
                        {actionLoading === `deactivate-${plugin.name}` ? '...' : '⏸️'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Inactive Plugins */}
          {inactivePlugins.length > 0 && (
            <section className="ext-section">
              <h4 className="ext-section-title">
                {t('extensions.inactivePlugins')} ({inactivePlugins.length})
              </h4>
              <div className="ext-list">
                {inactivePlugins.map(plugin => (
                  <div key={plugin.name} className="ext-list-item ext-list-item-inactive">
                    <div className="ext-list-icon">🔌</div>
                    <div className="ext-list-info">
                      <span className="ext-list-name">{plugin.name}</span>
                      <span className="ext-list-version">v{plugin.version}</span>
                    </div>
                    <div className="ext-list-status">
                      {plugin.hasUpdate && (
                        <span className="ext-badge ext-badge-warning">
                          {t('extensions.updateAvailable')}
                        </span>
                      )}
                    </div>
                    <div className="ext-list-actions">
                      {plugin.hasUpdate && (
                        <button
                          className="ext-btn ext-btn-xs ext-btn-outline"
                          onClick={() => handleUpdate(plugin.name)}
                          disabled={actionLoading === `update-${plugin.name}`}
                          title={t('extensions.update')}
                        >
                          {actionLoading === `update-${plugin.name}` ? '...' : '⬆️'}
                        </button>
                      )}
                      <button
                        className="ext-btn ext-btn-xs ext-btn-success"
                        onClick={() => handleTogglePlugin(plugin)}
                        disabled={actionLoading === `activate-${plugin.name}`}
                        title={t('extensions.activate')}
                      >
                        {actionLoading === `activate-${plugin.name}` ? '...' : '▶️'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Security Notice */}
      <div className="ext-warning">
        <span className="ext-warning-icon">⚠️</span>
        <div>
          <strong>{t('extensions.securityNotice')}</strong>
          <p>{t('extensions.securityNoticeText')}</p>
        </div>
      </div>
    </div>
  );
}

export default PluginsTab;
