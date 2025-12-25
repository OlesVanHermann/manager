// ============================================================
// INDICES TAB SERVICE - Service API isolé pour l'onglet Indices
// ============================================================
// ⚠️ DÉFACTORISÉ : Ce service est ISOLÉ et ne doit JAMAIS être
// importé par un autre tab. Duplication volontaire.
// ============================================================

import { ovhGet, ovhPost } from "../../../../../services/api";
import type { Index } from "../dbaas-logs.types";

// ============================================================
// API INDICES
// ============================================================

/** Récupère la liste des indices d'un service. */
export async function getIndices(serviceName: string): Promise<Index[]> {
  const ids = await ovhGet<string[]>(`/dbaas/logs/${serviceName}/output/elasticsearch/index`);
  const indices = await Promise.all(
    ids.map((id) => ovhGet<Index>(`/dbaas/logs/${serviceName}/output/elasticsearch/index/${id}`))
  );
  return indices;
}

/** Crée un nouvel index. */
export async function createIndex(
  serviceName: string,
  data: { name: string; description?: string; nbShard: number }
): Promise<Index> {
  return ovhPost<Index>(`/dbaas/logs/${serviceName}/output/elasticsearch/index`, data);
}

// ============================================================
// HELPERS (isolés pour ce tab)
// ============================================================

/** Formate une taille en bytes. */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/** Calcule le pourcentage d'utilisation. */
export function getUsagePercent(current: number, max: number): number {
  return Math.round((current / max) * 100);
}

/** Retourne la classe CSS selon le pourcentage. */
export function getUsageClass(percent: number): string {
  if (percent >= 90) return "danger";
  if (percent >= 70) return "warning";
  return "";
}

// ============================================================
// SERVICE OBJECT
// ============================================================

export const indicesService = {
  getIndices,
  createIndex,
  formatSize,
  getUsagePercent,
  getUsageClass,
};
