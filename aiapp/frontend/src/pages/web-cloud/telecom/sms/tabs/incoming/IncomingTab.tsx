// ============================================================
// INCOMING TAB - Composant ISOLÉ
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { incomingService } from './IncomingTab.service';
import type { SmsIncoming } from '../../sms.types';
import './IncomingTab.css';

// ============================================================
// HELPER ISOLÉ - Dupliqué volontairement (WET > DRY)
// ============================================================
const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString('fr-FR');
};

interface Props {
  accountName: string;
}

export function IncomingTab({ accountName }: Props) {
  const { t } = useTranslation('web-cloud/telecom/sms/incoming');
  const [messages, setMessages] = useState<SmsIncoming[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await incomingService.getIncomingMessages(accountName);
        setMessages(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [accountName]);

  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
      </div>
    );
  }

  return (
    <div className="incoming-tab">
      <div className="incoming-header">
        <div>
          <h3>{t('title')}</h3>
        </div>
        <span className="incoming-count">{messages.length}</span>
      </div>

      {messages.length === 0 ? (
        <div className="incoming-empty">
          <p>{t('empty')}</p>
        </div>
      ) : (
        <div className="incoming-cards">
          {messages.map(msg => (
            <div key={msg.id} className="incoming-card">
              <div className="incoming-card-header">
                <div className="incoming-parties">
                  <span className="incoming-from">{msg.sender}</span>
                  <span className="incoming-arrow">→</span>
                  <span className="incoming-to">Moi</span>
                </div>
                <span className="incoming-date">{formatDate(msg.creationDatetime)}</span>
              </div>
              <div className="incoming-message">{msg.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IncomingTab;
