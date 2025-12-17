// ============================================================
// TASKS TAB - Historique des tâches HSM
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as hsmService from "../../../../services/iam.hsm";

// ============================================================
// TYPES
// ============================================================

interface Task {
  id: string;
  function: string;
  status: "done" | "doing" | "todo" | "error" | "cancelled";
  startDate?: string;
  doneDate?: string;
  comment?: string;
}

interface TasksTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Historique des tâches effectuées sur le HSM. */
export default function TasksTab({ serviceId }: TasksTabProps) {
  const { t } = useTranslation("iam/hsm/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadTasks();
  }, [serviceId]);

  // ---------- LOADERS ----------
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hsmService.getTasks(serviceId);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getStatusIcon = (status: Task["status"]) => {
    const icons: Record<string, string> = {
      done: "✅",
      doing: "⏳",
      todo: "📋",
      error: "❌",
      cancelled: "🚫",
    };
    return icons[status] || "❓";
  };

  const getStatusBadge = (status: Task["status"]) => {
    const classes: Record<string, string> = {
      done: "badge-success",
      doing: "badge-info",
      todo: "badge-warning",
      error: "badge-error",
      cancelled: "badge-secondary",
    };
    return <span className={`status-badge ${classes[status]}`}>{t(`tasks.status.${status}`)}</span>;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("fr-FR");
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadTasks}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h2>{t("tasks.empty.title")}</h2>
        <p>{t("tasks.empty.description")}</p>
      </div>
    );
  }

  return (
    <div className="tasks-tab">
      <div className="tab-toolbar">
        <h2>{t("tasks.title")}</h2>
        <button className="btn btn-outline" onClick={loadTasks}>{tCommon("actions.refresh")}</button>
      </div>

      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <span className="task-icon">{getStatusIcon(task.status)}</span>
            <div className="task-info">
              <div className="task-name">{task.function}</div>
              <div className="task-date">
                {task.startDate && <span>{t("tasks.started")}: {formatDate(task.startDate)}</span>}
                {task.doneDate && <span> • {t("tasks.completed")}: {formatDate(task.doneDate)}</span>}
              </div>
              {task.comment && <div className="task-comment">{task.comment}</div>}
            </div>
            <div className="task-status">{getStatusBadge(task.status)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
