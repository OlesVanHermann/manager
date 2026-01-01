// ============================================================
// API MX PLAN - Répondeurs automatiques
// Endpoints: /email/domain/{domain}/responder/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/domain";

// ---------- TYPES ----------

export interface MxPlanResponder {
  account: string;
  content: string;
  copy: boolean;
  copyTo?: string;
  from?: string;
  to?: string;
}

export interface CreateResponderParams {
  account: string;
  content: string;
  copy: boolean;
  copyTo?: string;
  from?: string;
  to?: string;
}

export interface ResponderTask {
  id: number;
  function: string;
  status: "todo" | "doing" | "done" | "error";
  account: string;
}

// ---------- RESPONDER CRUD ----------

/**
 * Liste des répondeurs (APIv6)
 * Équivalent old_manager: getResponders
 */
export async function list(domain: string): Promise<string[]> {
  return apiFetch<string[]>(`${BASE}/${domain}/responder`);
}

/**
 * Liste complète des répondeurs avec détails
 */
export async function listWithDetails(domain: string): Promise<MxPlanResponder[]> {
  const accounts = await list(domain);
  const responders = await Promise.all(
    accounts.map(account => get(domain, account).catch(() => null))
  );
  return responders.filter((r): r is MxPlanResponder => r !== null);
}

/**
 * Détails d'un répondeur (APIv6)
 * Équivalent old_manager: getResponder
 */
export async function get(domain: string, accountName: string): Promise<MxPlanResponder> {
  return apiFetch<MxPlanResponder>(`${BASE}/${domain}/responder/${accountName}`);
}

/**
 * Création d'un répondeur (APIv6)
 * Équivalent old_manager: createResponder
 */
export async function create(domain: string, data: CreateResponderParams): Promise<void> {
  await apiFetch(`${BASE}/${domain}/responder`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Mise à jour d'un répondeur (APIv6)
 * Équivalent old_manager: updateResponder
 */
export async function update(
  domain: string,
  accountName: string,
  data: Partial<Omit<CreateResponderParams, "account">>
): Promise<void> {
  await apiFetch(`${BASE}/${domain}/responder/${accountName}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Suppression d'un répondeur (APIv6)
 * Équivalent old_manager: deleteResponder
 */
export async function remove(domain: string, accountName: string): Promise<void> {
  await apiFetch(`${BASE}/${domain}/responder/${accountName}`, {
    method: "DELETE",
  });
}

export { remove as delete };

// ---------- RESPONDER TASKS ----------

/**
 * Tâches en cours pour un répondeur (APIv6)
 * Équivalent old_manager: getResponderTasks
 */
export async function getTasks(domain: string, account?: string): Promise<number[]> {
  const params = account ? `?account=${encodeURIComponent(account)}` : "";
  return apiFetch<number[]>(`${BASE}/${domain}/task/responder${params}`);
}

/**
 * Vérifier si un répondeur a des tâches en cours
 */
export async function hasPendingTasks(domain: string, account: string): Promise<boolean> {
  const tasks = await getTasks(domain, account);
  return tasks.length > 0;
}
