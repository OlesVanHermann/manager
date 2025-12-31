// ============================================================
// NUMBER STATS TAB - Statistiques du numéro
// Target: target_.web-cloud.voip.number.stats.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { numbersService } from '../../numbers.service';
import { Tile, Badge } from '../../../components/RightPanel';
import './StatsTab.css';

interface StatsTabProps {
  billingAccount: string;
  serviceName: string;
}

interface Statistics {
  callsTotal: number;
  callsAnswered: number;
  callsLost: number;
  averageWaitingTime: number;
  averageTalkTime: number;
  agentsAvailable: number;
  agentsTotal: number;
  serviceLevel: number;
  callsPerHour: number;
}

interface DailyStats {
  date: string;
  calls: number;
  answered: number;
  lost: number;
}

interface AgentStats {
  name: string;
  calls: number;
  duration: number;
  rate: number;
}

export function StatsTab({ billingAccount, serviceName }: StatsTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/numbers/stats');

  // ---------- STATE ----------
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');
  const [stats, setStats] = useState<Statistics | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [topAgents, setTopAgents] = useState<AgentStats[]>([]);
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
      const [statsData, dailyData, agentsData] = await Promise.all([
        numbersService.getStatistics(billingAccount, serviceName, period),
        numbersService.getDailyStatistics(billingAccount, serviceName, period),
        numbersService.getAgentStatistics(billingAccount, serviceName, period),
      ]);
      setStats(statsData);
      setDailyStats(dailyData);
      setTopAgents(agentsData);
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

  if (!stats) return null;

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
          className={`period-btn ${period === 'week' ? 'active' : ''}`}
          onClick={() => setPeriod('week')}
        >
          {t('periods.week')}
        </button>
        <button
          className={`period-btn ${period === 'month' ? 'active' : ''}`}
          onClick={() => setPeriod('month')}
        >
          {t('periods.month')}
        </button>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="stats-kpi-row">
        <div className="kpi-card">
          <span className="kpi-value">{stats.callsTotal.toLocaleString()}</span>
          <span className="kpi-label">{t('kpi.callsReceived')}</span>
        </div>
        <div className="kpi-card kpi-success">
          <span className="kpi-value">
            {stats.callsAnswered.toLocaleString()}
            <small>({formatPercent(stats.callsAnswered, stats.callsTotal)})</small>
          </span>
          <span className="kpi-label">{t('kpi.callsAnswered')}</span>
        </div>
        <div className="kpi-card kpi-danger">
          <span className="kpi-value">
            {stats.callsLost.toLocaleString()}
            <small>({formatPercent(stats.callsLost, stats.callsTotal)})</small>
          </span>
          <span className="kpi-label">{t('kpi.callsLost')}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">{formatDuration(stats.averageWaitingTime)}</span>
          <span className="kpi-label">{t('kpi.avgWaiting')}</span>
        </div>
      </div>

      {/* KPI Cards Row 2 */}
      <div className="stats-kpi-row">
        <div className="kpi-card">
          <span className="kpi-value">{formatDuration(stats.averageTalkTime)}</span>
          <span className="kpi-label">{t('kpi.avgTalk')}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">
            {stats.agentsAvailable}/{stats.agentsTotal}
          </span>
          <span className="kpi-label">{t('kpi.agents')}</span>
        </div>
        <div className="kpi-card kpi-primary">
          <span className="kpi-value">{stats.serviceLevel}%</span>
          <span className="kpi-label">{t('kpi.serviceLevel')}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-value">{stats.callsPerHour}</span>
          <span className="kpi-label">{t('kpi.callsPerHour')}</span>
        </div>
      </div>

      {/* Daily chart placeholder */}
      <Tile title={t('chart.title')}>
        <div className="stats-chart">
          {dailyStats.length > 0 ? (
            <div className="chart-bars">
              {dailyStats.map((day) => (
                <div key={day.date} className="chart-bar-group">
                  <div
                    className="chart-bar chart-bar-answered"
                    style={{
                      height: `${(day.answered / Math.max(...dailyStats.map((d) => d.calls))) * 100}%`,
                    }}
                    title={`${day.answered} ${t('chart.answered')}`}
                  />
                  <div
                    className="chart-bar chart-bar-lost"
                    style={{
                      height: `${(day.lost / Math.max(...dailyStats.map((d) => d.calls))) * 100}%`,
                    }}
                    title={`${day.lost} ${t('chart.lost')}`}
                  />
                  <span className="chart-label">
                    {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-chart">{t('chart.empty')}</div>
          )}
        </div>
      </Tile>

      {/* Top agents */}
      <Tile title={t('agents.title')}>
        {topAgents.length === 0 ? (
          <div className="empty-state">{t('agents.empty')}</div>
        ) : (
          <table className="agents-stats-table">
            <thead>
              <tr>
                <th>{t('agents.name')}</th>
                <th>{t('agents.calls')}</th>
                <th>{t('agents.duration')}</th>
                <th>{t('agents.rate')}</th>
              </tr>
            </thead>
            <tbody>
              {topAgents.slice(0, 5).map((agent, index) => (
                <tr key={index}>
                  <td className="agent-name">{agent.name}</td>
                  <td>{agent.calls}</td>
                  <td>{formatDuration(agent.duration)}</td>
                  <td>
                    <Badge variant={agent.rate >= 80 ? 'success' : agent.rate >= 60 ? 'warning' : 'danger'}>
                      {agent.rate}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="agents-footer">
          <button className="btn-link">{t('agents.viewAll')}</button>
        </div>
      </Tile>

      {/* Export buttons */}
      <div className="stats-actions">
        <button className="btn btn-secondary">{t('actions.exportCsv')}</button>
        <button className="btn btn-secondary">{t('actions.detailedReport')}</button>
      </div>
    </div>
  );
}
