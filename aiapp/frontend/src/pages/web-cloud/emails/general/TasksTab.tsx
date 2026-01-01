// ============================================================
// TAB - Tasks (Tâches en cours et historique)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface TasksTabProps {
  domain?: string;
}

interface Task {
  id: string;
  type: string;
  description: string;
  status: "pending" | "running" | "done" | "error";
  progress: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

/** Onglet Tâches - Suivi des opérations en cours. */
export default function TasksTab({ domain }: TasksTabProps) {
  const { t } = useTranslation("web-cloud/emails/tasks");

  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all");

  // Mock data - remplacer par appel API
  const tasks: Task[] = useMemo(() => [
    {
      id: "1",
      type: "account_creation",
      description: "Création du compte user@example.com",
      status: "running",
      progress: 45,
      createdAt: "2024-01-15T14:30:00Z",
    },
    {
      id: "2",
      type: "migration",
      description: "Migration MX Plan → Exchange",
      status: "pending",
      progress: 0,
      createdAt: "2024-01-15T14:25:00Z",
    },
    {
      id: "3",
      type: "dns_update",
      description: "Mise à jour des enregistrements DNS",
      status: "done",
      progress: 100,
      createdAt: "2024-01-15T10:00:00Z",
      completedAt: "2024-01-15T10:05:00Z",
    },
    {
      id: "4",
      type: "account_deletion",
      description: "Suppression du compte old@example.com",
      status: "error",
      progress: 50,
      createdAt: "2024-01-14T16:00:00Z",
      error: "Compte verrouillé par l'administrateur",
    },
    {
      id: "5",
      type: "backup",
      description: "Sauvegarde des boîtes email",
      status: "done",
      progress: 100,
      createdAt: "2024-01-14T02:00:00Z",
      completedAt: "2024-01-14T04:30:00Z",
    },
  ], []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filterStatus === "active") {
        return t.status === "pending" || t.status === "running";
      }
      if (filterStatus === "completed") {
        return t.status === "done" || t.status === "error";
      }
      return true;
    });
  }, [tasks, filterStatus]);

  const activeTasks = tasks.filter((t) => t.status === "pending" || t.status === "running");

  const handleRetry = (task: Task) => {
  };

  const handleCancel = (task: Task) => {
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: "⏳",
      running: "🔄",
      done: "✓",
      error: "✗",
    };
    return icons[status] || "?";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "En attente",
      running: "En cours",
      done: "Terminé",
      error: "Erreur",
    };
    return labels[status] || status;
  };

  return (
    <div className="tasks-tab">
      {/* Summary */}
      {activeTasks.length > 0 && (
        <div className="tasks-summary">
          <span className="tasks-summary-icon">🔄</span>
          <span className="tasks-summary-text">
            {activeTasks.length} tâche{activeTasks.length > 1 ? "s" : ""} en cours
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="emails-toolbar">
        <div className="emails-toolbar-left">
          <div className="filter-chips">
            <button
              className={`filter-chip ${filterStatus === "all" ? "active" : ""}`}
              onClick={() => setFilterStatus("all")}
            >
              {t("filters.all")}
            </button>
            <button
              className={`filter-chip ${filterStatus === "active" ? "active" : ""}`}
              onClick={() => setFilterStatus("active")}
            >
              {t("filters.active")}
            </button>
            <button
              className={`filter-chip ${filterStatus === "completed" ? "active" : ""}`}
              onClick={() => setFilterStatus("completed")}
            >
              {t("filters.completed")}
            </button>
          </div>
        </div>
      </div>

      {/* Tasks list */}
      {filteredTasks.length === 0 ? (
        <div className="emails-empty">
          <div className="emails-empty-icon">📋</div>
          <h3 className="emails-empty-title">{t("empty.title")}</h3>
          <p className="emails-empty-text">{t("empty.description")}</p>
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map((task) => (
            <div key={task.id} className={`task-card ${task.status}`}>
              <div className="task-header">
                <div className="task-info">
                  <span className={`task-status-icon ${task.status}`}>
                    {getStatusIcon(task.status)}
                  </span>
                  <span className="task-description">{task.description}</span>
                </div>
                <span className={`status-badge ${task.status === "error" ? "suspended" : task.status === "done" ? "ok" : "pending"}`}>
                  {getStatusLabel(task.status)}
                </span>
              </div>

              {/* Progress bar for running tasks */}
              {task.status === "running" && (
                <div className="task-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{task.progress}%</span>
                </div>
              )}

              {/* Error message */}
              {task.status === "error" && task.error && (
                <div className="task-error">
                  <span className="error-icon">⚠</span>
                  <span className="error-message">{task.error}</span>
                </div>
              )}

              <div className="task-footer">
                <span className="task-date">
                  {t("fields.createdAt")}: {formatDate(task.createdAt)}
                  {task.completedAt && (
                    <> · {t("fields.completedAt")}: {formatDate(task.completedAt)}</>
                  )}
                </span>
                <div className="task-actions">
                  {task.status === "error" && (
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleRetry(task)}
                    >
                      {t("actions.retry")}
                    </button>
                  )}
                  {(task.status === "pending" || task.status === "running") && (
                    <button
                      className="btn btn-sm btn-outline btn-danger"
                      onClick={() => handleCancel(task)}
                    >
                      {t("actions.cancel")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
