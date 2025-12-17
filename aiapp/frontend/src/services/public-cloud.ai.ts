import { ovhGet, ovhPost, ovhDelete } from "./api";

export interface Notebook { id: string; name?: string; framework: string; status: string; url?: string; createdAt: string; }
export interface Job { id: string; name?: string; image: string; status: string; createdAt: string; finishedAt?: string; }
export interface App { id: string; name?: string; image: string; status: string; url?: string; replicas: number; createdAt: string; }

export async function getNotebooks(projectId: string): Promise<Notebook[]> { return ovhGet<Notebook[]>(`/cloud/project/${projectId}/ai/notebook`).catch(() => []); }
export async function getJobs(projectId: string): Promise<Job[]> { return ovhGet<Job[]>(`/cloud/project/${projectId}/ai/job`).catch(() => []); }
export async function getApps(projectId: string): Promise<App[]> { return ovhGet<App[]>(`/cloud/project/${projectId}/ai/app`).catch(() => []); }
