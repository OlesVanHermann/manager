// ============================================================
// API EMAIL PRO - Disclaimers (signatures)
// Endpoints apiv6: /email/pro/{service}/domain/{domain}/disclaimer
// Endpoints 2API: /sws/emailpro/{service}/disclaimers/*
// ============================================================

import { apiFetch, ovh2apiGet } from "../../../../../services/api";

const BASE = "/email/pro";
const BASE_2API = "/sws/emailpro";

// ---------- TYPES ----------

export interface EmailProDisclaimer {
  domain: string;
  content: string;
  outsideOnly: boolean;
  creationDate?: string;
}

export interface DisclaimerListResult {
  list: {
    results: EmailProDisclaimer[];
    count: number;
  };
}

export interface DisclaimerOptions {
  availableDomains: Array<{ name: string; displayName: string }>;
  availableAttributes: string[];
}

// ---------- apiv6 API CALLS ----------

export async function get(serviceId: string, domain: string): Promise<EmailProDisclaimer> {
  return apiFetch<EmailProDisclaimer>(`${BASE}/${serviceId}/domain/${domain}/disclaimer`);
}

export async function create(
  serviceId: string,
  domain: string,
  data: { content: string; outsideOnly?: boolean }
): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}/domain/${domain}/disclaimer`, {
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
  await apiFetch(`${BASE}/${serviceId}/domain/${domain}/disclaimer`, {
    method: "PUT",
    body: JSON.stringify({
      content: data.content,
      outsideOnly: data.outsideOnly ?? false,
    }),
  });
}

export async function remove(serviceId: string, domain: string): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}/domain/${domain}/disclaimer`, {
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
  return ovh2apiGet<DisclaimerListResult>(`${BASE_2API}/${serviceId}/disclaimers`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
  });
}

/**
 * Options pour nouveau disclaimer (2API)
 * Équivalent old_manager: getNewDisclaimerOptions
 */
export async function getCreationOptions(serviceId: string): Promise<DisclaimerOptions> {
  return ovh2apiGet<DisclaimerOptions>(`${BASE_2API}/${serviceId}/disclaimers/new/options`);
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
