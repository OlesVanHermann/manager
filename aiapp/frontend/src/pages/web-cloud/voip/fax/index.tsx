// ============================================================
// FAX PAGE - Container avec structure tabs
// ============================================================

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GeneralTab } from './GeneralTab';
import { CampaignsTab } from './campaigns/CampaignsTab';
import { ConsumptionTab } from './consumption/ConsumptionTab';
import { SettingsTab } from './settings/SettingsTab';
import { LogoTab } from './logo/LogoTab';
import './fax.css';

type TabId = 'general' | 'campaigns' | 'consumption' | 'settings' | 'logo';

export default function FaxPage() {
  const { t } = useTranslation('web-cloud/voip/fax/index');
  const { serviceName } = useParams<{ serviceName: string }>();
  const [activeTab, setActiveTab] = useState<TabId>('general');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'general', label: t('tabs.general') },
    { id: 'campaigns', label: t('tabs.campaigns') },
    { id: 'consumption', label: t('tabs.consumption') },
    { id: 'settings', label: t('tabs.settings') },
    { id: 'logo', label: t('tabs.logo') },
  ];

  if (!serviceName) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>{t('title')}</h1>
        </div>
        <div className="empty-state">
          <p>{t('empty.description')}</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab serviceName={serviceName} />;
      case 'campaigns':
        return <CampaignsTab serviceName={serviceName} />;
      case 'consumption':
        return <ConsumptionTab serviceName={serviceName} />;
      case 'settings':
        return <SettingsTab serviceName={serviceName} />;
      case 'logo':
        return <LogoTab serviceName={serviceName} />;
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
          <Link to="/web-cloud/voip">{t('breadcrumb.telecom')}</Link>
          <span>/</span>
          <span>{t('breadcrumb.fax')}</span>
        </div>
        <h1>{t('title')}: {serviceName}</h1>
      </div>

      {/* ---------- TABS ---------- */}
      <div className="fax-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`fax-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---------- TAB CONTENT ---------- */}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}
