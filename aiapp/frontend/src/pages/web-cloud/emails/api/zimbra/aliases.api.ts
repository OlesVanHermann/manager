// ============================================================
// API ZIMBRA - Aliases
// Endpoints: /email/zimbra/{organization}/{platform}/alias/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/zimbra";
const BASE_V2 = "/v2/email/zimbra/platform";

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

// ============================================================
// API V2 ENDPOINTS - Pagination native Iceberg
// Ces endpoints utilisent /v2/email/zimbra/platform/* (API v2)
// ============================================================

export interface AliasListResultV2 {
  data: ZimbraAlias[];
  links: {
    next?: { href: string };
    prev?: { href: string };
    self: { href: string };
  };
  currentCursor?: string;
  nextCursor?: string;
}

/**
 * Liste paginée des alias (API v2) - pagination Iceberg native
 */
export async function listV2(
  platformId: string,
  options?: { pageSize?: number; cursor?: string }
): Promise<AliasListResultV2> {
  const params = new URLSearchParams();
  if (options?.pageSize) params.set("pageSize", String(options.pageSize));
  if (options?.cursor) params.set("cursor", options.cursor);

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<AliasListResultV2>(`${BASE_V2}/${platformId}/alias${query}`);
}

/**
 * Détails d'un alias (API v2)
 */
export async function getV2(platformId: string, aliasId: string): Promise<ZimbraAlias> {
  return apiFetch<ZimbraAlias>(`${BASE_V2}/${platformId}/alias/${aliasId}`);
}

/**
 * Création d'alias (API v2)
 */
export async function createV2(platformId: string, data: CreateAliasParams): Promise<ZimbraAlias> {
  return apiFetch<ZimbraAlias>(`${BASE_V2}/${platformId}/alias`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Suppression d'alias (API v2)
 */
export async function removeV2(platformId: string, aliasId: string): Promise<void> {
  await apiFetch(`${BASE_V2}/${platformId}/alias/${aliasId}`, {
    method: "DELETE",
  });
}

export { removeV2 as deleteV2 };
