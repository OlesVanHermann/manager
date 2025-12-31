// ============================================================
// ROUTING TAB - Gestion du routage Carrier SIP
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { routingService } from './RoutingTab.service';
import './RoutingTab.css';

interface Props {
  billingAccount: string;
  serviceName: string;
}

interface RoutingRule {
  id: string;
  name: string;
  pattern: string;
  destination: string;
  priority: number;
  enabled: boolean;
}

export function RoutingTab({ billingAccount, serviceName }: Props) {
  const { t } = useTranslation('web-cloud/voip/carrier-sip/routing');
  const [rules, setRules] = useState<RoutingRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await routingService.getRoutingRules(billingAccount, serviceName);
        setRules(data.sort((a, b) => a.priority - b.priority));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [billingAccount, serviceName]);

  const handleToggleRule = async (rule: RoutingRule) => {
    try {
      await routingService.updateRoutingRule(billingAccount, serviceName, rule.id, {
        enabled: !rule.enabled,
      });
      setRules(prev =>
        prev.map(r => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r))
      );
    } catch {
      // Error handling
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      await routingService.deleteRoutingRule(billingAccount, serviceName, ruleId);
      setRules(prev => prev.filter(r => r.id !== ruleId));
    } catch {
      // Error handling
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    routingService.getRoutingRules(billingAccount, serviceName).then(data => {
      setRules(data.sort((a, b) => a.priority - b.priority));
      setLoading(false);
    });
  };

  if (loading) {
    return (
      <div className="routing-loading">
        <div className="routing-skeleton" />
        <div className="routing-skeleton" />
      </div>
    );
  }

  return (
    <div className="routing-tab">
      {/* ---------- TOOLBAR ---------- */}
      <div className="routing-toolbar">
        <button className="btn btn-icon" onClick={handleRefresh} title={t('refresh')}>
          ↻
        </button>
        <button className="btn btn-primary">
          + {t('addRule')}
        </button>
      </div>

      {/* ---------- INFO BANNER ---------- */}
      <div className="routing-info-banner">
        <span className="routing-info-icon">ℹ️</span>
        <p>{t('infoBanner')}</p>
      </div>

      {/* ---------- TABLE ---------- */}
      {rules.length === 0 ? (
        <div className="routing-empty">
          <p>{t('empty')}</p>
        </div>
      ) : (
        <div className="routing-table-wrapper">
          <table className="routing-table">
            <thead>
              <tr>
                <th>{t('columns.priority')}</th>
                <th>{t('columns.name')}</th>
                <th>{t('columns.pattern')}</th>
                <th>{t('columns.destination')}</th>
                <th>{t('columns.status')}</th>
                <th>{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {rules.map(rule => (
                <tr key={rule.id} className={!rule.enabled ? 'disabled' : ''}>
                  <td className="cell-priority">{rule.priority}</td>
                  <td className="cell-name">{rule.name}</td>
                  <td className="cell-pattern">
                    <code>{rule.pattern}</code>
                  </td>
                  <td className="cell-destination">{rule.destination}</td>
                  <td>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => handleToggleRule(rule)}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </td>
                  <td className="cell-actions">
                    <button className="action-btn" title={t('actions.edit')}>✎</button>
                    <button
                      className="action-btn action-danger"
                      title={t('actions.delete')}
                      onClick={() => handleDeleteRule(rule.id)}
                    >
                      🗑️
                    </button>
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

export default RoutingTab;
