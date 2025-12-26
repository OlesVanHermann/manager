// ============================================================
// VRACK Services Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhGet } from "../../../../../services/api";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

// ==================== API CALLS ====================

async function listDedicatedServers(serviceName: string): Promise<string[]> {
  return ovhGet<string[]>(`/vrack/${serviceName}/dedicatedServer`).catch(() => []);
}

async function listCloudProjects(serviceName: string): Promise<string[]> {
  return ovhGet<string[]>(`/vrack/${serviceName}/cloudProject`).catch(() => []);
}

async function listIpLoadbalancing(serviceName: string): Promise<string[]> {
  return ovhGet<string[]>(`/vrack/${serviceName}/ipLoadbalancing`).catch(() => []);
}

async function getAllServices(serviceName: string): Promise<{ type: string; items: string[] }[]> {
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

// ==================== SERVICE OBJECT ====================

export const vrackServicesService = {
  listDedicatedServers,
  listCloudProjects,
  listIpLoadbalancing,
  getAllServices,
  formatDate,
};
