// ============================================================
// HOSTING TAB: TASKS - Tâches en cours
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Task } from "../../../../../services/web-cloud.hosting";

interface Props { serviceName: string; }

type TaskStatus = "done" | "doing" | "todo" | "error" | "cancelled" | "init";

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  done: { label: "Terminée", className: "success" },
  doing: { label: "En cours", className: "info" },
  todo: { label: "Planifiée", className: "warning" },
  init: { label: "En cours", className: "info" },
  error: { label: "En erreur", className: "error" },
  cancelled: { label: "Annulée", className: "inactive" },
};

export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await hostingService.listTasks(serviceName);
      const data = await Promise.all(ids.map(id => hostingService.getTask(serviceName, id)));
      // Tri par date de début décroissante
      data.sort((a, b) => new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime());
      setTasks(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  // Auto-refresh si tâches en cours
  useEffect(() => {
    const hasRunningTasks = tasks.some(t => t.status === "doing" || t.status === "init" || t.status === "todo");
    if (!hasRunningTasks) return;
    
    const interval = setInterval(loadTasks, 10000);
    return () => clearInterval(interval);
  }, [tasks, loadTasks]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status as TaskStatus] || { label: status, className: "inactive" };
    return <span className={`badge ${config.className}`}>{config.label}</span>;
  };

  if (loading) {
    return (
      <div className="tasks-tab">
        <div className="skeleton-block" style={{ height: "300px" }} />
      </div>
    );
  }

  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="tasks-tab">
      {/* Header */}
      <div className="tab-header">
        <div>
          <h3>{t("tasks.title")}</h3>
          <p className="tab-description">{t("tasks.description")}</p>
        </div>
        <div className="tab-actions">
          <button 
            className="btn btn-icon-only" 
            onClick={handleRefresh} 
            disabled={refreshing}
            title={t("tasks.refresh")}
          >
            {refreshing ? "⏳" : "↻"}
          </button>
        </div>
      </div>

      {/* Table */}
      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>{t("tasks.empty")}</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("tasks.function")}</th>
              <th>{t("tasks.status")}</th>
              <th>{t("tasks.startDate")}</th>
              <th>{t("tasks.doneDate")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.function || task.id}</td>
                <td>{getStatusBadge(task.status)}</td>
                <td>{formatDate(task.startDate)}</td>
                <td>{formatDate(task.doneDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Indicateur tâches en cours */}
      {tasks.some(t => t.status === "doing" || t.status === "init") && (
        <div className="info-banner" style={{ marginTop: "1rem" }}>
          <span className="info-icon">🔄</span>
          <span>Des tâches sont en cours d'exécution. Actualisation automatique toutes les 10 secondes.</span>
        </div>
      )}
    </div>
  );
}

export default TasksTab;
