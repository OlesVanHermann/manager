// ============================================================
// NUMBER STATS TAB - Statistiques du numéro
// Target: target_.web-cloud.voip.number.stats.svg
// DEFACTORISATION: Composants UI dupliqués, service isolé
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { statsTabService, type NumberStats, type HuntingStats } from './StatsTab.service';
import './StatsTab.css';

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

function Badge({ type = 'default', children }: { type?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'danger'; children: React.ReactNode }) {
  return <span className={`voip-badge voip-badge-${type}`}>{children}</span>;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

interface StatsTabProps {
  billingAccount: string;
  serviceName: string;
}

export function StatsTab({ billingAccount, serviceName }: StatsTabProps) {
  const { t } = useTranslation('web-cloud/voip/numbers/stats');

  // ---------- STATE ----------
  const [period, setPeriod] = useState<'today' | 'lastWeek' | 'lastMonth'>('lastMonth');
  const [stats, setStats] = useState<NumberStats | null>(null);
  const [huntingStats, setHuntingStats] = useState<HuntingStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadStats();
  }, [billingAccount, serviceName, period]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, huntingData] = await Promise.all([
        statsTabService.getStats(billingAccount, serviceName, period),
        statsTabService.getHuntingStats(billingAccount, serviceName),
      ]);
      setStats(statsData);
      setHuntingStats(huntingData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.loading'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPercent = (value: number, total: number) => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="stats-tab">
        <div className="loading-state">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-tab">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  const totalCalls = stats ? stats.incomingCalls + stats.outgoingCalls : 0;

  return (
    <div className="stats-tab">
      {/* Period selector */}
      <div className="stats-period-selector">
        <button
          className={`period-btn ${period === 'today' ? 'active' : ''}`}
          onClick={() => setPeriod('today')}
        >
          {t('periods.today')}
        </button>
        <button
          className={`period-btn ${period === 'lastWeek' ? 'active' : ''}`}
          onClick={() => setPeriod('lastWeek')}
        >
          {t('periods.week')}
        </button>
        <button
          className={`period-btn ${period === 'lastMonth' ? 'active' : ''}`}
          onClick={() => setPeriod('lastMonth')}
        >
          {t('periods.month')}
        </button>
      </div>

      {stats && (
        <>
          {/* KPI Cards Row 1 */}
          <div className="stats-kpi-row">
            <div className="kpi-card">
              <span className="kpi-value">{totalCalls.toLocaleString()}</span>
              <span className="kpi-label">{t('kpi.totalCalls')}</span>
            </div>
            <div className="kpi-card kpi-success">
              <span className="kpi-value">
                {stats.incomingCalls.toLocaleString()}
                <small>({formatPercent(stats.incomingCalls, totalCalls)})</small>
              </span>
              <span className="kpi-label">{t('kpi.incomingCalls')}</span>
            </div>
            <div className="kpi-card kpi-primary">
              <span className="kpi-value">
                {stats.outgoingCalls.toLocaleString()}
                <small>({formatPercent(stats.outgoingCalls, totalCalls)})</small>
              </span>
              <span className="kpi-label">{t('kpi.outgoingCalls')}</span>
            </div>
            <div className="kpi-card kpi-danger">
              <span className="kpi-value">{stats.missedCalls.toLocaleString()}</span>
              <span className="kpi-label">{t('kpi.missedCalls')}</span>
            </div>
          </div>

          {/* KPI Cards Row 2 */}
          <div className="stats-kpi-row">
            <div className="kpi-card">
              <span className="kpi-value">{formatDuration(stats.totalDuration)}</span>
              <span className="kpi-label">{t('kpi.totalDuration')}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-value">{formatDuration(stats.averageDuration)}</span>
              <span className="kpi-label">{t('kpi.avgDuration')}</span>
            </div>
          </div>
        </>
      )}

      {/* Hunting stats (agents) */}
      {huntingStats.length > 0 && (
        <Tile title={t('agents.title')}>
          <table className="agents-stats-table">
            <thead>
              <tr>
                <th>{t('agents.id')}</th>
                <th>{t('agents.calls')}</th>
                <th>{t('agents.avgCallTime')}</th>
                <th>{t('agents.avgWaitTime')}</th>
              </tr>
            </thead>
            <tbody>
              {huntingStats.slice(0, 10).map((agent, index) => (
                <tr key={index}>
                  <td className="agent-name">{agent.agentId}</td>
                  <td>{agent.calls}</td>
                  <td>{formatDuration(agent.averageCallTime)}</td>
                  <td>{formatDuration(agent.averageWaitTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tile>
      )}

      {/* Export buttons */}
      <div className="stats-actions">
        <button className="btn btn-secondary">{t('actions.exportCsv')}</button>
        <button className="btn btn-secondary">{t('actions.detailedReport')}</button>
      </div>
    </div>
  );
}
