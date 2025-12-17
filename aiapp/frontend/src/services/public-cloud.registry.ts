import { ovhGet, ovhPost, ovhDelete } from "./api";

export interface Registry { id: string; name: string; region: string; status: string; url: string; size: number; createdAt: string; }
export interface Image { id: string; name: string; tagsCount: number; size: number; updatedAt: string; }
export interface RegistryUser { id: string; user: string; email?: string; }

export async function getRegistries(projectId: string): Promise<string[]> { return ovhGet<string[]>(`/cloud/project/${projectId}/containerRegistry`); }
export async function getRegistry(projectId: string, registryId: string): Promise<Registry> { return ovhGet<Registry>(`/cloud/project/${projectId}/containerRegistry/${registryId}`); }
export async function getImages(projectId: string, registryId: string): Promise<Image[]> { return ovhGet<Image[]>(`/cloud/project/${projectId}/containerRegistry/${registryId}/repositories`).catch(() => []); }
export async function getUsers(projectId: string, registryId: string): Promise<RegistryUser[]> { return ovhGet<RegistryUser[]>(`/cloud/project/${projectId}/containerRegistry/${registryId}/users`).catch(() => []); }
