// ============================================================
// LINE VOICEMAIL TAB - Gestion de la messagerie vocale
// Target: target_.web-cloud.voip.line.voicemail.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { linesService } from '../../lines.service';
import { Tile, InfoRow, Badge } from '../../../components/RightPanel';
import './VoicemailTab.css';

interface VoicemailTabProps {
  billingAccount: string;
  serviceName: string;
}

type VoicemailSubTab = 'options' | 'messages' | 'greeting';

interface VoicemailConfig {
  active: boolean;
  audioFormat: string;
  doNotRecord: boolean;
  forcePassword: boolean;
  fromEmail: string;
  keepMessage: boolean;
  redirectionEmails: string[];
}

interface VoicemailMessage {
  id: string;
  caller: string;
  datetime: string;
  duration: number;
  status: 'new' | 'read';
}

export function VoicemailTab({ billingAccount, serviceName }: VoicemailTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/lines/voicemail');

  // ---------- STATE ----------
  const [activeSubTab, setActiveSubTab] = useState<VoicemailSubTab>('options');
  const [config, setConfig] = useState<VoicemailConfig | null>(null);
  const [messages, setMessages] = useState<VoicemailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadVoicemail();
  }, [billingAccount, serviceName]);

  const loadVoicemail = async () => {
    try {
      setLoading(true);
      setError(null);
      const [voicemailConfig, voicemailMessages] = await Promise.all([
        linesService.getVoicemailConfig(billingAccount, serviceName),
        linesService.getVoicemailMessages(billingAccount, serviceName),
      ]);
      setConfig(voicemailConfig);
      setMessages(voicemailMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.loading'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleToggleActive = async () => {
    if (!config) return;
    try {
      setSaving(true);
      await linesService.updateVoicemailConfig(billingAccount, serviceName, {
        active: !config.active,
      });
      setConfig({ ...config, active: !config.active });
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.save'));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 4) {
      alert(t('error.passwordLength'));
      return;
    }
    try {
      setSaving(true);
      await linesService.changeVoicemailPassword(billingAccount, serviceName, newPassword);
      setShowPasswordModal(false);
      setNewPassword('');
      alert(t('success.passwordChanged'));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.save'));
    } finally {
      setSaving(false);
    }
  };

  const handlePlayMessage = async (messageId: string) => {
    try {
      const audioUrl = await linesService.getVoicemailMessageAudio(
        billingAccount,
        serviceName,
        messageId
      );
      window.open(audioUrl, '_blank');
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.play'));
    }
  };

  const handleDownloadMessage = async (messageId: string) => {
    try {
      const audioUrl = await linesService.getVoicemailMessageAudio(
        billingAccount,
        serviceName,
        messageId
      );
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `voicemail-${messageId}.${config?.audioFormat || 'wav'}`;
      link.click();
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.download'));
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm(t('confirm.deleteMessage'))) return;
    try {
      await linesService.deleteVoicemailMessage(billingAccount, serviceName, messageId);
      setMessages(messages.filter((m) => m.id !== messageId));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.delete'));
    }
  };

  // ---------- RENDER HELPERS ----------
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const subTabs = [
    { id: 'options' as const, label: t('subtabs.options') },
    { id: 'messages' as const, label: t('subtabs.messages') },
    { id: 'greeting' as const, label: t('subtabs.greeting') },
  ];

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="voicemail-tab">
        <div className="loading-state">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="voicemail-tab">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="voicemail-tab">
      {/* Sub-navigation NAV4 */}
      <div className="voicemail-subtabs">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            className={`subtab-btn ${activeSubTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {tab.label}
            {tab.id === 'messages' && messages.filter((m) => m.status === 'new').length > 0 && (
              <span className="badge-count">
                {messages.filter((m) => m.status === 'new').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Options Tab */}
      {activeSubTab === 'options' && config && (
        <div className="voicemail-options">
          <Tile title={t('options.status')}>
            <div className="voicemail-toggle-row">
              <label>{t('options.active')}</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={config.active}
                  onChange={handleToggleActive}
                  disabled={saving}
                />
                <span className="toggle-slider"></span>
              </label>
              <Badge variant={config.active ? 'success' : 'neutral'}>
                {config.active ? t('status.active') : t('status.inactive')}
              </Badge>
            </div>
          </Tile>

          <Tile title={t('options.password')}>
            <div className="password-row">
              <span className="password-dots">••••••</span>
              <button
                className="btn btn-secondary"
                onClick={() => setShowPasswordModal(true)}
              >
                {t('actions.changePassword')}
              </button>
            </div>
          </Tile>

          <Tile title={t('options.configuration')}>
            <InfoRow
              label={t('options.audioFormat')}
              value={config.audioFormat?.toUpperCase() || 'WAV'}
            />
            <InfoRow
              label={t('options.keepMessage')}
              value={config.keepMessage ? t('common.yes') : t('common.no')}
            />
            <InfoRow
              label={t('options.doNotRecord')}
              value={config.doNotRecord ? t('common.yes') : t('common.no')}
            />
            <InfoRow
              label={t('options.forcePassword')}
              value={config.forcePassword ? t('common.yes') : t('common.no')}
            />
            {config.redirectionEmails.length > 0 && (
              <InfoRow
                label={t('options.redirectionEmails')}
                value={config.redirectionEmails.join(', ')}
              />
            )}
            <div className="config-action">
              <button className="btn btn-secondary">{t('actions.configure')}</button>
            </div>
          </Tile>
        </div>
      )}

      {/* Messages Tab */}
      {activeSubTab === 'messages' && (
        <div className="voicemail-messages">
          <Tile title={t('messages.title')}>
            {messages.length === 0 ? (
              <div className="empty-messages">{t('messages.empty')}</div>
            ) : (
              <table className="messages-table">
                <thead>
                  <tr>
                    <th>{t('messages.date')}</th>
                    <th>{t('messages.caller')}</th>
                    <th>{t('messages.duration')}</th>
                    <th>{t('messages.status')}</th>
                    <th>{t('messages.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.slice(0, 10).map((message) => (
                    <tr key={message.id} className={message.status === 'new' ? 'new-message' : ''}>
                      <td>{formatDate(message.datetime)}</td>
                      <td className="monospace">{message.caller}</td>
                      <td>{formatDuration(message.duration)}</td>
                      <td>
                        <Badge variant={message.status === 'new' ? 'info' : 'success'}>
                          {message.status === 'new' ? t('messages.new') : t('messages.read')}
                        </Badge>
                      </td>
                      <td className="message-actions">
                        <button
                          className="btn-icon"
                          onClick={() => handlePlayMessage(message.id)}
                          title={t('actions.play')}
                        >
                          ▶
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDownloadMessage(message.id)}
                          title={t('actions.download')}
                        >
                          📥
                        </button>
                        <button
                          className="btn-icon btn-icon-danger"
                          onClick={() => handleDeleteMessage(message.id)}
                          title={t('actions.delete')}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {messages.length > 10 && (
              <div className="messages-footer">
                <button className="btn-link">{t('messages.viewAll')}</button>
              </div>
            )}
          </Tile>
        </div>
      )}

      {/* Greeting Tab */}
      {activeSubTab === 'greeting' && (
        <div className="voicemail-greeting">
          <Tile title={t('greeting.title')}>
            <p className="greeting-info">{t('greeting.info')}</p>
            <div className="greeting-actions">
              <button className="btn btn-secondary">{t('greeting.listen')}</button>
              <button className="btn btn-primary">{t('greeting.upload')}</button>
            </div>
          </Tile>
        </div>
      )}

      {/* Info banner */}
      <div className="voicemail-info-banner">
        <span className="info-icon">ℹ️</span>
        <p>{t('info.access')}</p>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('modal.changePassword')}</h3>
            <div className="form-group">
              <label>{t('modal.newPassword')}</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('modal.passwordPlaceholder')}
                className="form-input"
                minLength={4}
                maxLength={10}
              />
              <small>{t('modal.passwordHint')}</small>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowPasswordModal(false)}
              >
                {t('actions.cancel')}
              </button>
              <button
                className="btn btn-primary"
                onClick={handleChangePassword}
                disabled={saving || newPassword.length < 4}
              >
                {saving ? t('actions.saving') : t('actions.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
