// ============================================================
// API MX PLAN - Filtres email
// Endpoints: /email/domain/{domain}/account/{accountName}/filter/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/domain";

// ---------- TYPES ----------

export interface MxPlanFilter {
  name: string;
  action: "accept" | "redirect" | "delete" | "localCopy";
  actionParam?: string;
  active: boolean;
  header: string;
  operand: "contains" | "containsNot" | "matches" | "matchesNot" | "startWith" | "endWith" | "is" | "isNot";
  priority: number;
  value: string;
}

export interface CreateFilterParams {
  name: string;
  action: "accept" | "redirect" | "delete" | "localCopy";
  actionParam?: string;
  active?: boolean;
  header: string;
  operand: "contains" | "containsNot" | "matches" | "matchesNot" | "startWith" | "endWith" | "is" | "isNot";
  priority: number;
  value: string;
}

export interface FilterRule {
  id: number;
  header: string;
  operand: "contains" | "containsNot" | "matches" | "matchesNot" | "startWith" | "endWith" | "is" | "isNot";
  value: string;
}

export interface CreateFilterRuleParams {
  header: string;
  operand: "contains" | "containsNot" | "matches" | "matchesNot" | "startWith" | "endWith" | "is" | "isNot";
  value: string;
}

// ---------- FILTER CRUD ----------

/**
 * Liste des filtres d'un compte (APIv6)
 * Équivalent old_manager: getFilters
 */
export async function list(domain: string, accountName: string): Promise<string[]> {
  return apiFetch<string[]>(`${BASE}/${domain}/account/${accountName}/filter`);
}

/**
 * Liste complète des filtres avec détails
 */
export async function listWithDetails(domain: string, accountName: string): Promise<MxPlanFilter[]> {
  const names = await list(domain, accountName);
  const filters = await Promise.all(
    names.map(name => get(domain, accountName, name))
  );
  return filters;
}

/**
 * Détails d'un filtre (APIv6)
 * Équivalent old_manager: getFilter
 */
export async function get(domain: string, accountName: string, filterName: string): Promise<MxPlanFilter> {
  return apiFetch<MxPlanFilter>(
    `${BASE}/${domain}/account/${accountName}/filter/${encodeURIComponent(filterName)}`
  );
}

/**
 * Création d'un filtre (APIv6)
 * Équivalent old_manager: createFilter
 */
export async function create(
  domain: string,
  accountName: string,
  filter: CreateFilterParams
): Promise<void> {
  await apiFetch(`${BASE}/${domain}/account/${accountName}/filter`, {
    method: "POST",
    body: JSON.stringify(filter),
  });
}

/**
 * Création d'un filtre avec règles (APIv6)
 * Équivalent old_manager: createFilter (avec rules)
 */
export async function createWithRules(
  domain: string,
  accountName: string,
  filter: CreateFilterParams,
  rules: CreateFilterRuleParams[]
): Promise<void> {
  // Crée le filtre
  await create(domain, accountName, filter);

  // Crée les règles associées
  if (rules.length > 0) {
    await Promise.all(
      rules.map(rule => createRule(domain, accountName, filter.name, rule))
    );
  }
}

/**
 * Mise à jour d'un filtre (via delete+create)
 * Équivalent old_manager: updateFilter
 */
export async function update(
  domain: string,
  accountName: string,
  filter: CreateFilterParams,
  rules: CreateFilterRuleParams[]
): Promise<void> {
  await remove(domain, accountName, filter.name);
  await createWithRules(domain, accountName, filter, rules);
}

/**
 * Suppression d'un filtre (APIv6)
 * Équivalent old_manager: deleteFilter
 */
export async function remove(domain: string, accountName: string, filterName: string): Promise<void> {
  await apiFetch(
    `${BASE}/${domain}/account/${accountName}/filter/${encodeURIComponent(filterName)}`,
    { method: "DELETE" }
  );
}

export { remove as delete };

// ---------- FILTER ACTIONS ----------

/**
 * Activer/désactiver un filtre (APIv6)
 * Équivalent old_manager: changeFilterActivity
 */
export async function changeActivity(
  domain: string,
  accountName: string,
  filterName: string,
  active: boolean
): Promise<void> {
  await apiFetch(
    `${BASE}/${domain}/account/${accountName}/filter/${encodeURIComponent(filterName)}/changeActivity`,
    {
      method: "POST",
      body: JSON.stringify({ activity: active }),
    }
  );
}

/**
 * Changer la priorité d'un filtre (APIv6)
 * Équivalent old_manager: changeFilterPriority
 */
export async function changePriority(
  domain: string,
  accountName: string,
  filterName: string,
  priority: number
): Promise<void> {
  await apiFetch(
    `${BASE}/${domain}/account/${accountName}/filter/${encodeURIComponent(filterName)}/changePriority`,
    {
      method: "POST",
      body: JSON.stringify({ priority }),
    }
  );
}

// ---------- FILTER RULES ----------

/**
 * Liste des règles d'un filtre (APIv6)
 * Équivalent old_manager: getRules
 */
export async function getRules(
  domain: string,
  accountName: string,
  filterName: string
): Promise<FilterRule[]> {
  const ids = await apiFetch<number[]>(
    `${BASE}/${domain}/account/${accountName}/filter/${encodeURIComponent(filterName)}/rule`
  );

  const rules = await Promise.all(
    ids.map(id => getRule(domain, accountName, filterName, id))
  );

  return rules;
}

/**
 * Détails d'une règle (APIv6)
 * Équivalent old_manager: getRule
 */
export async function getRule(
  domain: string,
  accountName: string,
  filterName: string,
  ruleId: number
): Promise<FilterRule> {
  return apiFetch<FilterRule>(
    `${BASE}/${domain}/account/${accountName}/filter/${encodeURIComponent(filterName)}/rule/${ruleId}`
  );
}

/**
 * Création d'une règle (APIv6)
 * Équivalent old_manager: createRule
 */
export async function createRule(
  domain: string,
  accountName: string,
  filterName: string,
  rule: CreateFilterRuleParams
): Promise<void> {
  await apiFetch(
    `${BASE}/${domain}/account/${accountName}/filter/${encodeURIComponent(filterName)}/rule`,
    {
      method: "POST",
      body: JSON.stringify(rule),
    }
  );
}

/**
 * Suppression d'une règle (APIv6)
 * Équivalent old_manager: deleteRule
 */
export async function deleteRule(
  domain: string,
  accountName: string,
  filterName: string,
  ruleId: number
): Promise<void> {
  await apiFetch(
    `${BASE}/${domain}/account/${accountName}/filter/${encodeURIComponent(filterName)}/rule/${ruleId}`,
    { method: "DELETE" }
  );
}

/**
 * Suppression de toutes les règles d'un filtre
 * Équivalent old_manager: deleteRules
 */
export async function deleteRules(
  domain: string,
  accountName: string,
  filterName: string,
  ruleIds: number[]
): Promise<void> {
  await Promise.all(
    ruleIds.map(id => deleteRule(domain, accountName, filterName, id))
  );
}
