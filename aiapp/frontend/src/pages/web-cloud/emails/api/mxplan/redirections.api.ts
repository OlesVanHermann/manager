// ============================================================
// API MX PLAN - Redirections email
// Endpoints: /email/domain/{domain}/redirection/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/domain";

// ---------- TYPES ----------

export interface MxPlanRedirection {
  id: string;
  from: string;
  to: string;
  localCopy: boolean;
}

export interface CreateRedirectionParams {
  from: string;
  to: string;
  localCopy?: boolean;
}

// ---------- API CALLS ----------

export async function list(domain: string): Promise<MxPlanRedirection[]> {
  // GET /email/domain/{domain}/redirection returns list of IDs
  const ids = await apiFetch<string[]>(`${BASE}/${domain}/redirection`);

  // Fetch details for each redirection
  const redirections = await Promise.all(
    ids.map(id => get(domain, id))
  );

  return redirections;
}

export async function get(domain: string, id: string): Promise<MxPlanRedirection> {
  return apiFetch<MxPlanRedirection>(`${BASE}/${domain}/redirection/${id}`);
}

export async function create(domain: string, data: CreateRedirectionParams): Promise<MxPlanRedirection> {
  return apiFetch<MxPlanRedirection>(`${BASE}/${domain}/redirection`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function remove(domain: string, id: string): Promise<void> {
  await apiFetch(`${BASE}/${domain}/redirection/${id}`, {
    method: "DELETE",
  });
}

// Alias for delete
export { remove as delete };
