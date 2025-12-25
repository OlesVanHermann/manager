// ############################################################
// #  VPS/TASKS - COMPOSANT STRICTEMENT ISOLÉ                 #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./TasksTab.css                              #
// #  SERVICE LOCAL : ./TasksTab.ts                           #
// #  I18N LOCAL : bare-metal/vps/tasks                       #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tasksService } from "./TasksTab.service";
import type { VpsTask } from "../../vps.types";
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

const getStatusInfo = (state: string): { className: string; icon: string } => {
  const map: Record<string, { className: string; icon: string }> = {
    todo: { className: "vps-tasks-warning", icon: "⏳" },
    doing: { className: "vps-tasks-info", icon: "🔄" },
    done: { className: "vps-tasks-success", icon: "✓" },
    error: { className: "vps-tasks-error", icon: "✗" },
    cancelled: { className: "vps-tasks-inactive", icon: "⊘" },
    paused: { className: "vps-tasks-warning", icon: "⏸" },
  };
  return map[state] || { className: "vps-tasks-inactive", icon: "?" };
};

// ============================================================
// Composant Principal
// ============================================================
export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/vps/tasks");
  const [tasks, setTasks] = useState<VpsTask[]>([]);
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
          (a, b) =>
            (b.startDate ? new Date(b.startDate).getTime() : 0) -
            (a.startDate ? new Date(a.startDate).getTime() : 0)
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
      <div className="vps-tasks-tab">
        <div className="vps-tasks-loading">
          <div className="vps-tasks-skeleton" style={{ width: "100%" }} />
          <div className="vps-tasks-skeleton" style={{ width: "80%" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="vps-tasks-tab">
      {/* En-tête */}
      <div className="vps-tasks-header">
        <h3>{t("title")}</h3>
      </div>

      {/* Liste vide */}
      {tasks.length === 0 ? (
        <div className="vps-tasks-empty">
          <p>{t("empty")}</p>
        </div>
      ) : (
        <table className="vps-tasks-table">
          <thead>
            <tr>
              <th>{t("type")}</th>
              <th>{t("state")}</th>
              <th>{t("progress")}</th>
              <th>{t("started")}</th>
              <th>{t("done")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const statusInfo = getStatusInfo(task.state);
              return (
                <tr key={task.id}>
                  <td className="vps-tasks-mono">{task.type}</td>
                  <td>
                    <span className={`vps-tasks-badge ${statusInfo.className}`}>
                      {statusInfo.icon} {task.state}
                    </span>
                  </td>
                  <td>{task.progress}%</td>
                  <td>{task.startDate ? formatDateTime(task.startDate) : "-"}</td>
                  <td>{task.doneDate ? formatDateTime(task.doneDate) : "-"}</td>
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
