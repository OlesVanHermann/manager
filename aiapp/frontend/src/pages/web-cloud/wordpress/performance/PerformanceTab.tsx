// ============================================================
// WORDPRESS TAB: PERFORMANCE
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { performanceService } from './PerformanceTab.service';
import type { CdnStatus, CacheStatus, Optimizations } from '../wordpress.types';
import { ConfigureCdnModal } from '../ConfigureCdnModal';
import './PerformanceTab.css';

interface Props {
  serviceName: string;
  offer: string;
}

export function PerformanceTab({ serviceName, offer }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  const [cdnStatus, setCdnStatus] = useState<CdnStatus | null>(null);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
  const [optimizations, setOptimizations] = useState<Optimizations | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showCdnModal, setShowCdnModal] = useState(false);

  const isProOrBusiness = offer === 'Pro' || offer === 'Business';

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [cdn, cache] = await Promise.all([
        performanceService.getCdnStatus(serviceName).catch(() => null),
        performanceService.getCacheStatus(serviceName).catch(() => null),
      ]);
      setCdnStatus(cdn);
      setCacheStatus(cache);
      setOptimizations(performanceService.getOptimizations(offer));
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [serviceName, offer]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFlushCache = async () => {
    setActionLoading('cache');
    try {
      await performanceService.flushCache(serviceName);
      alert(t('performance.cacheCleared'));
      loadData();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleCdn = async () => {
    if (!cdnStatus) return;
    const action = cdnStatus.enabled ? 'disable' : 'enable';
    setActionLoading('cdn');
    try {
      if (cdnStatus.enabled) {
        await performanceService.disableCdn(serviceName);
      } else {
        await performanceService.enableCdn(serviceName);
      }
      loadData();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="performance-loading">{t('common.loading')}</div>;
  }

  return (
    <div className="performance-tab">
      {/* CDN & Cache Cards */}
      <div className="performance-grid">
        {/* CDN Card */}
        <section className="performance-card">
          <h4>{t('performance.cdn')}</h4>
          {!isProOrBusiness ? (
            <div className="performance-upgrade-notice">
              <p>{t('performance.cdnNotAvailable')}</p>
              <a href="https://www.ovhcloud.com/fr/web-hosting/wordpress-hosting/" target="_blank" rel="noopener noreferrer" className="perf-btn perf-btn-outline perf-btn-sm">
                {t('performance.upgradeOffer')}
              </a>
            </div>
          ) : (
            <>
              <div className="performance-status">
                <span className="performance-status-dot" style={{ backgroundColor: cdnStatus?.enabled ? '#10B981' : '#6B7280' }} />
                <span>{cdnStatus?.enabled ? t('performance.active') : t('performance.inactive')}</span>
              </div>
              {cdnStatus?.enabled && (
                <div className="performance-details">
                  <div className="performance-row">
                    <span className="performance-label">{t('performance.provider')}</span>
                    <span className="performance-value">{cdnStatus.provider || 'OVHcloud CDN'}</span>
                  </div>
                  <div className="performance-row">
                    <span className="performance-label">{t('performance.pops')}</span>
                    <span className="performance-value">{cdnStatus.popCount || 19}</span>
                  </div>
                  <div className="performance-row">
                    <span className="performance-label">{t('performance.bandwidth')}</span>
                    <span className="performance-value">
                      {cdnStatus.bandwidth || 0} {cdnStatus.bandwidthUnit || 'Go'} / {t('performance.unlimited')}
                    </span>
                  </div>
                </div>
              )}
              <div className="performance-actions">
                <button className="perf-btn perf-btn-outline perf-btn-sm" onClick={() => {
                  setShowCdnModal(true);
                }}>
                  {t('performance.configureCdn')}
                </button>
                <button
                  className="perf-btn perf-btn-outline perf-btn-sm"
                  onClick={handleToggleCdn}
                  disabled={actionLoading === 'cdn'}
                >
                  {actionLoading === 'cdn' ? '...' : cdnStatus?.enabled ? t('performance.disable') : t('performance.enable')}
                </button>
              </div>
            </>
          )}
        </section>

        {/* Cache Card */}
        <section className="performance-card">
          <h4>{t('performance.cache')}</h4>
          <div className="performance-details">
            <div className="performance-row">
              <span className="performance-label">{t('performance.serverCache')}</span>
              <span className="performance-value">
                <span className="performance-status-dot" style={{ backgroundColor: cacheStatus?.serverCache ? '#10B981' : '#6B7280' }} />
                {cacheStatus?.serverCache ? t('performance.active') : t('performance.inactive')}
              </span>
            </div>
            <div className="performance-row">
              <span className="performance-label">{t('performance.browserCache')}</span>
              <span className="performance-value">
                <span className="performance-status-dot" style={{ backgroundColor: cacheStatus?.browserCache ? '#10B981' : '#6B7280' }} />
                {cacheStatus?.browserCache ? t('performance.active') : t('performance.inactive')}
              </span>
            </div>
            <div className="performance-row">
              <span className="performance-label">{t('performance.lastFlush')}</span>
              <span className="performance-value">{formatDate(cacheStatus?.lastFlush || null)}</span>
            </div>
          </div>
          <div className="performance-actions">
            <button
              className="perf-btn perf-btn-outline perf-btn-sm"
              onClick={handleFlushCache}
              disabled={actionLoading === 'cache'}
            >
              {actionLoading === 'cache' ? '...' : t('performance.flushCache')}
            </button>
          </div>
        </section>
      </div>

      {/* Optimizations */}
      <section className="performance-card performance-full">
        <h4>{t('performance.optimizations')}</h4>
        <div className="performance-optimizations-grid">
          <div className="performance-optimization-item">
            <span className="performance-opt-label">{t('performance.gzip')}</span>
            <span className="performance-opt-value">
              <span className="performance-status-dot" style={{ backgroundColor: optimizations?.gzip ? '#10B981' : '#6B7280' }} />
              {optimizations?.gzip ? t('performance.enabled') : t('performance.disabled')}
            </span>
          </div>
          <div className="performance-optimization-item">
            <span className="performance-opt-label">{t('performance.brotli')}</span>
            <span className="performance-opt-value">
              <span className="performance-status-dot" style={{ backgroundColor: optimizations?.brotli ? '#10B981' : '#6B7280' }} />
              {optimizations?.brotli ? t('performance.enabled') : t('performance.disabled')}
            </span>
          </div>
          <div className="performance-optimization-item">
            <span className="performance-opt-label">{t('performance.http2')}</span>
            <span className="performance-opt-value">
              <span className="performance-status-dot" style={{ backgroundColor: optimizations?.http2 ? '#10B981' : '#6B7280' }} />
              {optimizations?.http2 ? t('performance.enabled') : t('performance.disabled')}
            </span>
          </div>
          <div className="performance-optimization-item">
            <span className="performance-opt-label">{t('performance.http3')}</span>
            <span className="performance-opt-value">
              <span className="performance-status-dot" style={{ backgroundColor: optimizations?.http3 ? '#10B981' : '#F59E0B' }} />
              {optimizations?.http3 ? t('performance.enabled') : t('performance.proRequired')}
            </span>
          </div>
          <div className="performance-optimization-item">
            <span className="performance-opt-label">{t('performance.webp')}</span>
            <span className="performance-opt-value">
              <span className="performance-status-dot" style={{ backgroundColor: '#F59E0B' }} />
              {t('performance.pluginRecommended')}
            </span>
          </div>
          <div className="performance-optimization-item">
            <span className="performance-opt-label">{t('performance.lazyLoading')}</span>
            <span className="performance-opt-value">
              <span className="performance-status-dot" style={{ backgroundColor: '#F59E0B' }} />
              {t('performance.pluginRecommended')}
            </span>
          </div>
        </div>
      </section>

      {/* Tip */}
      <div className="performance-tip">
        <span className="performance-tip-icon">💡</span>
        <span>{t('performance.tip')}</span>
      </div>

      {/* CDN Modal */}
      <ConfigureCdnModal
        serviceName={serviceName}
        isOpen={showCdnModal}
        onClose={() => setShowCdnModal(false)}
        onSuccess={() => {
          setShowCdnModal(false);
          loadData();
        }}
      />
    </div>
  );
}

export default PerformanceTab;
