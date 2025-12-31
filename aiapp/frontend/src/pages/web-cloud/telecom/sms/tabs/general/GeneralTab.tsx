// ============================================================
// SMS GENERAL TAB - Dashboard compte SMS
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generalService } from './GeneralTab.service';
import type { SmsAccount } from '../../sms.types';
import './GeneralTab.css';

interface Props {
  accountName: string;
}

interface SmsStats {
  sent: number;
  received: number;
  pending: number;
}

export function GeneralTab({ accountName }: Props) {
  const { t } = useTranslation('web-cloud/telecom/sms/general');
  const [account, setAccount] = useState<SmsAccount | null>(null);
  const [stats, setStats] = useState<SmsStats>({ sent: 0, received: 0, pending: 0 });
  const [senders, setSenders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [accountData, statsData, sendersData] = await Promise.all([
          generalService.getAccount(accountName),
          generalService.getStatistics(accountName),
          generalService.getSenders(accountName),
        ]);
        setAccount(accountData);
        setStats(statsData);
        setSenders(sendersData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [accountName]);

  if (loading) {
    return (
      <div className="sms-general-loading">
        <div className="sms-general-skeleton" />
        <div className="sms-general-skeleton" />
        <div className="sms-general-skeleton" />
      </div>
    );
  }

  if (!account) {
    return <div className="sms-general-empty">{t('noData')}</div>;
  }

  return (
    <div className="sms-general-tab">
      {/* ---------- CREDITS CARD ---------- */}
      <div className="sms-general-card credits-card">
        <div className="card-header">
          <h3>{t('credits.title')}</h3>
        </div>
        <div className="card-content">
          <div className="credits-display">
            <span className="credits-value">{account.creditsLeft.toLocaleString('fr-FR')}</span>
            <span className="credits-label">{t('credits.available')}</span>
          </div>
          <button className="btn btn-primary">{t('credits.buy')}</button>
        </div>
      </div>

      {/* ---------- STATS CARD ---------- */}
      <div className="sms-general-card stats-card">
        <div className="card-header">
          <h3>{t('stats.title')}</h3>
        </div>
        <div className="card-content">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.sent}</span>
              <span className="stat-label">{t('stats.sent')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.received}</span>
              <span className="stat-label">{t('stats.received')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">{t('stats.pending')}</span>
            </div>
          </div>
          <a href="#" className="link-more">{t('stats.viewHistory')}</a>
        </div>
      </div>

      {/* ---------- INFO CARD ---------- */}
      <div className="sms-general-card info-card">
        <div className="card-header">
          <h3>{t('info.title')}</h3>
        </div>
        <div className="card-content">
          <div className="info-row">
            <span className="info-label">{t('info.name')}</span>
            <span className="info-value">{account.name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">{t('info.description')}</span>
            <span className="info-value">{account.description || '-'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">{t('info.defaultSender')}</span>
            <span className="info-value">{senders[0] || '-'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">{t('info.status')}</span>
            <span className={`status-badge status-${account.status}`}>
              {t(`status.${account.status}`)}
            </span>
          </div>
        </div>
      </div>

      {/* ---------- QUICK ACTIONS ---------- */}
      <div className="sms-general-card actions-card">
        <div className="card-header">
          <h3>{t('actions.title')}</h3>
        </div>
        <div className="card-content">
          <div className="actions-grid">
            <button className="action-btn">
              <span className="action-icon">📤</span>
              <span className="action-label">{t('actions.send')}</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">📊</span>
              <span className="action-label">{t('actions.campaign')}</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">📝</span>
              <span className="action-label">{t('actions.templates')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------- CONFIG SECTION ---------- */}
      <div className="sms-general-card config-card">
        <div className="card-header">
          <h3>{t('config.title')}</h3>
        </div>
        <div className="card-content">
          <div className="config-row">
            <div className="config-info">
              <span className="config-label">{t('config.senders')}</span>
              <span className="config-value">{senders.length} {t('config.sendersCount')}</span>
            </div>
            <a href="#" className="link-action">{t('config.manage')}</a>
          </div>
          <div className="config-row">
            <div className="config-info">
              <span className="config-label">{t('config.reception')}</span>
              <span className="config-value">{account.smsResponse.responseType || '-'}</span>
            </div>
            <a href="#" className="link-action">{t('config.configure')}</a>
          </div>
        </div>
      </div>

      {/* ---------- API BANNER ---------- */}
      <div className="sms-api-banner">
        <div className="banner-icon">💡</div>
        <div className="banner-content">
          <p>{t('api.info')}</p>
          <a href="https://api.ovh.com/console/#/sms" target="_blank" rel="noopener noreferrer">
            {t('api.link')}
          </a>
        </div>
      </div>
    </div>
  );
}

export default GeneralTab;
