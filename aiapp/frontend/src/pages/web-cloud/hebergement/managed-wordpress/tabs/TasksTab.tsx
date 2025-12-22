// ============================================================
// MANAGED WORDPRESS TAB: TASKS
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { managedWordPressService } from "../../../../../services/web-cloud.managed-wordpress";

interface Props { serviceName: string; }

interface Task {
  id: string;
  function: string;
  status: string;
  startDate: string;
  doneDate?: string;
}

const POLL_INTERVAL = 30000;

/** Onglet Tâches WordPress Managé. */
export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/managed-wordpress/index");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // ---------- LOAD ----------
  const loadTasks = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await managedWordPressService.listTasks(serviceName);
      setTasks(data || []);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => loadTasks(false), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [autoRefresh, loadTasks]);

  // ---------- HELPERS ----------
  const getStatusBadge = (status: string) => {
    const map: Record<string, { class: string; label: string }> = {
      todo: { class: "warning", label: "À faire" },
      init: { class: "info", label: "Initialisation" },
      doing: { class: "info", label: "En cours" },
      done: { class: "success", label: "Terminé" },
      error: { class: "error", label: "Erreur" },
      cancelled: { class: "inactive", label: "Annulé" },
    };
    return map[status] || { class: "inactive", label: status };
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFunction = (fn: string) => {
    const map: Record<string, string> = {
      "wordpress/install": "Installation WordPress",
      "wordpress/update": "Mise à jour WordPress",
      "plugin/update": "Mise à jour extension",
      "theme/update": "Mise à jour thème",
      "backup/create": "Création sauvegarde",
      "backup/restore": "Restauration sauvegarde",
      "cache/flush": "Vidage cache",
    };
    return map[fn] || fn;
  };

  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
      </div>
    );
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  // ---------- RENDER ----------
  return (
    <div className="wp-tasks-tab">
      <div className="tab-header">
        <div>
          <h3>{t("tasks.title")}</h3>
        </div>
        <div className="tab-actions">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={e => setAutoRefresh(e.target.checked)}
            />
            {t("tasks.autoRefresh")}
          </label>
          <button className="btn-icon" onClick={() => loadTasks()} title={t("tasks.refresh")}>
            ↻
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">✅</span>
          <h4>{t("tasks.empty")}</h4>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("tasks.operation")}</th>
              <th>{t("tasks.status")}</th>
              <th>{t("tasks.started")}</th>
              <th>{t("tasks.finished")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{formatFunction(task.function)}</td>
                <td>
                  <span className={`badge ${getStatusBadge(task.status).class}`}>
                    {getStatusBadge(task.status).label}
                  </span>
                </td>
                <td>{formatDate(task.startDate)}</td>
                <td>{formatDate(task.doneDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TasksTab;
