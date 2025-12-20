// ============================================================
// EMAIL PRO TAB: TASKS (style Hosting)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { emailProService, EmailProTask } from "../../../../../services/web-cloud.email-pro";

interface Props { serviceName: string; }

/** Onglet Taches Email Pro. */
export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/email-pro/index");
  const [tasks, setTasks] = useState<EmailProTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await emailProService.listTasks(serviceName);
        const data = await Promise.all(ids.slice(0, 50).map(id => emailProService.getTask(serviceName, id)));
        data.sort((a, b) => new Date(b.todoDate).getTime() - new Date(a.todoDate).getTime());
        setTasks(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { cls: string; icon: string }> = { todo: { cls: 'warning', icon: '⏳' }, doing: { cls: 'info', icon: '🔄' }, done: { cls: 'success', icon: '✓' }, error: { cls: 'error', icon: '✗' }, cancelled: { cls: 'inactive', icon: '⊘' } };
    const s = map[status] || { cls: 'inactive', icon: '?' };
    return <span className={`badge ${s.cls}`}>{s.icon} {status}</span>;
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="tasks-tab">
      <div className="tab-header"><div><h3>{t("tasks.title")}</h3><p className="tab-description">{t("tasks.description")}</p></div></div>
      {tasks.length === 0 ? (
        <div className="empty-state"><p>{t("tasks.empty")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("tasks.function")}</th><th>{t("tasks.status")}</th><th>{t("tasks.date")}</th></tr></thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}><td className="font-mono">{task.function}</td><td>{getStatusBadge(task.status)}</td><td>{new Date(task.todoDate).toLocaleString('fr-FR')}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TasksTab;
