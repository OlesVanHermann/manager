// ============================================================
// HOSTING TAB: TASKS - Liste des tâches
// Target: SVG target_.web-cloud.hebergement.hosting.tasks.svg
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { tasksService } from "./TasksTab";
import "./tasks.css";

// ============================================================
// TYPES
// ============================================================

interface Task {
  id: number;
  function: string;
  status: string;
  startDate?: string;
  doneDate?: string;
}

interface Props {
  serviceName: string;
}

// ============================================================
// CONSTANTS
// ============================================================

type TaskStatus = "done" | "doing" | "todo" | "error" | "cancelled" | "init";

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  done: { label: "Terminée", className: "badge-success" },
  doing: { label: "En cours", className: "badge-info" },
  init: { label: "En cours", className: "badge-info" },
  todo: { label: "Planifiée", className: "badge-warning" },
  error: { label: "En erreur", className: "badge-error" },
  cancelled: { label: "Annulée", className: "badge-neutral" },
};

const FUNCTION_LABELS: Record<string, string> = {
  "web/ssl/regenerate": "Création d'un certificat SSL",
  "web/ssl/delete": "Suppression du certificat SSL",
  "web/ssl/install": "Installation d'un certificat SSL",
  "web/attachedDomain/create": "Ajout d'un domaine sur l'hébergement",
  "web/attachedDomain/update": "Modification d'un domaine",
  "web/attachedDomain/delete": "Suppression d'un domaine",
  "web/database/changePassword": "Changement de mot de passe de base de données",
  "web/database/create": "Création d'une base de données",
  "web/database/delete": "Suppression d'une base de données",
  "web/database/dump": "Export d'une base de données",
  "web/database/import": "Import d'une base de données",
  "web/database/restore": "Restauration d'une base de données",
  "web/module/install": "Installation d'un module",
  "web/module/delete": "Suppression d'un module",
  "web/module/changePassword": "Changement de mot de passe du module",
  "web/cdn/flush": "Nettoyage du cache CDN",
  "web/cdn/activate": "Activation du CDN",
  "web/cdn/deactivate": "Désactivation du CDN",
  "web/user/create": "Création d'un utilisateur FTP",
  "web/user/delete": "Suppression d'un utilisateur FTP",
  "web/user/changePassword": "Changement de mot de passe FTP",
  "web/user/update": "Modification d'un utilisateur FTP",
  "web/cron/create": "Création d'une tâche planifiée",
  "web/cron/delete": "Suppression d'une tâche planifiée",
  "web/cron/update": "Modification d'une tâche planifiée",
  "web/envVar/create": "Création d'une variable d'environnement",
  "web/envVar/delete": "Suppression d'une variable d'environnement",
  "web/envVar/update": "Modification d'une variable d'environnement",
  "web/runtime/create": "Création d'un runtime",
  "web/runtime/delete": "Suppression d'un runtime",
  "web/runtime/update": "Modification d'un runtime",
  "web/restoreSnapshot": "Restauration d'un snapshot",
  "web/boost/request": "Activation du boost",
  "web/boost/terminate": "Désactivation du boost",
};

// ============================================================
// COMPONENT
// ============================================================

export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.tasks");

  // ---------- STATE ----------
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- LOAD TASKS ----------
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const ids = await tasksService.listTasks(serviceName);
      const data = await Promise.all(
        ids.map((id) => tasksService.getTask(serviceName, id))
      );
      // Tri par date de début décroissante (plus récent en premier)
      data.sort(
        (a, b) =>
          new Date(b.startDate || 0).getTime() -
          new Date(a.startDate || 0).getTime()
      );
      setTasks(data);
    } catch (err) {
      setError(t("common.error"));
      console.error("[TasksTab] Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  }, [serviceName, t]);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Auto-refresh si tâches en cours (toutes les 10s)
  useEffect(() => {
    const hasRunning = tasks.some(
      (task) =>
        task.status === "doing" || task.status === "init" || task.status === "todo"
    );
    if (!hasRunning) return;

    const interval = setInterval(loadTasks, 10000);
    return () => clearInterval(interval);
  }, [tasks, loadTasks]);

  // ---------- HELPERS ----------
  const formatDate = (date?: string): string => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    return (
      STATUS_CONFIG[status as TaskStatus] || {
        label: status,
        className: "badge-neutral",
      }
    );
  };

  const getFunctionLabel = (fn: string): string => {
    return FUNCTION_LABELS[fn] || fn;
  };

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="tasks-tab">
        <div className="tasks-table-container">
          <div className="tasks-skeleton">
            <div className="skeleton-row" />
            <div className="skeleton-row" />
            <div className="skeleton-row" />
          </div>
        </div>
      </div>
    );
  }

  // ---------- RENDER ERROR ----------
  if (error) {
    return (
      <div className="tasks-tab">
        <div className="tasks-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // ---------- RENDER EMPTY ----------
  if (tasks.length === 0) {
    return (
      <div className="tasks-tab">
        <div className="tasks-table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>{t("columns.task")}</th>
                <th>{t("columns.status")}</th>
                <th>{t("columns.startDate")}</th>
                <th>{t("columns.doneDate")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="empty-cell">
                  {t("empty")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="tasks-tab">
      <div className="tasks-table-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>{t("columns.task")}</th>
              <th>{t("columns.status")}</th>
              <th>{t("columns.startDate")}</th>
              <th>{t("columns.doneDate")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const statusConfig = getStatusConfig(task.status);
              return (
                <tr key={task.id}>
                  <td className="task-function">{getFunctionLabel(task.function)}</td>
                  <td>
                    <span className={`task-badge ${statusConfig.className}`}>
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="task-date">{formatDate(task.startDate)}</td>
                  <td className="task-date">{formatDate(task.doneDate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TasksTab;
