// ============================================================
// FAX PAGE - Container avec structure tabs
// ============================================================

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GeneralTab } from './tabs/general/GeneralTab';

export default function FaxPage() {
  const { t } = useTranslation('web-cloud/fax/index');
  const { serviceName } = useParams<{ serviceName: string }>();
  const [activeTab] = useState<'general'>('general');

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

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/web-cloud">{t('breadcrumb.webCloud')}</Link>
          <span>/</span>
          <Link to="/web-cloud/telecom">{t('breadcrumb.telecom')}</Link>
          <span>/</span>
          <span>{t('breadcrumb.fax')}</span>
        </div>
        <h1>{t('title')}</h1>
      </div>

      <div className="tab-content">
        {activeTab === 'general' && (
          <GeneralTab serviceName={serviceName} />
        )}
      </div>
    </div>
  );
}
