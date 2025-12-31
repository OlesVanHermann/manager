// ============================================================
// API EXCHANGE - Tâches
// Endpoints: /email/exchange/{org}/service/{service}/task/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/exchange";

// ---------- TYPES ----------

export interface ExchangeTask {
  id: number;
  function: string;
  status: "todo" | "doing" | "done" | "error";
  todoDate?: string;
  doneDate?: string;
  finishDate?: string;
}

// ---------- HELPERS ----------

function getServicePath(serviceId: string): string {
  const [org, service] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE}/${org}/service/${service}`;
}

// ---------- API CALLS ----------

export async function list(domain: string, serviceId?: string): Promise<ExchangeTask[]> {
  if (!serviceId) return [];

  const basePath = getServicePath(serviceId);
  const ids = await apiFetch<number[]>(`${basePath}/task`);

  const tasks = await Promise.all(
    ids.slice(0, 50).map(id => get(domain, id, serviceId)) // Limit to 50 recent tasks
  );

  return tasks;
}

export async function get(domain: string, id: number, serviceId?: string): Promise<ExchangeTask> {
  if (!serviceId) throw new Error("serviceId required");
  const basePath = getServicePath(serviceId);
  return apiFetch<ExchangeTask>(`${basePath}/task/${id}`);
}
