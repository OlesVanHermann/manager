// ============================================================
// PUBLIC-CLOUD / DATABASES / BACKUPS - Service ISOLÉ
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { Backup } from "../databases.types";

// ======================== API ========================

export async function getBackups(projectId: string, engine: string, serviceId: string): Promise<Backup[]> {
  return ovhGet<Backup[]>(`/cloud/project/${projectId}/database/${engine}/${serviceId}/backup`).catch(() => []);
}

export async function createBackup(projectId: string, engine: string, serviceId: string, description?: string): Promise<Backup> {
  return ovhPost<Backup>(`/cloud/project/${projectId}/database/${engine}/${serviceId}/backup`, { description });
}

export async function restoreBackup(projectId: string, engine: string, serviceId: string, backupId: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/database/${engine}/${serviceId}/backup/${backupId}/restore`, {});
}

export async function deleteBackup(projectId: string, engine: string, serviceId: string, backupId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/database/${engine}/${serviceId}/backup/${backupId}`);
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("fr-FR");
}

export function formatSize(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
  return `${bytes} B`;
}

export function getBackupStatusClass(status: string): string {
  const classes: Record<string, string> = {
    READY: "backups-badge-success",
    CREATING: "backups-badge-warning",
    ERROR: "backups-badge-error",
  };
  return classes[status] || "";
}
