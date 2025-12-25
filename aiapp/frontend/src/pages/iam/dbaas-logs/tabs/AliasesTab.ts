// ============================================================
// ALIASES TAB SERVICE - Service API isolé pour l'onglet Aliases
// ============================================================
// ⚠️ DÉFACTORISÉ : Ce service est ISOLÉ et ne doit JAMAIS être
// importé par un autre tab. Duplication volontaire.
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { Alias } from "../dbaas-logs.types";

// ============================================================
// API ALIASES
// ============================================================

/** Récupère la liste des aliases d'un service. */
export async function getAliases(serviceName: string): Promise<Alias[]> {
  const ids = await ovhGet<string[]>(`/dbaas/logs/${serviceName}/output/elasticsearch/alias`);
  const aliases = await Promise.all(
    ids.map((id) => ovhGet<Alias>(`/dbaas/logs/${serviceName}/output/elasticsearch/alias/${id}`))
  );
  return aliases;
}

/** Crée un nouvel alias. */
export async function createAlias(
  serviceName: string,
  data: { name: string; description?: string }
): Promise<Alias> {
  return ovhPost<Alias>(`/dbaas/logs/${serviceName}/output/elasticsearch/alias`, data);
}

/** Supprime un alias. */
export async function deleteAlias(serviceName: string, aliasId: string): Promise<void> {
  return ovhDelete(`/dbaas/logs/${serviceName}/output/elasticsearch/alias/${aliasId}`);
}

// ============================================================
// SERVICE OBJECT
// ============================================================

export const aliasesService = {
  getAliases,
  createAlias,
  deleteAlias,
};
