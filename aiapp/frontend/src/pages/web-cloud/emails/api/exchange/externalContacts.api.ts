// ============================================================
// API EXCHANGE - Contacts externes
// Endpoints APIv6: /email/exchange/{org}/service/{service}/externalContact/*
// ============================================================

import { apiFetch, ovhIceberg, IcebergOptions } from "../../../../../services/api";

const BASE = "/email/exchange";

// ---------- TYPES ----------

export interface ExchangeExternalContact {
  externalEmailAddress: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  initials?: string;
  hiddenFromGAL: boolean;
  state: "ok" | "deleting";
  taskPendingId?: number;
  creationDate?: string;
}

export interface CreateExternalContactParams {
  externalEmailAddress: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  initials?: string;
  hiddenFromGAL?: boolean;
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
 * Liste des contacts externes (APIv6)
 * Équivalent old_manager: getExternalContactIds
 */
export async function list(serviceId: string): Promise<string[]> {
  const basePath = getServicePath(serviceId);
  return apiFetch<string[]>(`${basePath}/externalContact`);
}

/**
 * Liste paginée des contacts externes avec Iceberg (APIv6)
 */
export async function listPaginated(
  serviceId: string,
  options?: IcebergOptions
): Promise<{ data: ExchangeExternalContact[]; totalCount: number }> {
  const basePath = getServicePath(serviceId);
  return ovhIceberg<ExchangeExternalContact>(`${basePath}/externalContact`, options);
}

/**
 * Détails d'un contact externe (APIv6)
 */
export async function get(serviceId: string, externalEmailAddress: string): Promise<ExchangeExternalContact> {
  const basePath = getServicePath(serviceId);
  return apiFetch<ExchangeExternalContact>(`${basePath}/externalContact/${externalEmailAddress}`);
}

/**
 * Création d'un contact externe (APIv6)
 */
export async function create(
  serviceId: string,
  data: CreateExternalContactParams
): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/externalContact`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Mise à jour d'un contact externe (APIv6)
 */
export async function update(
  serviceId: string,
  externalEmailAddress: string,
  data: Partial<Omit<CreateExternalContactParams, "externalEmailAddress">>
): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/externalContact/${externalEmailAddress}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Suppression d'un contact externe (APIv6)
 */
export async function remove(serviceId: string, externalEmailAddress: string): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/externalContact/${externalEmailAddress}`, {
    method: "DELETE",
  });
}

export { remove as delete };

/**
 * Liste complète des contacts externes avec détails
 */
export async function listWithDetails(serviceId: string): Promise<ExchangeExternalContact[]> {
  const emails = await list(serviceId);
  const contacts = await Promise.all(
    emails.map(email => get(serviceId, email))
  );
  return contacts;
}
