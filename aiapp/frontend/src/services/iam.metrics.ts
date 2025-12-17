// ============================================================
// IAM METRICS SERVICE - API Metrics Platform OVHcloud
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

// ============================================================
// TYPES
// ============================================================

export interface MetricsService {
  serviceName: string;
  displayName?: string;
  region: string;
  type: string;
  status: string;
  quota: {
    current: number;
    max: number;
  };
  createdAt: string;
}

export interface Token {
  id: string;
  description?: string;
  type: "read" | "write";
  access: string;
  isRevoked: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface Task {
  id: number;
  function: string;
  status: "done" | "doing" | "todo" | "error" | "cancelled";
  startDate?: string;
  doneDate?: string;
}

// ============================================================
// SERVICE
// ============================================================

/** Récupère la liste des services Metrics. */
export async function getServices(): Promise<string[]> {
  return ovhGet<string[]>("/metrics");
}

/** Récupère les détails d'un service Metrics. */
export async function getService(serviceName: string): Promise<MetricsService> {
  return ovhGet<MetricsService>(`/metrics/${serviceName}`);
}

/** Met à jour un service Metrics. */
export async function updateService(serviceName: string, data: { description?: string }): Promise<void> {
  return ovhPost(`/metrics/${serviceName}`, data);
}

// ============================================================
// TOKENS
// ============================================================

/** Récupère la liste des tokens d'un service. */
export async function getTokens(serviceName: string): Promise<Token[]> {
  const ids = await ovhGet<string[]>(`/metrics/${serviceName}/token`);
  const tokens = await Promise.all(
    ids.map((id) => ovhGet<Token>(`/metrics/${serviceName}/token/${id}`))
  );
  return tokens;
}

/** Récupère les détails d'un token. */
export async function getToken(serviceName: string, tokenId: string): Promise<Token> {
  return ovhGet<Token>(`/metrics/${serviceName}/token/${tokenId}`);
}

/** Crée un nouveau token. */
export async function createToken(serviceName: string, data: { description?: string; type: "read" | "write" }): Promise<Token> {
  return ovhPost<Token>(`/metrics/${serviceName}/token`, data);
}

/** Révoque un token. */
export async function revokeToken(serviceName: string, tokenId: string): Promise<void> {
  return ovhDelete(`/metrics/${serviceName}/token/${tokenId}`);
}

// ============================================================
// TASKS
// ============================================================

/** Récupère la liste des tâches d'un service. */
export async function getTasks(serviceName: string): Promise<Task[]> {
  const ids = await ovhGet<number[]>(`/metrics/${serviceName}/task`);
  const tasks = await Promise.all(
    ids.map((id) => ovhGet<Task>(`/metrics/${serviceName}/task/${id}`))
  );
  return tasks.sort((a, b) => {
    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
    return dateB - dateA;
  });
}

/** Récupère les détails d'une tâche. */
export async function getTask(serviceName: string, taskId: number): Promise<Task> {
  return ovhGet<Task>(`/metrics/${serviceName}/task/${taskId}`);
}
