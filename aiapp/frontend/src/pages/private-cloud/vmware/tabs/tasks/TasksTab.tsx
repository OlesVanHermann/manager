import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tasksService, getTaskStateBadgeClass } from "./TasksTab.service";
import type { Task } from "../../vmware.types";
import "./TasksTab.css";

export default function TasksTab({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation("private-cloud/vmware/tasks");
  const { t: tCommon } = useTranslation("common");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadData(); }, [serviceId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setTasks(await tasksService.getTasks(serviceId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadData}>{tCommon("actions.retry")}</button></div>;
  if (!tasks.length) return <div className="tasks-empty"><h2>{t("empty.title")}</h2><p>{t("empty.description")}</p></div>;

  return (
    <div className="tasks-tab">
      <div className="tasks-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadData}>{tCommon("actions.refresh")}</button>
      </div>
      <table className="tasks-table">
        <thead>
          <tr>
            <th>{t("columns.name")}</th>
            <th>{t("columns.state")}</th>
            <th>{t("columns.progress")}</th>
            <th>{t("columns.started")}</th>
            <th>{t("columns.ended")}</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.taskId}>
              <td><strong>{task.name}</strong></td>
              <td><span className={`status-badge ${getTaskStateBadgeClass(task.state)}`}>{t(`states.${task.state}`)}</span></td>
              <td>
                <div className="tasks-progress">
                  <div className="tasks-progress-bar">
                    <div className="tasks-progress-fill" style={{ width: `${task.progress}%` }}></div>
                  </div>
                  <span>{task.progress}%</span>
                </div>
              </td>
              <td>{formatDate(task.startedAt)}</td>
              <td>{formatDate(task.endedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
