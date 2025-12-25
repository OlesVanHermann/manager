// ============================================================
// VRACK SERVICES General Tab - Service isolé
// ============================================================
// Ce tab reçoit les données via props, pas d'appels API directs

import { ovhPut } from "../../../../../services/api";
import type { VrackServicesInfo } from "../../vrack-services.types";

// ==================== ACTIONS ====================

export async function updateDisplayName(
  id: string,
  displayName: string
): Promise<VrackServicesInfo> {
  return ovhPut<VrackServicesInfo>(`/vrackServices/${id}`, { displayName });
}

// ==================== HELPERS (DUPLIQUÉS - ISOLATION) ====================

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

export function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    READY: "badge-success",
    CREATING: "badge-warning",
    ERROR: "badge-error",
    DELETING: "badge-error",
  };
  return classes[status] || "";
}

// ==================== SERVICE OBJECT ====================

export const generalService = {
  updateDisplayName,
  formatDate,
  getStatusBadgeClass,
};
