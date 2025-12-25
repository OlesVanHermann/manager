// ============================================================
// CLOUD CONNECT General Tab - Service isolé
// ============================================================
// Ce tab reçoit les données via props, pas d'appels API directs

import { ovhPut } from "../../../../../services/api";
import type { CloudConnectInfo } from "../../cloud-connect.types";

// ==================== ACTIONS ====================

export async function updateDescription(
  uuid: string,
  description: string
): Promise<CloudConnectInfo> {
  return ovhPut<CloudConnectInfo>(`/ovhCloudConnect/${uuid}`, { description });
}

// ==================== HELPERS (DUPLIQUÉS - ISOLATION) ====================

export function formatBandwidth(mbps: number): string {
  return mbps >= 1000 ? `${mbps / 1000} Gbps` : `${mbps} Mbps`;
}

export function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    active: "badge-success",
    init: "badge-warning",
    disabled: "badge-error",
  };
  return classes[status] || "";
}

// ==================== SERVICE OBJECT ====================

export const generalService = {
  updateDescription,
  formatBandwidth,
  getStatusBadgeClass,
};
