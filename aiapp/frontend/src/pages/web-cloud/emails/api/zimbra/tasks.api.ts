// ============================================================
// API ZIMBRA - Tâches
// Endpoints: /email/zimbra/{organization}/{platform}/task/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/zimbra";

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
