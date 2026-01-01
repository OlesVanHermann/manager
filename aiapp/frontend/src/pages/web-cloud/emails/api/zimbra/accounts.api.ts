// ============================================================
// API ZIMBRA - Comptes email
// Endpoints: /email/zimbra/{organization}/{platform}/account/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/zimbra";
const BASE_V2 = "/v2/email/zimbra/platform";

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

// ============================================================
// API V2 ENDPOINTS - Pagination native Iceberg
// Ces endpoints utilisent /v2/email/zimbra/platform/* (API v2)
// ============================================================

export interface AccountListResultV2 {
  data: ZimbraAccount[];
  links: {
    next?: { href: string };
    prev?: { href: string };
    self: { href: string };
  };
  currentCursor?: string;
  nextCursor?: string;
}

/**
 * Liste paginée des comptes (API v2) - pagination Iceberg native
 * Équivalent old_manager: getAccounts avec pagination
 */
export async function listV2(
  platformId: string,
  options?: { pageSize?: number; cursor?: string }
): Promise<AccountListResultV2> {
  const params = new URLSearchParams();
  if (options?.pageSize) params.set("pageSize", String(options.pageSize));
  if (options?.cursor) params.set("cursor", options.cursor);

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<AccountListResultV2>(`${BASE_V2}/${platformId}/account${query}`);
}

/**
 * Détails d'un compte (API v2)
 */
export async function getV2(platformId: string, accountId: string): Promise<ZimbraAccount> {
  return apiFetch<ZimbraAccount>(`${BASE_V2}/${platformId}/account/${accountId}`);
}

/**
 * Création de compte (API v2)
 */
export async function createV2(
  platformId: string,
  data: Omit<CreateAccountParams, "offer"> & { offerId?: string }
): Promise<ZimbraAccount> {
  return apiFetch<ZimbraAccount>(`${BASE_V2}/${platformId}/account`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Mise à jour compte (API v2)
 */
export async function updateV2(
  platformId: string,
  accountId: string,
  data: Partial<ZimbraAccount>
): Promise<ZimbraAccount> {
  return apiFetch<ZimbraAccount>(`${BASE_V2}/${platformId}/account/${accountId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Suppression compte (API v2)
 */
export async function removeV2(platformId: string, accountId: string): Promise<void> {
  await apiFetch(`${BASE_V2}/${platformId}/account/${accountId}`, {
    method: "DELETE",
  });
}

export { removeV2 as deleteV2 };

/**
 * Changement mot de passe (API v2)
 */
export async function changePasswordV2(
  platformId: string,
  accountId: string,
  password: string
): Promise<void> {
  await apiFetch(`${BASE_V2}/${platformId}/account/${accountId}/changePassword`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}
