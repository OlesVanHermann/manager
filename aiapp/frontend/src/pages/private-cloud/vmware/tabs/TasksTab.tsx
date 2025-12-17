import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as vmwareService from "../../../../services/private-cloud.vmware";

interface Task { taskId: number; name: string; state: string; progress: number; startDate: string; endDate?: string; }
interface TasksTabProps { serviceId: string; }

export default function TasksTab({ serviceId }: TasksTabProps) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadTasks(); }, [serviceId]);

  const loadTasks = async () => {
    try { setLoading(true); setError(null); const data = await vmwareService.getTasks(serviceId); setTasks(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStateBadge = (state: string) => {
    const classes: Record<string, string> = { done: "badge-success", doing: "badge-info", todo: "badge-warning", error: "badge-error", cancelled: "badge-secondary" };
    return <span className={`status-badge ${classes[state] || ""}`}>{state}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadTasks}>{tCommon("actions.retry")}</button></div>;
  if (tasks.length === 0) return <div className="empty-state"><h2>{t("tasks.empty.title")}</h2></div>;

  return (
    <div className="tasks-tab">
      <div className="tab-toolbar"><h2>{t("tasks.title")}</h2><button className="btn btn-outline" onClick={loadTasks}>{tCommon("actions.refresh")}</button></div>
      <table className="data-table">
        <thead><tr><th>{t("tasks.columns.name")}</th><th>{t("tasks.columns.state")}</th><th>{t("tasks.columns.progress")}</th><th>{t("tasks.columns.started")}</th><th>{t("tasks.columns.ended")}</th></tr></thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.taskId}>
              <td>{task.name}</td>
              <td>{getStateBadge(task.state)}</td>
              <td>{task.progress}%</td>
              <td>{new Date(task.startDate).toLocaleString("fr-FR")}</td>
              <td>{task.endDate ? new Date(task.endDate).toLocaleString("fr-FR") : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
