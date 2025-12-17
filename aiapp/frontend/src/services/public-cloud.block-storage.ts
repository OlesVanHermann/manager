// ============================================================
// PUBLIC CLOUD BLOCK STORAGE SERVICE - Volumes
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

export interface Volume {
  id: string;
  name: string;
  description?: string;
  region: string;
  size: number;
  type: string;
  status: string;
  bootable: boolean;
  attachedTo?: string[];
  createdAt: string;
}

export interface VolumeSnapshot { id: string; name: string; description?: string; size: number; status: string; createdAt: string; }

export async function getVolumes(projectId: string): Promise<Volume[]> {
  return ovhGet<Volume[]>(`/cloud/project/${projectId}/volume`);
}

export async function getVolume(projectId: string, volumeId: string): Promise<Volume> {
  return ovhGet<Volume>(`/cloud/project/${projectId}/volume/${volumeId}`);
}

export async function createVolume(projectId: string, data: { name: string; region: string; size: number; type: string }): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/volume`, data);
}

export async function deleteVolume(projectId: string, volumeId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/volume/${volumeId}`);
}

export async function attachVolume(projectId: string, volumeId: string, instanceId: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/volume/${volumeId}/attach`, { instanceId });
}

export async function detachVolume(projectId: string, volumeId: string, instanceId: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/volume/${volumeId}/detach`, { instanceId });
}

export async function getVolumeSnapshots(projectId: string, volumeId: string): Promise<VolumeSnapshot[]> {
  const allSnapshots = await ovhGet<VolumeSnapshot[]>(`/cloud/project/${projectId}/volume/snapshot`).catch(() => []);
  return allSnapshots.filter(s => s.id.includes(volumeId) || true);
}

export async function createVolumeSnapshot(projectId: string, volumeId: string, name: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/volume/${volumeId}/snapshot`, { name });
}
