// ============================================================
// VRACK Tasks Tab - Service isolé (extrait de network.ts)
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { VrackTask } from "../../vrack.types";

export async function listTasks(serviceName: string): Promise<number[]> {
  return ovhGet<number[]>(`/vrack/${serviceName}/task`);
}

export async function getTask(serviceName: string, taskId: number): Promise<VrackTask> {
  return ovhGet<VrackTask>(`/vrack/${serviceName}/task/${taskId}`);
}

export async function getAllTasks(serviceName: string): Promise<VrackTask[]> {
  const ids = await listTasks(serviceName);
  const tasks = await Promise.all(ids.slice(0, 50).map((id) => getTask(serviceName, id)));
  return tasks.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
}

export function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = { done: "badge-success", doing: "badge-info", todo: "badge-warning", init: "badge-warning", cancelled: "badge-inactive" };
  return map[status] || "badge-inactive";
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("fr-FR");
}

export const tasksService = { listTasks, getTask, getAllTasks, getStatusBadgeClass, formatDate };
