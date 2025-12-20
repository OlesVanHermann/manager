// ============================================================
// TAB: TASKS - Liste des tâches avec actions
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { domainsService, DomainTask } from "../../../../services/web-cloud.domains";

interface Props {
  domain: string;
}

// ============ ICONS ============

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const FastForwardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 19 22 12 13 5 13 19"/><polygon points="2 19 11 12 2 5 2 19"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

// ============ COMPOSANT PRINCIPAL ============

export function TasksTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");

  // ---------- STATE ----------
  const [tasks, setTasks] = useState<DomainTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // ---------- LOAD DATA ----------
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const ids = await domainsService.listTasks(domain, filterStatus || undefined);
      if (ids.length === 0) {
        setTasks([]);
        return;
      }
      const details = await Promise.all(ids.map((id) => domainsService.getTask(domain, id)));
      // Sort by creation date desc
      details.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
      setTasks(details);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [domain, filterStatus]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // ---------- ACTIONS ----------
  const handleAccelerate = async (task: DomainTask) => {
    try {
      setActionLoading(task.id);
      await domainsService.accelerateTask(domain, task.id);
      await loadTasks();
    } catch (err) {
      setError(String(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (task: DomainTask) => {
    try {
      setActionLoading(task.id);
      await domainsService.cancelTask(domain, task.id);
      await loadTasks();
    } catch (err) {
      setError(String(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleRelaunch = async (task: DomainTask) => {
    try {
      setActionLoading(task.id);
      await domainsService.relaunchTask(domain, task.id);
      await loadTasks();
    } catch (err) {
      setError(String(err));
    } finally {
      setActionLoading(null);
    }
  };

  // ---------- HELPERS ----------
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'done': return 'status-done';
      case 'doing': return 'status-doing';
      case 'todo': return 'status-todo';
      case 'error': return 'status-error';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="tasks-tab">
      {/* Header */}
      <div className="tab-header">
        <div>
          <h3>{t("tasks.title")}</h3>
          <p className="tab-description">{t("tasks.description")}</p>
        </div>
        <div className="tab-header-actions">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">{t("tasks.allStatus")}</option>
            <option value="todo">{t("tasks.todo")}</option>
            <option value="doing">{t("tasks.doing")}</option>
            <option value="done">{t("tasks.statusDone")}</option>
            <option value="error">{t("tasks.error")}</option>
          </select>
          <button className="btn-secondary" onClick={loadTasks} title={t("tasks.refresh")}>
            <RefreshIcon />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="error-banner">{error}</div>}

      {/* Count */}
      {tasks.length > 0 && (
        <div className="tasks-count">{tasks.length} {t("tasks.count")}</div>
      )}

      {/* Empty state */}
      {tasks.length === 0 && !error ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          <h3>{t("tasks.empty")}</h3>
        </div>
      ) : (
        /* Tasks table */
        <div className="tasks-table-wrapper">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>{t("tasks.function")}</th>
                <th>{t("tasks.status")}</th>
                <th>{t("tasks.created")}</th>
                <th>{t("tasks.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <span className="task-function">{task.function}</span>
                    {task.comment && <span className="task-comment">{task.comment}</span>}
                  </td>
                  <td>
                    <span className={`task-status ${getStatusBadgeClass(task.status)}`}>
                      {t(`tasks.status_${task.status}`, task.status)}
                    </span>
                  </td>
                  <td className="task-date">{formatDate(task.creationDate)}</td>
                  <td className="task-actions">
                    {task.canAccelerate && (
                      <button
                        className="btn-icon btn-icon-small"
                        onClick={() => handleAccelerate(task)}
                        disabled={actionLoading === task.id}
                        title={t("tasks.accelerate")}
                      >
                        <FastForwardIcon />
                      </button>
                    )}
                    {task.canRelaunch && (
                      <button
                        className="btn-icon btn-icon-small"
                        onClick={() => handleRelaunch(task)}
                        disabled={actionLoading === task.id}
                        title={t("tasks.relaunch")}
                      >
                        <PlayIcon />
                      </button>
                    )}
                    {task.canCancel && (
                      <button
                        className="btn-icon btn-icon-small btn-icon-danger"
                        onClick={() => handleCancel(task)}
                        disabled={actionLoading === task.id}
                        title={t("tasks.cancel")}
                      >
                        <XIcon />
                      </button>
                    )}
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

export default TasksTab;
