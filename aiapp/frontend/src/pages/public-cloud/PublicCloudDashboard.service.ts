// ============================================================
// PUBLIC-CLOUD DASHBOARD - Service ISOLÉ
// ============================================================

import { ovhGet } from "../../services/api";

export interface CloudInstance {
  id: string;
  name: string;
  status: string;
}

export interface CloudVolume {
  id: string;
  name: string;
  size: number;
}

export interface CloudContainer {
  id: string;
  name: string;
  region: string;
}

export async function listProjects(): Promise<string[]> {
  return ovhGet<string[]>("/cloud/project");
}

export async function listInstances(projectId: string): Promise<CloudInstance[]> {
  return ovhGet<CloudInstance[]>(`/cloud/project/${projectId}/instance`);
}

export async function listVolumes(projectId: string): Promise<CloudVolume[]> {
  return ovhGet<CloudVolume[]>(`/cloud/project/${projectId}/volume`);
}

export async function listContainers(projectId: string): Promise<CloudContainer[]> {
  return ovhGet<CloudContainer[]>(`/cloud/project/${projectId}/storage`);
}
