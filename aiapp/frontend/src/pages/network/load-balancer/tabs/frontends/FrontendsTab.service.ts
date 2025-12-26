// ============================================================
// LOAD BALANCER Frontends Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { IpLoadBalancingFrontend } from "../../load-balancer.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

function getStatusBadgeClass(disabled: boolean): string {
  return disabled ? "lb-frontends-badge-inactive" : "lb-frontends-badge-success";
}

// ==================== API CALLS ====================

async function listFrontends(serviceName: string, zone?: string): Promise<number[]> {
  let path = `/ipLoadbalancing/${serviceName}/http/frontend`;
  if (zone) path += `?zone=${zone}`;
  return ovhGet<number[]>(path);
}

async function getFrontend(serviceName: string, frontendId: number): Promise<IpLoadBalancingFrontend> {
  return ovhGet<IpLoadBalancingFrontend>(`/ipLoadbalancing/${serviceName}/http/frontend/${frontendId}`);
}

async function getAllFrontends(serviceName: string): Promise<IpLoadBalancingFrontend[]> {
  const ids = await listFrontends(serviceName);
  return Promise.all(ids.map(id => getFrontend(serviceName, id)));
}

// ==================== SERVICE OBJECT ====================

export const lbFrontendsService = {
  listFrontends,
  getFrontend,
  getAllFrontends,
  formatDate,
  getStatusBadgeClass,
};
