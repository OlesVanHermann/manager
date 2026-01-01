// ============================================================
// API MXPLAN MODERN - Domaines
// Endpoints APIv6: /email/mxplan/{service}/domain/*
// Endpoints 2API: /sws/emailpro/{service}/domains avec isMXPlan=true
// ============================================================

import { apiFetch, ovh2apiGet } from "../../../../../services/api";

const BASE = "/email/mxplan";
const BASE_2API = "/sws/emailpro";

// ---------- TYPES ----------

export interface MxPlanModernDomain {
  name: string;
  state: "ok" | "inMaintenance";
  mxIsValid: boolean;
  mxRecord?: string[];
  srvIsValid: boolean;
  cnameToCheck?: string;
  expectedAutoDNS?: string;
  expectedMx?: string;
  expectedSPF?: string;
  taskPendingId?: number;
}

export interface DomainListResult {
  list: {
    results: MxPlanModernDomain[];
    count: number;
  };
}

// ---------- APIv6 CALLS ----------

/**
 * Liste des domaines (APIv6)
 */
export async function list(serviceId: string): Promise<string[]> {
  return apiFetch<string[]>(`${BASE}/${serviceId}/domain`);
}

/**
 * Détails d'un domaine (APIv6)
 */
export async function get(serviceId: string, domainName: string): Promise<MxPlanModernDomain> {
  return apiFetch<MxPlanModernDomain>(`${BASE}/${serviceId}/domain/${domainName}`);
}

/**
 * Liste complète des domaines avec détails
 */
export async function listWithDetails(serviceId: string): Promise<MxPlanModernDomain[]> {
  const names = await list(serviceId);
  const domains = await Promise.all(
    names.map(name => get(serviceId, name))
  );
  return domains;
}

// ---------- 2API CALLS ----------

/**
 * Liste paginée des domaines (2API)
 */
export async function list2api(
  serviceId: string,
  options?: { count?: number; offset?: number }
): Promise<DomainListResult> {
  return ovh2apiGet<DomainListResult>(`${BASE_2API}/${serviceId}/domains`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    isMXPlan: 1,
  });
}
