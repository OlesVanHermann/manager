// ============================================================
// CLOUD CONNECT Tasks Tab - Composant STRICTEMENT isolé
// Préfixe CSS: .cloudconnect-tasks-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { CloudConnectTask } from "../../cloud-connect.types";
import { cloudconnectTasksService } from "./TasksTab.service";
import "./TasksTab.css";

interface TasksTabProps {
  serviceId: string;
}

export default function TasksTab({ serviceId }: TasksTabProps) {
  const { t } = useTranslation("network/cloud-connect/tasks");
  const { t: tCommon } = useTranslation("common");
  const [tasks, setTasks] = useState<CloudConnectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, [serviceId]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cloudconnectTasksService.getTasks(serviceId);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="cloudconnect-tasks-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="cloudconnect-tasks-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadTasks}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="cloudconnect-tasks-tab">
      <div className="cloudconnect-tasks-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadTasks}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="cloudconnect-tasks-empty">
          <h2>{t("empty.title")}</h2>
        </div>
      ) : (
        <table className="cloudconnect-tasks-table">
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
                  <span className="cloudconnect-tasks-function">{task.function}</span>
                </td>
                <td>
                  <span
                    className={`cloudconnect-tasks-status-badge ${cloudconnectTasksService.getStatusBadgeClass(task.status)}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td>
                  <span className="cloudconnect-tasks-date">
                    {cloudconnectTasksService.formatDate(task.startDate)}
                  </span>
                </td>
                <td>
                  <span className="cloudconnect-tasks-date">
                    {task.doneDate ? cloudconnectTasksService.formatDate(task.doneDate) : "-"}
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
