// ============================================================
// PLESK TASKS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Task } from "../../plesk.types";
import { getTasks, formatDate, getStatusIcon } from "./TasksTab.service";
import "./TasksTab.css";

interface TasksTabProps {
  licenseId: string;
}

export default function TasksTab({ licenseId }: TasksTabProps) {
  const { t } = useTranslation("license/plesk/tasks");
  const { t: tCommon } = useTranslation("common");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, [licenseId]);

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

  if (loading) {
    return <div className="plesk-tasks-loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="plesk-tasks-error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadTasks}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  return (
    <div className="plesk-tasks-tab">
      <div className="plesk-tasks-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadTasks}>{tCommon("actions.refresh")}</button>
      </div>

      {tasks.length === 0 ? (
        <div className="plesk-tasks-empty">
          <p>{t("empty")}</p>
        </div>
      ) : (
        <table className="plesk-tasks-table">
          <thead>
            <tr>
              <th>{t("columns.id")}</th>
              <th>{t("columns.action")}</th>
              <th>{t("columns.status")}</th>
              <th>{t("columns.startDate")}</th>
              <th>{t("columns.doneDate")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.action}</td>
                <td>
                  <span className={`plesk-tasks-status-badge ${getStatusBadgeClass(task.status)}`}>
                    {getStatusIcon(task.status)} {t(`status.${task.status}`)}
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
