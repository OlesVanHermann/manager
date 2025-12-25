// ============================================================
// PUBLIC-CLOUD / LOAD-BALANCER / POOLS - Service ISOLÉ
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { Pool } from "../load-balancer.types";

// ======================== API ========================

export async function getPools(projectId: string, lbId: string): Promise<Pool[]> {
  return ovhGet<Pool[]>(`/cloud/project/${projectId}/loadbalancer/${lbId}/pool`).catch(() => []);
}

export async function createPool(
  projectId: string,
  lbId: string,
  name: string,
  protocol: string,
  algorithm: string
): Promise<Pool> {
  return ovhPost<Pool>(`/cloud/project/${projectId}/loadbalancer/${lbId}/pool`, {
    name,
    protocol,
    algorithm,
  });
}

export async function deletePool(projectId: string, lbId: string, poolId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/loadbalancer/${lbId}/pool/${poolId}`);
}

export async function getPoolMembers(projectId: string, lbId: string, poolId: string): Promise<unknown[]> {
  return ovhGet<unknown[]>(`/cloud/project/${projectId}/loadbalancer/${lbId}/pool/${poolId}/member`).catch(() => []);
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function getPoolStatusClass(status: string): string {
  const classes: Record<string, string> = {
    ACTIVE: "pools-badge-success",
    PENDING: "pools-badge-warning",
    ERROR: "pools-badge-error",
  };
  return classes[status] || "";
}
