import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { InstanceSnapshot } from "../instances.types";

export async function getSnapshots(projectId: string, instanceId: string): Promise<InstanceSnapshot[]> {
  return ovhGet<InstanceSnapshot[]>(`/cloud/project/${projectId}/snapshot`);
}

export async function createSnapshot(projectId: string, instanceId: string, name: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/snapshot`, { snapshotName: name });
}

export function formatSize(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
  return `${bytes} B`;
}

export function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = { active: "badge-success", queued: "badge-warning", saving: "badge-info" };
  return classes[status] || "";
}

export const snapshotsService = { getSnapshots, createSnapshot, formatSize, getStatusBadgeClass };
