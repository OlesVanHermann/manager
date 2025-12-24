import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tasksService } from "./TasksTab";
import type { Task } from "../../pack-xdsl.types";
import "./TasksTab.css";

interface Props {
  packName: string;
}

export function TasksTab({ packName }: Props) {
  const { t } = useTranslation("web-cloud/pack-xdsl/index");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await tasksService.getTasks(packName);
        setTasks(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [packName]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { cls: string; icon: string }> = {
      todo: { cls: 'warning', icon: '⏳' },
      doing: { cls: 'info', icon: '🔄' },
      done: { cls: 'success', icon: '✓' },
      error: { cls: 'error', icon: '✗' }
    };
    const s = map[status] || { cls: 'inactive', icon: '?' };
    return <span className={`badge ${s.cls}`}>{s.icon} {status}</span>;
  };

  if (loading) {
    return <div className="tab-loading"><div className="skeleton-block" /></div>;
  }

  return (
    <div className="tasks-xdsl-container">
      <div className="tasks-xdsl-header">
        <div>
          <h3>{t("tasks.title")}</h3>
        </div>
      </div>
      {tasks.length === 0 ? (
        <div className="tasks-xdsl-empty">
          <p>{t("tasks.empty")}</p>
        </div>
      ) : (
        <table className="tasks-xdsl-table">
          <thead>
            <tr>
              <th>{t("tasks.function")}</th>
              <th>{t("tasks.status")}</th>
              <th>{t("tasks.date")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td className="tasks-xdsl-font-mono">{task.function}</td>
                <td>{getStatusBadge(task.status)}</td>
                <td>{new Date(task.todoDate).toLocaleString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TasksTab;
