// ============================================================
// NUMBER SCHEDULER TAB - Plages horaires du numéro
// Target: target_.web-cloud.voip.number.scheduler.svg
// DEFACTORISATION: Composants UI dupliqués, service isolé
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { schedulerTabService, type SchedulerCondition } from './SchedulerTab.service';
import './SchedulerTab.css';

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

interface SchedulerTabProps {
  billingAccount: string;
  serviceName: string;
}

export function SchedulerTab({ billingAccount, serviceName }: SchedulerTabProps) {
  const { t } = useTranslation('web-cloud/voip/numbers/scheduler');
  const [conditions, setConditions] = useState<SchedulerCondition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedule();
  }, [billingAccount, serviceName]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const data = await schedulerTabService.getSchedule(billingAccount, serviceName);
      setConditions(data);
    } catch {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (conditionId: number) => {
    if (!confirm(t('confirm.delete'))) return;

    try {
      await schedulerTabService.deleteCondition(billingAccount, serviceName, conditionId);
      await loadSchedule();
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.delete'));
    }
  };

  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Group conditions by day
  const conditionsByDay = conditions.reduce((acc, c) => {
    if (!acc[c.day]) acc[c.day] = [];
    acc[c.day].push(c);
    return acc;
  }, {} as Record<string, SchedulerCondition[]>);

  if (loading) {
    return (
      <div className="number-scheduler-tab">
        <div className="voip-skeleton voip-skeleton-tile" />
      </div>
    );
  }

  return (
    <div className="number-scheduler-tab">
      {/* Info */}
      <Tile title={t('info.title')}>
        <p className="scheduler-description">{t('info.description')}</p>
      </Tile>

      {/* Actions */}
      <div className="scheduler-actions">
        <button className="btn btn-primary">
          + {t('actions.addCondition')}
        </button>
      </div>

      {/* Liste des conditions */}
      {conditions.length > 0 ? (
        <Tile title={t('conditions.title')}>
          {/* Grille horaire */}
          <div className="schedule-grid">
            <div className="schedule-header">
              <span></span>
              {Array.from({ length: 24 }, (_, i) => (
                <span key={i} className="hour-label">
                  {i.toString().padStart(2, '0')}
                </span>
              ))}
            </div>
            {weekDays.map((day) => (
              <div key={day} className="schedule-row">
                <span className="day-label">{t(`days.${day}`)}</span>
                <div className="schedule-hours">
                  {Array.from({ length: 24 }, (_, i) => {
                    const condition = conditionsByDay[day]?.find(
                      (c) => parseInt(c.hourBegin) <= i && parseInt(c.hourEnd) > i
                    );
                    return (
                      <div
                        key={i}
                        className={`hour-block ${condition?.policy === 'available' ? 'available' : ''}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="schedule-legend">
            <span className="legend-item">
              <span className="legend-block available" /> {t('legend.available')}
            </span>
            <span className="legend-item">
              <span className="legend-block" /> {t('legend.unavailable')}
            </span>
          </div>

          {/* Liste détaillée */}
          <div className="conditions-list">
            <h4>{t('conditions.details')}</h4>
            {conditions.map((condition) => (
              <div key={condition.id} className="condition-item">
                <Badge type={condition.policy === 'available' ? 'success' : 'warning'}>
                  {t(`policy.${condition.policy}`)}
                </Badge>
                <span className="condition-day">{t(`days.${condition.day}`)}</span>
                <span className="condition-time">{condition.hourBegin} - {condition.hourEnd}</span>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(condition.id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </Tile>
      ) : (
        <div className="empty-container">
          <EmptyState
            icon="🗓️"
            title={t('empty.title')}
            description={t('empty.description')}
          />
        </div>
      )}
    </div>
  );
}
