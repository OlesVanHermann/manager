// ============================================================
// TAB: TASKS - Operations en cours
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { domainsService, DomainTask } from "../../../../services/web-cloud.domains";

interface Props {
  domain: string;
}

/** Onglet Operations en cours du domaine. */
export function TasksTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");
  const [tasks, setTasks] = useState<DomainTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const ids = await domainsService.listTasks(domain, filter || undefined);
        const details = await Promise.all(ids.map(id => domainsService.getTask(domain, id)));
        // Trier par date de creation (plus recent en premier)
        details.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
        setTasks(details);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [domain, filter]);

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      todo: 'warning',
      doing: 'info',
      done: 'success',
      error: 'error',
      cancelled: 'inactive',
    };
    const icons: Record<string, string> = {
      todo: '⏳',
      doing: '🔄',
      done: '✓',
      error: '✗',
      cancelled: '⊘',
    };
    return (
      <span className={`badge ${classes[status] || ''}`}>
        {icons[status]} {t(`tasks.status.${status}`)}
      </span>
    );
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
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="">{t("tasks.allStatuses")}</option>
          <option value="todo">{t("tasks.status.todo")}</option>
          <option value="doing">{t("tasks.status.doing")}</option>
          <option value="done">{t("tasks.status.done")}</option>
          <option value="error">{t("tasks.status.error")}</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{t("tasks.empty")}</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("tasks.function")}</th>
              <th>{t("tasks.status")}</th>
              <th>{t("tasks.created")}</th>
              <th>{t("tasks.updated")}</th>
              <th>{t("tasks.comment")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td className="font-mono">{task.function}</td>
                <td>{getStatusBadge(task.status)}</td>
                <td>{new Date(task.creationDate).toLocaleString()}</td>
                <td>{new Date(task.lastUpdate).toLocaleString()}</td>
                <td className="comment-cell">{task.comment || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TasksTab;
