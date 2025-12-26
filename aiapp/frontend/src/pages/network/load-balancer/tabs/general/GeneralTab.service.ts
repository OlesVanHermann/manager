// ============================================================
// LOAD BALANCER General Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhGet, ovhPut } from "../../../../../services/api";
import type { IpLoadBalancing, IpLoadBalancingServiceInfos } from "../../load-balancer.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function getStatusBadgeClass(state: string): string {
  const classes: Record<string, string> = {
    ok: "lb-general-badge-success",
    free: "lb-general-badge-success",
    suspended: "lb-general-badge-warning",
    quarantined: "lb-general-badge-warning",
    blacklisted: "lb-general-badge-error",
    deleted: "lb-general-badge-error",
  };
  return classes[state] || "";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("fr-FR");
}

// ==================== API CALLS ====================

async function getLoadBalancer(serviceName: string): Promise<IpLoadBalancing> {
  return ovhGet<IpLoadBalancing>(`/ipLoadbalancing/${serviceName}`);
}

async function getServiceInfos(serviceName: string): Promise<IpLoadBalancingServiceInfos> {
  return ovhGet<IpLoadBalancingServiceInfos>(`/ipLoadbalancing/${serviceName}/serviceInfos`);
}

async function updateDisplayName(serviceName: string, displayName: string): Promise<void> {
  return ovhPut<void>(`/ipLoadbalancing/${serviceName}`, { displayName });
}

async function refresh(serviceName: string): Promise<void> {
  return ovhGet<void>(`/ipLoadbalancing/${serviceName}/refresh`);
}

// ==================== SERVICE OBJECT ====================

export const lbGeneralService = {
  getLoadBalancer,
  getServiceInfos,
  updateDisplayName,
  refresh,
  getStatusBadgeClass,
  formatDate,
  formatDateTime,
};
