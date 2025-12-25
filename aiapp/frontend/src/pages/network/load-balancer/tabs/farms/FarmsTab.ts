// ============================================================
// LOAD BALANCER Farms Tab - Service isolé (extrait de network.ts)
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { IpLoadBalancingFarm, IpLoadBalancingServer } from "../../load-balancer.types";

export async function listFarms(serviceName: string, zone?: string): Promise<number[]> {
  let path = `/ipLoadbalancing/${serviceName}/http/farm`;
  if (zone) path += `?zone=${zone}`;
  return ovhGet<number[]>(path);
}

export async function getFarm(serviceName: string, farmId: number): Promise<IpLoadBalancingFarm> {
  return ovhGet<IpLoadBalancingFarm>(`/ipLoadbalancing/${serviceName}/http/farm/${farmId}`);
}

export async function listServers(serviceName: string, farmId: number): Promise<number[]> {
  return ovhGet<number[]>(`/ipLoadbalancing/${serviceName}/http/farm/${farmId}/server`);
}

export async function getServer(serviceName: string, farmId: number, serverId: number): Promise<IpLoadBalancingServer> {
  return ovhGet<IpLoadBalancingServer>(`/ipLoadbalancing/${serviceName}/http/farm/${farmId}/server/${serverId}`);
}

export async function getAllFarms(serviceName: string): Promise<IpLoadBalancingFarm[]> {
  const ids = await listFarms(serviceName);
  return Promise.all(ids.map(id => getFarm(serviceName, id)));
}

export async function getServersForFarm(serviceName: string, farmId: number): Promise<IpLoadBalancingServer[]> {
  const ids = await listServers(serviceName, farmId);
  return Promise.all(ids.map(id => getServer(serviceName, farmId, id)));
}

export const farmsService = { listFarms, getFarm, listServers, getServer, getAllFarms, getServersForFarm };
