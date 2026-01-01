// ============================================================
// API EXCHANGE - Domaines
// Endpoints APIv6: /email/exchange/{org}/service/{service}/domain/*
// ============================================================

import { apiFetch, ovhIceberg, IcebergOptions } from "../../../../../services/api";

const BASE = "/email/exchange";

// ---------- TYPES ----------

export interface ExchangeDomain {
  name: string;
  state: "ok" | "inMaintenance" | "suspended";
  type: "authoritative" | "nonAuthoritative";
  cnameToCheck?: string;
  expectedAutoDNS?: string;
  expectedMx?: string;
  expectedSPF?: string;
  isConfigured?: boolean;
  mxIsValid: boolean;
  mxRecord?: string[];
  mxRelay?: string;
  srvIsValid: boolean;
  srvRecord?: string[];
  taskPendingId?: number;
}

export interface CreateDomainParams {
  name: string;
  type: "authoritative" | "nonAuthoritative";
  configureAutodiscover?: boolean;
  configureMx?: boolean;
  mxRelay?: string;
}

// ---------- HELPERS ----------

function getServicePath(serviceId: string): string {
  const [org, service] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE}/${org}/service/${service}`;
}

// ---------- API CALLS ----------

/**
 * Liste des domaines (APIv6)
 * Équivalent old_manager: getDomainIds
 */
export async function list(
  serviceId: string,
  state?: "ok" | "inMaintenance"
): Promise<string[]> {
  const basePath = getServicePath(serviceId);
  const params = state ? `?state=${state}` : "";
  return apiFetch<string[]>(`${basePath}/domain${params}`);
}

/**
 * Liste paginée des domaines avec Iceberg (APIv6)
 * Équivalent old_manager: utilisation iceberg
 */
export async function listPaginated(
  serviceId: string,
  options?: IcebergOptions
): Promise<{ data: ExchangeDomain[]; totalCount: number }> {
  const basePath = getServicePath(serviceId);
  return ovhIceberg<ExchangeDomain>(`${basePath}/domain`, options);
}

/**
 * Détails d'un domaine (APIv6)
 */
export async function get(serviceId: string, domainName: string): Promise<ExchangeDomain> {
  const basePath = getServicePath(serviceId);
  return apiFetch<ExchangeDomain>(`${basePath}/domain/${domainName}`);
}

/**
 * Ajout d'un domaine (APIv6)
 */
export async function create(
  serviceId: string,
  data: CreateDomainParams
): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/domain`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Mise à jour d'un domaine (APIv6)
 */
export async function update(
  serviceId: string,
  domainName: string,
  data: Partial<Pick<ExchangeDomain, "type" | "mxRelay">>
): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/domain/${domainName}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Suppression d'un domaine (APIv6)
 */
export async function remove(serviceId: string, domainName: string): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/domain/${domainName}`, {
    method: "DELETE",
  });
}

export { remove as delete };

// ---------- DOMAINES OK ----------

/**
 * Liste des domaines disponibles (état ok)
 * Équivalent old_manager: retrievingOptionsToCreateNewGroup (pour availableDomains)
 */
export async function listAvailable(serviceId: string): Promise<ExchangeDomain[]> {
  const names = await list(serviceId, "ok");
  const domains = await Promise.all(
    names.map(name => get(serviceId, name))
  );
  return domains;
}
