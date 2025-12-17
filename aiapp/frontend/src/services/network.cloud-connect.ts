// ============================================================
// NETWORK CLOUD CONNECT SERVICE - API OVHcloud Connect
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

export interface CloudConnect { uuid: string; description?: string; status: string; bandwidth: number; pop: string; portSpeed: number; }
export interface Interface { id: number; status: string; lightStatus: string; }
export interface Task { id: number; function: string; status: string; startDate: string; doneDate?: string; }

export async function getServices(): Promise<string[]> { return ovhGet<string[]>("/ovhCloudConnect"); }
export async function getService(uuid: string): Promise<CloudConnect> { return ovhGet<CloudConnect>(`/ovhCloudConnect/${uuid}`); }

export async function getInterfaces(uuid: string): Promise<Interface[]> {
  const ids = await ovhGet<number[]>(`/ovhCloudConnect/${uuid}/interface`);
  return Promise.all(ids.map(id => ovhGet<Interface>(`/ovhCloudConnect/${uuid}/interface/${id}`)));
}

export async function getTasks(uuid: string): Promise<Task[]> {
  const ids = await ovhGet<number[]>(`/ovhCloudConnect/${uuid}/task`).catch(() => []);
  const tasks = await Promise.all(ids.slice(0, 50).map(id => ovhGet<Task>(`/ovhCloudConnect/${uuid}/task/${id}`)));
  return tasks.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}
