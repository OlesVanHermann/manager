// ============================================================
// API ZIMBRA - Comptes email
// Endpoints: /email/zimbra/{organization}/{platform}/account/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/zimbra";

// ---------- TYPES ----------

export interface ZimbraAccount {
  id: string;
  emailAddress: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  organizationId: string;
  offer: "starter" | "business" | "enterprise";
  quota: number;
  currentUsage?: number;
  status: "ok" | "suspended" | "deleting";
  lastLoginDate?: string;
  createdAt: string;
  taskPendingId?: string;
}

export interface CreateAccountParams {
  emailAddress: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  password: string;
  offer: "starter" | "business" | "enterprise";
}

// ---------- HELPERS ----------

function parsePlatformId(serviceId: string): { org: string; platform: string } {
  // serviceId format: "org/platform" or just "platform"
  const parts = serviceId.split("/");
  return {
    org: parts[0],
    platform: parts[1] || parts[0],
  };
}

// ---------- API CALLS ----------

export async function list(params: { serviceId?: string }): Promise<ZimbraAccount[]> {
  if (!params.serviceId) return [];

  const { org, platform } = parsePlatformId(params.serviceId);
  const ids = await apiFetch<string[]>(`${BASE}/${org}/${platform}/account`);

  const accounts = await Promise.all(
    ids.map(id => get(id, params.serviceId!))
  );

  return accounts;
}

export async function get(id: string, serviceId: string): Promise<ZimbraAccount> {
  const { org, platform } = parsePlatformId(serviceId);
  return apiFetch<ZimbraAccount>(`${BASE}/${org}/${platform}/account/${id}`);
}

export async function create(data: CreateAccountParams & { serviceId: string }): Promise<ZimbraAccount> {
  const { serviceId, ...body } = data;
  const { org, platform } = parsePlatformId(serviceId);
  return apiFetch<ZimbraAccount>(`${BASE}/${org}/${platform}/account`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function update(id: string, serviceId: string, data: Partial<ZimbraAccount>): Promise<ZimbraAccount> {
  const { org, platform } = parsePlatformId(serviceId);
  return apiFetch<ZimbraAccount>(`${BASE}/${org}/${platform}/account/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function remove(id: string, serviceId: string): Promise<void> {
  const { org, platform } = parsePlatformId(serviceId);
  await apiFetch(`${BASE}/${org}/${platform}/account/${id}`, {
    method: "DELETE",
  });
}

export { remove as delete };

export async function changePassword(id: string, serviceId: string, password: string): Promise<void> {
  const { org, platform } = parsePlatformId(serviceId);
  await apiFetch(`${BASE}/${org}/${platform}/account/${id}/changePassword`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}
