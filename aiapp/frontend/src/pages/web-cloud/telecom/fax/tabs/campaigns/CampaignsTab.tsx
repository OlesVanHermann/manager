// ============================================================
// FAX CAMPAIGNS TAB - Gestion des campagnes fax
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { campaignsService } from './CampaignsTab.service';
import './CampaignsTab.css';

interface Props {
  serviceName: string;
}

interface FaxCampaign {
  id: string;
  name: string;
  creationDatetime: string;
  recipientsCount: number;
  sentCount: number;
  failedCount: number;
  status: 'scheduled' | 'running' | 'completed' | 'cancelled';
}

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getStatusClass = (status: FaxCampaign['status']): string => {
  const classes: Record<FaxCampaign['status'], string> = {
    scheduled: 'status-default',
    running: 'status-warning',
    completed: 'status-success',
    cancelled: 'status-error',
  };
  return classes[status];
};

export function CampaignsTab({ serviceName }: Props) {
  const { t } = useTranslation('web-cloud/telecom/fax/campaigns');
  const [campaigns, setCampaigns] = useState<FaxCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await campaignsService.getCampaigns(serviceName);
        setCampaigns(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  const handleRefresh = () => {
    setLoading(true);
    campaignsService.getCampaigns(serviceName).then(data => {
      setCampaigns(data);
      setLoading(false);
    });
  };

  if (loading) {
    return (
      <div className="fax-campaigns-loading">
        <div className="fax-campaigns-skeleton" />
        <div className="fax-campaigns-skeleton" />
      </div>
    );
  }

  return (
    <div className="fax-campaigns-tab">
      {/* ---------- TOOLBAR ---------- */}
      <div className="campaigns-toolbar">
        <button className="btn btn-icon" onClick={handleRefresh} title={t('refresh')}>
          ↻
        </button>
        <button className="btn btn-primary">
          + {t('newCampaign')}
        </button>
      </div>

      {/* ---------- TABLE ---------- */}
      {campaigns.length === 0 ? (
        <div className="campaigns-empty">
          <p>{t('empty')}</p>
        </div>
      ) : (
        <div className="campaigns-table-wrapper">
          <table className="campaigns-table">
            <thead>
              <tr>
                <th>{t('columns.name')}</th>
                <th>{t('columns.date')}</th>
                <th>{t('columns.recipients')}</th>
                <th>{t('columns.sent')}</th>
                <th>{t('columns.failed')}</th>
                <th>{t('columns.status')}</th>
                <th>{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(campaign => (
                <tr key={campaign.id}>
                  <td className="cell-name">{campaign.name}</td>
                  <td>{formatDate(campaign.creationDatetime)}</td>
                  <td>{campaign.recipientsCount}</td>
                  <td className="cell-success">{campaign.sentCount}</td>
                  <td className="cell-error">{campaign.failedCount}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(campaign.status)}`}>
                      {t(`status.${campaign.status}`)}
                    </span>
                  </td>
                  <td className="cell-actions">
                    <button className="action-btn" title={t('actions.view')}>👁️</button>
                    <button className="action-btn" title={t('actions.copy')}>📋</button>
                    <button className="action-btn" title={t('actions.edit')}>✎</button>
                    <button className="action-btn action-danger" title={t('actions.delete')}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CampaignsTab;
