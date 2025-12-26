// ============================================================
// VOIP PAGE - Imports depuis tabs ISOLÉS
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ovhApi } from '../../../../services/api';
import type { TelephonyBillingAccount } from './voip.types';

// Imports ISOLÉS - chaque tab depuis son dossier
import { LinesTab } from './tabs/lines/LinesTab';
import { NumbersTab } from './tabs/numbers/NumbersTab';
import { VoicemailsTab } from './tabs/voicemails/VoicemailsTab';

// ============================================================
// SERVICE LOCAL - Pour le billing account uniquement
// ============================================================
const voipIndexService = {
  async listBillingAccounts(): Promise<string[]> {
    return ovhApi.get<string[]>('/telephony');
  },
  async getBillingAccount(billingAccount: string): Promise<TelephonyBillingAccount> {
    return ovhApi.get<TelephonyBillingAccount>(`/telephony/${billingAccount}`);
  },
};

type TabId = 'lines' | 'numbers' | 'voicemails';

export default function VoipPage() {
  const { t } = useTranslation('web-cloud/telecom/voip/index');
  const { serviceName } = useParams<{ serviceName: string }>();
  const [account, setAccount] = useState<TelephonyBillingAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('lines');

  useEffect(() => {
    const load = async () => {
      if (!serviceName) return;
      try {
        setLoading(true);
        setError(null);
        const data = await voipIndexService.getBillingAccount(serviceName);
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
    { id: 'lines', label: t('tabs.lines') },
    { id: 'numbers', label: t('tabs.numbers') },
    { id: 'voicemails', label: t('tabs.voicemails') },
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
            <span>{t('breadcrumb.voip')}</span>
          </div>
          <h1>{t('title')}</h1>
        </div>
        <div className="voip-page-loading">
          <div className="voip-page-skeleton" />
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
      case 'lines':
        return <LinesTab billingAccount={serviceName} />;
      case 'numbers':
        return <NumbersTab billingAccount={serviceName} />;
      case 'voicemails':
        return <VoicemailsTab billingAccount={serviceName} />;
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
          <span>{t('breadcrumb.voip')}</span>
        </div>
        <h1>{account.billingAccount}</h1>
        <p className="page-description">{account.description || t('noDescription')}</p>
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
