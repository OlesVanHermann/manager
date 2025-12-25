// ============================================================
// PUBLIC-CLOUD / LOAD-BALANCER / LISTENERS - Service ISOLÉ
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../services/api";
import type { Listener } from "../load-balancer.types";

// ======================== API ========================

export async function getListeners(projectId: string, lbId: string): Promise<Listener[]> {
  return ovhGet<Listener[]>(`/cloud/project/${projectId}/loadbalancer/${lbId}/listener`).catch(() => []);
}

export async function createListener(
  projectId: string,
  lbId: string,
  name: string,
  protocol: string,
  port: number
): Promise<Listener> {
  return ovhPost<Listener>(`/cloud/project/${projectId}/loadbalancer/${lbId}/listener`, {
    name,
    protocol,
    port,
  });
}

export async function updateListener(
  projectId: string,
  lbId: string,
  listenerId: string,
  data: Partial<Listener>
): Promise<void> {
  return ovhPut(`/cloud/project/${projectId}/loadbalancer/${lbId}/listener/${listenerId}`, data);
}

export async function deleteListener(projectId: string, lbId: string, listenerId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/loadbalancer/${lbId}/listener/${listenerId}`);
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function getListenerStatusClass(status: string): string {
  const classes: Record<string, string> = {
    ACTIVE: "listeners-badge-success",
    PENDING: "listeners-badge-warning",
    ERROR: "listeners-badge-error",
  };
  return classes[status] || "";
}
