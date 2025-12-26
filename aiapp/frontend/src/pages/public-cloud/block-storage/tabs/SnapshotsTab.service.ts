// ============================================================
// PUBLIC-CLOUD / BLOCK-STORAGE / SNAPSHOTS - Service ISOLÉ
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { VolumeSnapshot } from "../block-storage.types";

// ======================== API ========================

export async function getSnapshots(projectId: string, volumeId: string): Promise<VolumeSnapshot[]> {
  return ovhGet<VolumeSnapshot[]>(`/cloud/project/${projectId}/volume/${volumeId}/snapshot`).catch(() => []);
}

export async function createSnapshot(projectId: string, volumeId: string, name: string): Promise<VolumeSnapshot> {
  return ovhPost<VolumeSnapshot>(`/cloud/project/${projectId}/volume/${volumeId}/snapshot`, { name });
}

export async function deleteSnapshot(projectId: string, snapshotId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/snapshot/${snapshotId}`);
}

// ======================== Helpers (DUPLIQUÉS - isolation) ========================

export function formatSize(sizeGB: number): string {
  if (sizeGB >= 1000) {
    return `${(sizeGB / 1000).toFixed(2)} TB`;
  }
  return `${sizeGB} GB`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getSnapshotsStatusClass(status: string): string {
  const classes: Record<string, string> = {
    available: "snapshots-badge-success",
    creating: "snapshots-badge-warning",
    error: "snapshots-badge-error",
  };
  return classes[status] || "";
}
