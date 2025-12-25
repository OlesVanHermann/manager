import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tasksService, getTaskStateBadgeClass } from "./TasksTab.service";
import type { Task } from "../../vmware.types";
import "./TasksTab.css";
export default function TasksTab({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { loadData(); }, [serviceId]);
  const loadData = async () => { try { setLoading(true); setError(null); setTasks(await tasksService.getTasks(serviceId)); } catch (e) { setError(e instanceof Error ? e.message : "Erreur"); } finally { setLoading(false); } };
  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadData}>{tCommon("actions.retry")}</button></div>;
  if (!tasks.length) return <div className="tasks-empty"><h2>{t("tasks.empty.title")}</h2></div>;
  return (
    <div className="tasks-tab">
      <div className="tasks-toolbar"><h2>{t("tasks.title")}</h2><button className="btn btn-outline" onClick={loadData}>{tCommon("actions.refresh")}</button></div>
      <table className="tasks-table"><thead><tr><th>{t("tasks.columns.name")}</th><th>{t("tasks.columns.state")}</th><th>{t("tasks.columns.progress")}</th><th>{t("tasks.columns.started")}</th><th>{t("tasks.columns.ended")}</th></tr></thead>
        <tbody>{tasks.map((t) => <tr key={t.taskId}><td>{t.name}</td><td><span className={`status-badge ${getTaskStateBadgeClass(t.state)}`}>{t.state}</span></td><td>{t.progress}%</td><td>{new Date(t.startDate).toLocaleString("fr-FR")}</td><td>{t.endDate ? new Date(t.endDate).toLocaleString("fr-FR") : "-"}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
