// ============================================================
// PUBLIC-CLOUD / AI / NOTEBOOKS - Service ISOLÉ
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { Notebook } from "../ai.types";

// ======================== API ========================

export async function getNotebooks(projectId: string): Promise<Notebook[]> {
  return ovhGet<Notebook[]>(`/cloud/project/${projectId}/ai/notebook`).catch(() => []);
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

export function getNotebookStatusClass(status: string): string {
  const classes: Record<string, string> = {
    RUNNING: "notebooks-badge-success",
    STARTING: "notebooks-badge-warning",
    STOPPED: "notebooks-badge-secondary",
    ERROR: "notebooks-badge-error",
  };
  return classes[status] || "";
}
