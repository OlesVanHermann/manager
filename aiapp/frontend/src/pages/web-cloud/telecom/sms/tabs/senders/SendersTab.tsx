// ============================================================
// SENDERS TAB - Composant ISOLÉ
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { sendersService } from './SendersTab.service';
import type { SmsSender } from '../../sms.types';
import './SendersTab.css';

interface Props {
  accountName: string;
}

export function SendersTab({ accountName }: Props) {
  const { t } = useTranslation('web-cloud/telecom/sms/senders');
  const [senders, setSenders] = useState<SmsSender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await sendersService.getSenders(accountName);
        setSenders(data);
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

  // Helper pour déterminer la classe de statut
  const getStatusClass = (status: SmsSender['status']): string => {
    if (status === 'enable') return 'senders-active';
    if (status === 'waitingValidation') return 'senders-pending';
    return '';
  };

  // Helper pour le badge de statut
  const getStatusBadge = (status: SmsSender['status']): string => {
    if (status === 'enable') return 'success';
    if (status === 'waitingValidation') return 'warning';
    return 'inactive';
  };

  return (
    <div className="senders-tab">
      <div className="senders-header">
        <div>
          <h3>{t('title')}</h3>
        </div>
        <span className="senders-count">{senders.length}</span>
      </div>

      {senders.length === 0 ? (
        <div className="senders-empty">
          <p>{t('empty')}</p>
        </div>
      ) : (
        <div className="senders-cards">
          {senders.map(sender => (
            <div
              key={sender.sender}
              className={`senders-card ${getStatusClass(sender.status)}`}
            >
              <div className="senders-card-header">
                <h4>{sender.sender}</h4>
                <span className={`senders-type senders-${sender.type}`}>
                  {sender.type}
                </span>
              </div>
              <p className="senders-comment">{sender.comment || '-'}</p>
              <span className={`badge ${getStatusBadge(sender.status)}`}>
                {sender.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SendersTab;
