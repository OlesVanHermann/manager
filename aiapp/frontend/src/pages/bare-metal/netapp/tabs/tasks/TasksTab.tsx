// ############################################################
// #  NETAPP/TASKS - COMPOSANT STRICTEMENT ISOLÉ              #
// ############################################################
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tasksService } from "./TasksTab";
import type { NetAppTask } from "../../netapp.types";
import "./TasksTab.css";

interface TasksTabProps { serviceId: string; }
const formatDate = (date: string): string => new Date(date).toLocaleString("fr-FR");

export default function TasksTab({ serviceId }: TasksTabProps) {
  const { t } = useTranslation("bare-metal/netapp/index");
  const { t: tCommon } = useTranslation("common");
  const [tasks, setTasks] = useState<NetAppTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadTasks(); }, [serviceId]);
  const loadTasks = async () => {
    try { setLoading(true); setError(null); setTasks(await tasksService.getTasks(serviceId)); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="netapp-tasks-loading">{tCommon("loading")}</div>;
  if (error) return <div className="netapp-tasks-error"><p>{error}</p><button className="btn btn-primary" onClick={loadTasks}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="netapp-tasks-tab">
      <div className="netapp-tasks-toolbar"><h2>{t("tasks.title")}</h2><button className="btn btn-outline" onClick={loadTasks}>{tCommon("actions.refresh")}</button></div>
      {tasks.length === 0 ? <div className="netapp-tasks-empty"><h2>{t("tasks.empty.title")}</h2></div> : (
        <table className="netapp-tasks-table">
          <thead><tr><th>{t("tasks.columns.type")}</th><th>{t("tasks.columns.status")}</th><th>{t("tasks.columns.progress")}</th><th>{t("tasks.columns.created")}</th><th>{t("tasks.columns.finished")}</th></tr></thead>
          <tbody>{tasks.map((task) => (<tr key={task.id}><td>{task.type}</td><td><span className={`netapp-tasks-status-badge ${task.status}`}>{task.status}</span></td><td>{task.progress}%</td><td>{formatDate(task.createdAt)}</td><td>{task.finishedAt ? formatDate(task.finishedAt) : "-"}</td></tr>))}</tbody>
        </table>
      )}
    </div>
  );
}
