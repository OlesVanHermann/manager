// ============================================================
// BARE METAL HOUSING SERVICE - Colocation
// ============================================================

import { ovhGet, ovhPost } from "./api";

export interface Housing { name: string; datacenter: string; rack: string; networkBandwidth: number; }
export interface Task { taskId: number; function: string; status: string; startDate: string; doneDate?: string; }

export async function getHousingList(): Promise<string[]> { return ovhGet<string[]>("/dedicated/housing"); }
export async function getHousing(serviceName: string): Promise<Housing> { return ovhGet<Housing>(`/dedicated/housing/${serviceName}`); }

export async function getTasks(serviceName: string): Promise<Task[]> {
  const ids = await ovhGet<number[]>(`/dedicated/housing/${serviceName}/task`).catch(() => []);
  const tasks = await Promise.all(ids.slice(0, 50).map(id => ovhGet<Task>(`/dedicated/housing/${serviceName}/task/${id}`).catch(() => null)));
  return (tasks.filter(Boolean) as Task[]).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}
