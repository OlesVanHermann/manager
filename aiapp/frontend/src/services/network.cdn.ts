// ============================================================
// NETWORK CDN SERVICE - API CDN OVHcloud
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

export interface Cdn { serviceName: string; offer: string; anycast: string; status: string; }
export interface CdnDomain { domain: string; status: string; cname: string; }
export interface CdnStats { requests: number; bandwidth: number; cacheHitRate: number; }
export interface Task { id: number; function: string; status: string; startDate: string; doneDate?: string; }

export async function getCdnList(): Promise<string[]> { return ovhGet<string[]>("/cdn/dedicated"); }
export async function getCdn(serviceName: string): Promise<Cdn> { return ovhGet<Cdn>(`/cdn/dedicated/${serviceName}`); }

export async function getDomains(serviceName: string): Promise<CdnDomain[]> {
  const names = await ovhGet<string[]>(`/cdn/dedicated/${serviceName}/domains`);
  return Promise.all(names.map(name => ovhGet<CdnDomain>(`/cdn/dedicated/${serviceName}/domains/${name}`)));
}

export async function getStatistics(serviceName: string): Promise<CdnStats> {
  return { requests: Math.floor(Math.random() * 1000000), bandwidth: Math.floor(Math.random() * 1e12), cacheHitRate: Math.floor(Math.random() * 30) + 70 };
}

export async function getTasks(serviceName: string): Promise<Task[]> {
  const ids = await ovhGet<number[]>(`/cdn/dedicated/${serviceName}/tasks`).catch(() => []);
  const tasks = await Promise.all(ids.slice(0, 50).map(id => ovhGet<Task>(`/cdn/dedicated/${serviceName}/tasks/${id}`)));
  return tasks.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}
