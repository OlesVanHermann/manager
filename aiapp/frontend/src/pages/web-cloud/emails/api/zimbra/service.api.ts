// ============================================================
// API ZIMBRA - Service/Platform (informations générales)
// Endpoints API v2: /v2/email/zimbra/platform/{platformId}/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE_V2 = "/v2/email/zimbra/platform";

// ---------- TYPES ----------

export interface ZimbraPlatform {
  id: string;
  name: string;
  description?: string;
  status: "ok" | "suspended" | "maintenance";
  offer: "starter" | "business" | "enterprise";
  region: string;
  organizationId: string;
  accountsCount: number;
  accountsQuota: number;
  domainsCount: number;
  createdAt: string;
  webUrl?: string;
}

export interface ZimbraOrganization {
  id: string;
  name: string;
  description?: string;
  status: "ok" | "suspended";
  accountsTotal: number;
  domainVerified: boolean;
  createdAt: string;
}

export interface PlatformListResult {
  data: ZimbraPlatform[];
  links: {
    next?: { href: string };
    prev?: { href: string };
    self: { href: string };
  };
}

// ---------- API V2 CALLS ----------

/**
 * Liste des plateformes Zimbra (API v2)
 */
export async function listPlatforms(
  options?: { pageSize?: number; cursor?: string }
): Promise<PlatformListResult> {
  const params = new URLSearchParams();
  if (options?.pageSize) params.set("pageSize", String(options.pageSize));
  if (options?.cursor) params.set("cursor", options.cursor);

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<PlatformListResult>(`${BASE_V2}${query}`);
}

/**
 * Détails d'une plateforme (API v2)
 */
export async function getPlatform(platformId: string): Promise<ZimbraPlatform> {
  return apiFetch<ZimbraPlatform>(`${BASE_V2}/${platformId}`);
}

/**
 * Organisation liée à une plateforme (API v2)
 */
export async function getOrganization(platformId: string): Promise<ZimbraOrganization> {
  return apiFetch<ZimbraOrganization>(`${BASE_V2}/${platformId}/organization`);
}

/**
 * Mise à jour plateforme (API v2)
 */
export async function updatePlatform(
  platformId: string,
  data: Partial<Pick<ZimbraPlatform, "name" | "description">>
): Promise<ZimbraPlatform> {
  return apiFetch<ZimbraPlatform>(`${BASE_V2}/${platformId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Domaines de la plateforme (API v2)
 */
export async function listDomains(
  platformId: string,
  options?: { pageSize?: number; cursor?: string }
): Promise<{ data: Array<{ id: string; domain: string; status: string }>; links: { next?: { href: string }; self: { href: string } } }> {
  const params = new URLSearchParams();
  if (options?.pageSize) params.set("pageSize", String(options.pageSize));
  if (options?.cursor) params.set("cursor", options.cursor);

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch(`${BASE_V2}/${platformId}/domain${query}`);
}
