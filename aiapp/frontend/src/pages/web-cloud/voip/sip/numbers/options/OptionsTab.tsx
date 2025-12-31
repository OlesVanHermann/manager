// ============================================================
// NUMBER OPTIONS TAB - Options du numéro
// Target: target_.web-cloud.voip.number.options.svg
// DEFACTORISATION: Composants UI dupliqués, service isolé
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { optionsTabService, type NumberOptions } from './OptionsTab.service';
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

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="voip-info-row">
      <span className="voip-info-label">{label}</span>
      <span className="voip-info-value">{value}</span>
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
  const { t } = useTranslation('web-cloud/voip/numbers/options');
  const [options, setOptions] = useState<NumberOptions | null>(null);
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

  const handleToggle = async (key: 'voicemail' | 'identificationRestriction') => {
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
    description,
    value,
    optionKey,
  }: {
    label: string;
    description: string;
    value: boolean;
    optionKey: 'voicemail' | 'identificationRestriction';
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
        <InfoRow
          label={t('main.simultaneousLines')}
          value={options.simultaneousLines}
        />
        <InfoRow
          label={t('main.displayedNumber')}
          value={options.displayedNumber || '-'}
        />
        <ToggleSwitch
          label={t('main.voicemail')}
          description={t('main.voicemailDesc')}
          value={options.voicemail}
          optionKey="voicemail"
        />
        <ToggleSwitch
          label={t('main.identificationRestriction')}
          description={t('main.identificationRestrictionDesc')}
          value={options.identificationRestriction}
          optionKey="identificationRestriction"
        />
      </Tile>

      {/* Informations */}
      <Tile title={t('info.title')}>
        <p className="info-text">{t('info.description')}</p>
      </Tile>
    </div>
  );
}
