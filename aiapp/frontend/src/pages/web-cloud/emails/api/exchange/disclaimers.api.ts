// ============================================================
// API EXCHANGE - Disclaimers (signatures)
// Endpoints apiv6: /email/exchange/{org}/service/{service}/domain/{domain}/disclaimer
// Endpoints 2API: /sws/exchange/{org}/{exchange}/disclaimers/*
// ============================================================

import { apiFetch, ovh2apiGet } from "../../../../../services/api";

const BASE = "/email/exchange";
const BASE_2API = "/sws/exchange";

// ---------- TYPES ----------

export interface ExchangeDisclaimer {
  domain: string;
  content: string;
  outsideOnly: boolean;
  creationDate?: string;
}

export interface DisclaimerListResult {
  list: {
    results: ExchangeDisclaimer[];
    count: number;
  };
}

export interface DisclaimerOptions {
  availableDomains: Array<{ name: string; displayName: string }>;
  availableAttributes: string[];
}

// ---------- HELPERS ----------

function getServicePath(serviceId: string): string {
  const [org, service] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE}/${org}/service/${service}`;
}

function get2apiPath(serviceId: string): string {
  const [org, exchange] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE_2API}/${org}/${exchange}`;
}

// ---------- apiv6 API CALLS ----------

export async function get(serviceId: string, domain: string): Promise<ExchangeDisclaimer> {
  const basePath = getServicePath(serviceId);
  return apiFetch<ExchangeDisclaimer>(`${basePath}/domain/${domain}/disclaimer`);
}

export async function create(
  serviceId: string,
  domain: string,
  data: { content: string; outsideOnly?: boolean }
): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/domain/${domain}/disclaimer`, {
    method: "POST",
    body: JSON.stringify({
      content: data.content,
      outsideOnly: data.outsideOnly ?? false,
    }),
  });
}

export async function update(
  serviceId: string,
  domain: string,
  data: { content: string; outsideOnly?: boolean }
): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/domain/${domain}/disclaimer`, {
    method: "PUT",
    body: JSON.stringify({
      content: data.content,
      outsideOnly: data.outsideOnly ?? false,
    }),
  });
}

export async function remove(serviceId: string, domain: string): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/domain/${domain}/disclaimer`, {
    method: "DELETE",
  });
}

export { remove as delete };

// ============================================================
// 2API ENDPOINTS - Pagination serveur & données agrégées
// ============================================================

/**
 * Liste des disclaimers (2API)
 * Équivalent old_manager: getDisclaimers
 */
export async function list2api(
  serviceId: string,
  options?: { count?: number; offset?: number }
): Promise<DisclaimerListResult> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet<DisclaimerListResult>(`${path}/disclaimers`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
  });
}

/**
 * Options pour nouveau disclaimer (2API)
 * Équivalent old_manager: getNewDisclaimerOptions
 */
export async function getCreationOptions(serviceId: string): Promise<DisclaimerOptions> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet<DisclaimerOptions>(`${path}/disclaimers/new/options`);
}

/**
 * Options pour mise à jour disclaimer
 * Retourne les attributs disponibles pour templating
 */
export function getUpdateOptions(): DisclaimerOptions {
  return {
    availableDomains: [],
    availableAttributes: [
      "City",
      "Country",
      "Department",
      "DisplayName",
      "Email",
      "FaxNumber",
      "FirstName",
      "HomePhoneNumber",
      "Initials",
      "LastName",
      "MobileNumber",
      "Office",
      "PhoneNumber",
      "Street",
      "ZipCode",
    ],
  };
}
