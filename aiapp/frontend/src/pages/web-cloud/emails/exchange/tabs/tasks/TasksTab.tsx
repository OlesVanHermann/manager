// ============================================================
// EXCHANGE/TASKS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listTasks, getTask, getStatusBadge } from "./TasksTab.ts";
import type { ExchangeTask } from "../../exchange.types";
import "./TasksTab.css";

interface Props { org: string; service: string; }

/** Onglet Taches Exchange. */
export function TasksTab({ org, service }: Props) {
  const { t } = useTranslation("web-cloud/exchange/index");
  const [tasks, setTasks] = useState<ExchangeTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await listTasks(org, service);
        const data = await Promise.all(ids.slice(0, 50).map(id => getTask(org, service, id)));
        data.sort((a, b) => new Date(b.todoDate).getTime() - new Date(a.todoDate).getTime());
        setTasks(data);
      } finally { setLoading(false); }
    };
    load();
  }, [org, service]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="exchange-tasks-tab">
      <div className="exchange-tasks-tab-header"><div><h3>{t("tasks.title")}</h3></div></div>
      {tasks.length === 0 ? (
        <div className="exchange-tasks-empty"><p>{t("tasks.empty")}</p></div>
      ) : (
        <table className="exchange-tasks-table">
          <thead><tr><th>{t("tasks.function")}</th><th>{t("tasks.status")}</th><th>{t("tasks.date")}</th></tr></thead>
          <tbody>
            {tasks.map(task => {
              const s = getStatusBadge(task.status);
              return (
                <tr key={task.id}>
                  <td className="font-mono">{task.function}</td>
                  <td><span className={`badge ${s.cls}`}>{s.icon} {task.status}</span></td>
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
