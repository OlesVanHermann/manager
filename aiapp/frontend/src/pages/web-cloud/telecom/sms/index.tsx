// ============================================================
// SMS PAGE - Compte SMS avec tous les tabs
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ovhApi } from '../../../../services/api';
import type { SmsAccount } from './sms.types';

// Imports ISOLÉS - chaque tab depuis son dossier
import { GeneralTab } from './tabs/general/GeneralTab';
import { SendTab } from './tabs/send/SendTab';
import { CampaignsTab } from './tabs/campaigns/CampaignsTab';
import { OutgoingTab } from './tabs/outgoing/OutgoingTab';
import { IncomingTab } from './tabs/incoming/IncomingTab';
import { SendersTab } from './tabs/senders/SendersTab';
import { TemplatesTab } from './tabs/templates/TemplatesTab';

// ============================================================
// SERVICE LOCAL - Pour le compte SMS uniquement
// ============================================================
const smsIndexService = {
  async listSmsAccounts(): Promise<string[]> {
    return ovhApi.get<string[]>('/sms');
  },
  async getSmsAccount(serviceName: string): Promise<SmsAccount> {
    return ovhApi.get<SmsAccount>(`/sms/${serviceName}`);
  },
};

type TabId = 'general' | 'send' | 'campaigns' | 'outgoing' | 'incoming' | 'senders' | 'templates';

export default function SmsPage() {
  const { t } = useTranslation('web-cloud/telecom/sms/index');
  const { serviceName } = useParams<{ serviceName: string }>();
  const [account, setAccount] = useState<SmsAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('general');

  useEffect(() => {
    const load = async () => {
      if (!serviceName) return;
      try {
        setLoading(true);
        setError(null);
        const data = await smsIndexService.getSmsAccount(serviceName);
        setAccount(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'general', label: t('tabs.general') },
    { id: 'send', label: t('tabs.send') },
    { id: 'campaigns', label: t('tabs.campaigns') },
    { id: 'outgoing', label: t('tabs.outgoing') },
    { id: 'incoming', label: t('tabs.incoming') },
    { id: 'senders', label: t('tabs.senders') },
    { id: 'templates', label: t('tabs.templates') },
  ];

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div className="breadcrumb">
            <Link to="/web-cloud">{t('breadcrumb.webCloud')}</Link>
            <span>/</span>
            <Link to="/web-cloud/telecom">{t('breadcrumb.telecom')}</Link>
            <span>/</span>
            <span>{t('breadcrumb.sms')}</span>
          </div>
          <h1>{t('title')}</h1>
        </div>
        <div className="sms-page-loading">
          <div className="sms-page-skeleton" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>{t('title')}</h1>
        </div>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!account || !serviceName) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>{t('title')}</h1>
        </div>
        <div className="empty-state">
          <p>{t('empty')}</p>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab accountName={serviceName} />;
      case 'send':
        return <SendTab accountName={serviceName} />;
      case 'campaigns':
        return <CampaignsTab accountName={serviceName} />;
      case 'outgoing':
        return <OutgoingTab accountName={serviceName} />;
      case 'incoming':
        return <IncomingTab accountName={serviceName} />;
      case 'senders':
        return <SendersTab accountName={serviceName} />;
      case 'templates':
        return <TemplatesTab accountName={serviceName} />;
      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/web-cloud">{t('breadcrumb.webCloud')}</Link>
          <span>/</span>
          <Link to="/web-cloud/telecom">{t('breadcrumb.telecom')}</Link>
          <span>/</span>
          <span>{t('breadcrumb.sms')}</span>
        </div>
        <h1>{account.name}</h1>
        <p className="page-description">{account.description || t('noDescription')}</p>
      </div>

      <div className="credits-display">
        <span className="credits-value">{account.creditsLeft.toLocaleString('fr-FR')}</span>
        <span className="credits-label">{t('credits')}</span>
      </div>

      <div className="tabs-container">
        <div className="tabs-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
