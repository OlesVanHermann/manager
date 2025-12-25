// ============================================================
// VRACK Services Tab - Service isolé (extrait de network.ts)
// ============================================================

import { ovhGet } from "../../../../../services/api";

export async function listDedicatedServers(serviceName: string): Promise<string[]> {
  return ovhGet<string[]>(`/vrack/${serviceName}/dedicatedServer`).catch(() => []);
}

export async function listCloudProjects(serviceName: string): Promise<string[]> {
  return ovhGet<string[]>(`/vrack/${serviceName}/cloudProject`).catch(() => []);
}

export async function listIpLoadbalancing(serviceName: string): Promise<string[]> {
  return ovhGet<string[]>(`/vrack/${serviceName}/ipLoadbalancing`).catch(() => []);
}

export async function getAllServices(serviceName: string): Promise<{ type: string; items: string[] }[]> {
  const [servers, clouds, lbs] = await Promise.all([
    listDedicatedServers(serviceName),
    listCloudProjects(serviceName),
    listIpLoadbalancing(serviceName),
  ]);
  const list: { type: string; items: string[] }[] = [];
  if (servers.length) list.push({ type: "dedicatedServer", items: servers });
  if (clouds.length) list.push({ type: "cloudProject", items: clouds });
  if (lbs.length) list.push({ type: "loadBalancer", items: lbs });
  return list;
}

export const servicesService = { listDedicatedServers, listCloudProjects, listIpLoadbalancing, getAllServices };
