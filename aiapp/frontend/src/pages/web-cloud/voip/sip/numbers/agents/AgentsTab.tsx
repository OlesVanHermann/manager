// ============================================================
// NUMBER AGENTS TAB - Gestion des agents du numéro
// Target: target_.web-cloud.voip.number.agents.svg
// DEFACTORISATION: Composants UI dupliqués, service isolé
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { agentsTabService, type NumberAgent } from './AgentsTab.service';
import './AgentsTab.css';

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

function Badge({ type = 'default', children }: { type?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'neutral'; children: React.ReactNode }) {
  return <span className={`voip-badge voip-badge-${type}`}>{children}</span>;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

interface AgentsTabProps {
  billingAccount: string;
  serviceName: string;
}

export function AgentsTab({ billingAccount, serviceName }: AgentsTabProps) {
  const { t } = useTranslation('web-cloud/voip/numbers/agents');

  // ---------- STATE ----------
  const [agents, setAgents] = useState<NumberAgent[]>([]);
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
      const data = await agentsTabService.getAgents(billingAccount, serviceName);
      setAgents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.loading'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleMovePriority = async (agentNumber: string, direction: 'up' | 'down') => {
    const sortedAgents = [...agents].sort((a, b) => a.position - b.position);
    const index = sortedAgents.findIndex((a) => a.agentNumber === agentNumber);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sortedAgents.length - 1) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const newPosition = sortedAgents[swapIndex].position;

    try {
      await agentsTabService.updateAgent(billingAccount, serviceName, agentNumber, { position: newPosition });
      await loadAgents();
    } catch {
      // Revert on error
    }
  };

  const handleDeleteAgent = async (agentNumber: string) => {
    if (!confirm(t('confirm.delete'))) return;
    try {
      await agentsTabService.deleteAgent(billingAccount, serviceName, agentNumber);
      setAgents(agents.filter((a) => a.agentNumber !== agentNumber));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.delete'));
    }
  };

  const handleToggleLogged = async (agent: NumberAgent) => {
    try {
      await agentsTabService.updateAgent(billingAccount, serviceName, agent.agentNumber, { logged: !agent.logged });
      setAgents(agents.map((a) =>
        a.agentNumber === agent.agentNumber ? { ...a, logged: !a.logged } : a
      ));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.update'));
    }
  };

  // ---------- COMPUTED ----------
  const filteredAgents = agents.filter((a) =>
    a.agentNumber.includes(searchTerm) ||
    a.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAgents = [...filteredAgents].sort((a, b) => a.position - b.position);
  const loggedCount = agents.filter((a) => a.logged).length;

  const getStatusVariant = (status: NumberAgent['status']): 'success' | 'warning' | 'neutral' => {
    switch (status) {
      case 'available':
        return 'success';
      case 'busy':
        return 'warning';
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
            {loggedCount} / {agents.length}
          </span>
          <span className="stat-label">{t('stats.activeAgents')}</span>
        </div>
      </div>

      {/* Agents table */}
      <Tile title={t('table.title')}>
        {sortedAgents.length === 0 ? (
          <div className="empty-state">{t('table.empty')}</div>
        ) : (
          <table className="agents-table">
            <thead>
              <tr>
                <th>{t('table.priority')}</th>
                <th>{t('table.agent')}</th>
                <th>{t('table.description')}</th>
                <th>{t('table.status')}</th>
                <th>{t('table.logged')}</th>
                <th>{t('table.lines')}</th>
                <th>{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedAgents.map((agent, index) => (
                <tr key={agent.agentNumber}>
                  <td className="priority-cell">
                    <span className="priority-number">{agent.position}</span>
                    <div className="priority-arrows">
                      <button
                        className="arrow-btn"
                        onClick={() => handleMovePriority(agent.agentNumber, 'up')}
                        disabled={index === 0}
                      >
                        ▲
                      </button>
                      <button
                        className="arrow-btn"
                        onClick={() => handleMovePriority(agent.agentNumber, 'down')}
                        disabled={index === sortedAgents.length - 1}
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="monospace">{agent.agentNumber}</td>
                  <td>{agent.description || '-'}</td>
                  <td>
                    <Badge type={getStatusVariant(agent.status)}>
                      {t(`status.${agent.status}`)}
                    </Badge>
                  </td>
                  <td>
                    <button
                      className={`toggle-btn ${agent.logged ? 'active' : ''}`}
                      onClick={() => handleToggleLogged(agent)}
                    >
                      {agent.logged ? '✓' : '✗'}
                    </button>
                  </td>
                  <td>{agent.simultaneousLines}</td>
                  <td className="actions-cell">
                    <button className="btn-icon" title={t('actions.edit')}>
                      ✎
                    </button>
                    <button
                      className="btn-icon btn-icon-danger"
                      onClick={() => handleDeleteAgent(agent.agentNumber)}
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
