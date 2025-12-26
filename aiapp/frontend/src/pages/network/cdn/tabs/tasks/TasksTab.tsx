// ============================================================
// CDN Tasks Tab - Composant STRICTEMENT isolé
// Préfixe CSS: .cdn-tasks-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { CdnTask } from "../../cdn.types";
import { cdnTasksService } from "./TasksTab.service";
import "./TasksTab.css";

interface TasksTabProps {
  serviceId: string;
}

export default function TasksTab({ serviceId }: TasksTabProps) {
  const { t } = useTranslation("network/cdn/tasks");
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
      const data = await cdnTasksService.getTasks(serviceId);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="cdn-tasks-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="cdn-tasks-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadTasks}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="cdn-tasks-tab">
      <div className="cdn-tasks-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadTasks}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="cdn-tasks-empty">
          <h2>{t("empty.title")}</h2>
        </div>
      ) : (
        <table className="cdn-tasks-table">
          <thead>
            <tr>
              <th>{t("columns.function")}</th>
              <th>{t("columns.status")}</th>
              <th>{t("columns.started")}</th>
              <th>{t("columns.completed")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <span className="cdn-tasks-function">{task.function}</span>
                </td>
                <td>
                  <span
                    className={`cdn-tasks-status-badge ${cdnTasksService.getStatusBadgeClass(task.status)}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td>
                  <span className="cdn-tasks-date">
                    {cdnTasksService.formatDate(task.startDate)}
                  </span>
                </td>
                <td>
                  <span className="cdn-tasks-date">
                    {task.doneDate ? cdnTasksService.formatDate(task.doneDate) : "-"}
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
