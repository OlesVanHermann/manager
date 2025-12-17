// ============================================================
// TASKS TAB - Historique des tâches licence (réutilisable)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as licenseService from "../../../../services/license";

// ============================================================
// TYPES
// ============================================================

interface Task {
  id: number;
  action: string;
  status: "done" | "doing" | "todo" | "error" | "cancelled";
  startDate?: string;
  doneDate?: string;
}

interface TasksTabProps {
  licenseId: string;
  licenseType: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Historique des tâches d'une licence. */
export default function TasksTab({ licenseId, licenseType }: TasksTabProps) {
  const { t } = useTranslation("license/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadTasks();
  }, [licenseId]);

  // ---------- LOADERS ----------
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await licenseService.getTasks(licenseType, licenseId);
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

      <table className="license-table">
        <thead>
          <tr>
            <th>{t("tasks.columns.action")}</th>
            <th>{t("tasks.columns.status")}</th>
            <th>{t("tasks.columns.started")}</th>
            <th>{t("tasks.columns.completed")}</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <span style={{ marginRight: "var(--space-2)" }}>{getStatusIcon(task.status)}</span>
                {task.action}
              </td>
              <td>{getStatusBadge(task.status)}</td>
              <td>{formatDate(task.startDate)}</td>
              <td>{formatDate(task.doneDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
