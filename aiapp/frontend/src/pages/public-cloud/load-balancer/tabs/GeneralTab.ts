// ============================================================
// PUBLIC-CLOUD / LOAD-BALANCER / GENERAL - Service ISOLÉ
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { LoadBalancer } from "../load-balancer.types";

// ======================== API ========================

export async function getLoadBalancer(projectId: string, lbId: string): Promise<LoadBalancer> {
  return ovhGet<LoadBalancer>(`/cloud/project/${projectId}/loadbalancer/${lbId}`);
}

export async function resizeLoadBalancer(projectId: string, lbId: string, flavor: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/loadbalancer/${lbId}`, { flavor });
}

export async function deleteLoadBalancer(projectId: string, lbId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/loadbalancer/${lbId}`);
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function getGeneralStatusClass(status: string): string {
  const classes: Record<string, string> = {
    ACTIVE: "general-badge-success",
    PENDING_CREATE: "general-badge-warning",
    PENDING_UPDATE: "general-badge-info",
    ERROR: "general-badge-error",
  };
  return classes[status] || "";
}
