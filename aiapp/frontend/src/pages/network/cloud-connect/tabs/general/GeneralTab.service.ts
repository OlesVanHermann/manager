// ============================================================
// CLOUD CONNECT General Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhPut } from "../../../../../services/api";
import type { CloudConnectInfo } from "../../cloud-connect.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function formatBandwidth(mbps: number): string {
  return mbps >= 1000 ? `${mbps / 1000} Gbps` : `${mbps} Mbps`;
}

function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    active: "cloudconnect-general-badge-success",
    init: "cloudconnect-general-badge-warning",
    disabled: "cloudconnect-general-badge-error",
  };
  return classes[status] || "";
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("fr-FR");
}

// ==================== ACTIONS ====================

async function updateDescription(
  uuid: string,
  description: string
): Promise<CloudConnectInfo> {
  return ovhPut<CloudConnectInfo>(`/ovhCloudConnect/${uuid}`, { description });
}

// ==================== SERVICE OBJECT ====================

export const cloudconnectGeneralService = {
  updateDescription,
  formatBandwidth,
  getStatusBadgeClass,
  formatDate,
};
