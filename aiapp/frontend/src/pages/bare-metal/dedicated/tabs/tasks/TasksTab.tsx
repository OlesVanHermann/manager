// ############################################################
// #  DEDICATED/TASKS - COMPOSANT STRICTEMENT ISOLÉ           #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./TasksTab.css                              #
// #  SERVICE LOCAL : ./TasksTab.ts                           #
// #  I18N LOCAL : bare-metal/dedicated/tasks                 #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tasksService } from "./TasksTab.service";
import type { DedicatedServerTask } from "../../dedicated.types";
import "./TasksTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface Props {
  serviceName: string;
}

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// NE JAMAIS importer depuis un autre tab
// ============================================================
const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString();
};

const getStatusInfo = (status: string): { className: string; icon: string } => {
  const map: Record<string, { className: string; icon: string }> = {
    todo: { className: "dedicated-tasks-warning", icon: "⏳" },
    init: { className: "dedicated-tasks-info", icon: "🔄" },
    doing: { className: "dedicated-tasks-info", icon: "🔄" },
    done: { className: "dedicated-tasks-success", icon: "✓" },
    customerError: { className: "dedicated-tasks-error", icon: "✗" },
    ovhError: { className: "dedicated-tasks-error", icon: "✗" },
    cancelled: { className: "dedicated-tasks-inactive", icon: "⊘" },
  };
  return map[status] || { className: "dedicated-tasks-inactive", icon: "?" };
};

// ============================================================
// Composant Principal
// ============================================================
export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/dedicated/tasks");
  const [tasks, setTasks] = useState<DedicatedServerTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Chargement des tâches
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await tasksService.listTasks(serviceName);
        const data = await Promise.all(
          ids.slice(0, 50).map((id) => tasksService.getTask(serviceName, id))
        );
        data.sort(
          (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setTasks(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  // État de chargement
  if (loading) {
    return (
      <div className="dedicated-tasks-tab">
        <div className="dedicated-tasks-loading">
          <div className="dedicated-tasks-skeleton" style={{ width: "100%" }} />
          <div className="dedicated-tasks-skeleton" style={{ width: "80%" }} />
          <div className="dedicated-tasks-skeleton" style={{ width: "60%" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="dedicated-tasks-tab">
      {/* En-tête */}
      <div className="dedicated-tasks-header">
        <h3>{t("title")}</h3>
      </div>

      {/* Liste vide */}
      {tasks.length === 0 ? (
        <div className="dedicated-tasks-empty">
          <p>{t("empty")}</p>
        </div>
      ) : (
        <table className="dedicated-tasks-table">
          <thead>
            <tr>
              <th>{t("function")}</th>
              <th>{t("status")}</th>
              <th>{t("started")}</th>
              <th>{t("done")}</th>
              <th>{t("comment")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const statusInfo = getStatusInfo(task.status);
              return (
                <tr key={task.taskId}>
                  <td className="dedicated-tasks-mono">{task.function}</td>
                  <td>
                    <span className={`dedicated-tasks-badge ${statusInfo.className}`}>
                      {statusInfo.icon} {task.status}
                    </span>
                  </td>
                  <td>{formatDateTime(task.startDate)}</td>
                  <td>{task.doneDate ? formatDateTime(task.doneDate) : "-"}</td>
                  <td>{task.comment || "-"}</td>
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
