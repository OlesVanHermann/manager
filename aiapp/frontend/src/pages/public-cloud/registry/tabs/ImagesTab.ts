// ============================================================
// PUBLIC-CLOUD / REGISTRY / IMAGES - Service ISOLÉ
// ============================================================

import { ovhGet, ovhDelete } from "../../../../services/api";
import type { Image } from "../registry.types";

// ======================== API ========================

export async function getImages(projectId: string, registryId: string): Promise<Image[]> {
  return ovhGet<Image[]>(`/cloud/project/${projectId}/containerRegistry/${registryId}/repositories`).catch(() => []);
}

export async function deleteImage(projectId: string, registryId: string, imageId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/containerRegistry/${registryId}/repositories/${imageId}`);
}

export async function getImageTags(projectId: string, registryId: string, imageId: string): Promise<string[]> {
  return ovhGet<string[]>(`/cloud/project/${projectId}/containerRegistry/${registryId}/repositories/${imageId}/tags`).catch(() => []);
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
