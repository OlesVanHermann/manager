// ============================================================
// HOSTING TAB: TASKS - Operations en cours
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, HostingTask } from "../../../../services/hosting.service";

interface Props { serviceName: string; }

/** Onglet Operations en cours. */
export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [tasks, setTasks] = useState<HostingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await hostingService.listTasks(serviceName);
        const data = await Promise.all(ids.slice(0, 50).map(id => hostingService.getTask(serviceName, id)));
        data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        setTasks(data);
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { class: string; icon: string }> = {
      todo: { class: 'warning', icon: '⏳' },
      init: { class: 'info', icon: '🔄' },
      doing: { class: 'info', icon: '🔄' },
      done: { class: 'success', icon: '✓' },
      error: { class: 'error', icon: '✗' },
      cancelled: { class: 'inactive', icon: '⊘' },
    };
    const s = map[status] || { class: 'inactive', icon: '?' };
    return <span className={`badge ${s.class}`}>{s.icon} {status}</span>;
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="tasks-tab">
      <div className="tab-header">
        <div>
          <h3>{t("tasks.title")}</h3>
          <p className="tab-description">{t("tasks.description")}</p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p>{t("tasks.empty")}</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("tasks.function")}</th>
              <th>{t("tasks.status")}</th>
              <th>{t("tasks.started")}</th>
              <th>{t("tasks.finished")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td className="font-mono">{task.function}</td>
                <td>{getStatusBadge(task.status)}</td>
                <td>{new Date(task.startDate).toLocaleString()}</td>
                <td>{task.doneDate ? new Date(task.doneDate).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TasksTab;
