// ============================================================
// API MX PLAN - Comptes email
// Endpoints: /email/domain/{domain}/account/*
// ============================================================

import { apiFetch, ovh2apiGet } from "../../../../../services/api";

const BASE = "/email/domain";
const BASE_2API = "/sws/email-domain";

// ---------- TYPES ----------

export interface MxPlanAccount {
  accountName: string;
  domain: string;
  email: string;
  description?: string;
  size: number;           // Quota utilisé (bytes)
  quota?: number;         // Quota max (bytes)
  isBlocked: boolean;
}

export interface CreateAccountParams {
  accountName: string;
  password: string;
  description?: string;
  size?: number;
}

// ---------- API CALLS ----------

export async function list(params: { domain?: string }): Promise<MxPlanAccount[]> {
  if (!params.domain) return [];

  // GET /email/domain/{domain}/account returns list of account names
  const names = await apiFetch<string[]>(`${BASE}/${params.domain}/account`);

  // Fetch details for each account
  const accounts = await Promise.all(
    names.map(name => get(`${name}@${params.domain}`))
  );

  return accounts;
}

export async function get(id: string): Promise<MxPlanAccount> {
  const [accountName, domain] = id.split("@");
  return apiFetch<MxPlanAccount>(`${BASE}/${domain}/account/${accountName}`);
}

export async function create(data: CreateAccountParams & { domain: string }): Promise<MxPlanAccount> {
  const { domain, ...body } = data;
  return apiFetch<MxPlanAccount>(`${BASE}/${domain}/account`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function update(id: string, data: Partial<MxPlanAccount>): Promise<MxPlanAccount> {
  const [accountName, domain] = id.split("@");
  return apiFetch<MxPlanAccount>(`${BASE}/${domain}/account/${accountName}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function remove(id: string): Promise<void> {
  const [accountName, domain] = id.split("@");
  await apiFetch(`${BASE}/${domain}/account/${accountName}`, {
    method: "DELETE",
  });
}

// Alias for delete (reserved keyword)
export { remove as delete };

export async function changePassword(id: string, password: string): Promise<void> {
  const [accountName, domain] = id.split("@");
  await apiFetch(`${BASE}/${domain}/account/${accountName}/changePassword`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

// ---------- USAGE ----------

export interface AccountUsage {
  date: string;
  quota: number;
  emailCount?: number;
}

/**
 * Espace utilisé par un compte (APIv6)
 * Équivalent old_manager: getEmailUsage
 */
export async function getUsage(id: string): Promise<AccountUsage> {
  const [accountName, domain] = id.split("@");
  return apiFetch<AccountUsage>(`${BASE}/${domain}/account/${accountName}/usage`);
}

/**
 * Mettre à jour les informations d'usage (APIv6)
 * Équivalent old_manager: updateUsage
 */
export async function updateUsage(id: string): Promise<void> {
  const [accountName, domain] = id.split("@");
  await apiFetch(`${BASE}/${domain}/account/${accountName}/updateUsage`, {
    method: "POST",
  });
}

// ============================================================
// 2API ENDPOINTS - Pagination serveur
// Ces endpoints utilisent /sws/email-domain/* (2API)
// ============================================================

export interface AccountListResult {
  list: {
    results: MxPlanAccount[];
    count: number;
  };
}

/**
 * Liste paginée des comptes (2API) - pagination serveur
 * Équivalent old_manager: getAccounts avec pagination
 */
export async function list2api(
  domain: string,
  options?: { count?: number; offset?: number; search?: string }
): Promise<AccountListResult> {
  return ovh2apiGet<AccountListResult>(`${BASE_2API}/${domain}/accounts`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    search: options?.search ?? "",
  });
}
