// ============================================================
// LOAD BALANCER Farms Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { IpLoadBalancingFarm, IpLoadBalancingServer } from "../../load-balancer.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

function getStatusClass(status: string): string {
  return status === "active" ? "lb-farms-status-success" : "lb-farms-status-inactive";
}

// ==================== API CALLS ====================

async function listFarms(serviceName: string, zone?: string): Promise<number[]> {
  let path = `/ipLoadbalancing/${serviceName}/http/farm`;
  if (zone) path += `?zone=${zone}`;
  return ovhGet<number[]>(path);
}

async function getFarm(serviceName: string, farmId: number): Promise<IpLoadBalancingFarm> {
  return ovhGet<IpLoadBalancingFarm>(`/ipLoadbalancing/${serviceName}/http/farm/${farmId}`);
}

async function listServers(serviceName: string, farmId: number): Promise<number[]> {
  return ovhGet<number[]>(`/ipLoadbalancing/${serviceName}/http/farm/${farmId}/server`);
}

async function getServer(serviceName: string, farmId: number, serverId: number): Promise<IpLoadBalancingServer> {
  return ovhGet<IpLoadBalancingServer>(`/ipLoadbalancing/${serviceName}/http/farm/${farmId}/server/${serverId}`);
}

async function getAllFarms(serviceName: string): Promise<IpLoadBalancingFarm[]> {
  const ids = await listFarms(serviceName);
  return Promise.all(ids.map(id => getFarm(serviceName, id)));
}

async function getServersForFarm(serviceName: string, farmId: number): Promise<IpLoadBalancingServer[]> {
  const ids = await listServers(serviceName, farmId);
  return Promise.all(ids.map(id => getServer(serviceName, farmId, id)));
}

// ==================== SERVICE OBJECT ====================

export const lbFarmsService = {
  listFarms,
  getFarm,
  listServers,
  getServer,
  getAllFarms,
  getServersForFarm,
  formatDate,
  getStatusClass,
};
