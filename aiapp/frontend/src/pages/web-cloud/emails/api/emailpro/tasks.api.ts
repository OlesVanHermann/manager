// ============================================================
// API EMAIL PRO - Tâches
// Endpoints: /email/pro/{service}/task/*
// ============================================================

import { apiFetch, ovh2apiGet } from "../../../../../services/api";

const BASE = "/email/pro";
const BASE_2API = "/sws/emailpro";

// ---------- TYPES ----------

export interface EmailProTask {
  id: number;
  function: string;
  status: "todo" | "doing" | "done" | "error";
  todoDate?: string;
  doneDate?: string;
  finishDate?: string;
}

// ---------- API CALLS ----------

export async function list(domain: string, serviceId?: string): Promise<EmailProTask[]> {
  if (!serviceId) return [];

  const ids = await apiFetch<number[]>(`${BASE}/${serviceId}/task`);

  const tasks = await Promise.all(
    ids.slice(0, 50).map(id => get(domain, id, serviceId))
  );

  return tasks;
}

export async function get(domain: string, id: number, serviceId?: string): Promise<EmailProTask> {
  if (!serviceId) throw new Error("serviceId required");
  return apiFetch<EmailProTask>(`${BASE}/${serviceId}/task/${id}`);
}

// ============================================================
// 2API ENDPOINTS - Pagination serveur
// Ces endpoints utilisent /sws/emailpro/* (2API)
// ============================================================

export interface TaskListResult {
  list: {
    results: Array<{
      id: number;
      todoDate: string;
      finishDate?: string;
      function: string;
      status: string;
    }>;
    count: number;
  };
}

/**
 * Liste paginée des tâches (2API) - pagination serveur
 * Équivalent old_manager: getTasks
 */
export async function list2api(
  serviceId: string,
  options?: { count?: number; offset?: number }
): Promise<TaskListResult> {
  return ovh2apiGet<TaskListResult>(`${BASE_2API}/${serviceId}/tasks`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
  });
}
