// ============================================================
// TASKS TAB - Historique des tâches Metrics
// ============================================================
// ⚠️ DÉFACTORISÉ : Imports locaux uniquement
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as tasksService from "./TasksTab.service";
import type { Task } from "../metrics.types";
import "./TasksTab.css";

// ============================================================
// TYPES
// ============================================================

interface TasksTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Historique des tâches du service Metrics. */
export default function TasksTab({ serviceId }: TasksTabProps) {
  const { t } = useTranslation("iam/metrics/tasks");
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
      const data = await tasksService.getTasks(serviceId);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getStatusBadge = (status: Task["status"]) => {
    const classes: Record<string, string> = {
      done: "badge-success",
      doing: "badge-info",
      todo: "badge-warning",
      error: "badge-error",
      cancelled: "badge-secondary",
    };
    return <span className={`tasks-status-badge ${classes[status]}`}>{t(`tasks.status.${status}`)}</span>;
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="metrics-tasks-loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="metrics-tasks-error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadTasks}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="metrics-tasks-empty-state">
        <h2>{t("empty.title")}</h2>
        <p>{t("empty.description")}</p>
      </div>
    );
  }

  return (
    <div className="metrics-tasks-tab">
      <div className="metrics-tasks-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadTasks}>{tCommon("actions.refresh")}</button>
      </div>

      <div className="metrics-tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className="metrics-tasks-item">
            <span className="metrics-tasks-icon">{tasksService.getStatusIcon(task.status)}</span>
            <div className="metrics-tasks-info">
              <div className="metrics-tasks-name">{task.function}</div>
              <div className="metrics-tasks-date">
                {task.startDate && <span>{t("started")}: {tasksService.formatDateTime(task.startDate)}</span>}
                {task.doneDate && <span> • {t("completed")}: {tasksService.formatDateTime(task.doneDate)}</span>}
              </div>
            </div>
            <div className="metrics-tasks-status">{getStatusBadge(task.status)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
