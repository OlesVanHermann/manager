// ============================================================
// API MX PLAN - Délégation email
// Endpoints: /email/domain/{domain}/account/{account}/delegation/*
//            /email/domain/delegatedAccount/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/domain";

// ---------- TYPES ----------

export interface MxPlanDelegation {
  accountId: string;
}

export interface DelegatedAccount {
  accountName: string;
  allowedAccountSize: number[];
  domain: string;
  email: string;
  size: number;
  description?: string;
  isBlocked: boolean;
}

export interface DelegatedFilter {
  name: string;
  action: "accept" | "redirect" | "delete" | "localCopy";
  actionParam?: string;
  active: boolean;
  header: string;
  operand: "contains" | "containsNot" | "matches" | "matchesNot" | "startWith" | "endWith" | "is" | "isNot";
  priority: number;
  value: string;
}

export interface DelegatedResponder {
  account: string;
  content: string;
  copy: boolean;
  copyTo?: string;
  from?: string;
  to?: string;
}

// ============================================================
// DELEGATION PAR COMPTE
// /email/domain/{domain}/account/{account}/delegation/*
// ============================================================

/**
 * Liste des délégations d'un compte (APIv6)
 * Équivalent old_manager: getDelegationList
 */
export async function list(domain: string, accountName: string): Promise<string[]> {
  return apiFetch<string[]>(`${BASE}/${domain}/account/${accountName}/delegation`);
}

/**
 * Détails d'une délégation (APIv6)
 * Équivalent old_manager: getDelegation
 */
export async function get(
  domain: string,
  accountName: string,
  accountId: string
): Promise<MxPlanDelegation> {
  return apiFetch<MxPlanDelegation>(
    `${BASE}/${domain}/account/${accountName}/delegation/${accountId}`
  );
}

/**
 * Ajouter une délégation (APIv6)
 * Équivalent old_manager: addDelegation
 */
export async function add(
  domain: string,
  accountName: string,
  accountId: string
): Promise<void> {
  await apiFetch(`${BASE}/${domain}/account/${accountName}/delegation`, {
    method: "POST",
    body: JSON.stringify({ accountId }),
  });
}

/**
 * Supprimer une délégation (APIv6)
 * Équivalent old_manager: removeDelegation
 */
export async function remove(
  domain: string,
  accountName: string,
  accountId: string
): Promise<void> {
  await apiFetch(`${BASE}/${domain}/account/${accountName}/delegation/${accountId}`, {
    method: "DELETE",
  });
}

// ============================================================
// COMPTES DÉLÉGUÉS
// /email/domain/delegatedAccount/*
// ============================================================

/**
 * Liste des comptes délégués (APIv6)
 * Équivalent old_manager: getDelegatedEmails
 */
export async function listDelegatedAccounts(
  domain?: string,
  accountName?: string
): Promise<string[]> {
  const params = new URLSearchParams();
  if (domain) params.set("domain", domain);
  if (accountName) params.set("accountName", accountName);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<string[]>(`${BASE}/delegatedAccount${query}`);
}

/**
 * Détails d'un compte délégué (APIv6)
 * Équivalent old_manager: getDelegatedEmail
 */
export async function getDelegatedAccount(email: string): Promise<DelegatedAccount> {
  return apiFetch<DelegatedAccount>(`${BASE}/delegatedAccount/${email}`);
}

/**
 * Mise à jour d'un compte délégué (APIv6)
 * Équivalent old_manager: updateDelegatedAccount
 */
export async function updateDelegatedAccount(
  email: string,
  data: Partial<Pick<DelegatedAccount, "description" | "size">>
): Promise<void> {
  await apiFetch(`${BASE}/delegatedAccount/${email}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Changer le mot de passe d'un compte délégué (APIv6)
 * Équivalent old_manager: changePasswordDelegatedAccount
 */
export async function changePasswordDelegated(email: string, password: string): Promise<void> {
  await apiFetch(`${BASE}/delegatedAccount/${email}/changePassword`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

/**
 * Mettre à jour l'usage d'un compte délégué (APIv6)
 * Équivalent old_manager: updateDelegatedUsage
 */
export async function updateDelegatedUsage(email: string): Promise<void> {
  await apiFetch(`${BASE}/delegatedAccount/${email}/updateUsage`, {
    method: "POST",
  });
}

/**
 * Récupérer l'usage d'un compte délégué (APIv6)
 * Équivalent old_manager: getEmailDelegatedUsage
 */
export async function getDelegatedUsage(email: string): Promise<{ date: string; quota: number }> {
  return apiFetch(`${BASE}/delegatedAccount/${email}/usage`, {
    method: "POST",
  });
}

// ============================================================
// FILTRES DE COMPTES DÉLÉGUÉS
// /email/domain/delegatedAccount/{email}/filter/*
// ============================================================

/**
 * Liste des filtres d'un compte délégué (APIv6)
 * Équivalent old_manager: getDelegatedFilters
 */
export async function listDelegatedFilters(email: string): Promise<string[]> {
  return apiFetch<string[]>(`${BASE}/delegatedAccount/${email}/filter`);
}

/**
 * Détails d'un filtre délégué (APIv6)
 * Équivalent old_manager: getDelegatedFilter
 */
export async function getDelegatedFilter(
  email: string,
  filterName: string
): Promise<DelegatedFilter> {
  return apiFetch<DelegatedFilter>(
    `${BASE}/delegatedAccount/${email}/filter/${encodeURIComponent(filterName)}`
  );
}

/**
 * Créer un filtre délégué (APIv6)
 * Équivalent old_manager: createDelegatedFilter
 */
export async function createDelegatedFilter(
  email: string,
  filter: Omit<DelegatedFilter, "active">
): Promise<void> {
  await apiFetch(`${BASE}/delegatedAccount/${email}/filter`, {
    method: "POST",
    body: JSON.stringify(filter),
  });
}

/**
 * Supprimer un filtre délégué (APIv6)
 * Équivalent old_manager: deleteDelegatedFilter
 */
export async function deleteDelegatedFilter(email: string, filterName: string): Promise<void> {
  await apiFetch(
    `${BASE}/delegatedAccount/${email}/filter/${encodeURIComponent(filterName)}`,
    { method: "DELETE" }
  );
}

/**
 * Changer l'activité d'un filtre délégué (APIv6)
 * Équivalent old_manager: changeDelegatedFilterActivity
 */
export async function changeDelegatedFilterActivity(
  email: string,
  filterName: string,
  active: boolean
): Promise<void> {
  await apiFetch(
    `${BASE}/delegatedAccount/${email}/filter/${encodeURIComponent(filterName)}/changeActivity`,
    {
      method: "POST",
      body: JSON.stringify({ activity: active }),
    }
  );
}

/**
 * Changer la priorité d'un filtre délégué (APIv6)
 * Équivalent old_manager: changeDelegatedFilterPriority
 */
export async function changeDelegatedFilterPriority(
  email: string,
  filterName: string,
  priority: number
): Promise<void> {
  await apiFetch(
    `${BASE}/delegatedAccount/${email}/filter/${encodeURIComponent(filterName)}/changePriority`,
    {
      method: "POST",
      body: JSON.stringify({ priority }),
    }
  );
}

// ============================================================
// RÉPONDEUR DE COMPTE DÉLÉGUÉ
// /email/domain/delegatedAccount/{email}/responder
// ============================================================

/**
 * Récupérer le répondeur d'un compte délégué (APIv6)
 * Équivalent old_manager: getDelegatedResponder
 */
export async function getDelegatedResponder(email: string): Promise<DelegatedResponder> {
  return apiFetch<DelegatedResponder>(`${BASE}/delegatedAccount/${email}/responder`);
}

/**
 * Créer un répondeur pour un compte délégué (APIv6)
 * Équivalent old_manager: createDelegatedResponder
 */
export async function createDelegatedResponder(
  email: string,
  data: Omit<DelegatedResponder, "account">
): Promise<void> {
  await apiFetch(`${BASE}/delegatedAccount/${email}/responder`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Mettre à jour le répondeur d'un compte délégué (APIv6)
 * Équivalent old_manager: updateDelegatedResponder
 */
export async function updateDelegatedResponder(
  email: string,
  data: Partial<Omit<DelegatedResponder, "account">>
): Promise<void> {
  await apiFetch(`${BASE}/delegatedAccount/${email}/responder`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Supprimer le répondeur d'un compte délégué (APIv6)
 * Équivalent old_manager: deleteDelegatedResponder
 */
export async function deleteDelegatedResponder(email: string): Promise<void> {
  await apiFetch(`${BASE}/delegatedAccount/${email}/responder`, {
    method: "DELETE",
  });
}
