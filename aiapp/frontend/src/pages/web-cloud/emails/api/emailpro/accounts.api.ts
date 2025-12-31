// ============================================================
// API EMAIL PRO - Comptes email
// Endpoints: /email/pro/{service}/account/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/pro";

// ---------- TYPES ----------

export interface EmailProAccount {
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

// ---------- API CALLS ----------

export async function list(params: { serviceId?: string }): Promise<EmailProAccount[]> {
  if (!params.serviceId) return [];

  const emails = await apiFetch<string[]>(`${BASE}/${params.serviceId}/account`);

  const accounts = await Promise.all(
    emails.map(email => get(email, params.serviceId!))
  );

  return accounts;
}

export async function get(id: string, serviceId: string): Promise<EmailProAccount> {
  return apiFetch<EmailProAccount>(`${BASE}/${serviceId}/account/${id}`);
}

export async function create(data: CreateAccountParams & { serviceId: string }): Promise<EmailProAccount> {
  const { serviceId, ...body } = data;
  return apiFetch<EmailProAccount>(`${BASE}/${serviceId}/account`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function update(id: string, serviceId: string, data: Partial<EmailProAccount>): Promise<EmailProAccount> {
  return apiFetch<EmailProAccount>(`${BASE}/${serviceId}/account/${id}`, {
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

// ---------- ALIASES ----------

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
