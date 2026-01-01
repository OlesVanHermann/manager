// ============================================================
// API EMAIL PRO - Contacts externes
// Endpoints apiv6: /email/pro/{service}/externalContact/*
// Endpoints 2API: /sws/emailpro/{service}/externalContacts/*
// ============================================================

import { apiFetch, ovh2apiGet } from "../../../../../services/api";

const BASE = "/email/pro";
const BASE_2API = "/sws/emailpro";

// ---------- TYPES ----------

export interface ExternalContact {
  id: number;
  displayName: string;
  externalEmailAddress: string;
  firstName?: string;
  lastName?: string;
  hiddenFromGAL: boolean;
  initials?: string;
  state: "ok" | "deleting";
  taskPendingId?: number;
}

export interface CreateContactParams {
  displayName: string;
  externalEmailAddress: string;
  firstName?: string;
  lastName?: string;
  hiddenFromGAL?: boolean;
  initials?: string;
}

export interface ContactListResult {
  list: {
    results: ExternalContact[];
    count: number;
  };
}

// ---------- apiv6 API CALLS ----------

export async function list(serviceId: string): Promise<ExternalContact[]> {
  const emails = await apiFetch<string[]>(`${BASE}/${serviceId}/externalContact`);

  const contacts = await Promise.all(
    emails.map(email => get(serviceId, email))
  );

  return contacts;
}

export async function get(serviceId: string, email: string): Promise<ExternalContact> {
  return apiFetch<ExternalContact>(`${BASE}/${serviceId}/externalContact/${email}`);
}

export async function create(serviceId: string, data: CreateContactParams): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}/externalContact`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function update(
  serviceId: string,
  email: string,
  data: Partial<CreateContactParams>
): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}/externalContact/${email}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function remove(serviceId: string, email: string): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}/externalContact/${email}`, {
    method: "DELETE",
  });
}

export { remove as delete };

// ============================================================
// 2API ENDPOINTS - Pagination serveur & données agrégées
// ============================================================

/**
 * Liste paginée des contacts externes (2API)
 * Équivalent old_manager: getExternalContacts
 */
export async function list2api(
  serviceId: string,
  options?: { count?: number; offset?: number; search?: string }
): Promise<ContactListResult> {
  return ovh2apiGet<ContactListResult>(`${BASE_2API}/${serviceId}/externalContacts`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    search: options?.search ?? "",
  });
}

/**
 * Options pour création contact externe (2API)
 */
export async function getCreationOptions(serviceId: string): Promise<{
  availableDomains: Array<{ name: string; displayName: string }>;
}> {
  return ovh2apiGet(`${BASE_2API}/${serviceId}/externalContacts/new/options`);
}
