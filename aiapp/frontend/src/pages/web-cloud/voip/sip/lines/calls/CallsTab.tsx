// ============================================================
// LINE CALLS TAB - Historique des appels
// Target: target_.web-cloud.voip.line.calls.svg
// DEFACTORISATION: Composants UI dupliqués, service isolé
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { callsTabService, type LineCall } from './CallsTab.service';
import './CallsTab.css';

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

function Badge({ type = 'default', children }: { type?: 'success' | 'warning' | 'error' | 'info' | 'default'; children: React.ReactNode }) {
  return <span className={`voip-badge voip-badge-${type}`}>{children}</span>;
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

interface CallsTabProps {
  billingAccount: string;
  serviceName: string;
}

export function CallsTab({ billingAccount, serviceName }: CallsTabProps) {
  const { t } = useTranslation('web-cloud/voip/lines/calls');
  const [calls, setCalls] = useState<LineCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');

  useEffect(() => {
    loadCalls();
  }, [billingAccount, serviceName]);

  const loadCalls = async () => {
    try {
      setLoading(true);
      const data = await callsTabService.getCalls(billingAccount, serviceName);
      setCalls(data);
    } catch {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  const filteredCalls = calls.filter(
    (c) => filter === 'all' || c.type === filter
  );

  const stats = {
    total: calls.length,
    incoming: calls.filter((c) => c.type === 'incoming').length,
    outgoing: calls.filter((c) => c.type === 'outgoing').length,
    totalDuration: calls.reduce((sum, c) => sum + c.duration, 0),
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('fr-FR'),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  if (loading) {
    return (
      <div className="line-calls-tab">
        <div className="voip-skeleton voip-skeleton-tile" />
        <div className="voip-skeleton voip-skeleton-table" />
      </div>
    );
  }

  return (
    <div className="line-calls-tab">
      {/* Statistiques */}
      <Tile title={t('stats.title')}>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">{t('stats.total')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-value incoming">{stats.incoming}</span>
            <span className="stat-label">{t('stats.incoming')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-value outgoing">{stats.outgoing}</span>
            <span className="stat-label">{t('stats.outgoing')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{formatDuration(stats.totalDuration)}</span>
            <span className="stat-label">{t('stats.duration')}</span>
          </div>
        </div>
      </Tile>

      {/* Filtres */}
      <div className="calls-filters">
        {(['all', 'incoming', 'outgoing'] as const).map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'incoming' && '📥 '}
            {f === 'outgoing' && '📤 '}
            {t(`filter.${f}`)}
          </button>
        ))}
      </div>

      {/* Liste des appels */}
      <div className="voip-table-container">
        <table className="voip-table">
          <thead>
            <tr>
              <th>{t('table.type')}</th>
              <th>{t('table.number')}</th>
              <th>{t('table.date')}</th>
              <th>{t('table.duration')}</th>
              <th>{t('table.price')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalls.map((call) => {
              const { date, time } = formatDate(call.datetime);
              return (
                <tr key={call.id}>
                  <td>
                    <span className={`call-type ${call.type}`}>
                      {call.type === 'incoming' ? '📥' : '📤'}
                    </span>
                  </td>
                  <td className="monospace">
                    {call.type === 'incoming' ? call.calling : call.called}
                    {call.destination && (
                      <span className="destination"> ({call.destination})</span>
                    )}
                  </td>
                  <td>
                    <span className="date">{date}</span>
                    <span className="time">{time}</span>
                  </td>
                  <td>{formatDuration(call.duration)}</td>
                  <td className="price">-</td>
                </tr>
              );
            })}
            {filteredCalls.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>
                  <EmptyState
                    icon="📞"
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
