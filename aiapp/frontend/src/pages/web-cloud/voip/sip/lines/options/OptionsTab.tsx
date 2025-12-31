// ============================================================
// LINE OPTIONS TAB - Options de la ligne VoIP
// Target: target_.web-cloud.voip.line.options.svg
// DEFACTORISATION: Composants UI dupliqués, service isolé
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { optionsTabService } from './OptionsTab.service';
import type { TelephonyLineOptions } from '../../../voip.types';
import './OptionsTab.css';

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

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

interface OptionsTabProps {
  billingAccount: string;
  serviceName: string;
}

export function OptionsTab({ billingAccount, serviceName }: OptionsTabProps) {
  const { t } = useTranslation('web-cloud/voip/lines/options');
  const [options, setOptions] = useState<TelephonyLineOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOptions();
  }, [billingAccount, serviceName]);

  const loadOptions = async () => {
    try {
      setLoading(true);
      const data = await optionsTabService.getOptions(billingAccount, serviceName);
      setOptions(data);
    } catch {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  // Clés booléennes uniquement
  type BooleanOptionKey = 'forwardUnconditional' | 'forwardNoReply' | 'forwardBusy' | 'forwardBackup' | 'identificationRestriction' | 'callWaiting' | 'doNotDisturb';

  const handleToggle = async (key: BooleanOptionKey) => {
    if (!options) return;

    try {
      setSaving(true);
      const newValue = !options[key];
      await optionsTabService.updateOptions(billingAccount, serviceName, { [key]: newValue });
      setOptions({ ...options, [key]: newValue });
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.save'));
    } finally {
      setSaving(false);
    }
  };

  const ToggleSwitch = ({
    label,
    value,
    optionKey
  }: {
    label: string;
    value: boolean;
    optionKey: BooleanOptionKey;
  }) => (
    <div className="option-row">
      <span className="option-label">{label}</span>
      <button
        className={`toggle-switch ${value ? 'active' : ''}`}
        onClick={() => handleToggle(optionKey)}
        disabled={saving}
      >
        <span className="toggle-slider" />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="line-options-tab">
        <div className="voip-skeleton voip-skeleton-tile" />
        <div className="voip-skeleton voip-skeleton-tile" />
      </div>
    );
  }

  if (!options) {
    return (
      <div className="line-options-tab">
        <p>{t('error.loading')}</p>
      </div>
    );
  }

  return (
    <div className="line-options-tab">
      {/* Options d'appel */}
      <Tile title={t('calls.title')}>
        <ToggleSwitch
          label={t('calls.identificationRestriction')}
          value={options.identificationRestriction}
          optionKey="identificationRestriction"
        />
        <ToggleSwitch
          label={t('calls.callWaiting')}
          value={options.callWaiting}
          optionKey="callWaiting"
        />
        <ToggleSwitch
          label={t('calls.doNotDisturb')}
          value={options.doNotDisturb}
          optionKey="doNotDisturb"
        />
        {/* Intercom - select instead of toggle */}
        <div className="option-row">
          <span className="option-label">{t('calls.intercom')}</span>
          <span className="option-value">{options.intercom}</span>
        </div>
      </Tile>

      {/* Renvois d'appel */}
      <Tile title={t('forwards.title')}>
        <ToggleSwitch
          label={t('forwards.unconditional')}
          value={options.forwardUnconditional}
          optionKey="forwardUnconditional"
        />
        <ToggleSwitch
          label={t('forwards.busy')}
          value={options.forwardBusy}
          optionKey="forwardBusy"
        />
        <ToggleSwitch
          label={t('forwards.noReply')}
          value={options.forwardNoReply}
          optionKey="forwardNoReply"
        />
        <ToggleSwitch
          label={t('forwards.backup')}
          value={options.forwardBackup}
          optionKey="forwardBackup"
        />
      </Tile>

      {/* Messagerie vocale */}
      <Tile title={t('voicemail.title')}>
        <div className="voicemail-actions">
          <button className="btn btn-sm btn-secondary">
            {t('voicemail.changePassword')}
          </button>
          <button className="btn btn-sm btn-secondary">
            {t('voicemail.changeGreeting')}
          </button>
        </div>
      </Tile>

      {/* Numéro affiché */}
      <Tile title={t('display.title')}>
        <div className="option-row">
          <span className="option-label">{t('display.number')}</span>
          <span className="option-value">{options.displayNumber || '-'}</span>
        </div>
      </Tile>
    </div>
  );
}
