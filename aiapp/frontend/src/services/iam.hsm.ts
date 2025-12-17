// ============================================================
// IAM HSM SERVICE - API Hardware Security Module OVHcloud
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

// ============================================================
// TYPES
// ============================================================

export interface Hsm {
  id: string;
  name: string;
  model: string;
  region: string;
  state: string;
  ip: string;
  createdAt: string;
}

export interface Partition {
  id: string;
  name: string;
  serialNumber: string;
  state: "active" | "inactive" | "error";
  usedStorage: number;
  totalStorage: number;
  objectCount: number;
  createdAt: string;
}

export interface Task {
  id: string;
  function: string;
  status: "done" | "doing" | "todo" | "error" | "cancelled";
  startDate?: string;
  doneDate?: string;
  comment?: string;
}

// ============================================================
// HSM
// ============================================================

/** Récupère la liste des HSM. */
export async function getHsmList(): Promise<string[]> {
  return ovhGet<string[]>("/dedicated/nasha");
}

/** Récupère les détails d'un HSM. */
export async function getHsm(serviceId: string): Promise<Hsm> {
  return ovhGet<Hsm>(`/dedicated/nasha/${serviceId}`);
}

// ============================================================
// PARTITIONS
// ============================================================

/** Récupère la liste des partitions d'un HSM. */
export async function getPartitions(serviceId: string): Promise<Partition[]> {
  const ids = await ovhGet<string[]>(`/dedicated/nasha/${serviceId}/partition`);
  const partitions = await Promise.all(
    ids.map((id) => ovhGet<Partition>(`/dedicated/nasha/${serviceId}/partition/${id}`))
  );
  return partitions;
}

/** Récupère les détails d'une partition. */
export async function getPartition(serviceId: string, partitionId: string): Promise<Partition> {
  return ovhGet<Partition>(`/dedicated/nasha/${serviceId}/partition/${partitionId}`);
}

/** Crée une nouvelle partition. */
export async function createPartition(serviceId: string, data: { name: string; size: number }): Promise<Partition> {
  return ovhPost<Partition>(`/dedicated/nasha/${serviceId}/partition`, data);
}

/** Supprime une partition. */
export async function deletePartition(serviceId: string, partitionId: string): Promise<void> {
  return ovhDelete(`/dedicated/nasha/${serviceId}/partition/${partitionId}`);
}

// ============================================================
// TASKS
// ============================================================

/** Récupère la liste des tâches d'un HSM. */
export async function getTasks(serviceId: string): Promise<Task[]> {
  const ids = await ovhGet<number[]>(`/dedicated/nasha/${serviceId}/task`);
  const tasks = await Promise.all(
    ids.map((id) => ovhGet<Task>(`/dedicated/nasha/${serviceId}/task/${id}`))
  );
  return tasks.sort((a, b) => {
    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
    return dateB - dateA;
  });
}

/** Récupère les détails d'une tâche. */
export async function getTask(serviceId: string, taskId: number): Promise<Task> {
  return ovhGet<Task>(`/dedicated/nasha/${serviceId}/task/${taskId}`);
}
