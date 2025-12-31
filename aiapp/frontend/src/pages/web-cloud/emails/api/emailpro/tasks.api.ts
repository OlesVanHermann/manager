// ============================================================
// API EMAIL PRO - Tâches
// Endpoints: /email/pro/{service}/task/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/pro";

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
