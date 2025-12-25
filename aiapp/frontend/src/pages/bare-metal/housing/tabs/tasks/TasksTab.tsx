// ############################################################
// #  HOUSING/TASKS - COMPOSANT STRICTEMENT ISOLÉ             #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./TasksTab.css                              #
// #  SERVICE LOCAL : ./TasksTab.ts                           #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tasksService } from "./TasksTab";
import type { HousingTask } from "../../housing.types";
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

// ============================================================
// Composant Principal
// ============================================================
export default function TasksTab({ serviceId }: TasksTabProps) {
  const { t } = useTranslation("bare-metal/housing/index");
  const { t: tCommon } = useTranslation("common");
  const [tasks, setTasks] = useState<HousingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement initial
  useEffect(() => {
    loadTasks();
  }, [serviceId]);

  // Fonction de chargement
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

  // État de chargement
  if (loading) {
    return <div className="housing-tasks-loading">{tCommon("loading")}</div>;
  }

  // État d'erreur
  if (error) {
    return (
      <div className="housing-tasks-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadTasks}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="housing-tasks-tab">
      {/* Barre d'outils */}
      <div className="housing-tasks-toolbar">
        <h2>{t("tasks.title")}</h2>
        <button className="btn btn-outline" onClick={loadTasks}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {/* Liste vide ou tableau */}
      {tasks.length === 0 ? (
        <div className="housing-tasks-empty">
          <h2>{t("tasks.empty.title")}</h2>
        </div>
      ) : (
        <table className="housing-tasks-table">
          <thead>
            <tr>
              <th>{t("tasks.columns.function")}</th>
              <th>{t("tasks.columns.status")}</th>
              <th>{t("tasks.columns.started")}</th>
              <th>{t("tasks.columns.completed")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.taskId}>
                <td>{task.function}</td>
                <td>
                  <span className={`housing-tasks-status-badge ${task.status}`}>
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
