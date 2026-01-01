// ============================================================
// API MXPLAN MODERN - Tâches
// Endpoints APIv6: /email/mxplan/{service}/task/*
// Endpoints 2API: /sws/emailpro/{service}/tasks avec isMXPlan=true
// ============================================================

import { apiFetch, ovh2apiGet } from "../../../../../services/api";

const BASE = "/email/mxplan";
const BASE_2API = "/sws/emailpro";

// ---------- TYPES ----------

export interface MxPlanModernTask {
  id: number;
  function: string;
  status: "cancelled" | "doing" | "done" | "error" | "todo";
  todoDate: string;
  finishDate?: string;
}

export interface TaskListResult {
  list: {
    results: MxPlanModernTask[];
    count: number;
  };
}

// ---------- APIv6 CALLS ----------

/**
 * Liste des tâches (APIv6)
 */
export async function list(serviceId: string): Promise<number[]> {
  return apiFetch<number[]>(`${BASE}/${serviceId}/task`);
}

/**
 * Détails d'une tâche (APIv6)
 */
export async function get(serviceId: string, taskId: number): Promise<MxPlanModernTask> {
  return apiFetch<MxPlanModernTask>(`${BASE}/${serviceId}/task/${taskId}`);
}

/**
 * Liste complète des tâches avec détails
 */
export async function listWithDetails(serviceId: string): Promise<MxPlanModernTask[]> {
  const ids = await list(serviceId);
  const tasks = await Promise.all(
    ids.map(id => get(serviceId, id))
  );
  return tasks;
}

// ---------- 2API CALLS ----------

/**
 * Liste paginée des tâches (2API)
 * Équivalent old_manager: getMxTasks
 */
export async function list2api(
  serviceId: string,
  options?: { count?: number; offset?: number }
): Promise<TaskListResult> {
  return ovh2apiGet<TaskListResult>(`${BASE_2API}/${serviceId}/tasks`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    isMXPlan: 1,
  });
}
