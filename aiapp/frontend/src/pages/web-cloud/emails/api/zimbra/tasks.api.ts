// ============================================================
// API ZIMBRA - Tâches
// Endpoints: /email/zimbra/{organization}/{platform}/task/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/zimbra";
const BASE_V2 = "/v2/email/zimbra/platform";

// ---------- TYPES ----------

export interface ZimbraTask {
  id: string;
  action: string;
  status: "pending" | "running" | "done" | "error";
  createdAt: string;
  finishedAt?: string;
  resourceId?: string;
  message?: string;
}

// ---------- HELPERS ----------

function parsePlatformId(serviceId: string): { org: string; platform: string } {
  const parts = serviceId.split("/");
  return {
    org: parts[0],
    platform: parts[1] || parts[0],
  };
}

// ---------- API CALLS ----------

export async function list(domain: string, serviceId?: string): Promise<ZimbraTask[]> {
  if (!serviceId) return [];

  const { org, platform } = parsePlatformId(serviceId);

  try {
    const ids = await apiFetch<string[]>(`${BASE}/${org}/${platform}/task`);

    const tasks = await Promise.all(
      ids.slice(0, 50).map(id => get(domain, id, serviceId))
    );

    return tasks;
  } catch {
    return [];
  }
}

export async function get(domain: string, id: string | number, serviceId?: string): Promise<ZimbraTask> {
  if (!serviceId) throw new Error("serviceId required");

  const { org, platform } = parsePlatformId(serviceId);
  return apiFetch<ZimbraTask>(`${BASE}/${org}/${platform}/task/${id}`);
}

// ============================================================
// API V2 ENDPOINTS - Pagination native Iceberg
// Ces endpoints utilisent /v2/email/zimbra/platform/* (API v2)
// ============================================================

export interface TaskListResultV2 {
  data: ZimbraTask[];
  links: {
    next?: { href: string };
    prev?: { href: string };
    self: { href: string };
  };
  currentCursor?: string;
  nextCursor?: string;
}

/**
 * Liste paginée des tâches (API v2) - pagination Iceberg native
 * Équivalent old_manager: getTasks avec pagination
 */
export async function listV2(
  platformId: string,
  options?: { pageSize?: number; cursor?: string }
): Promise<TaskListResultV2> {
  const params = new URLSearchParams();
  if (options?.pageSize) params.set("pageSize", String(options.pageSize));
  if (options?.cursor) params.set("cursor", options.cursor);

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<TaskListResultV2>(`${BASE_V2}/${platformId}/task${query}`);
}

/**
 * Détails d'une tâche (API v2)
 */
export async function getV2(platformId: string, taskId: string): Promise<ZimbraTask> {
  return apiFetch<ZimbraTask>(`${BASE_V2}/${platformId}/task/${taskId}`);
}
