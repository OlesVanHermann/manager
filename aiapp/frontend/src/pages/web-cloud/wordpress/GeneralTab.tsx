// ============================================================
// WORDPRESS TAB: GENERAL (target UX)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { generalService } from './GeneralTab.service';
import type { WordPress, ServiceInfos } from './wordpress.types';
import { DeleteWebsiteModal } from './DeleteWebsiteModal';
import './GeneralTab.css';

interface Props {
  serviceName: string;
  websiteId: string;
  details: WordPress;
  onRefresh: () => void;
}

export function GeneralTab({ serviceName, websiteId, details, onRefresh }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  const [serviceInfos, setServiceInfos] = useState<ServiceInfos | null>(null);
  const [_loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadServiceInfos = useCallback(async () => {
    try {
      setLoading(true);
      const infos = await generalService.getServiceInfos(serviceName);
      setServiceInfos(infos);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    loadServiceInfos();
  }, [loadServiceInfos]);

  // Actions
  const handleFlushCache = async () => {
    setActionLoading('cache');
    try {
      await generalService.flushCache(serviceName);
      alert(t('general.cacheCleared'));
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetPassword = async () => {
    if (!confirm(t('general.confirmResetPassword'))) {
      return;
    }
    setActionLoading('password');
    try {
      await generalService.resetAdminPassword(serviceName);
      alert(t('general.passwordResetStarted'));
      onRefresh();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateWordPress = async () => {
    if (!confirm(t('general.confirmUpdate'))) {
      return;
    }
    setActionLoading('update');
    try {
      await generalService.updateWordPress(serviceName);
      alert(t('general.updateStarted'));
      onRefresh();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Helpers
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStateBadge = (state: string) => {
    const states: Record<string, { className: string; label: string; color: string }> = {
      active: { className: 'success', label: t('states.active'), color: '#10B981' },
      installing: { className: 'warning', label: t('states.installing'), color: '#F59E0B' },
      updating: { className: 'warning', label: t('states.updating'), color: '#F59E0B' },
      suspended: { className: 'error', label: t('states.suspended'), color: '#EF4444' },
      error: { className: 'error', label: t('states.error'), color: '#EF4444' },
    };
    return states[state] || { className: 'muted', label: state, color: '#6B7280' };
  };

  const stateInfo = getStateBadge(details.state);

  return (
    <div className="general-tab">
      {/* Quick Actions */}
      <div className="general-quick-actions-box">
        <div className="general-quick-actions-title">{t('general.quickActions')}</div>
        <div className="general-quick-actions-buttons">
          <a
            href={details.adminUrl || `${details.url}/wp-admin`}
            target="_blank"
            rel="noopener noreferrer"
            className="general-btn general-btn-outline"
            onClick={() => console.log('[GeneralTab] QuickActions: Opening Admin WP', { url: details.adminUrl || `${details.url}/wp-admin` })}
          >
            {t('general.accessAdmin')}
          </a>
          <a
            href={details.url}
            target="_blank"
            rel="noopener noreferrer"
            className="general-btn general-btn-outline"
            onClick={() => console.log('[GeneralTab] QuickActions: Opening site', { url: details.url })}
          >
            {t('general.visitSite')}
          </a>
          <button
            className="general-btn general-btn-outline"
            onClick={handleFlushCache}
            disabled={actionLoading === 'cache'}
          >
            {actionLoading === 'cache' ? '...' : t('general.flushCache')}
          </button>
          <button
            className="general-btn general-btn-outline"
            onClick={handleResetPassword}
            disabled={actionLoading === 'password'}
          >
            {actionLoading === 'password' ? '...' : t('general.resetPassword')}
          </button>
        </div>
      </div>

      {/* Two columns */}
      <div className="general-grid-2col">
        {/* WordPress Info */}
        <section className="general-card">
          <h4>{t('general.wordpress')}</h4>
          <div className="general-info-row">
            <span className="general-info-label">{t('general.state')}</span>
            <span className="general-info-value">
              <span className="general-state-dot" style={{ backgroundColor: stateInfo.color }} />
              {stateInfo.label}
            </span>
          </div>
          <div className="general-info-row">
            <span className="general-info-label">{t('general.version')}</span>
            <span className="general-info-value">{details.wordpressVersion || details.wpVersion || '-'}</span>
          </div>
          <div className="general-info-row">
            <span className="general-info-label">{t('general.php')}</span>
            <span className="general-info-value">{details.phpVersion || '-'}</span>
          </div>
          <div className="general-info-row">
            <span className="general-info-label">{t('general.url')}</span>
            <span className="general-info-value general-copyable">
              <a href={details.url} target="_blank" rel="noopener noreferrer" className="general-link">
                {details.url?.replace('https://', '')}
              </a>
              <button className="general-copy-btn" onClick={() => copyToClipboard(details.url)} title={t('common.copy')}>
                📋
              </button>
            </span>
          </div>
          <div className="general-info-row">
            <span className="general-info-label">{t('general.admin')}</span>
            <span className="general-info-value">{details.adminUser || 'admin'}</span>
          </div>
          {details.updateAvailable && (
            <div className="general-update-btn-wrapper">
              <button
                className="general-btn general-btn-outline general-btn-update"
                onClick={handleUpdateWordPress}
                disabled={actionLoading === 'update'}
              >
                {actionLoading === 'update' ? '...' : t('general.updateWp')}
              </button>
            </div>
          )}
        </section>

        {/* Technical Info */}
        <section className="general-card">
          <h4>{t('general.technical')}</h4>
          <div className="general-info-row">
            <span className="general-info-label">{t('general.offer')}</span>
            <span className="general-info-value">{details.offer || '-'}</span>
          </div>
          <div className="general-info-row">
            <span className="general-info-label">{t('general.datacenter')}</span>
            <span className="general-info-value">{details.datacenter || '-'}</span>
          </div>
          <div className="general-info-row">
            <span className="general-info-label">{t('general.ssl')}</span>
            <span className="general-info-value">
              <span className="general-state-dot" style={{ backgroundColor: details.sslEnabled ? '#10B981' : '#EF4444' }} />
              {details.sslEnabled ? "Let's Encrypt" : t('general.notConfigured')}
            </span>
          </div>
          <div className="general-info-row">
            <span className="general-info-label">{t('general.cdn')}</span>
            <span className="general-info-value">
              <span className="general-state-dot" style={{ backgroundColor: details.cdnEnabled ? '#10B981' : '#6B7280' }} />
              {details.cdnEnabled ? t('general.active') : t('general.inactive')}
            </span>
          </div>
          <div className="general-info-row">
            <span className="general-info-label">{t('general.autoUpdate')}</span>
            <span className="general-info-value">
              <span className="general-state-dot" style={{ backgroundColor: details.autoUpdate ? '#10B981' : '#6B7280' }} />
              {details.autoUpdate ? t('general.enabled') : t('general.disabled')}
            </span>
          </div>
          <div className="general-info-row">
            <span className="general-info-label">{t('general.creation')}</span>
            <span className="general-info-value">{formatDate(serviceInfos?.creation || details.creationDate)}</span>
          </div>
          <div className="general-info-row">
            <span className="general-info-label">{t('general.expiration')}</span>
            <span className="general-info-value">{formatDate(serviceInfos?.expiration || details.expirationDate)}</span>
          </div>
        </section>
      </div>

      {/* Danger Zone */}
      <section className="general-danger-zone">
        <div className="general-danger-header">
          <h4>{t('general.dangerZone')}</h4>
          <button
            className="general-btn general-btn-danger"
            onClick={() => {
              setShowDeleteModal(true);
            }}
          >
            {t('general.delete')}
          </button>
        </div>
        <p className="general-danger-text">{t('general.deleteWarning')}</p>
      </section>

      {/* Delete Modal */}
      <DeleteWebsiteModal
        serviceName={serviceName}
        websiteId={websiteId}
        websiteName={details.displayName || details.url?.replace('https://', '') || websiteId}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={() => {
          setShowDeleteModal(false);
          window.location.reload();
        }}
      />
    </div>
  );
}

export default GeneralTab;
