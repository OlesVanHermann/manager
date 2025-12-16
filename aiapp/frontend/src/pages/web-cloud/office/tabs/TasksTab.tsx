import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { officeService, OfficeTask } from "../../../../services/web-cloud.office";

interface Props { serviceName: string; }

export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/office/index");
  const [tasks, setTasks] = useState<OfficeTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await officeService.listTasks(serviceName);
        const data = await Promise.all(ids.slice(0, 50).map(id => officeService.getTask(serviceName, id)));
        data.sort((a, b) => new Date(b.todoDate).getTime() - new Date(a.todoDate).getTime());
        setTasks(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="tasks-tab">
      <div className="tab-header"><h3>{t("tasks.title")}</h3></div>
      {tasks.length === 0 ? (<div className="empty-state"><p>{t("tasks.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("tasks.function")}</th><th>{t("tasks.status")}</th><th>{t("tasks.date")}</th></tr></thead>
          <tbody>{tasks.map(task => (<tr key={task.id}><td className="font-mono">{task.function}</td><td><span className={`badge ${task.status === 'done' ? 'success' : 'warning'}`}>{task.status}</span></td><td>{new Date(task.todoDate).toLocaleString()}</td></tr>))}</tbody>
        </table>
      )}
    </div>
  );
}
export default TasksTab;
