// ============================================================
// API MXPLAN MODERN - Redirections
// Endpoints APIv6: /email/mxplan/{service}/redirection/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/mxplan";

// ---------- TYPES ----------

export interface MxPlanModernRedirection {
  id: string;
  from: string;
  to: string;
  subDomain?: string;
  state: "ok" | "deleting";
}

export interface CreateRedirectionParams {
  from: string;
  to: string;
  localCopy?: boolean;
  subDomain?: string;
}

// ---------- API CALLS ----------

/**
 * Liste des redirections (APIv6)
 */
export async function list(serviceId: string): Promise<string[]> {
  return apiFetch<string[]>(`${BASE}/${serviceId}/redirection`);
}

/**
 * Détails d'une redirection (APIv6)
 */
export async function get(serviceId: string, redirectionId: string): Promise<MxPlanModernRedirection> {
  return apiFetch<MxPlanModernRedirection>(`${BASE}/${serviceId}/redirection/${redirectionId}`);
}

/**
 * Liste complète des redirections avec détails
 */
export async function listWithDetails(serviceId: string): Promise<MxPlanModernRedirection[]> {
  const ids = await list(serviceId);
  const redirections = await Promise.all(
    ids.map(id => get(serviceId, id))
  );
  return redirections;
}

/**
 * Création d'une redirection (APIv6)
 */
export async function create(
  serviceId: string,
  data: CreateRedirectionParams
): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}/redirection`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Suppression d'une redirection (APIv6)
 */
export async function remove(serviceId: string, redirectionId: string): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}/redirection/${redirectionId}`, {
    method: "DELETE",
  });
}

export { remove as delete };
