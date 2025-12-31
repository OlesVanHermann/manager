// ============================================================
// FAX CONSUMPTION TAB - Historique et statistiques
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { consumptionService } from './ConsumptionTab.service';
import './ConsumptionTab.css';

interface Props {
  serviceName: string;
}

interface FaxConsumption {
  id: string;
  datetime: string;
  destinationNumber: string;
  pages: number;
  duration: number;
  price: number;
  status: 'success' | 'failed';
}

interface ConsumptionStats {
  total: number;
  pagesCount: number;
  totalCost: number;
}

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function ConsumptionTab({ serviceName }: Props) {
  const { t } = useTranslation('web-cloud/voip/fax/consumption');
  const [items, setItems] = useState<FaxConsumption[]>([]);
  const [stats, setStats] = useState<ConsumptionStats>({ total: 0, pagesCount: 0, totalCost: 0 });
  const [loading, setLoading] = useState(true);
  const [wayType, setWayType] = useState<'outgoing' | 'incoming'>('outgoing');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [itemsData, statsData] = await Promise.all([
          consumptionService.getConsumption(serviceName, wayType),
          consumptionService.getStats(serviceName),
        ]);
        setItems(itemsData);
        setStats(statsData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName, wayType]);

  const handleExport = () => {
    // Export CSV logic
    const csv = items.map(item =>
      `${item.datetime},${item.destinationNumber},${item.pages},${formatDuration(item.duration)},${item.price},${item.status}`
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fax-consumption-${serviceName}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="fax-consumption-loading">
        <div className="fax-consumption-skeleton" />
        <div className="fax-consumption-skeleton" />
      </div>
    );
  }

  return (
    <div className="fax-consumption-tab">
      {/* ---------- SUB TABS ---------- */}
      <div className="consumption-subtabs">
        <button
          className={`subtab-btn ${wayType === 'outgoing' ? 'active' : ''}`}
          onClick={() => setWayType('outgoing')}
        >
          {t('tabs.outgoing')}
        </button>
        <button
          className={`subtab-btn ${wayType === 'incoming' ? 'active' : ''}`}
          onClick={() => setWayType('incoming')}
        >
          {t('tabs.incoming')}
        </button>
      </div>

      {/* ---------- STATS CARDS ---------- */}
      <div className="consumption-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">{t('stats.total')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.pagesCount}</span>
          <span className="stat-label">{t('stats.pages')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalCost.toFixed(2)}€</span>
          <span className="stat-label">{t('stats.cost')}</span>
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      {items.length === 0 ? (
        <div className="consumption-empty">
          <p>{t('empty')}</p>
        </div>
      ) : (
        <>
          <div className="consumption-table-wrapper">
            <table className="consumption-table">
              <thead>
                <tr>
                  <th>{t('columns.date')}</th>
                  <th>{t('columns.number')}</th>
                  <th>{t('columns.pages')}</th>
                  <th>{t('columns.duration')}</th>
                  <th>{t('columns.price')}</th>
                  <th>{t('columns.status')}</th>
                  <th>{t('columns.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>{formatDate(item.datetime)}</td>
                    <td className="cell-number">{item.destinationNumber}</td>
                    <td>{item.pages}</td>
                    <td>{formatDuration(item.duration)}</td>
                    <td>{item.price.toFixed(2)}€</td>
                    <td>
                      <span className={`status-badge status-${item.status}`}>
                        {t(`status.${item.status}`)}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn" title={t('actions.download')}>📄</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="consumption-footer">
            <button className="btn btn-secondary" onClick={handleExport}>
              {t('export')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ConsumptionTab;
