// ============================================================
// EMAIL DOMAIN TAB: TASKS
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { emailDomainService, EmailTask } from "../../../../services/email-domain.service";

interface Props { domain: string; }

export function TasksTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/email-domain/index");
  const [tasks, setTasks] = useState<EmailTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await emailDomainService.listTasks(domain);
        const data = await Promise.all(ids.slice(0, 50).map(id => emailDomainService.getTask(domain, id)));
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTasks(data);
      } finally { setLoading(false); }
    };
    load();
  }, [domain]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { class: string; icon: string }> = { todo: { class: 'warning', icon: '⏳' }, doing: { class: 'info', icon: '🔄' }, done: { class: 'success', icon: '✓' }, error: { class: 'error', icon: '✗' }, cancelled: { class: 'inactive', icon: '⊘' } };
    const s = map[status] || { class: 'inactive', icon: '?' };
    return <span className={`badge ${s.class}`}>{s.icon} {status}</span>;
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="tasks-tab">
      <div className="tab-header"><h3>{t("tasks.title")}</h3><p className="tab-description">{t("tasks.description")}</p></div>
      {tasks.length === 0 ? (<div className="empty-state"><p>{t("tasks.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("tasks.action")}</th><th>{t("tasks.status")}</th><th>{t("tasks.date")}</th></tr></thead>
          <tbody>{tasks.map(task => (<tr key={task.id}><td className="font-mono">{task.action}</td><td>{getStatusBadge(task.status)}</td><td>{new Date(task.date).toLocaleString()}</td></tr>))}</tbody>
        </table>
      )}
    </div>
  );
}

export default TasksTab;
