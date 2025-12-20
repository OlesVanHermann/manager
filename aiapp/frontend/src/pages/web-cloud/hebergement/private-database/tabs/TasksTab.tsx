// ============================================================
// PRIVATE DB TAB: TASKS
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService, PrivateDatabaseTask } from "../../../../../services/web-cloud.private-database";

interface Props { serviceName: string; }

export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [tasks, setTasks] = useState<PrivateDatabaseTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await privateDatabaseService.listTasks(serviceName);
        const data = await Promise.all(ids.slice(0, 50).map(id => privateDatabaseService.getTask(serviceName, id)));
        data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        setTasks(data);
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { class: string; icon: string }> = { todo: { class: 'warning', icon: '⏳' }, init: { class: 'info', icon: '🔄' }, doing: { class: 'info', icon: '🔄' }, done: { class: 'success', icon: '✓' }, error: { class: 'error', icon: '✗' }, cancelled: { class: 'inactive', icon: '⊘' } };
    const s = map[status] || { class: 'inactive', icon: '?' };
    return <span className={`badge ${s.class}`}>{s.icon} {status}</span>;
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="tasks-tab">
      <div className="tab-header"><h3>{t("tasks.title")}</h3><p className="tab-description">{t("tasks.description")}</p></div>
      {tasks.length === 0 ? (
        <div className="empty-state"><p>{t("tasks.empty")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("tasks.function")}</th><th>{t("tasks.status")}</th><th>{t("tasks.progress")}</th><th>{t("tasks.started")}</th></tr></thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td className="font-mono">{task.function}</td>
                <td>{getStatusBadge(task.status)}</td>
                <td>{task.progress}%</td>
                <td>{new Date(task.startDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TasksTab;
