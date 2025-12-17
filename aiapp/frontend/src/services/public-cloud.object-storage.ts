// ============================================================
// PUBLIC CLOUD OBJECT STORAGE SERVICE - S3
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

export interface Container {
  name: string;
  region: string;
  storedBytes: number;
  storedObjects: number;
  staticUrl?: string;
  containerType: string;
}

export interface StorageObject { name: string; size: number; contentType: string; lastModified: string; }
export interface S3User { id: string; username: string; description?: string; createdAt: string; }

export async function getContainers(projectId: string): Promise<Container[]> {
  return ovhGet<Container[]>(`/cloud/project/${projectId}/storage`);
}

export async function getContainer(projectId: string, region: string, containerId: string): Promise<Container> {
  const containers = await getContainers(projectId);
  const container = containers.find(c => c.name === containerId && c.region === region);
  if (!container) throw new Error("Container not found");
  return container;
}

export async function createContainer(projectId: string, data: { name: string; region: string; containerType: string }): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/storage`, data);
}

export async function deleteContainer(projectId: string, region: string, containerId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/storage/${containerId}?region=${region}`);
}

export async function getObjects(projectId: string, region: string, containerId: string, prefix?: string): Promise<StorageObject[]> {
  const url = prefix 
    ? `/cloud/project/${projectId}/storage/${containerId}?region=${region}&prefix=${encodeURIComponent(prefix)}`
    : `/cloud/project/${projectId}/storage/${containerId}?region=${region}`;
  const data = await ovhGet<{ objects: StorageObject[] }>(url).catch(() => ({ objects: [] }));
  return data.objects || [];
}

export async function getS3Users(projectId: string): Promise<S3User[]> {
  return ovhGet<S3User[]>(`/cloud/project/${projectId}/user`).catch(() => []);
}

export async function createS3User(projectId: string, description: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/user`, { description, role: "objectstore_operator" });
}
