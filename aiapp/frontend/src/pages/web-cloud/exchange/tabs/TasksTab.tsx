import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { exchangeService, ExchangeTask } from "../../../../services/web-cloud.exchange";

interface Props { org: string; service: string; }

export function TasksTab({ org, service }: Props) {
  const { t } = useTranslation("web-cloud/exchange/index");
  const [tasks, setTasks] = useState<ExchangeTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await exchangeService.listTasks(org, service);
        const data = await Promise.all(ids.slice(0, 50).map(id => exchangeService.getTask(org, service, id)));
        setTasks(data);
      } finally { setLoading(false); }
    };
    load();
  }, [org, service]);

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
