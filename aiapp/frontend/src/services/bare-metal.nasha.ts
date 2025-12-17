// ============================================================
// BARE METAL NASHA SERVICE - API NAS-HA OVHcloud
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "./api";

export interface Nasha {
  serviceName: string;
  customName?: string;
  datacenter: string;
  ip: string;
  zpoolSize: number;
  zpoolCapacity: number;
  monitored: boolean;
  status: string;
}

export interface Partition {
  partitionName: string;
  partitionDescription?: string;
  protocol: string;
  size: number;
  usedBySnapshots: number;
}

export interface Snapshot {
  name: string;
  partitionName: string;
  type: string;
  createdAt: string;
}

export interface Access {
  ip: string;
  partitionName: string;
  type: string;
  aclDescription?: string;
}

export interface Task {
  taskId: number;
  operation: string;
  status: string;
  partitionName?: string;
  startDate: string;
  doneDate?: string;
}

export async function getNashaList(): Promise<string[]> {
  return ovhGet<string[]>("/dedicated/nasha");
}

export async function getNasha(serviceName: string): Promise<Nasha> {
  return ovhGet<Nasha>(`/dedicated/nasha/${serviceName}`);
}

export async function getPartitions(serviceName: string): Promise<Partition[]> {
  const names = await ovhGet<string[]>(`/dedicated/nasha/${serviceName}/partition`);
  return Promise.all(names.map(name => ovhGet<Partition>(`/dedicated/nasha/${serviceName}/partition/${name}`)));
}

export async function createPartition(serviceName: string, data: { partitionName: string; protocol: string; size: number }): Promise<void> {
  return ovhPost(`/dedicated/nasha/${serviceName}/partition`, data);
}

export async function deletePartition(serviceName: string, partitionName: string): Promise<void> {
  return ovhDelete(`/dedicated/nasha/${serviceName}/partition/${partitionName}`);
}

export async function getSnapshots(serviceName: string): Promise<Snapshot[]> {
  const partitions = await getPartitions(serviceName);
  const allSnapshots: Snapshot[] = [];
  for (const partition of partitions) {
    const snapshotTypes = await ovhGet<string[]>(`/dedicated/nasha/${serviceName}/partition/${partition.partitionName}/snapshot`).catch(() => []);
    for (const type of snapshotTypes) {
      allSnapshots.push({ name: `${partition.partitionName}_${type}`, partitionName: partition.partitionName, type, createdAt: new Date().toISOString() });
    }
  }
  return allSnapshots;
}

export async function getAccesses(serviceName: string): Promise<Access[]> {
  const partitions = await getPartitions(serviceName);
  const allAccesses: Access[] = [];
  for (const partition of partitions) {
    const ips = await ovhGet<string[]>(`/dedicated/nasha/${serviceName}/partition/${partition.partitionName}/access`).catch(() => []);
    for (const ip of ips) {
      const access = await ovhGet<Access>(`/dedicated/nasha/${serviceName}/partition/${partition.partitionName}/access/${encodeURIComponent(ip)}`).catch(() => null);
      if (access) allAccesses.push({ ...access, partitionName: partition.partitionName });
    }
  }
  return allAccesses;
}

export async function deleteAccess(serviceName: string, partitionName: string, ip: string): Promise<void> {
  return ovhDelete(`/dedicated/nasha/${serviceName}/partition/${partitionName}/access/${encodeURIComponent(ip)}`);
}

export async function getTasks(serviceName: string): Promise<Task[]> {
  const ids = await ovhGet<number[]>(`/dedicated/nasha/${serviceName}/task`);
  const tasks = await Promise.all(ids.slice(0, 50).map(id => ovhGet<Task>(`/dedicated/nasha/${serviceName}/task/${id}`)));
  return tasks.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}
