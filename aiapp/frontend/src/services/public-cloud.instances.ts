// ============================================================
// PUBLIC CLOUD INSTANCES SERVICE - Compute VMs
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

export interface Instance {
  id: string;
  name: string;
  flavorId: string;
  flavorName: string;
  imageId: string;
  imageName: string;
  region: string;
  status: string;
  created: string;
  ipAddresses: { ip: string; type: string; version: number }[];
}

export interface Snapshot { id: string; name: string; status: string; size: number; createdAt: string; }

export async function getInstances(projectId: string): Promise<Instance[]> {
  return ovhGet<Instance[]>(`/cloud/project/${projectId}/instance`);
}

export async function getInstance(projectId: string, instanceId: string): Promise<Instance> {
  return ovhGet<Instance>(`/cloud/project/${projectId}/instance/${instanceId}`);
}

export async function instanceAction(projectId: string, instanceId: string, action: string): Promise<void> {
  switch (action) {
    case "start": return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/start`, {});
    case "stop": return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/stop`, {});
    case "reboot": return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/reboot`, { type: "soft" });
    case "rescue": return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/rescueMode`, { rescue: true });
    case "reinstall": return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/reinstall`, {});
    case "delete": return ovhDelete(`/cloud/project/${projectId}/instance/${instanceId}`);
    default: throw new Error(`Unknown action: ${action}`);
  }
}

export async function getSnapshots(projectId: string, instanceId: string): Promise<Snapshot[]> {
  const allSnapshots = await ovhGet<Snapshot[]>(`/cloud/project/${projectId}/snapshot`);
  return allSnapshots.filter(s => s.name.includes(instanceId) || true); // Filtrer si possible
}

export async function createSnapshot(projectId: string, instanceId: string, name: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/snapshot`, { snapshotName: name });
}

export async function getConsoleUrl(projectId: string, instanceId: string): Promise<string> {
  const resp = await ovhPost<{ url: string }>(`/cloud/project/${projectId}/instance/${instanceId}/vnc`, {});
  return resp.url;
}
