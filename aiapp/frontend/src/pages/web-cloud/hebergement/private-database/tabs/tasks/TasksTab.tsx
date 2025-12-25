// ============================================================
// PRIVATE DATABASE TAB: TASKS - Tâches en cours
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { tasksService } from "./TasksTab";
import type { PdbTask } from "../../private-database.types";
import "./TasksTab.css";

interface Props { serviceName: string; }

const POLL_INTERVAL = 30000;

export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [tasks, setTasks] = useState<PdbTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadTasks = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const ids = await tasksService.listTasks(serviceName);
      const data = await Promise.all(ids.slice(0, 50).map(id => tasksService.getTask(serviceName, id)));
      data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      setTasks(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => loadTasks(false), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [autoRefresh, loadTasks]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { class: string; label: string }> = {
      todo: { class: 'warning', label: 'À faire' },
      init: { class: 'info', label: 'Initialisation' },
      doing: { class: 'info', label: 'En cours' },
      done: { class: 'success', label: 'Terminé' },
      error: { class: 'error', label: 'Erreur' },
      cancelled: { class: 'inactive', label: 'Annulé' },
    };
    const s = map[status] || { class: 'inactive', label: status };
    return <span className={`badge ${s.class}`}>{s.label}</span>;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="tasks-tab">
      <div className="tasks-header">
        <h3>{t("tasks.title")}</h3>
        <div className="tasks-actions">
          <label className="tasks-checkbox-label">
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
            {t("tasks.autoRefresh")}
          </label>
          <button className="btn-icon" onClick={() => loadTasks()} title={t("tasks.refresh")}>↻</button>
        </div>
      </div>

      <table className="tasks-table">
        <thead>
          <tr>
            <th>{t("tasks.function")}</th>
            <th>{t("tasks.status")}</th>
            <th>{t("tasks.started")}</th>
            <th>{t("tasks.finished")}</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr><td colSpan={4} className="tasks-empty">{t("tasks.empty")}</td></tr>
          ) : (
            tasks.map(task => (
              <tr key={task.id}>
                <td className="font-mono">{task.function}</td>
                <td>{getStatusBadge(task.status)}</td>
                <td>{formatDate(task.startDate)}</td>
                <td>{formatDate(task.doneDate)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TasksTab;
