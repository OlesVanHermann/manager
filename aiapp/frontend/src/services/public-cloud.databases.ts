import { ovhGet, ovhPost, ovhDelete } from "./api";

export interface Database { id: string; description: string; engine: string; version: string; plan: string; status: string; region: string; nodeNumber: number; flavor: string; }
export interface DbUser { id: string; username: string; status: string; createdAt: string; }
export interface Backup { id: string; description?: string; status: string; createdAt: string; size: number; }

export async function getDatabases(projectId: string, engine: string): Promise<string[]> { return ovhGet<string[]>(`/cloud/project/${projectId}/database/${engine}`); }
export async function getDatabase(projectId: string, engine: string, serviceId: string): Promise<Database> { return ovhGet<Database>(`/cloud/project/${projectId}/database/${engine}/${serviceId}`); }
export async function getUsers(projectId: string, engine: string, serviceId: string): Promise<DbUser[]> { return ovhGet<DbUser[]>(`/cloud/project/${projectId}/database/${engine}/${serviceId}/user`); }
export async function getBackups(projectId: string, engine: string, serviceId: string): Promise<Backup[]> { return ovhGet<Backup[]>(`/cloud/project/${projectId}/database/${engine}/${serviceId}/backup`).catch(() => []); }
