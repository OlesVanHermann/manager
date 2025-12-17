import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as packXdslService from "../../../../services/web-cloud.pack-xdsl";

interface Task { id: number; function: string; status: string; todoDate: string; doneDate?: string; }
interface TasksTabProps { serviceId: string; }

export default function TasksTab({ serviceId }: TasksTabProps) {
  const { t } = useTranslation("web-cloud/pack-xdsl/index");
  const { t: tCommon } = useTranslation("common");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadTasks(); }, [serviceId]);

  const loadTasks = async () => {
    try { setLoading(true); setError(null); const data = await packXdslService.getTasks(serviceId); setTasks(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { done: "badge-success", doing: "badge-info", todo: "badge-warning", error: "badge-error", cancelled: "badge-secondary" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadTasks}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="tasks-tab">
      <div className="tab-toolbar"><h2>{t("tasks.title")}</h2><button className="btn btn-outline" onClick={loadTasks}>{tCommon("actions.refresh")}</button></div>
      {tasks.length === 0 ? <div className="empty-state"><h2>{t("tasks.empty.title")}</h2></div> : (
        <table className="data-table">
          <thead><tr><th>{t("tasks.columns.function")}</th><th>{t("tasks.columns.status")}</th><th>{t("tasks.columns.scheduled")}</th><th>{t("tasks.columns.completed")}</th></tr></thead>
          <tbody>
            {tasks.map((task) => (<tr key={task.id}><td>{task.function}</td><td>{getStatusBadge(task.status)}</td><td>{new Date(task.todoDate).toLocaleString("fr-FR")}</td><td>{task.doneDate ? new Date(task.doneDate).toLocaleString("fr-FR") : "-"}</td></tr>))}
          </tbody>
        </table>
      )}
    </div>
  );
}
