// ============================================================
// LINE FORWARD TAB - Gestion des transferts d'appels
// Target: target_.web-cloud.voip.line.forward.svg
// DEFACTORISATION: Composants UI dupliqués, service isolé
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { forwardTabService } from './ForwardTab.service';
import type { TelephonyLineOptions } from '../../../voip.types';
import './ForwardTab.css';

// ============================================================
// COMPOSANTS UI DUPLIQUÉS (ISOLATION)
// ============================================================

function Tile({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`voip-tile ${className}`}>
      <div className="voip-tile-header">{title}</div>
      <div className="voip-tile-content">{children}</div>
    </div>
  );
}

function Badge({ variant = 'default', children }: { variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'default'; children: React.ReactNode }) {
  return <span className={`voip-badge voip-badge-${variant}`}>{children}</span>;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

interface ForwardTabProps {
  billingAccount: string;
  serviceName: string;
}

type ForwardType = 'unconditional' | 'busy' | 'noReply';

interface ForwardConfig {
  enabled: boolean;
  number: string;
  delay?: number;
}

export function ForwardTab({ billingAccount, serviceName }: ForwardTabProps) {
  const { t } = useTranslation('web-cloud/voip/lines/forward');

  // ---------- STATE ----------
  const [activeSubTab, setActiveSubTab] = useState<ForwardType>('unconditional');
  const [options, setOptions] = useState<TelephonyLineOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [unconditional, setUnconditional] = useState<ForwardConfig>({
    enabled: false,
    number: '',
  });
  const [busy, setBusy] = useState<ForwardConfig>({ enabled: false, number: '' });
  const [noReply, setNoReply] = useState<ForwardConfig>({
    enabled: false,
    number: '',
    delay: 20,
  });

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadOptions();
  }, [billingAccount, serviceName]);

  const loadOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await forwardTabService.getOptions(billingAccount, serviceName);
      setOptions(data);
      setUnconditional({
        enabled: data.forwardUnconditional || false,
        number: data.forwardUnconditionalNumber || '',
      });
      setBusy({
        enabled: data.forwardBusy || false,
        number: data.forwardBusyNumber || '',
      });
      setNoReply({
        enabled: data.forwardNoReply || false,
        number: data.forwardNoReplyNumber || '',
        delay: data.forwardNoReplyDelay || 20,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.loading'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleSave = async (type: ForwardType) => {
    try {
      setSaving(true);
      let updateData: Partial<TelephonyLineOptions> = {};

      switch (type) {
        case 'unconditional':
          updateData = {
            forwardUnconditional: unconditional.enabled,
            forwardUnconditionalNumber: unconditional.number,
          };
          break;
        case 'busy':
          updateData = {
            forwardBusy: busy.enabled,
            forwardBusyNumber: busy.number,
          };
          break;
        case 'noReply':
          updateData = {
            forwardNoReply: noReply.enabled,
            forwardNoReplyNumber: noReply.number,
            forwardNoReplyDelay: noReply.delay,
          };
          break;
      }

      await forwardTabService.updateOptions(billingAccount, serviceName, updateData);
      await loadOptions();
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.save'));
    } finally {
      setSaving(false);
    }
  };

  // ---------- SUB-TABS ----------
  const subTabs = [
    { id: 'unconditional' as const, label: t('subtabs.unconditional') },
    { id: 'busy' as const, label: t('subtabs.busy') },
    { id: 'noReply' as const, label: t('subtabs.noReply') },
  ];

  // ---------- RENDER HELPERS ----------
  const renderForwardCard = (
    type: ForwardType,
    config: ForwardConfig,
    setConfig: (c: ForwardConfig) => void,
    showDelay = false
  ) => {
    const isActive = activeSubTab === type;
    const typeLabels = {
      unconditional: t('types.unconditional'),
      busy: t('types.busy'),
      noReply: t('types.noReply'),
    };

    return (
      <Tile title={typeLabels[type]} className={isActive ? 'forward-card-active' : ''}>
        <div className="forward-toggle-row">
          <label>{t('form.enabled')}</label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
            />
            <span className="toggle-slider"></span>
          </label>
          <Badge variant={config.enabled ? 'success' : 'neutral'}>
            {config.enabled ? t('status.active') : t('status.inactive')}
          </Badge>
        </div>

        <div className="forward-form">
          <div className="form-group">
            <label>{t('form.number')}</label>
            <input
              type="tel"
              value={config.number}
              onChange={(e) => setConfig({ ...config, number: e.target.value })}
              placeholder={t('form.numberPlaceholder')}
              className="form-input"
              disabled={!config.enabled}
            />
          </div>

          {showDelay && (
            <div className="form-group">
              <label>{t('form.delay')}</label>
              <select
                value={config.delay}
                onChange={(e) => setConfig({ ...config, delay: parseInt(e.target.value) })}
                className="form-select"
                disabled={!config.enabled}
              >
                <option value={5}>5 {t('form.seconds')}</option>
                <option value={10}>10 {t('form.seconds')}</option>
                <option value={15}>15 {t('form.seconds')}</option>
                <option value={20}>20 {t('form.seconds')}</option>
                <option value={25}>25 {t('form.seconds')}</option>
                <option value={30}>30 {t('form.seconds')}</option>
              </select>
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={() => handleSave(type)}
            disabled={saving}
          >
            {saving ? t('actions.saving') : t('actions.save')}
          </button>
        </div>
      </Tile>
    );
  };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="forward-tab">
        <div className="loading-state">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="forward-tab">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="forward-tab">
      {/* Sub-navigation NAV4 */}
      <div className="forward-subtabs">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            className={`subtab-btn ${activeSubTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div className="forward-info-banner">
        <span className="info-icon">ℹ️</span>
        <p>{t(`info.${activeSubTab}`)}</p>
      </div>

      {/* Active forward config */}
      {activeSubTab === 'unconditional' &&
        renderForwardCard('unconditional', unconditional, setUnconditional)}
      {activeSubTab === 'busy' && renderForwardCard('busy', busy, setBusy)}
      {activeSubTab === 'noReply' &&
        renderForwardCard('noReply', noReply, setNoReply, true)}

      {/* Preview cards for other types */}
      <div className="forward-preview-section">
        <h3>{t('preview.title')}</h3>
        <div className="forward-preview-cards">
          {activeSubTab !== 'unconditional' && (
            <div
              className="preview-card"
              onClick={() => setActiveSubTab('unconditional')}
            >
              <div className="preview-header">
                <span className="preview-title">{t('types.unconditional')}</span>
                <Badge variant={unconditional.enabled ? 'success' : 'neutral'}>
                  {unconditional.enabled ? t('status.active') : t('status.inactive')}
                </Badge>
              </div>
              {unconditional.enabled && unconditional.number && (
                <p className="preview-number">{unconditional.number}</p>
              )}
              <span className="preview-link">{t('preview.configure')}</span>
            </div>
          )}

          {activeSubTab !== 'busy' && (
            <div className="preview-card" onClick={() => setActiveSubTab('busy')}>
              <div className="preview-header">
                <span className="preview-title">{t('types.busy')}</span>
                <Badge variant={busy.enabled ? 'success' : 'neutral'}>
                  {busy.enabled ? t('status.active') : t('status.inactive')}
                </Badge>
              </div>
              {busy.enabled && busy.number && (
                <p className="preview-number">{busy.number}</p>
              )}
              <span className="preview-link">{t('preview.configure')}</span>
            </div>
          )}

          {activeSubTab !== 'noReply' && (
            <div className="preview-card" onClick={() => setActiveSubTab('noReply')}>
              <div className="preview-header">
                <span className="preview-title">{t('types.noReply')}</span>
                <Badge variant={noReply.enabled ? 'success' : 'neutral'}>
                  {noReply.enabled ? t('status.active') : t('status.inactive')}
                </Badge>
              </div>
              {noReply.enabled && noReply.number && (
                <p className="preview-number">
                  {noReply.number} ({noReply.delay}s)
                </p>
              )}
              <span className="preview-link">{t('preview.configure')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Info modifications */}
      <div className="forward-info-footer">
        <span className="info-icon">💡</span>
        <p>{t('info.modifications')}</p>
      </div>
    </div>
  );
}
