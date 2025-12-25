// ############################################################
// #  VPS/TASKS - COMPOSANT STRICTEMENT ISOLÉ                 #
// ############################################################
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tasksService } from "./TasksTab";
import type { VpsTask } from "../../vps.types";
import "./TasksTab.css";

interface Props { serviceName: string; }
const formatDateTime = (date: string): string => new Date(date).toLocaleString();
const getStatusInfo = (state: string): { className: string; icon: string } => {
  const map: Record<string, { className: string; icon: string }> = { todo: { className: "warning", icon: "⏳" }, doing: { className: "info", icon: "🔄" }, done: { className: "success", icon: "✓" }, error: { className: "error", icon: "✗" }, cancelled: { className: "inactive", icon: "⊘" }, paused: { className: "warning", icon: "⏸" } };
  return map[state] || { className: "inactive", icon: "?" };
};

export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/vps/index");
  const [tasks, setTasks] = useState<VpsTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const ids = await tasksService.listTasks(serviceName); const data = await Promise.all(ids.slice(0, 50).map((id) => tasksService.getTask(serviceName, id))); data.sort((a, b) => (b.startDate ? new Date(b.startDate).getTime() : 0) - (a.startDate ? new Date(a.startDate).getTime() : 0)); setTasks(data); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="vps-tasks-tab"><div className="vps-tasks-loading"><div className="vps-tasks-skeleton" style={{ width: "100%" }} /><div className="vps-tasks-skeleton" style={{ width: "80%" }} /></div></div>;

  return (
    <div className="vps-tasks-tab">
      <div className="vps-tasks-header"><h3>{t("tasks.title")}</h3></div>
      {tasks.length === 0 ? <div className="vps-tasks-empty"><p>{t("tasks.empty")}</p></div> : (
        <table className="vps-tasks-table">
          <thead><tr><th>{t("tasks.type")}</th><th>{t("tasks.state")}</th><th>{t("tasks.progress")}</th><th>{t("tasks.started")}</th><th>{t("tasks.done")}</th></tr></thead>
          <tbody>{tasks.map((task) => { const statusInfo = getStatusInfo(task.state); return (<tr key={task.id}><td className="mono">{task.type}</td><td><span className={`vps-tasks-badge ${statusInfo.className}`}>{statusInfo.icon} {task.state}</span></td><td>{task.progress}%</td><td>{task.startDate ? formatDateTime(task.startDate) : "-"}</td><td>{task.doneDate ? formatDateTime(task.doneDate) : "-"}</td></tr>); })}</tbody>
        </table>
      )}
    </div>
  );
}
export default TasksTab;
