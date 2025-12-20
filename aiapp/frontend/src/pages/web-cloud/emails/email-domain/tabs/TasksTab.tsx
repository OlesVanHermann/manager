// ============================================================
// EMAIL DOMAIN TAB: TASKS (style Hosting)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { emailDomainService, EmailTask } from "../../../../../services/web-cloud.email-domain";

interface Props { domain: string; }

/** Onglet Taches. */
export function TasksTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/email-domain/index");
  const [tasks, setTasks] = useState<EmailTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await emailDomainService.listTasks(domain);
        const data = await Promise.all(ids.slice(0, 50).map(id => emailDomainService.getTask(domain, id)));
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTasks(data);
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [domain]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { cls: string; icon: string }> = { todo: { cls: 'warning', icon: '⏳' }, doing: { cls: 'info', icon: '🔄' }, done: { cls: 'success', icon: '✓' }, error: { cls: 'error', icon: '✗' }, cancelled: { cls: 'inactive', icon: '⊘' } };
    const s = map[status] || { cls: 'inactive', icon: '?' };
    return <span className={`badge ${s.cls}`}>{s.icon} {status}</span>;
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="tasks-tab">
      <div className="tab-header"><div><h3>{t("tasks.title")}</h3><p className="tab-description">{t("tasks.description")}</p></div></div>
      {tasks.length === 0 ? (
        <div className="empty-state"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><p>{t("tasks.empty")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("tasks.action")}</th><th>{t("tasks.status")}</th><th>{t("tasks.date")}</th></tr></thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}><td className="font-mono">{task.action}</td><td>{getStatusBadge(task.status)}</td><td>{new Date(task.date).toLocaleString('fr-FR')}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TasksTab;
