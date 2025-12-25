// ============================================================
// TELECOM INDEX PAGE - Service LOCAL (défactorisé)
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ovhApi } from '../../../services/api';

// ============================================================
// SERVICE LOCAL - Plus d'import depuis /services/web-cloud.*
// ============================================================
const telecomIndexService = {
  async listVoipAccounts(): Promise<string[]> {
    return ovhApi.get<string[]>('/telephony').catch(() => []);
  },
  async listSmsAccounts(): Promise<string[]> {
    return ovhApi.get<string[]>('/sms').catch(() => []);
  },
  async listFaxServices(): Promise<string[]> {
    return ovhApi.get<string[]>('/freefax').catch(() => []);
  },
};

interface TelecomCounts {
  voip: number;
  sms: number;
  fax: number;
}

export default function TelecomIndexPage() {
  const { t } = useTranslation('web-cloud/telecom/index');
  const [counts, setCounts] = useState<TelecomCounts>({ voip: 0, sms: 0, fax: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [voipList, smsList, faxList] = await Promise.all([
          telecomIndexService.listVoipAccounts(),
          telecomIndexService.listSmsAccounts(),
          telecomIndexService.listFaxServices(),
        ]);
        setCounts({
          voip: voipList.length,
          sms: smsList.length,
          fax: faxList.length,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = [
    {
      id: 'voip',
      icon: '📞',
      title: t('categories.voip.title'),
      description: t('categories.voip.description'),
      count: counts.voip,
      link: '/web-cloud/telecom/voip',
    },
    {
      id: 'sms',
      icon: '💬',
      title: t('categories.sms.title'),
      description: t('categories.sms.description'),
      count: counts.sms,
      link: '/web-cloud/telecom/sms',
    },
    {
      id: 'fax',
      icon: '📠',
      title: t('categories.fax.title'),
      description: t('categories.fax.description'),
      count: counts.fax,
      link: '/web-cloud/telecom/fax',
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/web-cloud">{t('breadcrumb.webCloud')}</Link>
          <span>/</span>
          <span>{t('breadcrumb.telecom')}</span>
        </div>
        <h1>{t('title')}</h1>
        <p className="page-description">{t('description')}</p>
      </div>

      {loading ? (
        <div className="tab-loading">
          <div className="skeleton-block" />
          <div className="skeleton-block" />
        </div>
      ) : (
        <div className="category-cards">
          {categories.map(cat => (
            <Link key={cat.id} to={cat.link} className="category-card">
              <div className="category-icon">{cat.icon}</div>
              <div className="category-info">
                <h3>{cat.title}</h3>
                <p>{cat.description}</p>
              </div>
              <div className="category-count">
                <span className="count-value">{cat.count}</span>
                <span className="count-label">{t('services')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
