// ============================================================
// API EXCHANGE - Comptes email
// Endpoints apiv6: /email/exchange/{org}/service/{service}/account/*
// Endpoints 2API: /sws/exchange/{org}/{exchange}/*
// ============================================================

import { apiFetch, ovh2apiGet, ovh2apiPost, ovh2apiPut } from "../../../../../services/api";

const BASE = "/email/exchange";
const BASE_2API = "/sws/exchange";

// ---------- TYPES ----------

export interface ExchangeAccount {
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
  mfaEnabled?: boolean;
  hiddenFromGAL?: boolean;
  mailingFilter?: string[];
  outlookLicense?: boolean;
  company?: string;
  taskPendingId?: number;
}

export interface CreateAccountParams {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  login: string;
  domain: string;
  password: string;
  license: string;
  company?: string;
}

// ---------- HELPERS ----------

function getServicePath(serviceId: string): string {
  // serviceId format: "org/service" or just use org as service
  const [org, service] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE}/${org}/service/${service}`;
}

// ---------- API CALLS ----------

export async function list(params: { serviceId?: string }): Promise<ExchangeAccount[]> {
  if (!params.serviceId) return [];

  const basePath = getServicePath(params.serviceId);
  const emails = await apiFetch<string[]>(`${basePath}/account`);

  const accounts = await Promise.all(
    emails.map(email => get(email, params.serviceId!))
  );

  return accounts;
}

export async function get(id: string, serviceId: string): Promise<ExchangeAccount> {
  const basePath = getServicePath(serviceId);
  return apiFetch<ExchangeAccount>(`${basePath}/account/${id}`);
}

export async function create(data: CreateAccountParams & { serviceId: string }): Promise<ExchangeAccount> {
  const { serviceId, ...body } = data;
  const basePath = getServicePath(serviceId);
  return apiFetch<ExchangeAccount>(`${basePath}/account`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function update(id: string, serviceId: string, data: Partial<ExchangeAccount>): Promise<ExchangeAccount> {
  const basePath = getServicePath(serviceId);
  return apiFetch<ExchangeAccount>(`${basePath}/account/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function remove(id: string, serviceId: string): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/account/${id}`, {
    method: "DELETE",
  });
}

export { remove as delete };

export async function changePassword(id: string, serviceId: string, password: string): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/account/${id}/changePassword`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

// ---------- ALIASES ----------

export async function getAliases(id: string, serviceId: string): Promise<string[]> {
  const basePath = getServicePath(serviceId);
  return apiFetch<string[]>(`${basePath}/account/${id}/alias`);
}

export async function addAlias(id: string, serviceId: string, alias: string): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/account/${id}/alias`, {
    method: "POST",
    body: JSON.stringify({ alias }),
  });
}

export async function removeAlias(id: string, serviceId: string, alias: string): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/account/${id}/alias/${alias}`, {
    method: "DELETE",
  });
}

// ---------- MFA ----------

export async function enableMfa(id: string, serviceId: string): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/account/${id}/protocol`, {
    method: "PUT",
    body: JSON.stringify({ IMAP: false, POP: false, webMail: true }),
  });
}

// ============================================================
// 2API ENDPOINTS - Pagination serveur & données agrégées
// Ces endpoints utilisent /sws/exchange/* (2API)
// ============================================================

// ---------- 2API TYPES ----------

export interface AccountListResult {
  list: {
    results: ExchangeAccount[];
    count: number;
  };
}

export interface AccountCreationOptions {
  availableDomains: Array<{ name: string; displayName: string }>;
  availableLicenses: string[];
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

// ---------- 2API HELPERS ----------

function get2apiPath(serviceId: string): string {
  const [org, exchange] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE_2API}/${org}/${exchange}`;
}

// ---------- 2API CALLS ----------

/**
 * Liste paginée des comptes (2API) - pagination serveur
 * Équivalent old_manager: getAccountsForExchange
 */
export async function list2api(
  serviceId: string,
  options?: {
    count?: number;
    offset?: number;
    search?: string;
    configurableOnly?: number;
    typeLicence?: string;
  }
): Promise<AccountListResult> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet<AccountListResult>(`${path}/accounts`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    search: options?.search ?? "",
    configurableOnly: options?.configurableOnly ?? 0,
    typeLicence: options?.typeLicence ?? "",
  });
}

/**
 * Liste comptes + contacts (2API)
 * Équivalent old_manager: getAccountsAndContacts
 */
export async function listWithContacts(
  serviceId: string,
  options?: { count?: number; offset?: number; search?: string }
): Promise<AccountListResult> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet<AccountListResult>(`${path}/accounts/contacts`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    search: options?.search ?? "",
  });
}

/**
 * Options de création de compte (2API)
 * Équivalent old_manager: fetchingAccountCreationOptions
 */
export async function getCreationOptions(serviceId: string): Promise<AccountCreationOptions> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet<AccountCreationOptions>(`${path}/accounts/options`);
}

/**
 * Renouvellement batch des comptes (2API)
 * Équivalent old_manager: updateRenew
 */
export async function renewAccounts(
  serviceId: string,
  accounts: Array<{ primaryEmailAddress: string; renewPeriod?: string }>
): Promise<void> {
  const path = get2apiPath(serviceId);
  await ovh2apiPut(`${path}/accounts/renew`, { modelList: accounts });
}

/**
 * Droits de délégation d'un compte (2API)
 * Équivalent old_manager: retrieveAccountDelegationRight
 */
export async function getDelegationRights(
  serviceId: string,
  account: string,
  options?: { count?: number; offset?: number; search?: string }
): Promise<DelegationRightsResult> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet<DelegationRightsResult>(`${path}/accounts/${account}/rights`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    search: options?.search ?? "",
  });
}

/**
 * Mise à jour des droits de délégation (2API)
 * Équivalent old_manager: updatingAccountDelegationRights
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
  const path = get2apiPath(serviceId);
  await ovh2apiPost(`${path}/accounts/${account}/rights-update`, rights);
}

/**
 * Options pour alias (2API)
 * Équivalent old_manager: getNewAliasOptions
 */
export async function getAliasOptions(
  serviceId: string,
  emailAddress?: string,
  subType?: string
): Promise<{ availableDomains: Array<{ name: string; displayName: string }> }> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet(`${path}/aliasOptions`, {
    emailAddress: emailAddress ?? "",
    subType: subType ?? "",
  });
}

// ============================================================
// APIv6 - Fonctions supplémentaires
// ============================================================

/**
 * Tâches en cours pour un compte (APIv6)
 * Équivalent old_manager: getTasks (account.service.js)
 */
export async function getAccountTasks(
  serviceId: string,
  primaryEmailAddress: string
): Promise<number[]> {
  const basePath = getServicePath(serviceId);
  return apiFetch<number[]>(`${basePath}/account/${primaryEmailAddress}/tasks`);
}
