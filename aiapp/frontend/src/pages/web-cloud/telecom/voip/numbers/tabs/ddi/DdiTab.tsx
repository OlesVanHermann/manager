// ============================================================
// NUMBER DDI TAB - Gestion des extensions DDI
// Target: target_.web-cloud.voip.number.ddi.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { numbersService } from '../../numbers.service';
import { Tile, Badge } from '../../../components/RightPanel';
import './DdiTab.css';

interface DdiTabProps {
  billingAccount: string;
  serviceName: string;
}

interface DdiRule {
  extension: string;
  destination: string;
  destinationType: 'internal' | 'external' | 'queue' | 'svi';
  description: string;
  enabled: boolean;
}

interface DdiRange {
  min: number;
  max: number;
}

export function DdiTab({ billingAccount, serviceName }: DdiTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/numbers/ddi');

  // ---------- STATE ----------
  const [rules, setRules] = useState<DdiRule[]>([]);
  const [range, setRange] = useState<DdiRange | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadDdi();
  }, [billingAccount, serviceName]);

  const loadDdi = async () => {
    try {
      setLoading(true);
      setError(null);
      const [rulesData, rangeData] = await Promise.all([
        numbersService.getDdiRules(billingAccount, serviceName),
        numbersService.getDdiRange(billingAccount, serviceName),
      ]);
      setRules(rulesData);
      setRange(rangeData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.loading'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleDeleteRule = async (extension: string) => {
    if (!confirm(t('confirm.delete'))) return;
    try {
      await numbersService.deleteDdiRule(billingAccount, serviceName, extension);
      setRules(rules.filter((r) => r.extension !== extension));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.delete'));
    }
  };

  // ---------- COMPUTED ----------
  const filteredRules = rules.filter(
    (r) =>
      r.extension.includes(searchTerm) ||
      r.destination.includes(searchTerm) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = rules.filter((r) => r.enabled).length;

  const getTypeVariant = (type: DdiRule['destinationType']) => {
    switch (type) {
      case 'internal':
        return 'success';
      case 'external':
        return 'info';
      case 'queue':
        return 'purple';
      case 'svi':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="ddi-tab">
        <div className="loading-state">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ddi-tab">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="ddi-tab">
      {/* Info banner */}
      <div className="ddi-info-banner">
        <span className="info-icon">ℹ️</span>
        <div>
          <strong>{t('info.title')}</strong>
          <p>{t('info.description')}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="ddi-toolbar">
        <button className="btn btn-icon" onClick={loadDdi} title={t('actions.refresh')}>
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
      <div className="ddi-stats">
        <div className="stat-card">
          <span className="stat-value">{activeCount}</span>
          <span className="stat-label">{t('stats.activeRules')}</span>
        </div>
        {range && (
          <div className="stat-card">
            <span className="stat-value">
              {range.min} - {range.max}
            </span>
            <span className="stat-label">{t('stats.range')}</span>
          </div>
        )}
        <div className="stat-card">
          <span className="stat-value">{rules.length}</span>
          <span className="stat-label">{t('stats.totalRules')}</span>
        </div>
      </div>

      {/* DDI table */}
      <Tile title={t('table.title')}>
        {filteredRules.length === 0 ? (
          <div className="empty-state">{t('table.empty')}</div>
        ) : (
          <table className="ddi-table">
            <thead>
              <tr>
                <th>{t('table.extension')}</th>
                <th>{t('table.destination')}</th>
                <th>{t('table.type')}</th>
                <th>{t('table.status')}</th>
                <th>{t('table.description')}</th>
                <th>{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map((rule) => (
                <tr key={rule.extension}>
                  <td className="extension-cell">
                    <span className="extension-badge">{rule.extension}</span>
                  </td>
                  <td className="monospace">{rule.destination}</td>
                  <td>
                    <Badge variant={getTypeVariant(rule.destinationType)}>
                      {t(`types.${rule.destinationType}`)}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={rule.enabled ? 'success' : 'neutral'}>
                      {rule.enabled ? t('status.active') : t('status.inactive')}
                    </Badge>
                  </td>
                  <td className="description-cell">{rule.description || '-'}</td>
                  <td className="actions-cell">
                    <button className="btn-icon" title={t('actions.edit')}>
                      ✎
                    </button>
                    <button
                      className="btn-icon btn-icon-danger"
                      onClick={() => handleDeleteRule(rule.extension)}
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
