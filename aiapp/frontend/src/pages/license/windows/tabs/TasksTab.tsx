// ============================================================
// WINDOWS TASKS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Task } from "../../license.types";
import { getTasks, formatDate, getStatusIcon } from "./TasksTab";
import "./TasksTab.css";

// ============================================================
// TYPES
// ============================================================

interface TasksTabProps {
  licenseId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Historique des tâches d'une licence Windows. */
export default function TasksTab({ licenseId }: TasksTabProps) {
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
      const data = await getTasks(licenseId);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getStatusBadgeClass = (status: Task["status"]) => {
    const classes: Record<string, string> = {
      done: "badge-success",
      doing: "badge-info",
      todo: "badge-warning",
      error: "badge-error",
      cancelled: "badge-secondary",
    };
    return classes[status] || "";
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

  return (
    <div className="windows-tasks-tab">
      <div className="windows-tasks-toolbar">
        <h2>{t("tasks.title")}</h2>
        <button className="btn btn-outline" onClick={loadTasks}>{tCommon("actions.refresh")}</button>
      </div>

      {tasks.length === 0 ? (
        <div className="windows-tasks-empty">
          <p>{t("tasks.empty")}</p>
        </div>
      ) : (
        <table className="windows-tasks-table">
          <thead>
            <tr>
              <th>{t("tasks.columns.id")}</th>
              <th>{t("tasks.columns.action")}</th>
              <th>{t("tasks.columns.status")}</th>
              <th>{t("tasks.columns.startDate")}</th>
              <th>{t("tasks.columns.doneDate")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.action}</td>
                <td>
                  <span className={`windows-tasks-status-badge ${getStatusBadgeClass(task.status)}`}>
                    {getStatusIcon(task.status)} {t(`tasks.status.${task.status}`)}
                  </span>
                </td>
                <td>{formatDate(task.startDate)}</td>
                <td>{formatDate(task.doneDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
