// ============================================================
// SETTINGS TAB - Configuration Carrier SIP
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { settingsService } from './SettingsTab.service';
import './SettingsTab.css';

interface Props {
  billingAccount: string;
  serviceName: string;
}

interface CarrierSipSettings {
  description: string;
  maxCalls: number;
  secureCall: boolean;
  ipRestriction: string[];
  codecs: string[];
}

interface CarrierSipCredentials {
  username: string;
  password?: string;
  realm: string;
}

export function SettingsTab({ billingAccount, serviceName }: Props) {
  const { t } = useTranslation('web-cloud/voip/carrier-sip/settings');
  const [settings, setSettings] = useState<CarrierSipSettings | null>(null);
  const [credentials, setCredentials] = useState<CarrierSipCredentials | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [settingsData, credsData] = await Promise.all([
          settingsService.getSettings(billingAccount, serviceName),
          settingsService.getCredentials(billingAccount, serviceName),
        ]);
        setSettings(settingsData);
        setCredentials(credsData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [billingAccount, serviceName]);

  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      await settingsService.updateSettings(billingAccount, serviceName, settings);
    } finally {
      setSaving(false);
    }
  };

  const handleRegeneratePassword = async () => {
    if (!confirm(t('confirmRegenerate'))) return;

    try {
      const newPassword = await settingsService.regeneratePassword(billingAccount, serviceName);
      setCredentials(prev => prev ? { ...prev, password: newPassword } : null);
      setShowPassword(true);
    } catch {
      // Error handling
    }
  };

  const handleAddIp = async () => {
    if (!newIp.trim()) return;

    try {
      await settingsService.addIpRestriction(billingAccount, serviceName, newIp.trim());
      setSettings(prev =>
        prev ? { ...prev, ipRestriction: [...prev.ipRestriction, newIp.trim()] } : null
      );
      setNewIp('');
    } catch {
      // Error handling
    }
  };

  const handleRemoveIp = async (ip: string) => {
    try {
      await settingsService.removeIpRestriction(billingAccount, serviceName, ip);
      setSettings(prev =>
        prev ? { ...prev, ipRestriction: prev.ipRestriction.filter(i => i !== ip) } : null
      );
    } catch {
      // Error handling
    }
  };

  if (loading || !settings || !credentials) {
    return (
      <div className="csip-settings-loading">
        <div className="csip-settings-skeleton" />
        <div className="csip-settings-skeleton" />
      </div>
    );
  }

  return (
    <div className="csip-settings-tab">
      {/* ---------- GENERAL SETTINGS ---------- */}
      <section className="csip-settings-section">
        <h3 className="csip-settings-section-title">{t('sections.general')}</h3>
        <div className="csip-settings-card">
          <div className="csip-settings-row">
            <label className="csip-settings-label">{t('fields.description')}</label>
            <input
              type="text"
              className="csip-settings-input"
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              placeholder={t('placeholders.description')}
            />
          </div>

          <div className="csip-settings-row">
            <label className="csip-settings-label">{t('fields.maxCalls')}</label>
            <input
              type="number"
              className="csip-settings-input csip-settings-input-small"
              value={settings.maxCalls}
              min={1}
              onChange={(e) => setSettings({ ...settings, maxCalls: parseInt(e.target.value) || 1 })}
            />
          </div>

          <div className="csip-settings-row">
            <label className="csip-settings-checkbox-label">
              <input
                type="checkbox"
                checked={settings.secureCall}
                onChange={(e) => setSettings({ ...settings, secureCall: e.target.checked })}
              />
              <span>{t('fields.secureCall')}</span>
            </label>
          </div>

          <div className="csip-settings-actions">
            <button className="btn btn-primary" onClick={handleSaveSettings} disabled={saving}>
              {saving ? t('saving') : t('save')}
            </button>
          </div>
        </div>
      </section>

      {/* ---------- CREDENTIALS ---------- */}
      <section className="csip-settings-section">
        <h3 className="csip-settings-section-title">{t('sections.credentials')}</h3>
        <div className="csip-settings-card">
          <div className="csip-settings-row">
            <label className="csip-settings-label">{t('fields.username')}</label>
            <div className="csip-credentials-value">
              <code>{credentials.username}</code>
              <button className="btn-copy" onClick={() => navigator.clipboard.writeText(credentials.username)}>
                📋
              </button>
            </div>
          </div>

          <div className="csip-settings-row">
            <label className="csip-settings-label">{t('fields.realm')}</label>
            <div className="csip-credentials-value">
              <code>{credentials.realm}</code>
              <button className="btn-copy" onClick={() => navigator.clipboard.writeText(credentials.realm)}>
                📋
              </button>
            </div>
          </div>

          {credentials.password && (
            <div className="csip-settings-row">
              <label className="csip-settings-label">{t('fields.password')}</label>
              <div className="csip-credentials-value">
                <code>{showPassword ? credentials.password : '••••••••••••'}</code>
                <button className="btn-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
                <button className="btn-copy" onClick={() => navigator.clipboard.writeText(credentials.password || '')}>
                  📋
                </button>
              </div>
            </div>
          )}

          <div className="csip-settings-actions">
            <button className="btn btn-secondary" onClick={handleRegeneratePassword}>
              {t('regeneratePassword')}
            </button>
          </div>
        </div>
      </section>

      {/* ---------- IP RESTRICTIONS ---------- */}
      <section className="csip-settings-section">
        <h3 className="csip-settings-section-title">{t('sections.ipRestriction')}</h3>
        <div className="csip-settings-card">
          <div className="csip-ip-add">
            <input
              type="text"
              className="csip-settings-input"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              placeholder={t('placeholders.ip')}
            />
            <button className="btn btn-primary" onClick={handleAddIp}>
              {t('addIp')}
            </button>
          </div>

          {settings.ipRestriction.length > 0 ? (
            <div className="csip-ip-list">
              {settings.ipRestriction.map(ip => (
                <div key={ip} className="csip-ip-item">
                  <code>{ip}</code>
                  <button
                    className="action-btn action-danger"
                    onClick={() => handleRemoveIp(ip)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="csip-ip-empty">{t('noIpRestriction')}</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default SettingsTab;
