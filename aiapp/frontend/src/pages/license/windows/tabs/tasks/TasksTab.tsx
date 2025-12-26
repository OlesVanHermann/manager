// ============================================================
// WINDOWS TASKS TAB - Composant STRICTEMENT isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Task } from "../../windows.types";
import { getTasks } from "./TasksTab.service";
import "./TasksTab.css";

interface TasksTabProps {
  licenseId: string;
}

export default function TasksTab({ licenseId }: TasksTabProps) {
  const { t } = useTranslation("license/windows/tasks");
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
    return <div className="windows-tasks-loading-state">{tCommon("loading")}</div>;
  }

  return (
    <div className="windows-tasks-tab">
      <div className="windows-tasks-toolbar">
        <h2>{t("title")}</h2>
        <button className="windows-tasks-btn windows-tasks-btn-outline" onClick={loadTasks}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="windows-tasks-empty-state">{t("empty")}</div>
      ) : (
        <div className="windows-tasks-table-container">
          <table className="windows-tasks-table">
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
                    <span className={`windows-tasks-status-badge windows-tasks-status-${task.status}`}>
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
