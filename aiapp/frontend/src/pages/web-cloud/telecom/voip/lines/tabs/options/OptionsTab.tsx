// ============================================================
// LINE OPTIONS TAB - Options de la ligne VoIP
// Target: target_.web-cloud.voip.line.options.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { linesService } from '../../lines.service';
import { Tile, InfoRow, Badge } from '../../../components/RightPanel';
import type { TelephonyLineOptions } from '../../../voip.types';
import './OptionsTab.css';

interface OptionsTabProps {
  billingAccount: string;
  serviceName: string;
}

export function OptionsTab({ billingAccount, serviceName }: OptionsTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/lines/options');
  const [options, setOptions] = useState<TelephonyLineOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOptions();
  }, [billingAccount, serviceName]);

  const loadOptions = async () => {
    try {
      setLoading(true);
      const data = await linesService.getOptions(billingAccount, serviceName);
      setOptions(data);
    } catch {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: keyof TelephonyLineOptions) => {
    if (!options) return;

    try {
      setSaving(true);
      const newValue = !options[key];
      await linesService.updateOptions(billingAccount, serviceName, { [key]: newValue });
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
    optionKey: keyof TelephonyLineOptions;
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
          label={t('calls.displayNumber')}
          value={options.displayNumber}
          optionKey="displayNumber"
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
        <ToggleSwitch
          label={t('calls.intercom')}
          value={options.intercom}
          optionKey="intercom"
        />
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
        <ToggleSwitch
          label={t('voicemail.active')}
          value={options.voicemail}
          optionKey="voicemail"
        />
        <div className="voicemail-actions">
          <button className="btn btn-sm btn-secondary">
            {t('voicemail.changePassword')}
          </button>
          <button className="btn btn-sm btn-secondary">
            {t('voicemail.changeGreeting')}
          </button>
        </div>
      </Tile>

      {/* Restrictions */}
      <Tile title={t('restrictions.title')}>
        <ToggleSwitch
          label={t('restrictions.lockOutCall')}
          value={options.lockOutCall}
          optionKey="lockOutCall"
        />
        <p className="restrictions-info">{t('restrictions.info')}</p>
      </Tile>
    </div>
  );
}
