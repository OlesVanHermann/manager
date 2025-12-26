import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { tasksService } from "./TasksTab.service";
import type { ManagedWordPressTask } from "../../managed-wordpress.types";
import "./TasksTab.css";

interface Props { serviceName: string; }

const POLL_INTERVAL = 30000;

export function TasksTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/managed-wordpress/index");
  const [tasks, setTasks] = useState<ManagedWordPressTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadTasks = useCallback(async (showLoading = true) => {
    try { if (showLoading) setLoading(true); const data = await tasksService.listTasks(serviceName); setTasks(data || []); }
    catch (err) { setError(String(err)); } finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadTasks(); }, [loadTasks]);
  useEffect(() => { if (!autoRefresh) return; const i = setInterval(() => loadTasks(false), POLL_INTERVAL); return () => clearInterval(i); }, [autoRefresh, loadTasks]);

  const getStatusBadge = (s: string) => ({ todo: { class: "warning", label: "À faire" }, init: { class: "info", label: "Init" }, doing: { class: "info", label: "En cours" }, done: { class: "success", label: "Terminé" }, error: { class: "error", label: "Erreur" }, cancelled: { class: "inactive", label: "Annulé" } }[s] || { class: "inactive", label: s });
  const formatDate = (d?: string) => d ? new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";
  const formatFunction = (fn: string) => ({ "wordpress/install": "Installation WordPress", "wordpress/update": "Mise à jour WordPress", "plugin/update": "Mise à jour extension", "theme/update": "Mise à jour thème", "backup/create": "Création sauvegarde", "backup/restore": "Restauration sauvegarde", "cache/flush": "Vidage cache" }[fn] || fn);

  if (loading) return <div className="mwp-tasks-loading"><div className="mwp-tasks-skeleton" /></div>;
  if (error) return <div className="mwp-tasks-error">{error}</div>;

  return (
    <div className="tasks-tab">
      <div className="tasks-header">
        <h3>{t("tasks.title")}</h3>
        <div className="tasks-actions">
          <label className="tasks-checkbox-label"><input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} /> {t("tasks.autoRefresh")}</label>
          <button className="mwp-tasks-btn-icon" onClick={() => loadTasks()} title={t("tasks.refresh")}>↻</button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="tasks-empty"><span className="tasks-empty-icon">✅</span><h4>{t("tasks.empty")}</h4></div>
      ) : (
        <table className="tasks-table">
          <thead><tr><th>{t("tasks.operation")}</th><th>{t("tasks.status")}</th><th>{t("tasks.started")}</th><th>{t("tasks.finished")}</th></tr></thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{formatFunction(task.function)}</td>
                <td><span className={`mwp-tasks-badge ${getStatusBadge(task.status).class}`}>{getStatusBadge(task.status).label}</span></td>
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
