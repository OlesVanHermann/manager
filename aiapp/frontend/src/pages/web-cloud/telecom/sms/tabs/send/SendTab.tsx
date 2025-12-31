// ============================================================
// SMS SEND TAB - Formulaire d'envoi SMS
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { sendService } from './SendTab.service';
import './SendTab.css';

interface Props {
  accountName: string;
}

interface Template {
  id: string;
  name: string;
  content: string;
}

export function SendTab({ accountName }: Props) {
  const { t } = useTranslation('web-cloud/telecom/sms/send');
  const [senders, setSenders] = useState<string[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Form state
  const [sender, setSender] = useState('');
  const [recipients, setRecipients] = useState('');
  const [message, setMessage] = useState('');
  const [noMarketing, setNoMarketing] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [sendersData, templatesData] = await Promise.all([
          sendService.getSenders(accountName),
          sendService.getTemplates(accountName),
        ]);
        setSenders(sendersData);
        setTemplates(templatesData);
        if (sendersData.length > 0) {
          setSender(sendersData[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [accountName]);

  // Character count and SMS calculation
  const charCount = message.length;
  const smsCount = charCount === 0 ? 0 : Math.ceil(charCount / 160);
  const recipientCount = recipients.split(/[\n,;]/).filter(r => r.trim()).length;
  const totalCredits = smsCount * recipientCount;

  const handleSend = async () => {
    if (!sender || !recipients || !message) return;

    try {
      setSending(true);
      const recipientList = recipients.split(/[\n,;]/).map(r => r.trim()).filter(Boolean);
      await sendService.sendSms(accountName, {
        sender,
        receivers: recipientList,
        message,
        noStopClause: noMarketing,
        differedPeriod: scheduled ? new Date(scheduleDate).getTime() : undefined,
      });
      // Reset form on success
      setRecipients('');
      setMessage('');
      alert(t('success'));
    } catch (err) {
      alert(t('error'));
    } finally {
      setSending(false);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setMessage(template.content);
  };

  if (loading) {
    return (
      <div className="sms-send-loading">
        <div className="sms-send-skeleton" />
      </div>
    );
  }

  return (
    <div className="sms-send-tab">
      <div className="send-form-container">
        {/* ---------- FORM ---------- */}
        <div className="send-form">
          <h3>{t('title')}</h3>

          {/* Sender */}
          <div className="form-group">
            <label>{t('sender')}</label>
            <select value={sender} onChange={e => setSender(e.target.value)}>
              {senders.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Recipients */}
          <div className="form-group">
            <label>{t('recipients')}</label>
            <textarea
              value={recipients}
              onChange={e => setRecipients(e.target.value)}
              placeholder={t('recipientsPlaceholder')}
              rows={4}
            />
            <span className="form-help">
              {t('recipientsHelp', { count: recipientCount })}
            </span>
          </div>

          {/* Message */}
          <div className="form-group">
            <label>{t('message')}</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={t('messagePlaceholder')}
              rows={6}
              maxLength={918}
            />
            <div className="message-meta">
              <span>{charCount} {t('characters')}</span>
              <span>{smsCount} SMS</span>
            </div>
          </div>

          {/* Options */}
          <div className="form-group options-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={noMarketing}
                onChange={e => setNoMarketing(e.target.checked)}
              />
              <span>{t('noStopClause')}</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={scheduled}
                onChange={e => setScheduled(e.target.checked)}
              />
              <span>{t('schedule')}</span>
            </label>

            {scheduled && (
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={e => setScheduleDate(e.target.value)}
                className="schedule-input"
              />
            )}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button className="btn btn-secondary" disabled={sending}>
              {t('preview')}
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSend}
              disabled={sending || !sender || !recipients || !message}
            >
              {sending ? t('sending') : t('send')}
            </button>
          </div>
        </div>

        {/* ---------- SIDEBAR ---------- */}
        <div className="send-sidebar">
          {/* Summary */}
          <div className="summary-card">
            <h4>{t('summary.title')}</h4>
            <div className="summary-row">
              <span>{t('summary.recipients')}</span>
              <span>{recipientCount}</span>
            </div>
            <div className="summary-row">
              <span>{t('summary.smsPerRecipient')}</span>
              <span>{smsCount}</span>
            </div>
            <div className="summary-row total">
              <span>{t('summary.totalCredits')}</span>
              <span>{totalCredits}</span>
            </div>
          </div>

          {/* Recent templates */}
          {templates.length > 0 && (
            <div className="templates-card">
              <h4>{t('templates.title')}</h4>
              <div className="templates-list">
                {templates.slice(0, 3).map(tpl => (
                  <button
                    key={tpl.id}
                    className="template-btn"
                    onClick={() => handleTemplateSelect(tpl)}
                  >
                    <span className="template-name">{tpl.name}</span>
                    <span className="template-preview">
                      {tpl.content.substring(0, 50)}...
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SendTab;
