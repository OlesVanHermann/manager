// ============================================================
// WORDPRESS TAB: TASKS
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { tasksService } from './TasksTab.service';
import type { WordPressTask } from '../../wordpress.types';
import './TasksTab.css';

interface Props {
  serviceName: string;
}

const POLL_INTERVAL = 30000;

export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  const [tasks, setTasks] = useState<WordPressTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const loadTasks = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await tasksService.listTasks(serviceName);
      setTasks(data || []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => loadTasks(false), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [autoRefresh, loadTasks]);

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { className: string; label: string; icon: string }> = {
      todo: { className: 'tasks-badge tasks-badge-warning', label: t('tasks.statusTodo'), icon: '⏳' },
      init: { className: 'tasks-badge tasks-badge-info', label: t('tasks.statusInit'), icon: '🔄' },
      doing: { className: 'tasks-badge tasks-badge-info', label: t('tasks.statusDoing'), icon: '⚙️' },
      done: { className: 'tasks-badge tasks-badge-success', label: t('tasks.statusDone'), icon: '✅' },
      error: { className: 'tasks-badge tasks-badge-error', label: t('tasks.statusError'), icon: '❌' },
      cancelled: { className: 'tasks-badge tasks-badge-inactive', label: t('tasks.statusCancelled'), icon: '🚫' },
    };
    return statusMap[status] || { className: 'tasks-badge', label: status, icon: '❓' };
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFunction = (fn: string) => {
    const functionMap: Record<string, string> = {
      'wordpress/install': t('tasks.fnInstall'),
      'wordpress/update': t('tasks.fnUpdate'),
      'plugin/update': t('tasks.fnPluginUpdate'),
      'theme/update': t('tasks.fnThemeUpdate'),
      'backup/create': t('tasks.fnBackupCreate'),
      'backup/restore': t('tasks.fnBackupRestore'),
      'cache/flush': t('tasks.fnCacheFlush'),
      'ssl/configure': t('tasks.fnSslConfigure'),
      'cdn/enable': t('tasks.fnCdnEnable'),
      'cdn/disable': t('tasks.fnCdnDisable'),
    };
    return functionMap[fn] || fn;
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return ['todo', 'init', 'doing'].includes(task.status);
    if (filter === 'completed') return ['done', 'error', 'cancelled'].includes(task.status);
    return true;
  });

  const pendingCount = tasks.filter(t => ['todo', 'init', 'doing'].includes(t.status)).length;

  if (loading) {
    return <div className="tasks-loading">{t('common.loading')}</div>;
  }

  if (error) {
    return (
      <div className="tasks-error">
        <p>{error}</p>
        <button className="btn btn-outline btn-sm" onClick={() => loadTasks()}>
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="tasks-tab">
      {/* Header */}
      <div className="tasks-header">
        <div>
          <h3>{t('tasks.title')}</h3>
          {pendingCount > 0 && (
            <span className="tasks-pending-badge">
              {pendingCount} {t('tasks.pending')}
            </span>
          )}
        </div>
        <div className="tasks-actions">
          <label className="tasks-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={e => setAutoRefresh(e.target.checked)}
            />
            <span>{t('tasks.autoRefresh')}</span>
          </label>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => loadTasks()}
            title={t('tasks.refresh')}
          >
            ↻ {t('common.refresh')}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="tasks-filters">
        <button
          className={`tasks-filter ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {t('tasks.filterAll')} ({tasks.length})
        </button>
        <button
          className={`tasks-filter ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          {t('tasks.filterPending')} ({pendingCount})
        </button>
        <button
          className={`tasks-filter ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          {t('tasks.filterCompleted')} ({tasks.length - pendingCount})
        </button>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="tasks-empty">
          <span className="tasks-empty-icon">✅</span>
          <h4>{t('tasks.empty')}</h4>
          <p>{t('tasks.emptyHint')}</p>
        </div>
      ) : (
        <div className="tasks-list">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>{t('tasks.operation')}</th>
                <th>{t('tasks.status')}</th>
                <th>{t('tasks.started')}</th>
                <th>{t('tasks.finished')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => {
                const status = getStatusInfo(task.status);
                return (
                  <tr key={task.id} className={task.status === 'doing' ? 'tasks-row-active' : ''}>
                    <td>
                      <div className="tasks-operation">
                        <span className="tasks-operation-icon">{status.icon}</span>
                        <span className="tasks-operation-name">{formatFunction(task.function)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={status.className}>{status.label}</span>
                    </td>
                    <td className="tasks-date">{formatDate(task.startDate)}</td>
                    <td className="tasks-date">{formatDate(task.doneDate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Info */}
      <div className="tasks-info">
        <span className="tasks-info-icon">ℹ️</span>
        <p>{t('tasks.info')}</p>
      </div>
    </div>
  );
}

export default TasksTab;
