// ============================================================
// CLOUD CONNECT Tasks Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { CloudConnectTask } from "../../cloud-connect.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    done: "cloudconnect-tasks-badge-success",
    doing: "cloudconnect-tasks-badge-info",
    todo: "cloudconnect-tasks-badge-warning",
    error: "cloudconnect-tasks-badge-error",
    cancelled: "cloudconnect-tasks-badge-inactive",
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

async function getTasks(uuid: string): Promise<CloudConnectTask[]> {
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

async function getTask(
  uuid: string,
  taskId: number
): Promise<CloudConnectTask> {
  return ovhGet<CloudConnectTask>(`/ovhCloudConnect/${uuid}/task/${taskId}`);
}

// ==================== SERVICE OBJECT ====================

export const cloudconnectTasksService = {
  getTasks,
  getTask,
  getStatusBadgeClass,
  formatDate,
  formatDateShort,
};
