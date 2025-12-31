// ============================================================
// NUMBER AGENTS TAB - Gestion des agents du numéro
// Target: target_.web-cloud.voip.number.agents.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { numbersService } from '../../numbers.service';
import { Tile, Badge } from '../../../components/RightPanel';
import './AgentsTab.css';

interface AgentsTabProps {
  billingAccount: string;
  serviceName: string;
}

interface Agent {
  id: number;
  name: string;
  number: string;
  type: 'internal' | 'external';
  status: 'online' | 'offline' | 'busy' | 'ringing';
  priority: number;
  callCount24h: number;
  averageDuration: number;
}

export function AgentsTab({ billingAccount, serviceName }: AgentsTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/numbers/agents');

  // ---------- STATE ----------
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadAgents();
  }, [billingAccount, serviceName]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await numbersService.getAgents(billingAccount, serviceName);
      setAgents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.loading'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleMovePriority = async (agentId: number, direction: 'up' | 'down') => {
    const index = agents.findIndex((a) => a.id === agentId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === agents.length - 1) return;

    const newAgents = [...agents];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newAgents[index], newAgents[swapIndex]] = [newAgents[swapIndex], newAgents[index]];
    newAgents.forEach((a, i) => (a.priority = i + 1));
    setAgents(newAgents);

    try {
      await numbersService.updateAgentPriority(billingAccount, serviceName, agentId, direction);
    } catch {
      loadAgents();
    }
  };

  const handleDeleteAgent = async (agentId: number) => {
    if (!confirm(t('confirm.delete'))) return;
    try {
      await numbersService.deleteAgent(billingAccount, serviceName, agentId);
      setAgents(agents.filter((a) => a.id !== agentId));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.delete'));
    }
  };

  // ---------- COMPUTED ----------
  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.number.includes(searchTerm)
  );

  const onlineCount = agents.filter((a) => a.status === 'online' || a.status === 'busy').length;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}min ${secs.toString().padStart(2, '0')}s`;
  };

  const getStatusVariant = (status: Agent['status']) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'busy':
        return 'warning';
      case 'ringing':
        return 'info';
      default:
        return 'neutral';
    }
  };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="agents-tab">
        <div className="loading-state">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agents-tab">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="agents-tab">
      {/* Toolbar */}
      <div className="agents-toolbar">
        <button className="btn btn-icon" onClick={loadAgents} title={t('actions.refresh')}>
          ↻
        </button>
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="btn btn-primary">{t('actions.add')}</button>
      </div>

      {/* Stats cards */}
      <div className="agents-stats">
        <div className="stat-card">
          <span className="stat-value">
            {onlineCount} / {agents.length}
          </span>
          <span className="stat-label">{t('stats.activeAgents')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {agents.reduce((sum, a) => sum + a.callCount24h, 0)}
          </span>
          <span className="stat-label">{t('stats.calls24h')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {agents.length > 0
              ? formatDuration(
                  Math.round(
                    agents.reduce((sum, a) => sum + a.averageDuration, 0) / agents.length
                  )
                )
              : '0min'}
          </span>
          <span className="stat-label">{t('stats.avgDuration')}</span>
        </div>
      </div>

      {/* Agents table */}
      <Tile title={t('table.title')}>
        {filteredAgents.length === 0 ? (
          <div className="empty-state">{t('table.empty')}</div>
        ) : (
          <table className="agents-table">
            <thead>
              <tr>
                <th>{t('table.priority')}</th>
                <th>{t('table.agent')}</th>
                <th>{t('table.number')}</th>
                <th>{t('table.type')}</th>
                <th>{t('table.status')}</th>
                <th>{t('table.calls')}</th>
                <th>{t('table.duration')}</th>
                <th>{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((agent, index) => (
                <tr key={agent.id}>
                  <td className="priority-cell">
                    <span className="priority-number">{agent.priority}</span>
                    <div className="priority-arrows">
                      <button
                        className="arrow-btn"
                        onClick={() => handleMovePriority(agent.id, 'up')}
                        disabled={index === 0}
                      >
                        ▲
                      </button>
                      <button
                        className="arrow-btn"
                        onClick={() => handleMovePriority(agent.id, 'down')}
                        disabled={index === filteredAgents.length - 1}
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="agent-name">{agent.name}</td>
                  <td className="monospace">{agent.number}</td>
                  <td>
                    <Badge variant={agent.type === 'internal' ? 'info' : 'neutral'}>
                      {t(`types.${agent.type}`)}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={getStatusVariant(agent.status)}>
                      {t(`status.${agent.status}`)}
                    </Badge>
                  </td>
                  <td>{agent.callCount24h}</td>
                  <td>{formatDuration(agent.averageDuration)}</td>
                  <td className="actions-cell">
                    <button className="btn-icon" title={t('actions.edit')}>
                      ✎
                    </button>
                    <button
                      className="btn-icon btn-icon-danger"
                      onClick={() => handleDeleteAgent(agent.id)}
                      title={t('actions.delete')}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Tile>
    </div>
  );
}
