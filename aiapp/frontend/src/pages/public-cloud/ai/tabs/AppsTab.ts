// ============================================================
// PUBLIC-CLOUD / AI / APPS - Service ISOLÉ
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { App } from "../ai.types";

// ======================== API ========================

export async function getApps(projectId: string): Promise<App[]> {
  return ovhGet<App[]>(`/cloud/project/${projectId}/ai/app`).catch(() => []);
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

export function getAppStatusClass(status: string): string {
  const classes: Record<string, string> = {
    RUNNING: "apps-badge-success",
    SCALING: "apps-badge-info",
    STOPPED: "apps-badge-secondary",
    ERROR: "apps-badge-error",
  };
  return classes[status] || "";
}
