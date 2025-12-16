import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { networkService, VrackTask } from "../../../../services/network";

interface Props { serviceName: string; }

export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("network/vrack/index");
  const [tasks, setTasks] = useState<VrackTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await networkService.listVrackTasks(serviceName);
        const data = await Promise.all(ids.slice(0, 50).map(id => networkService.getVrackTask(serviceName, id)));
        data.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
        setTasks(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = { done: 'success', doing: 'info', todo: 'warning', init: 'warning', cancelled: 'inactive' };
    return <span className={`badge ${map[status] || 'inactive'}`}>{status}</span>;
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="tasks-tab">
      <div className="tab-header"><h3>{t("tasks.title")}</h3></div>
      {tasks.length === 0 ? (<div className="empty-state"><p>{t("tasks.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("tasks.function")}</th><th>{t("tasks.target")}</th><th>{t("tasks.status")}</th><th>{t("tasks.updated")}</th></tr></thead>
          <tbody>{tasks.map(task => (<tr key={task.id}><td className="font-mono">{task.function}</td><td className="font-mono">{task.targetDomain || task.serviceName || '-'}</td><td>{getStatusBadge(task.status)}</td><td>{new Date(task.lastUpdate).toLocaleString()}</td></tr>))}</tbody>
        </table>
      )}
    </div>
  );
}
export default TasksTab;
