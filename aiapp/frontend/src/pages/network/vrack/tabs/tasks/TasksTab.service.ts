// ============================================================
// VRACK Tasks Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { VrackTask } from "../../vrack.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    done: "vrack-tasks-badge-success",
    doing: "vrack-tasks-badge-info",
    todo: "vrack-tasks-badge-warning",
    init: "vrack-tasks-badge-warning",
    cancelled: "vrack-tasks-badge-inactive",
  };
  return map[status] || "vrack-tasks-badge-inactive";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("fr-FR");
}

function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

// ==================== API CALLS ====================

async function listTasks(serviceName: string): Promise<number[]> {
  return ovhGet<number[]>(`/vrack/${serviceName}/task`);
}

async function getTask(serviceName: string, taskId: number): Promise<VrackTask> {
  return ovhGet<VrackTask>(`/vrack/${serviceName}/task/${taskId}`);
}

async function getAllTasks(serviceName: string): Promise<VrackTask[]> {
  const ids = await listTasks(serviceName);
  const tasks = await Promise.all(
    ids.slice(0, 50).map((id) => getTask(serviceName, id))
  );
  return tasks.sort(
    (a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
  );
}

// ==================== SERVICE OBJECT ====================

export const vrackTasksService = {
  listTasks,
  getTask,
  getAllTasks,
  getStatusBadgeClass,
  formatDate,
  formatDateShort,
};
