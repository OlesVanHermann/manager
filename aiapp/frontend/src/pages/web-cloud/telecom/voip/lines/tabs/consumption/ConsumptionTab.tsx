// ============================================================
// LINE CONSUMPTION TAB - Consommation de la ligne
// Target: target_.web-cloud.voip.line.consumption.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { linesService } from '../../lines.service';
import { Tile, InfoRow, EmptyState } from '../../../components/RightPanel';
import type { LineConsumption } from '../../lines.types';
import './ConsumptionTab.css';

interface ConsumptionTabProps {
  billingAccount: string;
  serviceName: string;
}

export function ConsumptionTab({ billingAccount, serviceName }: ConsumptionTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/lines/consumption');
  const [consumption, setConsumption] = useState<LineConsumption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'call' | 'sms' | 'fax'>('all');

  useEffect(() => {
    loadConsumption();
  }, [billingAccount, serviceName]);

  const loadConsumption = async () => {
    try {
      setLoading(true);
      const data = await linesService.getConsumption(billingAccount, serviceName);
      setConsumption(data);
    } catch {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  const filteredConsumption = consumption.filter(
    (c) => filter === 'all' || c.type === filter
  );

  const totalAmount = filteredConsumption.reduce((sum, c) => sum + c.price, 0);
  const totalDuration = filteredConsumption
    .filter((c) => c.type === 'call')
    .reduce((sum, c) => sum + c.duration, 0);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="line-consumption-tab">
        <div className="voip-skeleton voip-skeleton-tile" />
        <div className="voip-skeleton voip-skeleton-table" />
      </div>
    );
  }

  return (
    <div className="line-consumption-tab">
      {/* Résumé */}
      <Tile title={t('summary.title')}>
        <InfoRow
          label={t('summary.total')}
          value={<span className="amount">{totalAmount.toFixed(2)} €</span>}
        />
        <InfoRow
          label={t('summary.duration')}
          value={formatDuration(totalDuration)}
        />
        <InfoRow
          label={t('summary.count')}
          value={filteredConsumption.length}
        />
      </Tile>

      {/* Filtres */}
      <div className="consumption-filters">
        {(['all', 'call', 'sms', 'fax'] as const).map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {t(`filter.${f}`)}
          </button>
        ))}
      </div>

      {/* Détail */}
      <div className="voip-table-container">
        <table className="voip-table">
          <thead>
            <tr>
              <th>{t('table.date')}</th>
              <th>{t('table.type')}</th>
              <th>{t('table.destination')}</th>
              <th>{t('table.duration')}</th>
              <th>{t('table.price')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredConsumption.map((c, i) => (
              <tr key={i}>
                <td>{new Date(c.date).toLocaleString('fr-FR')}</td>
                <td>
                  <span className={`type-badge ${c.type}`}>
                    {t(`type.${c.type}`)}
                  </span>
                </td>
                <td className="monospace">{c.destination}</td>
                <td>{c.type === 'call' ? formatDuration(c.duration) : '-'}</td>
                <td className="price">{c.price.toFixed(4)} €</td>
              </tr>
            ))}
            {filteredConsumption.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>
                  <EmptyState
                    icon="📊"
                    title={t('empty.title')}
                    description={t('empty.description')}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
