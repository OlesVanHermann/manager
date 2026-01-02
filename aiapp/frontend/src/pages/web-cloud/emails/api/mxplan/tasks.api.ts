// ============================================================
// API MX PLAN - Tâches
// Endpoints: /email/domain/{domain}/task/*
// ============================================================

import { ovhGet, ovh2apiGet } from "../../../../../services/api";

const BASE = "/email/domain";
const BASE_2API = "/sws/email-domain";

// ---------- TYPES ----------

export interface MxPlanTask {
  id: number;
  function: string;
  status: "todo" | "doing" | "done" | "error";
  account?: string;
  todoDate?: string;
  doneDate?: string;
}

// ---------- API CALLS ----------

export async function list(domain: string): Promise<MxPlanTask[]> {
  const ids = await ovhGet<number[]>(`${BASE}/${domain}/task`);

  const tasks = await Promise.all(
    ids.map(id => get(domain, id))
  );

  return tasks;
}

export async function get(domain: string, id: number): Promise<MxPlanTask> {
  return ovhGet<MxPlanTask>(`${BASE}/${domain}/task/${id}`);
}

// ============================================================
// 2API ENDPOINTS - Pagination serveur
// Ces endpoints utilisent /sws/email-domain/* (2API)
// ============================================================

export interface TaskListResult {
  list: {
    results: Array<{
      id: number;
      todoDate: string;
      finishDate?: string;
      function: string;
      status: string;
      account?: string;
    }>;
    count: number;
  };
}

/**
 * Liste paginée des tâches (2API) - pagination serveur
 * Équivalent old_manager: getTasks avec pagination
 */
export async function list2api(
  domain: string,
  options?: { count?: number; offset?: number }
): Promise<TaskListResult> {
  return ovh2apiGet<TaskListResult>(`${BASE_2API}/${domain}/tasks`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
  });
}
