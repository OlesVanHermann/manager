// ============================================================
// ZIMBRA/TASKS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listTasks, getTask, getStatusBadge } from "./TasksTab.service";
import type { ZimbraTask } from "../../zimbra.types";
import "./TasksTab.css";

interface Props { serviceId: string; }

export function TasksTab({ serviceId }: Props) {
  const { t } = useTranslation("web-cloud/zimbra/index");
  const [tasks, setTasks] = useState<ZimbraTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await listTasks(serviceId);
        const data = await Promise.all(ids.slice(0, 50).map(id => getTask(serviceId, id)));
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTasks(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceId]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="zimbra-tasks-tab">
      <div className="zimbra-tasks-tab-header"><div><h3>{t("tasks.title")}</h3></div></div>
      {tasks.length === 0 ? (
        <div className="zimbra-tasks-empty"><p>{t("tasks.empty")}</p></div>
      ) : (
        <table className="zimbra-tasks-table">
          <thead><tr><th>{t("tasks.type")}</th><th>{t("tasks.status")}</th><th>{t("tasks.created")}</th></tr></thead>
          <tbody>
            {tasks.map(task => {
              const s = getStatusBadge(task.status);
              return (
                <tr key={task.id}>
                  <td className="font-mono">{task.type}</td>
                  <td><span className={`badge ${s.cls}`}>{s.icon} {task.status}</span></td>
                  <td>{new Date(task.createdAt).toLocaleString('fr-FR')}</td>
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
