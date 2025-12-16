import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { zimbraService, ZimbraTask } from "../../../../services/web-cloud.zimbra";

interface Props { serviceId: string; }

export function TasksTab({ serviceId }: Props) {
  const { t } = useTranslation("web-cloud/zimbra/index");
  const [tasks, setTasks] = useState<ZimbraTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await zimbraService.listTasks(serviceId);
        const data = await Promise.all(ids.slice(0, 50).map(id => zimbraService.getTask(serviceId, id)));
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTasks(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceId]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="tasks-tab">
      <div className="tab-header"><h3>{t("tasks.title")}</h3></div>
      {tasks.length === 0 ? (<div className="empty-state"><p>{t("tasks.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("tasks.type")}</th><th>{t("tasks.status")}</th><th>{t("tasks.created")}</th><th>{t("tasks.message")}</th></tr></thead>
          <tbody>{tasks.map(task => (<tr key={task.id}><td className="font-mono">{task.type}</td><td><span className={`badge ${task.status === 'done' ? 'success' : task.status === 'error' ? 'error' : 'warning'}`}>{task.status}</span></td><td>{new Date(task.createdAt).toLocaleString()}</td><td>{task.message || '-'}</td></tr>))}</tbody>
        </table>
      )}
    </div>
  );
}
export default TasksTab;
