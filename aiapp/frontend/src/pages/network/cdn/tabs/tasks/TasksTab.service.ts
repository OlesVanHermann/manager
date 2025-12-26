// ============================================================
// CDN Tasks Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { CdnTask } from "../../cdn.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    done: "cdn-tasks-badge-success",
    doing: "cdn-tasks-badge-info",
    todo: "cdn-tasks-badge-warning",
    error: "cdn-tasks-badge-error",
    cancelled: "cdn-tasks-badge-inactive",
  };
  return classes[status] || "";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("fr-FR");
}

function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

// ==================== API CALLS ====================

async function getTasks(serviceName: string): Promise<CdnTask[]> {
  const ids = await ovhGet<number[]>(
    `/cdn/dedicated/${serviceName}/tasks`
  ).catch(() => []);

  const tasks = await Promise.all(
    ids.slice(0, 50).map((id) =>
      ovhGet<CdnTask>(`/cdn/dedicated/${serviceName}/tasks/${id}`)
    )
  );

  // Tri par date décroissante
  return tasks.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}

async function getTask(
  serviceName: string,
  taskId: number
): Promise<CdnTask> {
  return ovhGet<CdnTask>(`/cdn/dedicated/${serviceName}/tasks/${taskId}`);
}

// ==================== SERVICE OBJECT ====================

export const cdnTasksService = {
  getTasks,
  getTask,
  getStatusBadgeClass,
  formatDate,
  formatDateShort,
};
