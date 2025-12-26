// ============================================================
// OFFICE/TASKS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listTasks, getTask, getStatusBadge } from "./TasksTab.service";
import type { OfficeTask } from "../../office.types";
import "./TasksTab.css";

interface Props { tenantId: string; }

export function TasksTab({ tenantId }: Props) {
  const { t } = useTranslation("web-cloud/office/index");
  const [tasks, setTasks] = useState<OfficeTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await listTasks(tenantId);
        const data = await Promise.all(ids.slice(0, 50).map(id => getTask(tenantId, id)));
        data.sort((a, b) => new Date(b.todoDate).getTime() - new Date(a.todoDate).getTime());
        setTasks(data);
      } finally { setLoading(false); }
    };
    load();
  }, [tenantId]);

  if (loading) return <div className="office-tasks-loading"><div className="office-tasks-skeleton" /></div>;

  return (
    <div className="office-tasks-tab">
      <div className="office-tasks-tab-header"><div><h3>{t("tasks.title")}</h3></div></div>
      {tasks.length === 0 ? (
        <div className="office-tasks-empty"><p>{t("tasks.empty")}</p></div>
      ) : (
        <table className="office-tasks-table">
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
