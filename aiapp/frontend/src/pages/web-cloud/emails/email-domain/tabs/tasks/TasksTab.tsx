// ============================================================
// EMAIL-DOMAIN/TASKS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listTasks, getTask, getStatusBadge } from "./TasksTab.service";
import type { EmailTask } from "../../email-domain.types";
import "./TasksTab.css";

interface Props { domain: string; }

export function TasksTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/email-domain/index");
  const [tasks, setTasks] = useState<EmailTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await listTasks(domain);
        const data = await Promise.all(ids.slice(0, 50).map(id => getTask(domain, id)));
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTasks(data);
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [domain]);

  if (loading) return <div className="emaildomain-tasks-loading"><div className="emaildomain-tasks-skeleton" /></div>;
  if (error) return <div className="emaildomain-tasks-error">{error}</div>;

  return (
    <div className="emaildomain-tasks-tab">
      <div className="emaildomain-tasks-tab-header">
        <div><h3>{t("tasks.title")}</h3><p className="emaildomain-tasks-tab-description">{t("tasks.description")}</p></div>
      </div>
      {tasks.length === 0 ? (
        <div className="emaildomain-tasks-empty">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p>{t("tasks.empty")}</p>
        </div>
      ) : (
        <table className="emaildomain-tasks-table">
          <thead><tr><th>{t("tasks.action")}</th><th>{t("tasks.status")}</th><th>{t("tasks.date")}</th></tr></thead>
          <tbody>
            {tasks.map(task => {
              const s = getStatusBadge(task.status);
              return (
                <tr key={task.id}>
                  <td className="emaildomain-tasks-font-mono">{task.action}</td>
                  <td><span className={`emaildomain-tasks-badge ${s.cls}`}>{s.icon} {task.status}</span></td>
                  <td>{new Date(task.date).toLocaleString('fr-FR')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TasksTab;
