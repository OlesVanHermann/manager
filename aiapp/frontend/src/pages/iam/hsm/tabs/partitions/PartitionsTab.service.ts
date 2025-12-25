// ============================================================
// PARTITIONS TAB SERVICE - Service API isolé pour l'onglet Partitions
// ============================================================
// ⚠️ DÉFACTORISÉ : Ce service est ISOLÉ et ne doit JAMAIS être
// importé par un autre tab. Duplication volontaire.
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { Partition } from "../hsm.types";

// ============================================================
// API PARTITIONS
// ============================================================

/** Récupère la liste des partitions d'un HSM. */
export async function getPartitions(serviceId: string): Promise<Partition[]> {
  const ids = await ovhGet<string[]>(`/dedicated/nasha/${serviceId}/partition`);
  const partitions = await Promise.all(
    ids.map((id) => ovhGet<Partition>(`/dedicated/nasha/${serviceId}/partition/${id}`))
  );
  return partitions;
}

/** Récupère les détails d'une partition. */
export async function getPartition(serviceId: string, partitionId: string): Promise<Partition> {
  return ovhGet<Partition>(`/dedicated/nasha/${serviceId}/partition/${partitionId}`);
}

/** Crée une nouvelle partition. */
export async function createPartition(
  serviceId: string,
  data: { name: string; size: number }
): Promise<Partition> {
  return ovhPost<Partition>(`/dedicated/nasha/${serviceId}/partition`, data);
}

/** Supprime une partition. */
export async function deletePartition(serviceId: string, partitionId: string): Promise<void> {
  return ovhDelete(`/dedicated/nasha/${serviceId}/partition/${partitionId}`);
}

// ============================================================
// HELPERS (isolés pour ce tab)
// ============================================================

/** Calcule le pourcentage d'utilisation. */
export function getUsagePercent(used: number, total: number): number {
  return Math.round((used / total) * 100);
}

/** Retourne la classe CSS selon le pourcentage d'utilisation. */
export function getUsageClass(percent: number): string {
  if (percent >= 90) return "danger";
  if (percent >= 70) return "warning";
  return "";
}

/** Formate une taille en bytes. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ============================================================
// SERVICE OBJECT (alternative export)
// ============================================================

export const partitionsService = {
  getPartitions,
  getPartition,
  createPartition,
  deletePartition,
  getUsagePercent,
  getUsageClass,
  formatBytes,
};
