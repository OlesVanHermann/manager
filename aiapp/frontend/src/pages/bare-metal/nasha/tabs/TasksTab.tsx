import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as nashaService from "../../../../services/bare-metal.nasha";

interface Task {
  taskId: number;
  operation: string;
  status: string;
  partitionName?: string;
  startDate: string;
  doneDate?: string;
}

interface TasksTabProps {
  serviceId: string;
}

export default function TasksTab({ serviceId }: TasksTabProps) {
  const { t } = useTranslation("bare-metal/nasha/index");
  const { t: tCommon } = useTranslation("common");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadTasks(); }, [serviceId]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await nashaService.getTasks(serviceId);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { done: "badge-success", doing: "badge-info", todo: "badge-warning", error: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadTasks}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="tasks-tab">
      <div className="tab-toolbar">
        <h2>{t("tasks.title")}</h2>
        <button className="btn btn-outline" onClick={loadTasks}>{tCommon("actions.refresh")}</button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <h2>{t("tasks.empty.title")}</h2>
          <p>{t("tasks.empty.description")}</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("tasks.columns.operation")}</th>
              <th>{t("tasks.columns.partition")}</th>
              <th>{t("tasks.columns.status")}</th>
              <th>{t("tasks.columns.started")}</th>
              <th>{t("tasks.columns.completed")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.taskId}>
                <td>{task.operation}</td>
                <td>{task.partitionName || "-"}</td>
                <td>{getStatusBadge(task.status)}</td>
                <td>{new Date(task.startDate).toLocaleString("fr-FR")}</td>
                <td>{task.doneDate ? new Date(task.doneDate).toLocaleString("fr-FR") : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
