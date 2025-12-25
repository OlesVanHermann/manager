// ============================================================
// PUBLIC-CLOUD / REGISTRY / GENERAL - Service ISOLÉ
// ============================================================

import { ovhGet, ovhDelete } from "../../../../services/api";
import type { Registry } from "../registry.types";

// ======================== API ========================

export async function getRegistry(projectId: string, registryId: string): Promise<Registry> {
  return ovhGet<Registry>(`/cloud/project/${projectId}/containerRegistry/${registryId}`);
}

export async function deleteRegistry(projectId: string, registryId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/containerRegistry/${registryId}`);
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function formatSize(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
  return `${bytes} B`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR");
}
