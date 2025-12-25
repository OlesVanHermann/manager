// ============================================================
// DEDICATED TAB ISOLÉ : TasksTab
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tasksService } from "./TasksTab";
import type { DedicatedServerTask } from "../../dedicated.types";
import "./TasksTab.css";

interface Props {
  serviceName: string;
}

export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/dedicated/index");
  const [tasks, setTasks] = useState<DedicatedServerTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await tasksService.listTasks(serviceName);
        const data = await Promise.all(ids.slice(0, 50).map((id) => tasksService.getTask(serviceName, id)));
        data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        setTasks(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { class: string; icon: string }> = {
      todo: { class: "warning", icon: "⏳" },
      init: { class: "info", icon: "🔄" },
      doing: { class: "info", icon: "🔄" },
      done: { class: "success", icon: "✓" },
      customerError: { class: "error", icon: "✗" },
      ovhError: { class: "error", icon: "✗" },
      cancelled: { class: "inactive", icon: "⊘" },
    };
    const s = map[status] || { class: "inactive", icon: "?" };
    return <span className={`badge ${s.class}`}>{s.icon} {status}</span>;
  };

  if (loading) {
    return (
      <div className="tasks-tab">
        <div className="tab-loading">
          <div className="skeleton-block" />
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-tab">
      <div className="tab-header">
        <h3>{t("tasks.title")}</h3>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>{t("tasks.empty")}</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("tasks.function")}</th>
              <th>{t("tasks.status")}</th>
              <th>{t("tasks.started")}</th>
              <th>{t("tasks.done")}</th>
              <th>{t("tasks.comment")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.taskId}>
                <td className="font-mono">{task.function}</td>
                <td>{getStatusBadge(task.status)}</td>
                <td>{new Date(task.startDate).toLocaleString()}</td>
                <td>{task.doneDate ? new Date(task.doneDate).toLocaleString() : "-"}</td>
                <td>{task.comment || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TasksTab;
