// ============================================================
// BARE METAL NETAPP SERVICE - API Enterprise File Storage OVHcloud
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

export interface NetApp { id: string; name: string; region: string; status: string; performanceLevel: string; createdAt: string; }
export interface Volume { id: string; name: string; protocol: string; size: number; usedSize: number; status: string; mountPath: string; }
export interface Snapshot { id: string; name: string; volumeId: string; volumeName: string; createdAt: string; }
export interface Task { id: string; type: string; status: string; progress: number; createdAt: string; finishedAt?: string; }

export async function getNetAppList(): Promise<string[]> { return ovhGet<string[]>("/storage/netapp"); }
export async function getNetApp(serviceId: string): Promise<NetApp> { return ovhGet<NetApp>(`/storage/netapp/${serviceId}`); }

export async function getVolumes(serviceId: string): Promise<Volume[]> {
  const ids = await ovhGet<string[]>(`/storage/netapp/${serviceId}/share`);
  return Promise.all(ids.map(id => ovhGet<Volume>(`/storage/netapp/${serviceId}/share/${id}`)));
}

export async function createVolume(serviceId: string, data: { name: string; protocol: string; size: number }): Promise<void> {
  return ovhPost(`/storage/netapp/${serviceId}/share`, data);
}

export async function deleteVolume(serviceId: string, volumeId: string): Promise<void> {
  return ovhDelete(`/storage/netapp/${serviceId}/share/${volumeId}`);
}

export async function getSnapshots(serviceId: string): Promise<Snapshot[]> {
  const volumes = await getVolumes(serviceId);
  const allSnapshots: Snapshot[] = [];
  for (const volume of volumes) {
    const snapshotIds = await ovhGet<string[]>(`/storage/netapp/${serviceId}/share/${volume.id}/snapshot`).catch(() => []);
    for (const snapId of snapshotIds) {
      const snap = await ovhGet<Snapshot>(`/storage/netapp/${serviceId}/share/${volume.id}/snapshot/${snapId}`).catch(() => null);
      if (snap) allSnapshots.push({ ...snap, volumeName: volume.name, volumeId: volume.id });
    }
  }
  return allSnapshots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getTasks(serviceId: string): Promise<Task[]> {
  return ovhGet<Task[]>(`/storage/netapp/${serviceId}/task`).catch(() => []);
}
