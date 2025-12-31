// ============================================================
// SMS CAMPAIGNS TAB - Gestion des campagnes SMS
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { campaignsService } from './CampaignsTab.service';
import './CampaignsTab.css';

interface Props {
  accountName: string;
}

interface Campaign {
  id: string;
  name: string;
  type: 'marketing' | 'transactional';
  recipientCount: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  scheduledDate: string | null;
  status: 'completed' | 'running' | 'scheduled' | 'draft' | 'paused';
}

interface CampaignStats {
  active: number;
  totalSent: number;
  deliveryRate: number;
  creditsUsed: number;
}

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusBadgeClass = (status: Campaign['status']): string => {
  const classes: Record<Campaign['status'], string> = {
    completed: 'status-success',
    running: 'status-info',
    scheduled: 'status-warning',
    draft: 'status-default',
    paused: 'status-warning',
  };
  return classes[status];
};

export function CampaignsTab({ accountName }: Props) {
  const { t } = useTranslation('web-cloud/voip/sms/campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<CampaignStats>({
    active: 0,
    totalSent: 0,
    deliveryRate: 0,
    creditsUsed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [campaignsData, statsData] = await Promise.all([
          campaignsService.getCampaigns(accountName),
          campaignsService.getStats(accountName),
        ]);
        setCampaigns(campaignsData);
        setStats(statsData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [accountName]);

  const handleRefresh = () => {
    setLoading(true);
    campaignsService.getCampaigns(accountName).then(data => {
      setCampaigns(data);
      setLoading(false);
    });
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="sms-campaigns-loading">
        <div className="sms-campaigns-skeleton" />
        <div className="sms-campaigns-skeleton" />
      </div>
    );
  }

  return (
    <div className="sms-campaigns-tab">
      {/* ---------- STATS CARDS ---------- */}
      <div className="campaigns-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.active}</span>
          <span className="stat-label">{t('stats.active')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalSent.toLocaleString('fr-FR')}</span>
          <span className="stat-label">{t('stats.sent')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.deliveryRate}%</span>
          <span className="stat-label">{t('stats.deliveryRate')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.creditsUsed.toLocaleString('fr-FR')}</span>
          <span className="stat-label">{t('stats.credits')}</span>
        </div>
      </div>

      {/* ---------- TOOLBAR ---------- */}
      <div className="campaigns-toolbar">
        <div className="toolbar-left">
          <button className="btn btn-icon" onClick={handleRefresh} title={t('refresh')}>
            ↻
          </button>
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">{t('filter.all')}</option>
            <option value="completed">{t('filter.completed')}</option>
            <option value="running">{t('filter.running')}</option>
            <option value="scheduled">{t('filter.scheduled')}</option>
            <option value="draft">{t('filter.draft')}</option>
          </select>
        </div>
        <button className="btn btn-primary">
          + {t('newCampaign')}
        </button>
      </div>

      {/* ---------- TABLE ---------- */}
      {filteredCampaigns.length === 0 ? (
        <div className="campaigns-empty">
          <p>{t('empty')}</p>
        </div>
      ) : (
        <div className="campaigns-table-wrapper">
          <table className="campaigns-table">
            <thead>
              <tr>
                <th>{t('columns.name')}</th>
                <th>{t('columns.type')}</th>
                <th>{t('columns.recipients')}</th>
                <th>{t('columns.sent')}</th>
                <th>{t('columns.delivered')}</th>
                <th>{t('columns.failed')}</th>
                <th>{t('columns.scheduled')}</th>
                <th>{t('columns.status')}</th>
                <th>{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map(campaign => (
                <tr key={campaign.id}>
                  <td className="cell-name">{campaign.name}</td>
                  <td>
                    <span className={`type-badge type-${campaign.type}`}>
                      {t(`type.${campaign.type}`)}
                    </span>
                  </td>
                  <td>{campaign.recipientCount.toLocaleString('fr-FR')}</td>
                  <td>{campaign.sentCount.toLocaleString('fr-FR')}</td>
                  <td className="cell-success">{campaign.deliveredCount.toLocaleString('fr-FR')}</td>
                  <td className="cell-error">{campaign.failedCount}</td>
                  <td>{formatDate(campaign.scheduledDate)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(campaign.status)}`}>
                      {t(`status.${campaign.status}`)}
                    </span>
                  </td>
                  <td className="cell-actions">
                    <button className="action-btn" title={t('actions.stats')}>📊</button>
                    <button className="action-btn" title={t('actions.edit')}>✎</button>
                    <button className="action-btn" title={t('actions.copy')}>⧉</button>
                    <button className="action-btn action-danger" title={t('actions.delete')}>✕</button>
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
