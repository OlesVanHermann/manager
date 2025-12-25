// ============================================================
// VPS TAB ISOLÉ : TasksTab
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tasksService } from "./TasksTab";
import type { VpsTask } from "../../vps.types";
import "./TasksTab.css";

interface Props {
  serviceName: string;
}

export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/vps/index");
  const [tasks, setTasks] = useState<VpsTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await tasksService.listTasks(serviceName);
        const data = await Promise.all(ids.slice(0, 50).map((id) => tasksService.getTask(serviceName, id)));
        data.sort((a, b) => (b.startDate ? new Date(b.startDate).getTime() : 0) - (a.startDate ? new Date(a.startDate).getTime() : 0));
        setTasks(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  const getStatusBadge = (state: string) => {
    const map: Record<string, { class: string; icon: string }> = {
      todo: { class: "warning", icon: "⏳" },
      doing: { class: "info", icon: "🔄" },
      done: { class: "success", icon: "✓" },
      error: { class: "error", icon: "✗" },
      cancelled: { class: "inactive", icon: "⊘" },
      paused: { class: "warning", icon: "⏸" },
    };
    const s = map[state] || { class: "inactive", icon: "?" };
    return <span className={`badge ${s.class}`}>{s.icon} {state}</span>;
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
        <table className="tasks-data-table">
          <thead>
            <tr>
              <th>{t("tasks.type")}</th>
              <th>{t("tasks.status")}</th>
              <th>{t("tasks.progress")}</th>
              <th>{t("tasks.started")}</th>
              <th>{t("tasks.done")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="font-mono">{task.type}</td>
                <td>{getStatusBadge(task.state)}</td>
                <td>{task.progress}%</td>
                <td>{task.startDate ? new Date(task.startDate).toLocaleString() : "-"}</td>
                <td>{task.doneDate ? new Date(task.doneDate).toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TasksTab;
