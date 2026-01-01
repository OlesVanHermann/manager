// ============================================================
// API MX PLAN - ACL (Access Control List)
// Endpoints: /email/domain/{domain}/acl/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/domain";

// ---------- TYPES ----------

export interface MxPlanAcl {
  accountId: string;
}

// ---------- ACL CRUD ----------

/**
 * Liste des ACL (APIv6)
 * Équivalent old_manager: getAcls
 */
export async function list(domain: string): Promise<string[]> {
  return apiFetch<string[]>(`${BASE}/${domain}/acl`);
}

/**
 * Liste complète des ACL avec détails
 */
export async function listWithDetails(domain: string): Promise<MxPlanAcl[]> {
  const accountIds = await list(domain);
  const acls = await Promise.all(
    accountIds.map(accountId => get(domain, accountId))
  );
  return acls;
}

/**
 * Détails d'une ACL (APIv6)
 * Équivalent old_manager: getAcl
 */
export async function get(domain: string, accountId: string): Promise<MxPlanAcl> {
  return apiFetch<MxPlanAcl>(`${BASE}/${domain}/acl/${accountId}`);
}

/**
 * Création d'une ACL (APIv6)
 * Équivalent old_manager: createAcl
 */
export async function create(domain: string, accountId: string): Promise<void> {
  await apiFetch(`${BASE}/${domain}/acl`, {
    method: "POST",
    body: JSON.stringify({ accountId }),
  });
}

/**
 * Suppression d'une ACL (APIv6)
 * Équivalent old_manager: deleteAcl
 */
export async function remove(domain: string, accountId: string): Promise<void> {
  await apiFetch(`${BASE}/${domain}/acl/${accountId}`, {
    method: "DELETE",
  });
}

export { remove as delete };
