// ============================================================
// API MXPLAN MODERN - Comptes email
// Endpoints APIv6: /email/mxplan/{service}/account/*
// Endpoints 2API: /sws/emailpro/{service}/* avec isMXPlan=true
// ============================================================

import { apiFetch, ovh2apiGet, ovh2apiPost, ovh2apiPut } from "../../../../../services/api";

const BASE = "/email/mxplan";
const BASE_2API = "/sws/emailpro";

// ---------- TYPES ----------

export interface MxPlanModernAccount {
  primaryEmailAddress: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  login: string;
  domain: string;
  quota: number;
  currentUsage: number;
  state: "ok" | "suspended" | "deleting";
  configured: boolean;
  spamAndVirusConfiguration: {
    checkDKIM: boolean;
    checkSPF: boolean;
    deleteSpam: boolean;
    putInJunk: boolean;
    tagSpam: boolean;
  };
  taskPendingId?: number;
}

export interface CreateAccountParams {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  login: string;
  domain: string;
  password: string;
}

// ---------- API CALLS (APIv6) ----------

export async function list(params: { serviceId?: string }): Promise<MxPlanModernAccount[]> {
  if (!params.serviceId) return [];

  const emails = await apiFetch<string[]>(`${BASE}/${params.serviceId}/account`);

  const accounts = await Promise.all(
    emails.map(email => get(email, params.serviceId!))
  );

  return accounts;
}

export async function get(id: string, serviceId: string): Promise<MxPlanModernAccount> {
  return apiFetch<MxPlanModernAccount>(`${BASE}/${serviceId}/account/${id}`);
}

export async function create(data: CreateAccountParams & { serviceId: string }): Promise<MxPlanModernAccount> {
  const { serviceId, ...body } = data;
  return apiFetch<MxPlanModernAccount>(`${BASE}/${serviceId}/account`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function update(id: string, serviceId: string, data: Partial<MxPlanModernAccount>): Promise<MxPlanModernAccount> {
  return apiFetch<MxPlanModernAccount>(`${BASE}/${serviceId}/account/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function remove(id: string, serviceId: string): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}/account/${id}`, {
    method: "DELETE",
  });
}

export { remove as delete };

export async function changePassword(id: string, serviceId: string, password: string): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}/account/${id}/changePassword`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

// ---------- ALIASES (APIv6) ----------

export async function getAliases(id: string, serviceId: string): Promise<string[]> {
  return apiFetch<string[]>(`${BASE}/${serviceId}/account/${id}/alias`);
}

export async function addAlias(id: string, serviceId: string, alias: string): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}/account/${id}/alias`, {
    method: "POST",
    body: JSON.stringify({ alias }),
  });
}

export async function removeAlias(id: string, serviceId: string, alias: string): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}/account/${id}/alias/${alias}`, {
    method: "DELETE",
  });
}

// ============================================================
// 2API ENDPOINTS - Pagination serveur & données agrégées
// Ces endpoints utilisent /sws/emailpro/* avec isMXPlan=true
// ============================================================

export interface AccountListResult {
  list: {
    results: MxPlanModernAccount[];
    count: number;
  };
}

export interface AccountCreationOptions {
  availableDomains: Array<{ name: string; displayName: string }>;
  maxQuota: number;
}

export interface AccountDelegationRight {
  account: string;
  sendRights: boolean;
  fullAccessRights: boolean;
  sendOnBehalfRights: boolean;
}

export interface DelegationRightsResult {
  list: {
    results: AccountDelegationRight[];
    count: number;
  };
}

// ---------- 2API CALLS ----------

/**
 * Liste paginée des comptes (2API) - pagination serveur
 * Équivalent old_manager: getAccountsForEmailPro avec isMXPlan=true
 */
export async function list2api(
  serviceId: string,
  options?: {
    count?: number;
    offset?: number;
    search?: string;
    configurableOnly?: number;
  }
): Promise<AccountListResult> {
  return ovh2apiGet<AccountListResult>(`${BASE_2API}/${serviceId}/accounts`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    search: options?.search ?? "",
    configurableOnly: options?.configurableOnly ?? 0,
    isMXPlan: 1, // Paramètre spécifique MXPlan Modern
  });
}

/**
 * Options de création de compte (2API)
 */
export async function getCreationOptions(serviceId: string): Promise<AccountCreationOptions> {
  return ovh2apiGet<AccountCreationOptions>(`${BASE_2API}/${serviceId}/accounts/options`, {
    isMXPlan: 1,
  });
}

/**
 * Renouvellement batch des comptes (2API)
 */
export async function renewAccounts(
  serviceId: string,
  accounts: Array<{ primaryEmailAddress: string; renewPeriod?: string }>
): Promise<void> {
  await ovh2apiPut(`${BASE_2API}/${serviceId}/accounts/renew`, {
    modelList: accounts,
    isMXPlan: true,
  });
}

/**
 * Droits de délégation d'un compte (2API)
 */
export async function getDelegationRights(
  serviceId: string,
  account: string,
  options?: { count?: number; offset?: number; search?: string }
): Promise<DelegationRightsResult> {
  return ovh2apiGet<DelegationRightsResult>(`${BASE_2API}/${serviceId}/accounts/${account}/rights`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    search: options?.search ?? "",
    isMXPlan: 1,
  });
}

/**
 * Mise à jour des droits de délégation (2API)
 */
export async function updateDelegationRights(
  serviceId: string,
  account: string,
  rights: {
    sendRights?: string[];
    fullAccessRights?: string[];
    sendOnBehalfRights?: string[];
  }
): Promise<void> {
  await ovh2apiPost(`${BASE_2API}/${serviceId}/accounts/${account}/rights-update`, {
    ...rights,
    isMXPlan: true,
  });
}

/**
 * Options pour alias (2API)
 */
export async function getAliasOptions(
  serviceId: string,
  emailAddress?: string
): Promise<{ availableDomains: Array<{ name: string; displayName: string }> }> {
  return ovh2apiGet(`${BASE_2API}/${serviceId}/aliasOptions`, {
    emailAddress: emailAddress ?? "",
    isMXPlan: 1,
  });
}

/**
 * Liste des alias via 2API avec pagination
 */
export async function getAliases2api(
  serviceId: string,
  account: string,
  options?: { count?: number; offset?: number }
): Promise<{ list: { results: Array<{ displayName: string }>; count: number } }> {
  return ovh2apiGet(`${BASE_2API}/${serviceId}/accounts/${account}/alias`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    isMXPlan: 1,
  });
}
