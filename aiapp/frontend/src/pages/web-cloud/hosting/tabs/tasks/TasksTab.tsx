// ============================================================
// TASKS TAB - Liste des taches de l'hebergement
// Conforme au pattern NAV3 standard
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { tasksService } from "./TasksTab.service";
import "./TasksTab.css";

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

type TaskStatus = "done" | "doing" | "todo" | "error" | "cancelled" | "init";

// ============================================================
// CONSTANTS
// ============================================================

const FUNCTION_LABELS: Record<string, string> = {
  "web/ssl/regenerate": "Creation d'un certificat SSL",
  "web/ssl/delete": "Suppression du certificat SSL",
  "web/ssl/install": "Installation d'un certificat SSL",
  "web/attachedDomain/create": "Ajout d'un domaine sur l'hebergement",
  "web/attachedDomain/update": "Modification d'un domaine",
  "web/attachedDomain/delete": "Suppression d'un domaine",
  "web/database/changePassword": "Changement de mot de passe de base de donnees",
  "web/database/create": "Creation d'une base de donnees",
  "web/database/delete": "Suppression d'une base de donnees",
  "web/database/dump": "Export d'une base de donnees",
  "web/database/import": "Import d'une base de donnees",
  "web/database/restore": "Restauration d'une base de donnees",
  "web/module/install": "Installation d'un module",
  "web/module/delete": "Suppression d'un module",
  "web/module/changePassword": "Changement de mot de passe du module",
  "web/cdn/flush": "Nettoyage du cache CDN",
  "web/cdn/activate": "Activation du CDN",
  "web/cdn/deactivate": "Desactivation du CDN",
  "web/user/create": "Creation d'un utilisateur FTP",
  "web/user/delete": "Suppression d'un utilisateur FTP",
  "web/user/changePassword": "Changement de mot de passe FTP",
  "web/user/update": "Modification d'un utilisateur FTP",
  "web/cron/create": "Creation d'une tache planifiee",
  "web/cron/delete": "Suppression d'une tache planifiee",
  "web/cron/update": "Modification d'une tache planifiee",
  "web/envVar/create": "Creation d'une variable d'environnement",
  "web/envVar/delete": "Suppression d'une variable d'environnement",
  "web/envVar/update": "Modification d'une variable d'environnement",
  "web/runtime/create": "Creation d'un runtime",
  "web/runtime/delete": "Suppression d'un runtime",
  "web/runtime/update": "Modification d'un runtime",
  "web/restoreSnapshot": "Restauration d'un snapshot",
  "web/boost/request": "Activation du boost",
  "web/boost/terminate": "Desactivation du boost",
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

function Badge({ status }: { status: TaskStatus }) {
  const statusMap: Record<TaskStatus, { label: string; className: string }> = {
    done: { label: "Terminee", className: "tasks-badge-success" },
    doing: { label: "En cours", className: "tasks-badge-info" },
    init: { label: "En cours", className: "tasks-badge-info" },
    todo: { label: "Planifiee", className: "tasks-badge-warning" },
    error: { label: "Erreur", className: "tasks-badge-error" },
    cancelled: { label: "Annulee", className: "tasks-badge-neutral" },
  };
  const config = statusMap[status] || { label: status, className: "tasks-badge-neutral" };
  return <span className={`tasks-badge ${config.className}`}>{config.label}</span>;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.tasks");

  // ---------- STATE ----------
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ---------- LOAD ----------
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const ids = await tasksService.listTasks(serviceName);
      const data = await Promise.all(ids.map(id => tasksService.getTask(serviceName, id)));
      // Tri par date decroissante
      data.sort((a, b) => new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime());
      setTasks(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  // Auto-refresh si taches en cours
  useEffect(() => {
    const hasRunning = tasks.some(task => task.status === "doing" || task.status === "init" || task.status === "todo");
    if (!hasRunning) return;
    const interval = setInterval(loadTasks, 10000);
    return () => clearInterval(interval);
  }, [tasks, loadTasks]);

  // ---------- HELPERS ----------
  const formatDate = (date?: string): string => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleString("fr-FR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
    } catch { return date; }
  };

  const getFunctionLabel = (fn: string): string => FUNCTION_LABELS[fn] || fn;

  // ---------- FILTERING & PAGINATION ----------
  const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks;
    const term = searchTerm.toLowerCase();
    return tasks.filter(task =>
      getFunctionLabel(task.function).toLowerCase().includes(term) ||
      task.status.toLowerCase().includes(term)
    );
  }, [tasks, searchTerm]);

  const totalItems = filteredTasks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="tasks-tab">
        <div className="tasks-skeleton" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-tab">
        <div className="tasks-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="tasks-tab">
      {/* === TOOLBAR === */}
      <div className="tasks-toolbar">
        <button className="tasks-btn-outline" onClick={loadTasks}>
          {t("toolbar.refresh")}
        </button>
        <div className="tasks-toolbar-spacer" />
        <input
          type="text"
          className="tasks-search"
          placeholder={t("toolbar.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* === TABLE === */}
      {paginatedTasks.length === 0 ? (
        <div className="tasks-empty">
          <p>{searchTerm ? t("table.noResults") : t("table.noTasks")}</p>
        </div>
      ) : (
        <div className="tasks-table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>{t("table.task")}</th>
                <th>{t("table.status")}</th>
                <th>{t("table.startDate")}</th>
                <th>{t("table.doneDate")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTasks.map(task => (
                <tr key={task.id}>
                  <td>{getFunctionLabel(task.function)}</td>
                  <td><Badge status={task.status as TaskStatus} /></td>
                  <td>{formatDate(task.startDate)}</td>
                  <td>{formatDate(task.doneDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* === PAGINATION === */}
      <div className="tasks-pagination">
        <span className="tasks-pagination-info">
          {t("pagination.showing")} {startIndex + 1}-{endIndex} {t("pagination.of")} {totalItems}
        </span>
        <div className="tasks-pagination-controls">
          <span className="tasks-pagination-label">{t("pagination.perPage")}</span>
          <select
            className="tasks-pagination-select"
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <div className="tasks-pagination-buttons">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={currentPage === page ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TasksTab;
