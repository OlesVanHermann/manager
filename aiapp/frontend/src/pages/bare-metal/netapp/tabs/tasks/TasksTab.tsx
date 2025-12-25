// ############################################################
// #  NETAPP/TASKS - COMPOSANT STRICTEMENT ISOLÉ              #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./TasksTab.css                              #
// #  SERVICE LOCAL : ./TasksTab.ts                           #
// #  I18N LOCAL : bare-metal/netapp/tasks                    #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tasksService } from "./TasksTab.service";
import type { NetAppTask } from "../../netapp.types";
import "./TasksTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface TasksTabProps {
  serviceId: string;
}

// ============================================================
// Helpers LOCAUX - Dupliqués volontairement (défactorisation)
// NE JAMAIS importer depuis un autre tab
// ============================================================
const formatDate = (date: string): string => {
  return new Date(date).toLocaleString("fr-FR");
};

const getStatusClass = (status: string): string => {
  const map: Record<string, string> = {
    done: "netapp-tasks-done",
    running: "netapp-tasks-running",
    pending: "netapp-tasks-pending",
    error: "netapp-tasks-error",
  };
  return map[status] || "netapp-tasks-pending";
};

// ============================================================
// Composant Principal
// ============================================================
export default function TasksTab({ serviceId }: TasksTabProps) {
  const { t } = useTranslation("bare-metal/netapp/tasks");
  const { t: tCommon } = useTranslation("common");
  const [tasks, setTasks] = useState<NetAppTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement des tâches
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      setTasks(await tasksService.getTasks(serviceId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [serviceId]);

  // État de chargement
  if (loading) {
    return <div className="netapp-tasks-loading">{tCommon("loading")}</div>;
  }

  // État d'erreur
  if (error) {
    return (
      <div className="netapp-tasks-error">
        <p>{error}</p>
        <button className="netapp-tasks-btn netapp-tasks-btn-primary" onClick={loadTasks}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="netapp-tasks-tab">
      {/* Barre d'outils */}
      <div className="netapp-tasks-toolbar">
        <h2>{t("title")}</h2>
        <button className="netapp-tasks-btn netapp-tasks-btn-outline" onClick={loadTasks}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {/* Liste vide */}
      {tasks.length === 0 ? (
        <div className="netapp-tasks-empty">
          <h2>{t("empty.title")}</h2>
        </div>
      ) : (
        <table className="netapp-tasks-table">
          <thead>
            <tr>
              <th>{t("columns.type")}</th>
              <th>{t("columns.status")}</th>
              <th>{t("columns.progress")}</th>
              <th>{t("columns.created")}</th>
              <th>{t("columns.finished")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.type}</td>
                <td>
                  <span className={`netapp-tasks-status-badge ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td>{task.progress}%</td>
                <td>{formatDate(task.createdAt)}</td>
                <td>{task.finishedAt ? formatDate(task.finishedAt) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
