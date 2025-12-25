// ============================================================
// CDN Tasks Tab - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { CdnTask } from "../../cdn.types";
import { tasksService } from "./TasksTab.service";
import "./TasksTab.css";

interface TasksTabProps {
  serviceId: string;
}

export default function TasksTab({ serviceId }: TasksTabProps) {
  const { t } = useTranslation("network/cdn/index");
  const { t: tCommon } = useTranslation("common");
  const [tasks, setTasks] = useState<CdnTask[]>([]);
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
        <h2>{t("tasks.title")}</h2>
        <button className="btn btn-outline" onClick={loadTasks}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="tasks-empty">
          <h2>{t("tasks.empty.title")}</h2>
        </div>
      ) : (
        <table className="tasks-table">
          <thead>
            <tr>
              <th>{t("tasks.columns.function")}</th>
              <th>{t("tasks.columns.status")}</th>
              <th>{t("tasks.columns.started")}</th>
              <th>{t("tasks.columns.completed")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <span className="tasks-function">{task.function}</span>
                </td>
                <td>
                  <span
                    className={`tasks-status-badge ${tasksService.getStatusBadgeClass(task.status)}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td>
                  <span className="tasks-date">
                    {tasksService.formatDate(task.startDate)}
                  </span>
                </td>
                <td>
                  <span className="tasks-date">
                    {task.doneDate ? tasksService.formatDate(task.doneDate) : "-"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
