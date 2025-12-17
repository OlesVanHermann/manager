// ============================================================
// WEB CLOUD PACK XDSL SERVICE - API Pack Internet OVHcloud
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

export interface Pack { packName: string; description?: string; offerDescription: string; capabilities: { isLegacyOffer: boolean; canMoveAddress: boolean; }; }
export interface XdslAccess { accessName: string; accessType: string; status: string; address: { city: string; street: string; zipCode: string; }; connectionStatus: string; ipv4?: string; ipv6?: string; }
export interface VoipLine { serviceName: string; number: string; description?: string; status: string; }
export interface PackService { name: string; type: string; domain?: string; used: number; total: number; }
export interface Task { id: number; function: string; status: string; todoDate: string; doneDate?: string; }

export async function getPacks(): Promise<string[]> { return ovhGet<string[]>("/pack/xdsl"); }
export async function getPack(packName: string): Promise<Pack> { return ovhGet<Pack>(`/pack/xdsl/${packName}`); }

export async function getAccesses(packName: string): Promise<XdslAccess[]> {
  const ids = await ovhGet<string[]>(`/pack/xdsl/${packName}/xdslAccess/services`);
  return Promise.all(ids.map(id => ovhGet<XdslAccess>(`/xdsl/${id}`)));
}

export async function getVoipLines(packName: string): Promise<VoipLine[]> {
  const ids = await ovhGet<string[]>(`/pack/xdsl/${packName}/voipLine/services`).catch(() => []);
  return Promise.all(ids.map(id => ovhGet<VoipLine>(`/telephony/${id.split("/")[0]}/line/${id}`).catch(() => ({ serviceName: id, number: id, status: "unknown" }))));
}

export async function getServices(packName: string): Promise<PackService[]> {
  const services: PackService[] = [];
  const types = ["domain", "emailPro", "exchangeAccount", "hostedEmail", "voipLine"];
  for (const type of types) {
    const svcList = await ovhGet<string[]>(`/pack/xdsl/${packName}/${type}/services`).catch(() => []);
    if (svcList.length > 0) services.push({ name: type, type, used: svcList.length, total: svcList.length });
  }
  return services;
}

export async function getTasks(packName: string): Promise<Task[]> {
  const ids = await ovhGet<number[]>(`/pack/xdsl/${packName}/tasks`);
  const tasks = await Promise.all(ids.slice(0, 50).map(id => ovhGet<Task>(`/pack/xdsl/${packName}/tasks/${id}`)));
  return tasks.sort((a, b) => new Date(b.todoDate).getTime() - new Date(a.todoDate).getTime());
}
