// ============================================================
// TAB: TASKS - Tâches en cours domaine + zone
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../../services/api";

// ============ TYPES ============

interface Task {
  id: number;
  function: string;
  status: "cancelled" | "doing" | "done" | "error" | "init" | "todo";
  startDate: string;
  doneDate: string | null;
  source: "domain" | "dns";
}

interface Props {
  name: string;
  hasDomain: boolean;
  hasZone: boolean;
}

// ============ ICONS ============

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
  </svg>
);

// ============ COMPOSANT PRINCIPAL ============

/** Onglet listant les tâches en cours sur le domaine et la zone DNS. */
export function TasksTab({ name, hasDomain, hasZone }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");

  // ---------- STATE ----------
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // ---------- LOAD TASKS ----------
  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const results: Task[] = [];

      if (hasDomain) {
        try {
          const domainTaskIds = await apiClient.get<number[]>(`/me/task/domain?domain=${name}`);
          for (const id of domainTaskIds.slice(0, 20)) {
            try {
              const task = await apiClient.get<any>(`/me/task/domain/${id}`);
              results.push({ ...task, source: "domain" as const });
            } catch {}
          }
        } catch {}
      }

      if (hasZone) {
        try {
          const dnsTaskIds = await apiClient.get<number[]>(`/me/task/dns?domain=${name}`);
          for (const id of dnsTaskIds.slice(0, 20)) {
            try {
              const task = await apiClient.get<any>(`/me/task/dns/${id}`);
              results.push({ ...task, source: "dns" as const });
            } catch {}
          }
        } catch {}
      }

      results.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      setTasks(results);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [name, hasDomain, hasZone]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // ---------- TASK ACTIONS ----------
  const handleAccelerate = async (taskId: number, source: "domain" | "dns") => {
    if (!confirm(t("tasks.confirmAccelerate"))) return;
    try {
      await apiClient.post(`/me/task/${source}/${taskId}/accelerate`, {});
      loadTasks();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleCancel = async (taskId: number, source: "domain" | "dns") => {
    if (!confirm(t("tasks.confirmCancel"))) return;
    try {
      await apiClient.post(`/me/task/${source}/${taskId}/cancel`, {});
      loadTasks();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleRelaunch = async (taskId: number, source: "domain" | "dns") => {
    if (!confirm(t("tasks.confirmRelaunch"))) return;
    try {
      await apiClient.post(`/me/task/${source}/${taskId}/relaunch`, {});
      loadTasks();
    } catch (err) {
      alert(String(err));
    }
  };

  // ---------- FILTERED TASKS ----------
  const filteredTasks = statusFilter === "all" ? tasks : tasks.filter((t) => t.status === statusFilter);

  // ---------- HELPERS ----------
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const getStatusBadge = (status: string) => {
    const map: Record<string, { class: string; label: string }> = {
      todo: { class: "info", label: t("tasks.status_todo") },
      init: { class: "info", label: t("tasks.status_todo") },
      doing: { class: "warning", label: t("tasks.status_doing") },
      done: { class: "success", label: t("tasks.status_done") },
      error: { class: "error", label: t("tasks.status_error") },
      cancelled: { class: "muted", label: t("tasks.status_cancelled") },
    };
    const s = map[status] || { class: "muted", label: status };
    return <span className={`badge ${s.class}`}>{s.label}</span>;
  };

  // ---------- RENDER LOADING ----------
  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" style={{ height: "40px" }} />
        <div className="skeleton-block" style={{ height: "200px" }} />
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="tasks-tab">
      <div className="tab-header">
        <div>
          <h3>{t("tasks.title")}</h3>
          <p className="tab-description">{t("tasks.description")}</p>
        </div>
        <div className="tab-header-actions">
          <button className="btn-secondary" onClick={loadTasks}><RefreshIcon /> {t("tasks.refresh")}</button>
        </div>
      </div>

      <div className="filters-row">
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">{t("tasks.allStatus")}</option>
          <option value="todo">{t("tasks.todo")}</option>
          <option value="doing">{t("tasks.doing")}</option>
          <option value="done">{t("tasks.statusDone")}</option>
          <option value="error">{t("tasks.error")}</option>
        </select>
        <span className="records-count">{filteredTasks.length} {t("tasks.count")}</span>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>{t("tasks.empty")}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("tasks.source")}</th>
                <th>{t("tasks.function")}</th>
                <th>{t("tasks.status")}</th>
                <th>{t("tasks.created")}</th>
                <th>{t("tasks.done")}</th>
                <th>{t("tasks.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={`${task.source}-${task.id}`}>
                  <td><span className={`badge ${task.source === "domain" ? "info" : "primary"}`}>{task.source}</span></td>
                  <td>{task.function}</td>
                  <td>{getStatusBadge(task.status)}</td>
                  <td>{formatDate(task.startDate)}</td>
                  <td>{task.doneDate ? formatDate(task.doneDate) : "-"}</td>
                  <td className="task-actions-cell">
                    {(task.status === "todo" || task.status === "doing") && (
                      <>
                        <button className="btn-icon" title={t("tasks.accelerate")} onClick={() => handleAccelerate(task.id, task.source)}>⚡</button>
                        <button className="btn-icon" title={t("tasks.cancel")} onClick={() => handleCancel(task.id, task.source)}>✕</button>
                      </>
                    )}
                    {task.status === "error" && (
                      <button className="btn-icon" title={t("tasks.relaunch")} onClick={() => handleRelaunch(task.id, task.source)}>🔄</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TasksTab;
