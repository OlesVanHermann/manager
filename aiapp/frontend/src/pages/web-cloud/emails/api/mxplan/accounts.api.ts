// ============================================================
// API MX PLAN - Comptes email
// Endpoints: /email/domain/{domain}/account/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/domain";

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
