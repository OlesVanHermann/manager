// ============================================================
// OUTGOING TAB - Composant ISOLÉ
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { outgoingService } from './OutgoingTab.service';
import type { SmsOutgoing } from '../../sms.types';
import './OutgoingTab.css';

// ============================================================
// HELPER ISOLÉ - Dupliqué volontairement (WET > DRY)
// ============================================================
const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString('fr-FR');
};

interface Props {
  accountName: string;
}

export function OutgoingTab({ accountName }: Props) {
  const { t } = useTranslation('web-cloud/telecom/sms/outgoing');
  const [messages, setMessages] = useState<SmsOutgoing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await outgoingService.getOutgoingMessages(accountName);
        setMessages(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [accountName]);

  if (loading) {
    return (
      <div className="sms-outgoing-loading">
        <div className="sms-outgoing-skeleton" />
        <div className="sms-outgoing-skeleton" />
      </div>
    );
  }

  const totalCredits = messages.reduce((sum, m) => sum + m.credits, 0);

  return (
    <div className="outgoing-tab">
      <div className="outgoing-header">
        <div>
          <h3>{t('title')}</h3>
        </div>
        <span className="outgoing-count">{messages.length}</span>
      </div>

      <div className="outgoing-stats">
        <div className="outgoing-stat-card">
          <div className="outgoing-stat-value">{messages.length}</div>
          <div className="outgoing-stat-label">Envoyés</div>
        </div>
        <div className="outgoing-stat-card">
          <div className="outgoing-stat-value">{totalCredits}</div>
          <div className="outgoing-stat-label">Crédits</div>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="outgoing-empty">
          <p>{t('empty')}</p>
        </div>
      ) : (
        <div className="outgoing-cards">
          {messages.map(msg => (
            <div key={msg.id} className="outgoing-card">
              <div className="outgoing-card-header">
                <div className="outgoing-parties">
                  <span className="outgoing-from">{msg.sender}</span>
                  <span className="outgoing-arrow">→</span>
                  <span className="outgoing-to">{msg.receiver}</span>
                </div>
                <span className="outgoing-date">{formatDate(msg.creationDatetime)}</span>
              </div>
              <div className="outgoing-message">{msg.message}</div>
              <div className="outgoing-meta">
                <span>{msg.credits} crédit(s)</span>
                <span>{msg.numberOfSms} SMS</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OutgoingTab;
