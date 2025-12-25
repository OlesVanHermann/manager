// ############################################################
// #  NASHA/TASKS - COMPOSANT STRICTEMENT ISOLÉ               #
// #  CSS LOCAL : ./TasksTab.css                              #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tasksService } from "./TasksTab";
import type { NashaTask } from "../../nasha.types";
import "./TasksTab.css";

interface TasksTabProps { serviceId: string; }

const formatDate = (date: string): string => new Date(date).toLocaleString("fr-FR");

export default function TasksTab({ serviceId }: TasksTabProps) {
  const { t } = useTranslation("bare-metal/nasha/index");
  const { t: tCommon } = useTranslation("common");
  const [tasks, setTasks] = useState<NashaTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadTasks(); }, [serviceId]);

  const loadTasks = async () => {
    try {
      setLoading(true); setError(null);
      const data = await tasksService.getTasks(serviceId);
      setTasks(data);
    } catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="nasha-tasks-loading">{tCommon("loading")}</div>;
  if (error) return <div className="nasha-tasks-error"><p>{error}</p><button className="btn btn-primary" onClick={loadTasks}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="nasha-tasks-tab">
      <div className="nasha-tasks-toolbar">
        <h2>{t("tasks.title")}</h2>
        <button className="btn btn-outline" onClick={loadTasks}>{tCommon("actions.refresh")}</button>
      </div>

      {tasks.length === 0 ? (
        <div className="nasha-tasks-empty"><h2>{t("tasks.empty.title")}</h2><p>{t("tasks.empty.description")}</p></div>
      ) : (
        <table className="nasha-tasks-table">
          <thead><tr><th>{t("tasks.columns.operation")}</th><th>{t("tasks.columns.partition")}</th><th>{t("tasks.columns.status")}</th><th>{t("tasks.columns.started")}</th><th>{t("tasks.columns.completed")}</th></tr></thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.taskId}>
                <td>{task.operation}</td>
                <td>{task.partitionName || "-"}</td>
                <td><span className={`nasha-tasks-status-badge ${task.status}`}>{task.status}</span></td>
                <td>{formatDate(task.startDate)}</td>
                <td>{task.doneDate ? formatDate(task.doneDate) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
