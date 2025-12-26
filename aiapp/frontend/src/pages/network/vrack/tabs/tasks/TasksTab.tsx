// ============================================================
// VRACK Tasks Tab - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { VrackTask } from "../../vrack.types";
import { tasksService } from "./TasksTab.service";
import "./TasksTab.css";

interface TasksTabProps {
  serviceName: string;
}

export function TasksTab({ serviceName }: TasksTabProps) {
  const { t } = useTranslation("network/vrack/tasks");
  const [tasks, setTasks] = useState<VrackTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await tasksService.getAllTasks(serviceName);
        setTasks(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  if (loading) {
    return (
      <div className="tasks-loading">
        <div className="skeleton-block" />
      </div>
    );
  }

  return (
    <div className="tasks-tab">
      <div className="tasks-header">
        <h3>{t("title")}</h3>
      </div>

      {tasks.length === 0 ? (
        <div className="tasks-empty">
          <p>{t("empty")}</p>
        </div>
      ) : (
        <table className="tasks-table">
          <thead>
            <tr>
              <th>{t("function")}</th>
              <th>{t("target")}</th>
              <th>{t("status")}</th>
              <th>{t("updated")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="tasks-function">{task.function}</td>
                <td className="tasks-target">
                  {task.targetDomain || task.serviceName || "-"}
                </td>
                <td>
                  <span
                    className={`tasks-status-badge ${tasksService.getStatusBadgeClass(task.status)}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="tasks-date">
                  {tasksService.formatDate(task.lastUpdate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TasksTab;
