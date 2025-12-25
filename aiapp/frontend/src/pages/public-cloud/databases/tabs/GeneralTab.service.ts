// ============================================================
// PUBLIC-CLOUD / DATABASES / GENERAL - Service ISOLÉ
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { Database } from "../databases.types";

// ======================== API ========================

export async function getDatabase(projectId: string, engine: string, serviceId: string): Promise<Database> {
  return ovhGet<Database>(`/cloud/project/${projectId}/database/${engine}/${serviceId}`);
}

export async function upgradeDatabase(projectId: string, engine: string, serviceId: string, version: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/database/${engine}/${serviceId}/upgrade`, { version });
}

export async function deleteDatabase(projectId: string, engine: string, serviceId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/database/${engine}/${serviceId}`);
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

export function getGeneralStatusClass(status: string): string {
  const classes: Record<string, string> = {
    READY: "general-badge-success",
    CREATING: "general-badge-warning",
    UPDATING: "general-badge-info",
    ERROR: "general-badge-error",
  };
  return classes[status] || "";
}
