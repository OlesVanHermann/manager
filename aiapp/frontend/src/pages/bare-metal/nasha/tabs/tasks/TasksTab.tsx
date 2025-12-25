// ############################################################
// #  NASHA/TASKS - COMPOSANT STRICTEMENT ISOLÉ               #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./TasksTab.css                              #
// #  SERVICE LOCAL : ./TasksTab.ts                           #
// #  I18N LOCAL : bare-metal/nasha/tasks                     #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tasksService } from "./TasksTab.service";
import type { NashaTask } from "../../nasha.types";
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
    done: "nasha-tasks-done",
    doing: "nasha-tasks-doing",
    todo: "nasha-tasks-todo",
    error: "nasha-tasks-error",
  };
  return map[status] || "nasha-tasks-todo";
};

// ============================================================
// Composant Principal
// ============================================================
export default function TasksTab({ serviceId }: TasksTabProps) {
  const { t } = useTranslation("bare-metal/nasha/tasks");
  const { t: tCommon } = useTranslation("common");
  const [tasks, setTasks] = useState<NashaTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement des tâches
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tasksService.getTasks(serviceId);
      setTasks(data);
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
    return <div className="nasha-tasks-loading">{tCommon("loading")}</div>;
  }

  // État d'erreur
  if (error) {
    return (
      <div className="nasha-tasks-error">
        <p>{error}</p>
        <button className="nasha-tasks-btn nasha-tasks-btn-primary" onClick={loadTasks}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="nasha-tasks-tab">
      {/* Barre d'outils */}
      <div className="nasha-tasks-toolbar">
        <h2>{t("title")}</h2>
        <button className="nasha-tasks-btn nasha-tasks-btn-outline" onClick={loadTasks}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {/* Liste vide */}
      {tasks.length === 0 ? (
        <div className="nasha-tasks-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="nasha-tasks-table">
          <thead>
            <tr>
              <th>{t("columns.operation")}</th>
              <th>{t("columns.partition")}</th>
              <th>{t("columns.status")}</th>
              <th>{t("columns.started")}</th>
              <th>{t("columns.completed")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.taskId}>
                <td>{task.operation}</td>
                <td>{task.partitionName || "-"}</td>
                <td>
                  <span className={`nasha-tasks-status-badge ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td>{formatDate(task.startDate)}</td>
                <td>{task.doneDate ? formatDate(task.doneDate) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
