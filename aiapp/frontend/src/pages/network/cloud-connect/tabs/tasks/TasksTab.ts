// ============================================================
// CLOUD CONNECT Tasks Tab - Service isolé
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { CloudConnectTask } from "../../cloud-connect.types";

// ==================== API CALLS ====================

export async function getTasks(uuid: string): Promise<CloudConnectTask[]> {
  const ids = await ovhGet<number[]>(`/ovhCloudConnect/${uuid}/task`).catch(
    () => []
  );

  const tasks = await Promise.all(
    ids.slice(0, 50).map((id) =>
      ovhGet<CloudConnectTask>(`/ovhCloudConnect/${uuid}/task/${id}`)
    )
  );

  // Tri par date décroissante
  return tasks.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}

export async function getTask(
  uuid: string,
  taskId: number
): Promise<CloudConnectTask> {
  return ovhGet<CloudConnectTask>(`/ovhCloudConnect/${uuid}/task/${taskId}`);
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
