// ============================================================
// PUBLIC-CLOUD / KUBERNETES / GENERAL - Service ISOLÉ
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { Cluster } from "../kubernetes.types";

// ======================== API ========================

export async function getCluster(projectId: string, kubeId: string): Promise<Cluster> {
  return ovhGet<Cluster>(`/cloud/project/${projectId}/kube/${kubeId}`);
}

export async function upgradeCluster(projectId: string, kubeId: string, version: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/kube/${kubeId}/update`, { strategy: "LATEST_PATCH" });
}

export async function restartCluster(projectId: string, kubeId: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/kube/${kubeId}/restart`, {});
}

export async function deleteCluster(projectId: string, kubeId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/kube/${kubeId}`);
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function getGeneralStatusClass(status: string): string {
  const classes: Record<string, string> = {
    READY: "general-badge-success",
    INSTALLING: "general-badge-warning",
    UPDATING: "general-badge-info",
    ERROR: "general-badge-error",
  };
  return classes[status] || "";
}
