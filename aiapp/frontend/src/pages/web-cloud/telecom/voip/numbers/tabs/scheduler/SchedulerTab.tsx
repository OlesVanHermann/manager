// ============================================================
// NUMBER SCHEDULER TAB - Plages horaires du numéro
// Target: target_.web-cloud.voip.number.scheduler.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { numbersService } from '../../numbers.service';
import { Tile, Badge, EmptyState } from '../../../components/RightPanel';
import type { NumberScheduler } from '../../numbers.types';
import './SchedulerTab.css';

interface SchedulerTabProps {
  billingAccount: string;
  serviceName: string;
}

export function SchedulerTab({ billingAccount, serviceName }: SchedulerTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/numbers/scheduler');
  const [schedulers, setSchedulers] = useState<NumberScheduler[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedulers();
  }, [billingAccount, serviceName]);

  const loadSchedulers = async () => {
    try {
      setLoading(true);
      const data = await numbersService.getSchedulers(billingAccount, serviceName);
      setSchedulers(data);
    } catch {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (schedulerId: number) => {
    if (!confirm(t('confirm.delete'))) return;

    try {
      await numbersService.deleteScheduler(billingAccount, serviceName, schedulerId);
      await loadSchedulers();
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.delete'));
    }
  };

  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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
          + {t('actions.addScheduler')}
        </button>
      </div>

      {/* Liste des plannings */}
      {schedulers.length > 0 ? (
        schedulers.map((scheduler) => (
          <Tile key={scheduler.id} title={scheduler.name}>
            <div className="scheduler-header">
              <Badge type={scheduler.status === 'enabled' ? 'success' : 'warning'}>
                {scheduler.status === 'enabled' ? t('status.enabled') : t('status.disabled')}
              </Badge>
              <div className="scheduler-header-actions">
                <button className="btn btn-sm btn-secondary">{t('actions.edit')}</button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(scheduler.id)}
                >
                  🗑️
                </button>
              </div>
            </div>

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
                      const condition = scheduler.timeConditions?.find(
                        (tc) => tc.weekDay === day && parseInt(tc.timeFrom) <= i && parseInt(tc.timeTo) > i
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
          </Tile>
        ))
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
