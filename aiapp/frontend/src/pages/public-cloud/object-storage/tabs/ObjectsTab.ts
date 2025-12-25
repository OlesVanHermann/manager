// ============================================================
// PUBLIC-CLOUD / OBJECT-STORAGE / OBJECTS - Service ISOLÉ
// ============================================================

import { ovhGet, ovhDelete } from "../../../../services/api";
import type { StorageObject } from "../object-storage.types";

// ======================== API ========================

export async function getObjects(projectId: string, region: string, containerId: string, prefix?: string): Promise<StorageObject[]> {
  const url = prefix
    ? `/cloud/project/${projectId}/storage/${containerId}?region=${region}&prefix=${encodeURIComponent(prefix)}`
    : `/cloud/project/${projectId}/storage/${containerId}?region=${region}`;
  const data = await ovhGet<{ objects: StorageObject[] }>(url).catch(() => ({ objects: [] }));
  return data.objects || [];
}

export async function deleteObject(projectId: string, region: string, containerId: string, objectName: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/storage/${containerId}/${encodeURIComponent(objectName)}?region=${region}`);
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function formatSize(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(2)} KB`;
  return `${bytes} B`;
}

export function getFileIcon(contentType: string): string {
  if (contentType.startsWith("image/")) return "🖼️";
  if (contentType.startsWith("video/")) return "🎬";
  if (contentType.startsWith("audio/")) return "🎵";
  if (contentType.includes("pdf")) return "📄";
  if (contentType.includes("zip") || contentType.includes("tar") || contentType.includes("gzip")) return "📦";
  return "📁";
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("fr-FR");
}
