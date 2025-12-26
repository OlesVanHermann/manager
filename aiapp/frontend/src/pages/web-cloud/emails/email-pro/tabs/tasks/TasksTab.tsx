// ============================================================
// EMAIL-PRO/TASKS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listTasks, getTask, getStatusBadge } from "./TasksTab.service";
import type { EmailProTask } from "../../email-pro.types";
import "./TasksTab.css";

interface Props { serviceName: string; }

export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/email-pro/index");
  const [tasks, setTasks] = useState<EmailProTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await listTasks(serviceName);
        const data = await Promise.all(ids.slice(0, 50).map(id => getTask(serviceName, id)));
        data.sort((a, b) => new Date(b.todoDate).getTime() - new Date(a.todoDate).getTime());
        setTasks(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="emailpro-tasks-loading"><div className="emailpro-tasks-skeleton" /></div>;

  return (
    <div className="emailpro-tasks-tab">
      <div className="emailpro-tasks-tab-header"><div><h3>{t("tasks.title")}</h3><p className="emailpro-tasks-tab-description">{t("tasks.description")}</p></div></div>
      {tasks.length === 0 ? (
        <div className="emailpro-tasks-empty"><p>{t("tasks.empty")}</p></div>
      ) : (
        <table className="emailpro-tasks-table">
          <thead><tr><th>{t("tasks.function")}</th><th>{t("tasks.status")}</th><th>{t("tasks.date")}</th></tr></thead>
          <tbody>
            {tasks.map(task => {
              const s = getStatusBadge(task.status);
              return (
                <tr key={task.id}>
                  <td className="emailpro-tasks-font-mono">{task.function}</td>
                  <td><span className={`emailpro-tasks-badge ${s.cls}`}>{s.icon} {task.status}</span></td>
                  <td>{new Date(task.todoDate).toLocaleString('fr-FR')}</td>
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
