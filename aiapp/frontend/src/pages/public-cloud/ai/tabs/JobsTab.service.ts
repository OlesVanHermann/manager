// ============================================================
// PUBLIC-CLOUD / AI / JOBS - Service ISOLÉ
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { Job } from "../ai.types";

// ======================== API ========================

export async function getJobs(projectId: string): Promise<Job[]> {
  return ovhGet<Job[]>(`/cloud/project/${projectId}/ai/job`).catch(() => []);
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

export function getJobStatusClass(status: string): string {
  const classes: Record<string, string> = {
    DONE: "jobs-badge-success",
    RUNNING: "jobs-badge-info",
    PENDING: "jobs-badge-warning",
    FAILED: "jobs-badge-error",
  };
  return classes[status] || "";
}
