// ============================================================
// VRACK SERVICES General Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhPut } from "../../../../../services/api";
import type { VrackServicesInfo } from "../../vrack-services.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("fr-FR");
}

function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    READY: "vrackservices-general-badge-success",
    CREATING: "vrackservices-general-badge-warning",
    ERROR: "vrackservices-general-badge-error",
    DELETING: "vrackservices-general-badge-error",
  };
  return classes[status] || "";
}

// ==================== ACTIONS ====================

async function updateDisplayName(
  id: string,
  displayName: string
): Promise<VrackServicesInfo> {
  return ovhPut<VrackServicesInfo>(`/vrackServices/${id}`, { displayName });
}

// ==================== SERVICE OBJECT ====================

export const vrackservicesGeneralService = {
  updateDisplayName,
  formatDate,
  formatDateTime,
  getStatusBadgeClass,
};
