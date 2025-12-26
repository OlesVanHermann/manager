import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { Volume } from "../block-storage.types";

export async function getVolume(projectId: string, volumeId: string): Promise<Volume> {
  return ovhGet<Volume>(`/cloud/project/${projectId}/volume/${volumeId}`);
}

export async function attachVolume(projectId: string, volumeId: string, instanceId: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/volume/${volumeId}/attach`, { instanceId });
}

export async function detachVolume(projectId: string, volumeId: string, instanceId: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/volume/${volumeId}/detach`, { instanceId });
}

export async function resizeVolume(projectId: string, volumeId: string, newSize: number): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/volume/${volumeId}/upsize`, { size: newSize });
}

export async function deleteVolume(projectId: string, volumeId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/volume/${volumeId}`);
}

export function formatVolumeSize(sizeGB: number): string {
  return sizeGB >= 1000 ? `${(sizeGB / 1000).toFixed(1)} TB` : `${sizeGB} GB`;
}

export const generalService = { getVolume, attachVolume, detachVolume, resizeVolume, deleteVolume, formatVolumeSize };
