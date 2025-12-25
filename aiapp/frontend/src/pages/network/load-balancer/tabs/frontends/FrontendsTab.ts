// ============================================================
// LOAD BALANCER Frontends Tab - Service isolé (extrait de network.ts)
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { IpLoadBalancingFrontend } from "../../load-balancer.types";

export async function listFrontends(serviceName: string, zone?: string): Promise<number[]> {
  let path = `/ipLoadbalancing/${serviceName}/http/frontend`;
  if (zone) path += `?zone=${zone}`;
  return ovhGet<number[]>(path);
}

export async function getFrontend(serviceName: string, frontendId: number): Promise<IpLoadBalancingFrontend> {
  return ovhGet<IpLoadBalancingFrontend>(`/ipLoadbalancing/${serviceName}/http/frontend/${frontendId}`);
}

export async function getAllFrontends(serviceName: string): Promise<IpLoadBalancingFrontend[]> {
  const ids = await listFrontends(serviceName);
  return Promise.all(ids.map(id => getFrontend(serviceName, id)));
}

export const frontendsService = { listFrontends, getFrontend, getAllFrontends };
