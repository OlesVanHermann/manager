// ============================================================
// SECURITY Overview Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhPut } from "../../../../../services/api";
import type { SecurityIpInfo } from "../../security.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function getMitigationBadgeClass(mitigation: string): string {
  const classes: Record<string, string> = {
    auto: "security-overview-badge-success",
    permanent: "security-overview-badge-info",
    off: "security-overview-badge-secondary",
  };
  return classes[mitigation] || "";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("fr-FR");
}

// ==================== API CALLS ====================

async function changeMitigation(
  ipBlock: string,
  mitigation: "auto" | "permanent" | "off"
): Promise<void> {
  return ovhPut<void>(`/ip/${encodeURIComponent(ipBlock)}/mitigation`, {
    mitigation,
  });
}

async function enableFirewall(
  ipBlock: string,
  ipOnFirewall: string
): Promise<void> {
  return ovhPut<void>(
    `/ip/${encodeURIComponent(ipBlock)}/firewall/${ipOnFirewall}`,
    { enabled: true }
  );
}

// ==================== SERVICE OBJECT ====================

export const securityOverviewService = {
  changeMitigation,
  enableFirewall,
  getMitigationBadgeClass,
  formatDate,
  formatDateTime,
};
