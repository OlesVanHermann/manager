// ============================================================
// WEB CLOUD OVERTHEBOX SERVICE - API OverTheBox OVHcloud
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

export interface OverTheBox { serviceName: string; customerDescription?: string; status: string; releaseChannel: string; systemVersion?: string; tunnelMode: string; }
export interface Remote { remoteId: string; publicIp?: string; status: string; lastSeen?: string; exposedPort: number; }
export interface Task { id: string; name: string; status: string; todoDate: string; doneDate?: string; }

export async function getOverTheBoxList(): Promise<string[]> { return ovhGet<string[]>("/overTheBox"); }
export async function getOverTheBox(serviceName: string): Promise<OverTheBox> { return ovhGet<OverTheBox>(`/overTheBox/${serviceName}`); }

export async function getRemotes(serviceName: string): Promise<Remote[]> {
  const ids = await ovhGet<string[]>(`/overTheBox/${serviceName}/remoteAccesses`);
  return Promise.all(ids.map(id => ovhGet<Remote>(`/overTheBox/${serviceName}/remoteAccesses/${id}`)));
}

export async function getTasks(serviceName: string): Promise<Task[]> {
  const ids = await ovhGet<string[]>(`/overTheBox/${serviceName}/tasks`);
  const tasks = await Promise.all(ids.slice(0, 50).map(id => ovhGet<Task>(`/overTheBox/${serviceName}/tasks/${id}`)));
  return tasks.sort((a, b) => new Date(b.todoDate).getTime() - new Date(a.todoDate).getTime());
}
