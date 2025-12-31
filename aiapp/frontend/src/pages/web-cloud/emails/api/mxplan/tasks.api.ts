// ============================================================
// API MX PLAN - Tâches
// Endpoints: /email/domain/{domain}/task/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/domain";

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
  const ids = await apiFetch<number[]>(`${BASE}/${domain}/task`);

  const tasks = await Promise.all(
    ids.map(id => get(domain, id))
  );

  return tasks;
}

export async function get(domain: string, id: number): Promise<MxPlanTask> {
  return apiFetch<MxPlanTask>(`${BASE}/${domain}/task/${id}`);
}
