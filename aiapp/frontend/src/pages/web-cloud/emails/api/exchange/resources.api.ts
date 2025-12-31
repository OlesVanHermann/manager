// ============================================================
// API EXCHANGE - Ressources (salles, équipements)
// Endpoints: /email/exchange/{org}/service/{service}/resourceAccount/*
// Exchange ONLY feature
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/exchange";

// ---------- TYPES ----------

export interface ExchangeResource {
  resourceEmailAddress: string;
  displayName?: string;
  type: "room" | "equipment";
  capacity?: number;
  location?: string;
  addOrganizerToSubject: boolean;
  allowConflict: boolean;
  bookingWindow?: number;
  deleteComments: boolean;
  deleteSubject: boolean;
  maximumDuration?: number;
  state: "ok" | "deleting";
  taskPendingId?: number;
}

export interface CreateResourceParams {
  resourceEmailAddress: string;
  displayName?: string;
  type: "room" | "equipment";
  capacity?: number;
  location?: string;
  addOrganizerToSubject?: boolean;
  allowConflict?: boolean;
}

// ---------- HELPERS ----------

function getServicePath(serviceId: string): string {
  const [org, service] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE}/${org}/service/${service}`;
}

// ---------- API CALLS ----------

export async function list(serviceId: string): Promise<ExchangeResource[]> {
  const basePath = getServicePath(serviceId);
  const addresses = await apiFetch<string[]>(`${basePath}/resourceAccount`);

  const resources = await Promise.all(
    addresses.map(addr => get(addr, serviceId))
  );

  return resources;
}

export async function get(id: string, serviceId: string): Promise<ExchangeResource> {
  const basePath = getServicePath(serviceId);
  return apiFetch<ExchangeResource>(`${basePath}/resourceAccount/${id}`);
}

export async function create(data: CreateResourceParams, serviceId: string): Promise<ExchangeResource> {
  const basePath = getServicePath(serviceId);
  return apiFetch<ExchangeResource>(`${basePath}/resourceAccount`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function update(id: string, serviceId: string, data: Partial<ExchangeResource>): Promise<ExchangeResource> {
  const basePath = getServicePath(serviceId);
  return apiFetch<ExchangeResource>(`${basePath}/resourceAccount/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function remove(id: string, serviceId: string): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/resourceAccount/${id}`, {
    method: "DELETE",
  });
}

export { remove as delete };
