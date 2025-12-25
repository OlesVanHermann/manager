// ============================================================
// Network Dashboard - Service isolé
// ============================================================

import { ovhGet } from "../../services/api";

// ==================== COMPTAGES ====================

export async function countIps(): Promise<number> {
  try {
    const list = await ovhGet<string[]>("/ip");
    return list.length;
  } catch {
    return 0;
  }
}

export async function countVracks(): Promise<number> {
  try {
    const list = await ovhGet<string[]>("/vrack");
    return list.length;
  } catch {
    return 0;
  }
}

export async function countLoadBalancers(): Promise<number> {
  try {
    const list = await ovhGet<string[]>("/ipLoadbalancing");
    return list.length;
  } catch {
    return 0;
  }
}

export async function countCdn(): Promise<number> {
  try {
    const list = await ovhGet<string[]>("/cdn/dedicated");
    return list.length;
  } catch {
    return 0;
  }
}

export async function countCloudConnect(): Promise<number> {
  try {
    const list = await ovhGet<string[]>("/ovhCloudConnect");
    return list.length;
  } catch {
    return 0;
  }
}

export async function countVrackServices(): Promise<number> {
  try {
    const list = await ovhGet<string[]>("/vrackServices/resource");
    return list.length;
  } catch {
    return 0;
  }
}

// ==================== CHARGEMENT GLOBAL ====================

export interface NetworkCounts {
  ips: number;
  vracks: number;
  lbs: number;
  cdn: number;
  cloudConnect: number;
  vrackServices: number;
}

export async function loadAllCounts(): Promise<NetworkCounts> {
  const [ips, vracks, lbs, cdn, cloudConnect, vrackServices] = await Promise.all([
    countIps(),
    countVracks(),
    countLoadBalancers(),
    countCdn(),
    countCloudConnect(),
    countVrackServices(),
  ]);
  return { ips, vracks, lbs, cdn, cloudConnect, vrackServices };
}

// ==================== EXPORT SERVICE ====================

export const dashboardService = {
  countIps,
  countVracks,
  countLoadBalancers,
  countCdn,
  countCloudConnect,
  countVrackServices,
  loadAllCounts,
};
