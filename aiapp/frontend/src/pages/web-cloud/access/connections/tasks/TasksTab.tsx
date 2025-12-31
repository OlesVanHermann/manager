// ============================================================
// TASKS TAB - Historique des tâches
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connectionsService } from "../connections.service";
import type { Task } from "../connections.types";
import "./TasksTab.css";

interface TasksTabProps {
  connectionId: string;
}

export function TasksTab({ connectionId }: TasksTabProps) {
  const { t } = useTranslation("web-cloud/access/connections");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await connectionsService.getTasks(connectionId);
        setTasks(data);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [connectionId]);

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case "done": return "✓";
      case "doing": return "⏳";
      case "todo": return "○";
      case "error": return "✗";
      default: return "○";
    }
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case "done": return "success";
      case "doing": return "progress";
      case "todo": return "pending";
      case "error": return "error";
      default: return "pending";
    }
  };

  const formatDate = (date: string): string => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredTasks = filter === "all"
    ? tasks
    : tasks.filter((t) => t.status === filter);

  if (loading) {
    return (
      <div className="tasks-tab">
        <div className="tasks-loading">
          <div className="spinner" />
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-tab">
        <div className="tasks-error">
          <p>{t("error")}: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-tab">
      {/* Header */}
      <div className="tasks-header">
        <h4>{t("tasks.title")}</h4>
        <div className="tasks-filters">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            {t("tasks.filters.all")} ({tasks.length})
          </button>
          <button
            className={`filter-btn ${filter === "doing" ? "active" : ""}`}
            onClick={() => setFilter("doing")}
          >
            {t("tasks.filters.doing")} ({tasks.filter((t) => t.status === "doing").length})
          </button>
          <button
            className={`filter-btn ${filter === "done" ? "active" : ""}`}
            onClick={() => setFilter("done")}
          >
            {t("tasks.filters.done")} ({tasks.filter((t) => t.status === "done").length})
          </button>
          <button
            className={`filter-btn ${filter === "error" ? "active" : ""}`}
            onClick={() => setFilter("error")}
          >
            {t("tasks.filters.error")} ({tasks.filter((t) => t.status === "error").length})
          </button>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className="tasks-list">
          {filteredTasks.map((task) => (
            <div key={task.id} className={`task-item ${getStatusClass(task.status)}`}>
              <div className="task-status">
                <span className={`status-icon ${getStatusClass(task.status)}`}>
                  {getStatusIcon(task.status)}
                </span>
              </div>
              <div className="task-info">
                <span className="task-type">{task.type}</span>
                {task.comment && (
                  <span className="task-comment">{task.comment}</span>
                )}
              </div>
              <div className="task-dates">
                <div className="task-date">
                  <span className="date-label">{t("tasks.created")}</span>
                  <span className="date-value">{formatDate(task.createdAt)}</span>
                </div>
                <div className="task-date">
                  <span className="date-label">{t("tasks.updated")}</span>
                  <span className="date-value">{formatDate(task.updatedAt)}</span>
                </div>
              </div>
              {task.progress !== undefined && task.status === "doing" && (
                <div className="task-progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${task.progress}%` }}
                  />
                  <span className="progress-text">{task.progress}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="tasks-empty">
          <span className="empty-icon">📋</span>
          <p>{t("tasks.empty")}</p>
        </div>
      )}

      {/* Refresh */}
      <div className="tasks-footer">
        <button
          className="btn-action"
          onClick={() => {
            setLoading(true);
            connectionsService.getTasks(connectionId).then(setTasks).finally(() => setLoading(false));
          }}
        >
          🔄 {t("tasks.refresh")}
        </button>
      </div>
    </div>
  );
}
