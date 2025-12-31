// ============================================================
// API EXCHANGE - Comptes email
// Endpoints: /email/exchange/{org}/service/{service}/account/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/exchange";

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
