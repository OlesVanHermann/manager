// ============================================================
// NUMBER OPTIONS TAB - Options du numéro
// Target: target_.web-cloud.voip.number.options.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { numbersService } from '../../numbers.service';
import { Tile } from '../../../components/RightPanel';
import type { NumberOptions } from '../../numbers.types';
import './OptionsTab.css';

interface OptionsTabProps {
  billingAccount: string;
  serviceName: string;
}

export function OptionsTab({ billingAccount, serviceName }: OptionsTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/numbers/options');
  const [options, setOptions] = useState<NumberOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOptions();
  }, [billingAccount, serviceName]);

  const loadOptions = async () => {
    try {
      setLoading(true);
      const data = await numbersService.getOptions(billingAccount, serviceName);
      setOptions(data);
    } catch {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: keyof NumberOptions) => {
    if (!options) return;

    try {
      setSaving(true);
      const newValue = !options[key];
      await numbersService.updateOptions(billingAccount, serviceName, { [key]: newValue });
      setOptions({ ...options, [key]: newValue });
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.save'));
    } finally {
      setSaving(false);
    }
  };

  const ToggleSwitch = ({
    label,
    description,
    value,
    optionKey,
  }: {
    label: string;
    description: string;
    value: boolean;
    optionKey: keyof NumberOptions;
  }) => (
    <div className="option-item">
      <div className="option-info">
        <span className="option-label">{label}</span>
        <span className="option-description">{description}</span>
      </div>
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
      <div className="number-options-tab">
        <div className="voip-skeleton voip-skeleton-tile" />
      </div>
    );
  }

  if (!options) {
    return (
      <div className="number-options-tab">
        <p>{t('error.loading')}</p>
      </div>
    );
  }

  return (
    <div className="number-options-tab">
      {/* Options principales */}
      <Tile title={t('main.title')}>
        <ToggleSwitch
          label={t('main.displayNumber')}
          description={t('main.displayNumberDesc')}
          value={options.displayNumber}
          optionKey="displayNumber"
        />
        <ToggleSwitch
          label={t('main.recordCalls')}
          description={t('main.recordCallsDesc')}
          value={options.recordIncomingCalls}
          optionKey="recordIncomingCalls"
        />
        <ToggleSwitch
          label={t('main.antiSpam')}
          description={t('main.antiSpamDesc')}
          value={options.antiSpam}
          optionKey="antiSpam"
        />
      </Tile>

      {/* Informations */}
      <Tile title={t('info.title')}>
        <p className="info-text">{t('info.description')}</p>
      </Tile>
    </div>
  );
}
