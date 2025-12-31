// ============================================================
// LINE CONSUMPTION TAB - Consommation de la ligne
// Target: target_.web-cloud.voip.line.consumption.svg
// DEFACTORISATION: Composants UI dupliqués, service isolé
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { consumptionTabService, type LineConsumption } from './ConsumptionTab.service';
import './ConsumptionTab.css';

// ============================================================
// COMPOSANTS UI DUPLIQUÉS (ISOLATION)
// ============================================================

function Tile({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`voip-tile ${className}`}>
      <div className="voip-tile-header">{title}</div>
      <div className="voip-tile-content">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="voip-info-row">
      <span className="voip-info-label">{label}</span>
      <span className="voip-info-value">{value}</span>
    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="voip-empty-state">
      <span className="voip-empty-icon">{icon}</span>
      <h3 className="voip-empty-title">{title}</h3>
      <p className="voip-empty-description">{description}</p>
    </div>
  );
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

interface ConsumptionTabProps {
  billingAccount: string;
  serviceName: string;
}

export function ConsumptionTab({ billingAccount, serviceName }: ConsumptionTabProps) {
  const { t } = useTranslation('web-cloud/voip/lines/consumption');
  const [consumption, setConsumption] = useState<LineConsumption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'call' | 'sms' | 'fax'>('all');

  useEffect(() => {
    loadConsumption();
  }, [billingAccount, serviceName]);

  const loadConsumption = async () => {
    try {
      setLoading(true);
      const data = await consumptionTabService.getConsumption(billingAccount, serviceName);
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

  const totalAmount = consumptionTabService.calculateTotal(filteredConsumption);
  const totalDuration = consumptionTabService.calculateTotalDuration(
    filteredConsumption.filter((c) => c.type === 'call')
  );

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
                <td className="monospace">{c.called}</td>
                <td>{c.type === 'call' ? formatDuration(c.duration) : '-'}</td>
                <td className="price">{c.price.value.toFixed(4)} {c.price.currency}</td>
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
