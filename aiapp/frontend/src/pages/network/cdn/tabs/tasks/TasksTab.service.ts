// ============================================================
// CDN Tasks Tab - Service isolé
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { CdnTask } from "../../cdn.types";

// ==================== API CALLS ====================

export async function getTasks(serviceName: string): Promise<CdnTask[]> {
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

export async function getTask(
  serviceName: string,
  taskId: number
): Promise<CdnTask> {
  return ovhGet<CdnTask>(`/cdn/dedicated/${serviceName}/tasks/${taskId}`);
}

// ==================== HELPERS (DUPLIQUÉS - ISOLATION) ====================

export function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    done: "badge-success",
    doing: "badge-info",
    todo: "badge-warning",
    error: "badge-error",
    cancelled: "badge-inactive",
  };
  return classes[status] || "";
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("fr-FR");
}

// ==================== SERVICE OBJECT ====================

export const tasksService = {
  getTasks,
  getTask,
  getStatusBadgeClass,
  formatDate,
};
