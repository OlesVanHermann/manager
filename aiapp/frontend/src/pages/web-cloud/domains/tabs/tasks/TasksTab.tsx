// ============================================================
import "./TasksTab.css";
// TAB: TASKS - Tâches en cours domaine + zone
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { tasksService } from "./TasksTab.service";
import type { DomainTask, ZoneTask } from "../../domains.types";

// ============ TYPES ============

interface Task {
  id: number;
  function: string;
  status: "cancelled" | "doing" | "done" | "error" | "init" | "todo";
  comment?: string;
  creationDate?: string;
  doneDate?: string;
  lastUpdate?: string;
  source: "domain" | "zone";
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

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const LoaderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin">
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);

// ============ COMPOSANT PRINCIPAL ============

export function TasksTab({ name, hasDomain, hasZone }: Props) {
  const { t } = useTranslation("web-cloud/domains/tasks");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const results: Task[] = [];

      // Charger tâches domaine via /domain/{name}/task
      if (hasDomain) {
        try {
          const taskIds = await tasksService.listDomainTasks(name);
          for (const id of taskIds.slice(0, 20)) {
            try {
              const task = await tasksService.getDomainTask(name, id);
              results.push({ ...task, source: "domain" as const });
            } catch {}
          }
        } catch {}
      }

      // Charger tâches zone via /domain/zone/{name}/task
      if (hasZone) {
        try {
          const zoneTaskIds = await tasksService.listZoneTasks(name);
          for (const id of zoneTaskIds.slice(0, 20)) {
            try {
              const task = await tasksService.getZoneTask(name, id);
              results.push({ ...task, source: "zone" as const });
            } catch {}
          }
        } catch {}
      }

      // Tri par date
      results.sort((a, b) => {
        const dateA = a.lastUpdate || a.creationDate || "";
        const dateB = b.lastUpdate || b.creationDate || "";
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });

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

  const filteredTasks = statusFilter === "all" 
    ? tasks 
    : tasks.filter((t) => {
        if (statusFilter === "pending") return t.status === "todo" || t.status === "init";
        if (statusFilter === "doing") return t.status === "doing";
        if (statusFilter === "done") return t.status === "done";
        if (statusFilter === "error") return t.status === "error" || t.status === "cancelled";
        return true;
      });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done": return <CheckIcon />;
      case "doing": return <LoaderIcon />;
      case "error":
      case "cancelled": return <AlertIcon />;
      default: return <ClockIcon />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "done": return "status-done";
      case "doing": return "status-doing";
      case "error":
      case "cancelled": return "status-error";
      default: return "status-pending";
    }
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

  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  return (
    <div className="tasks-tab">
      <div className="tab-header">
        <div>
          <h3>{t("title")}</h3>
          <p className="tab-description">{t("description")}</p>
        </div>
        <div className="tab-header-actions">
          <button className="btn-secondary" onClick={loadTasks}>
            <RefreshIcon /> {t("refresh")}
          </button>
        </div>
      </div>

      <div className="tasks-filters">
        <div className="filter-buttons">
          <button className={`filter-btn ${statusFilter === "all" ? "active" : ""}`} onClick={() => setStatusFilter("all")}>
            {t("filters.all")}
          </button>
          <button className={`filter-btn ${statusFilter === "pending" ? "active" : ""}`} onClick={() => setStatusFilter("pending")}>
            {t("filters.pending")}
          </button>
          <button className={`filter-btn ${statusFilter === "doing" ? "active" : ""}`} onClick={() => setStatusFilter("doing")}>
            {t("filters.doing")}
          </button>
          <button className={`filter-btn ${statusFilter === "done" ? "active" : ""}`} onClick={() => setStatusFilter("done")}>
            {t("filters.done")}
          </button>
          <button className={`filter-btn ${statusFilter === "error" ? "active" : ""}`} onClick={() => setStatusFilter("error")}>
            {t("filters.error")}
          </button>
        </div>
        <span className="tasks-count">{filteredTasks.length} {t("taskCount")}</span>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <CheckIcon />
          <h3>{t("empty")}</h3>
          <p className="hint">{t("emptyHint")}</p>
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map((task) => (
            <div key={`${task.source}-${task.id}`} className={`task-card ${getStatusClass(task.status)}`}>
              <div className="task-icon">{getStatusIcon(task.status)}</div>
              <div className="task-content">
                <div className="task-function">{task.function}</div>
                {task.comment && <div className="task-comment">{task.comment}</div>}
                <div className="task-meta">
                  <span className="task-source">{task.source === "domain" ? "Domaine" : "Zone DNS"}</span>
                  <span className="task-date">{formatDate(task.lastUpdate || task.creationDate)}</span>
                </div>
              </div>
              <div className={`task-status ${getStatusClass(task.status)}`}>
                {t(`status.${task.status}`)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TasksTab;
