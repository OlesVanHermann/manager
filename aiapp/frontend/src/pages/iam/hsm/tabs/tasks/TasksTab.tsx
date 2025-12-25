// ============================================================
// TASKS TAB - Historique des tâches HSM
// ============================================================
// ⚠️ DÉFACTORISÉ : Imports locaux uniquement
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as tasksService from "./TasksTab.service";
import type { Task } from "../hsm.types";
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

/** Historique des tâches effectuées sur le HSM. */
export default function TasksTab({ serviceId }: TasksTabProps) {
  const { t } = useTranslation("iam/hsm/tasks");
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
    return <div className="tasks-loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="tasks-error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadTasks}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="tasks-empty-state">
        <h2>{t("empty.title")}</h2>
        <p>{t("empty.description")}</p>
      </div>
    );
  }

  return (
    <div className="tasks-tab">
      <div className="tasks-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadTasks}>{tCommon("actions.refresh")}</button>
      </div>

      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className="tasks-item">
            <span className="tasks-icon">{tasksService.getStatusIcon(task.status)}</span>
            <div className="tasks-info">
              <div className="tasks-name">{task.function}</div>
              <div className="tasks-date">
                {task.startDate && <span>{t("started")}: {tasksService.formatDateTime(task.startDate)}</span>}
                {task.doneDate && <span> • {t("completed")}: {tasksService.formatDateTime(task.doneDate)}</span>}
              </div>
              {task.comment && <div className="tasks-comment">{task.comment}</div>}
            </div>
            <div className="tasks-status">{getStatusBadge(task.status)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
