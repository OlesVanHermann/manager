// ============================================================
// IAM DBAAS-LOGS SERVICE - API Logs Data Platform OVHcloud
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "./api";

// ============================================================
// TYPES
// ============================================================

export interface LogsService {
  serviceName: string;
  displayName?: string;
  cluster: string;
  region: string;
  state: string;
  plan: string;
  createdAt: string;
}

export interface Stream {
  streamId: string;
  title: string;
  description?: string;
  retentionId: string;
  indexingEnabled: boolean;
  webSocketEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Dashboard {
  dashboardId: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isEditable: boolean;
}

export interface Index {
  indexId: string;
  name: string;
  description?: string;
  nbShard: number;
  isEditable: boolean;
  createdAt: string;
  currentSize: number;
  maxSize: number;
}

export interface Input {
  inputId: string;
  title: string;
  description?: string;
  engineId: string;
  streamId: string;
  exposedPort: string;
  publicAddress: string;
  sslEnabled: boolean;
  status: "RUNNING" | "PENDING" | "DISABLED";
  createdAt: string;
}

export interface Alias {
  aliasId: string;
  name: string;
  description?: string;
  indexIds: string[];
  streamIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// SERVICE
// ============================================================

/** Récupère la liste des services Logs Data Platform. */
export async function getServices(): Promise<string[]> {
  return ovhGet<string[]>("/dbaas/logs");
}

/** Récupère les détails d'un service. */
export async function getService(serviceName: string): Promise<LogsService> {
  return ovhGet<LogsService>(`/dbaas/logs/${serviceName}`);
}

// ============================================================
// STREAMS
// ============================================================

/** Récupère la liste des streams d'un service. */
export async function getStreams(serviceName: string): Promise<Stream[]> {
  const ids = await ovhGet<string[]>(`/dbaas/logs/${serviceName}/output/graylog/stream`);
  const streams = await Promise.all(
    ids.map((id) => ovhGet<Stream>(`/dbaas/logs/${serviceName}/output/graylog/stream/${id}`))
  );
  return streams;
}

/** Crée un nouveau stream. */
export async function createStream(serviceName: string, data: { title: string; description?: string; retentionId: string }): Promise<Stream> {
  return ovhPost<Stream>(`/dbaas/logs/${serviceName}/output/graylog/stream`, data);
}

/** Supprime un stream. */
export async function deleteStream(serviceName: string, streamId: string): Promise<void> {
  return ovhDelete(`/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}`);
}

// ============================================================
// DASHBOARDS
// ============================================================

/** Récupère la liste des dashboards d'un service. */
export async function getDashboards(serviceName: string): Promise<Dashboard[]> {
  const ids = await ovhGet<string[]>(`/dbaas/logs/${serviceName}/output/graylog/dashboard`);
  const dashboards = await Promise.all(
    ids.map((id) => ovhGet<Dashboard>(`/dbaas/logs/${serviceName}/output/graylog/dashboard/${id}`))
  );
  return dashboards;
}

/** Crée un nouveau dashboard. */
export async function createDashboard(serviceName: string, data: { title: string; description?: string }): Promise<Dashboard> {
  return ovhPost<Dashboard>(`/dbaas/logs/${serviceName}/output/graylog/dashboard`, data);
}

/** Supprime un dashboard. */
export async function deleteDashboard(serviceName: string, dashboardId: string): Promise<void> {
  return ovhDelete(`/dbaas/logs/${serviceName}/output/graylog/dashboard/${dashboardId}`);
}

// ============================================================
// INDICES
// ============================================================

/** Récupère la liste des indices d'un service. */
export async function getIndices(serviceName: string): Promise<Index[]> {
  const ids = await ovhGet<string[]>(`/dbaas/logs/${serviceName}/output/elasticsearch/index`);
  const indices = await Promise.all(
    ids.map((id) => ovhGet<Index>(`/dbaas/logs/${serviceName}/output/elasticsearch/index/${id}`))
  );
  return indices;
}

/** Crée un nouvel index. */
export async function createIndex(serviceName: string, data: { name: string; description?: string; nbShard: number }): Promise<Index> {
  return ovhPost<Index>(`/dbaas/logs/${serviceName}/output/elasticsearch/index`, data);
}

// ============================================================
// INPUTS
// ============================================================

/** Récupère la liste des inputs d'un service. */
export async function getInputs(serviceName: string): Promise<Input[]> {
  const ids = await ovhGet<string[]>(`/dbaas/logs/${serviceName}/input`);
  const inputs = await Promise.all(
    ids.map((id) => ovhGet<Input>(`/dbaas/logs/${serviceName}/input/${id}`))
  );
  return inputs;
}

/** Crée un nouvel input. */
export async function createInput(serviceName: string, data: { title: string; engineId: string; streamId: string }): Promise<Input> {
  return ovhPost<Input>(`/dbaas/logs/${serviceName}/input`, data);
}

// ============================================================
// ALIASES
// ============================================================

/** Récupère la liste des aliases d'un service. */
export async function getAliases(serviceName: string): Promise<Alias[]> {
  const ids = await ovhGet<string[]>(`/dbaas/logs/${serviceName}/output/elasticsearch/alias`);
  const aliases = await Promise.all(
    ids.map((id) => ovhGet<Alias>(`/dbaas/logs/${serviceName}/output/elasticsearch/alias/${id}`))
  );
  return aliases;
}

/** Crée un nouvel alias. */
export async function createAlias(serviceName: string, data: { name: string; description?: string }): Promise<Alias> {
  return ovhPost<Alias>(`/dbaas/logs/${serviceName}/output/elasticsearch/alias`, data);
}

/** Supprime un alias. */
export async function deleteAlias(serviceName: string, aliasId: string): Promise<void> {
  return ovhDelete(`/dbaas/logs/${serviceName}/output/elasticsearch/alias/${aliasId}`);
}
