// ============================================================
// HOSTING TAB: TASKS - Tâches en cours (selon old manager)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, HostingTask } from "../../../../../services/web-cloud.hosting";

interface Props { serviceName: string; }

const POLL_INTERVAL = 30000;

/** Onglet Tâches en cours avec colonnes exactes old manager. */
export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [tasks, setTasks] = useState<HostingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadTasks = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const ids = await hostingService.listTasks(serviceName);
      const data = await Promise.all(ids.slice(0, 50).map(id => hostingService.getTask(serviceName, id)));
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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="tasks-tab">
      <div className="tab-header">
        <div>
          <h3>{t("tasks.title")}</h3>
        </div>
        <div className="tab-actions">
          <button className="btn-icon" onClick={() => loadTasks()} title={t("tasks.refresh")}>
            ↻
          </button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Tâche</th>
            <th>Statut</th>
            <th>Date de création</th>
            <th>Date de fin</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-muted" style={{ padding: 'var(--space-8)' }}>
                Aucun résultat
              </td>
            </tr>
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
