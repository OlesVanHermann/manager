// ============================================================
// SQLSERVER TASKS TAB - Composant STRICTEMENT isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Task } from "../../sqlserver.types";
import { getTasks } from "./TasksTab.service";
import "./TasksTab.css";

interface TasksTabProps {
  licenseId: string;
}

export default function TasksTab({ licenseId }: TasksTabProps) {
  const { t } = useTranslation("license/sqlserver/tasks");
  const { t: tCommon } = useTranslation("common");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks(licenseId);
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [licenseId]);

  if (loading) {
    return <div className="sqlserver-tasks-loading-state">{tCommon("loading")}</div>;
  }

  return (
    <div className="sqlserver-tasks-tab">
      <div className="sqlserver-tasks-toolbar">
        <h2>{t("title")}</h2>
        <button className="sqlserver-tasks-btn sqlserver-tasks-btn-outline" onClick={loadTasks}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="sqlserver-tasks-empty-state">{t("empty")}</div>
      ) : (
        <div className="sqlserver-tasks-table-container">
          <table className="sqlserver-tasks-table">
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
                    <span className={`sqlserver-tasks-status-badge sqlserver-tasks-status-${task.status}`}>
                      {t(`status.${task.status}`)}
                    </span>
                  </td>
                  <td>{task.startDate ? new Date(task.startDate).toLocaleString("fr-FR") : "-"}</td>
                  <td>{task.doneDate ? new Date(task.doneDate).toLocaleString("fr-FR") : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
