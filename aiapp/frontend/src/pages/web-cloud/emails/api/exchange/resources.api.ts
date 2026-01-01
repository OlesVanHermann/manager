// ============================================================
// API EXCHANGE - Ressources (salles, équipements)
// Endpoints: /email/exchange/{org}/service/{service}/resourceAccount/*
// Exchange ONLY feature
// ============================================================

import { apiFetch, ovh2apiGet, ovh2apiPut } from "../../../../../services/api";

const BASE = "/email/exchange";
const BASE_2API = "/sws/exchange";

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

// ============================================================
// 2API ENDPOINTS - Pagination serveur & données agrégées
// Ces endpoints utilisent /sws/exchange/* (2API)
// ============================================================

// ---------- 2API TYPES ----------

export interface ResourceListResult {
  list: {
    results: ExchangeResource[];
    count: number;
  };
}

export interface ResourceDelegationRight {
  account: string;
  allowedAccountMember?: boolean;
}

export interface ResourceDelegationRightsResult {
  list: {
    results: ResourceDelegationRight[];
    count: number;
  };
}

// ---------- 2API HELPERS ----------

function get2apiPath(serviceId: string): string {
  const [org, exchange] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE_2API}/${org}/${exchange}`;
}

// ---------- 2API CALLS ----------

/**
 * Liste paginée des resources (2API)
 * Équivalent old_manager: retrievingResources
 */
export async function list2api(
  serviceId: string,
  options?: { count?: number; offset?: number; search?: string }
): Promise<ResourceListResult> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet<ResourceListResult>(`${path}/resources`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    search: options?.search ?? "",
  });
}

/**
 * Droits de délégation d'une resource (2API)
 * Équivalent old_manager: getAccountsByResource
 */
export async function getResourceRights(
  serviceId: string,
  resourceEmailAddress: string,
  options?: { count?: number; offset?: number; search?: string }
): Promise<ResourceDelegationRightsResult> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet<ResourceDelegationRightsResult>(
    `${path}/resources/${resourceEmailAddress}/rights`,
    {
      count: options?.count ?? 25,
      offset: options?.offset ?? 0,
      search: options?.search ?? "",
    }
  );
}

/**
 * Mise à jour des droits de délégation d'une resource (2API)
 * Équivalent old_manager: updateResourceDelegation
 */
export async function updateResourceRights(
  serviceId: string,
  resourceEmailAddress: string,
  delegationModel: {
    allowedAccountMember?: string[];
  }
): Promise<void> {
  const path = get2apiPath(serviceId);
  await ovh2apiPut(
    `${path}/resources/${resourceEmailAddress}/rights-update`,
    delegationModel
  );
}
