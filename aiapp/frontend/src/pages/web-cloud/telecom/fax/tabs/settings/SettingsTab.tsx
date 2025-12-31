// ============================================================
// FAX SETTINGS TAB - Configuration du service fax
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { settingsService } from './SettingsTab.service';
import './SettingsTab.css';

interface Props {
  serviceName: string;
}

interface FaxSettings {
  fromName: string;
  fromEmail: string;
  faxQuality: 'normal' | 'high' | 'best';
  faxMaxTry: number;
  mailUrl: string;
  redirectionEmail: string[];
  sendMode: 'auto' | 'manual';
  callNumber: string;
  countryCode: string;
}

interface FaxNotifications {
  sendEmail: boolean;
  receiveEmail: boolean;
  emailOnError: boolean;
}

export function SettingsTab({ serviceName }: Props) {
  const { t } = useTranslation('web-cloud/telecom/fax/settings');
  const [settings, setSettings] = useState<FaxSettings | null>(null);
  const [notifications, setNotifications] = useState<FaxNotifications | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [settingsData, notifData] = await Promise.all([
          settingsService.getSettings(serviceName),
          settingsService.getNotifications(serviceName),
        ]);
        setSettings(settingsData);
        setNotifications(notifData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      await settingsService.updateSettings(serviceName, settings);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!notifications) return;
    try {
      setSaving(true);
      await settingsService.updateNotifications(serviceName, notifications);
    } finally {
      setSaving(false);
    }
  };

  const handleTestFax = async () => {
    await settingsService.testFax(serviceName);
  };

  if (loading || !settings || !notifications) {
    return (
      <div className="fax-settings-loading">
        <div className="fax-settings-skeleton" />
        <div className="fax-settings-skeleton" />
      </div>
    );
  }

  return (
    <div className="fax-settings-tab">
      {/* ---------- GENERAL SETTINGS ---------- */}
      <section className="settings-section">
        <h3 className="settings-section-title">{t('sections.general')}</h3>
        <div className="settings-card">
          <div className="settings-row">
            <label className="settings-label">{t('fields.fromName')}</label>
            <input
              type="text"
              className="settings-input"
              value={settings.fromName}
              onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
              placeholder={t('placeholders.fromName')}
            />
          </div>

          <div className="settings-row">
            <label className="settings-label">{t('fields.fromEmail')}</label>
            <input
              type="email"
              className="settings-input"
              value={settings.fromEmail}
              onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
              placeholder={t('placeholders.fromEmail')}
            />
          </div>

          <div className="settings-row">
            <label className="settings-label">{t('fields.quality')}</label>
            <select
              className="settings-select"
              value={settings.faxQuality}
              onChange={(e) => setSettings({ ...settings, faxQuality: e.target.value as FaxSettings['faxQuality'] })}
            >
              <option value="normal">{t('quality.normal')}</option>
              <option value="high">{t('quality.high')}</option>
              <option value="best">{t('quality.best')}</option>
            </select>
          </div>

          <div className="settings-row">
            <label className="settings-label">{t('fields.maxRetries')}</label>
            <input
              type="number"
              className="settings-input settings-input-small"
              value={settings.faxMaxTry}
              min={1}
              max={10}
              onChange={(e) => setSettings({ ...settings, faxMaxTry: parseInt(e.target.value) || 3 })}
            />
          </div>

          <div className="settings-row">
            <label className="settings-label">{t('fields.sendMode')}</label>
            <select
              className="settings-select"
              value={settings.sendMode}
              onChange={(e) => setSettings({ ...settings, sendMode: e.target.value as 'auto' | 'manual' })}
            >
              <option value="auto">{t('sendMode.auto')}</option>
              <option value="manual">{t('sendMode.manual')}</option>
            </select>
          </div>

          <div className="settings-actions">
            <button className="btn btn-primary" onClick={handleSaveSettings} disabled={saving}>
              {saving ? t('saving') : t('save')}
            </button>
          </div>
        </div>
      </section>

      {/* ---------- NOTIFICATIONS ---------- */}
      <section className="settings-section">
        <h3 className="settings-section-title">{t('sections.notifications')}</h3>
        <div className="settings-card">
          <div className="settings-row">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={notifications.sendEmail}
                onChange={(e) => setNotifications({ ...notifications, sendEmail: e.target.checked })}
              />
              <span>{t('notifications.onSend')}</span>
            </label>
          </div>

          <div className="settings-row">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={notifications.receiveEmail}
                onChange={(e) => setNotifications({ ...notifications, receiveEmail: e.target.checked })}
              />
              <span>{t('notifications.onReceive')}</span>
            </label>
          </div>

          <div className="settings-row">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={notifications.emailOnError}
                onChange={(e) => setNotifications({ ...notifications, emailOnError: e.target.checked })}
              />
              <span>{t('notifications.onError')}</span>
            </label>
          </div>

          <div className="settings-actions">
            <button className="btn btn-primary" onClick={handleSaveNotifications} disabled={saving}>
              {saving ? t('saving') : t('save')}
            </button>
          </div>
        </div>
      </section>

      {/* ---------- TEST ---------- */}
      <section className="settings-section">
        <h3 className="settings-section-title">{t('sections.test')}</h3>
        <div className="settings-card">
          <p className="settings-description">{t('testDescription')}</p>
          <button className="btn btn-secondary" onClick={handleTestFax}>
            {t('sendTest')}
          </button>
        </div>
      </section>
    </div>
  );
}

export default SettingsTab;
