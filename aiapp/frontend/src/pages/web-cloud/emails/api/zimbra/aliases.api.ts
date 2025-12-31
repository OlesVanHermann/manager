// ============================================================
// API ZIMBRA - Aliases
// Endpoints: /email/zimbra/{organization}/{platform}/alias/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/zimbra";

// ---------- TYPES ----------

export interface ZimbraAlias {
  id: string;
  alias: string;
  targetAccountId: string;
  organizationId: string;
  status: "ok" | "deleting";
  createdAt: string;
}

export interface CreateAliasParams {
  alias: string;
  targetAccountId: string;
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

export async function list(serviceId: string): Promise<ZimbraAlias[]> {
  const { org, platform } = parsePlatformId(serviceId);
  const ids = await apiFetch<string[]>(`${BASE}/${org}/${platform}/alias`);

  const aliases = await Promise.all(
    ids.map(id => get(id, serviceId))
  );

  return aliases;
}

export async function get(id: string, serviceId: string): Promise<ZimbraAlias> {
  const { org, platform } = parsePlatformId(serviceId);
  return apiFetch<ZimbraAlias>(`${BASE}/${org}/${platform}/alias/${id}`);
}

export async function create(data: CreateAliasParams, serviceId: string): Promise<ZimbraAlias> {
  const { org, platform } = parsePlatformId(serviceId);
  return apiFetch<ZimbraAlias>(`${BASE}/${org}/${platform}/alias`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function remove(id: string, serviceId: string): Promise<void> {
  const { org, platform } = parsePlatformId(serviceId);
  await apiFetch(`${BASE}/${org}/${platform}/alias/${id}`, {
    method: "DELETE",
  });
}

export { remove as delete };

// ---------- BY ACCOUNT ----------

export async function listByAccount(accountId: string, serviceId: string): Promise<ZimbraAlias[]> {
  const all = await list(serviceId);
  return all.filter(a => a.targetAccountId === accountId);
}
