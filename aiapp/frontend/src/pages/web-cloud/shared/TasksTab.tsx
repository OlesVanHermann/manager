// ============================================================
// TASKS TAB - Onglet tâches générique
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { OvhTask, DetailTabProps } from "./types";
import "../styles.css";

interface TasksTabProps extends DetailTabProps {
  fetchTasks: (serviceName: string) => Promise<number[]>;
  fetchTask: (serviceName: string, id: number) => Promise<OvhTask>;
  i18nNamespace: string;
}

/** Onglet affichant les tâches en cours pour un service. */
export function TasksTab({ serviceName, fetchTasks, fetchTask, i18nNamespace }: TasksTabProps) {
  const { t } = useTranslation(i18nNamespace);
  const { t: tCommon } = useTranslation("common");

  const [tasks, setTasks] = useState<OvhTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await fetchTasks(serviceName);
        const details = await Promise.all(ids.slice(0, 20).map((id) => fetchTask(serviceName, id)));
        setTasks(details.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName, fetchTasks, fetchTask]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "done": return "success";
      case "doing": case "init": case "todo": return "info";
      case "error": return "error";
      case "cancelled": return "warning";
      default: return "";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="empty-state"><p>{tCommon("loading")}</p></div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>{t("tasks.empty")}</h3>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h3 className="section-title">{t("tasks.title")}</h3>
        <span className="section-count">{tasks.length} tâche(s)</span>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>{t("tasks.function")}</th>
            <th>{t("tasks.status")}</th>
            <th>{t("tasks.started")}</th>
            <th>{t("tasks.finished")}</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.function}</td>
              <td><span className={`status-badge ${getStatusClass(task.status)}`}>{task.status}</span></td>
              <td>{formatDate(task.startDate)}</td>
              <td>{task.doneDate ? formatDate(task.doneDate) : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
