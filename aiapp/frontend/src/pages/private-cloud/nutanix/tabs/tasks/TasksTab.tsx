// ============================================================
// TASKS TAB - Composant isolé pour Nutanix
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { NutanixTask } from "../../nutanix.types";
import {
  tasksService,
  getTaskStatusBadgeClass,
  formatDate,
  formatProgress,
} from "./TasksTab.service";
import "./TasksTab.css";

// ========================================
// TYPES LOCAUX
// ========================================

interface TasksTabProps {
  serviceId: string;
}

// ========================================
// HELPERS LOCAUX
// ========================================

const getProgressClass = (status: string): string => {
  if (status === "COMPLETED") return "completed";
  if (status === "FAILED") return "failed";
  return "";
};

// ========================================
// COMPOSANT
// ========================================

export default function TasksTab({ serviceId }: TasksTabProps) {
  const { t } = useTranslation("private-cloud/nutanix/tasks");
  const { t: tCommon } = useTranslation("common");

  const [tasks, setTasks] = useState<NutanixTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, [serviceId]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tasksService.getTasks(serviceId);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="tasks-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="tasks-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadTasks}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="tasks-tab">
      <div className="tasks-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadTasks}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="tasks-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="tasks-table">
          <thead>
            <tr>
              <th>{t("columns.name")}</th>
              <th>{t("columns.status")}</th>
              <th>{t("columns.progress")}</th>
              <th>{t("columns.started")}</th>
              <th>{t("columns.ended")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.taskId}>
                <td>
                  <div className="tasks-name">{task.name}</div>
                  <div className="tasks-id">{task.taskId}</div>
                </td>
                <td>
                  <span className={`status-badge ${getTaskStatusBadgeClass(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td>
                  <div className="tasks-progress">
                    <div className="tasks-progress-bar">
                      <div
                        className={`tasks-progress-fill ${getProgressClass(task.status)}`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="tasks-progress-text">
                      {formatProgress(task.progress)}
                    </span>
                  </div>
                </td>
                <td className="tasks-date">{formatDate(task.startDate)}</td>
                <td className="tasks-date">
                  {task.endDate ? formatDate(task.endDate) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
