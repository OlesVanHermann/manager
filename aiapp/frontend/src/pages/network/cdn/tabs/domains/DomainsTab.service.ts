// ============================================================
// CDN Domains Tab - Service isolé
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { CdnDomain } from "../../cdn.types";

// ==================== API CALLS ====================

export async function getDomains(serviceName: string): Promise<CdnDomain[]> {
  const names = await ovhGet<string[]>(`/cdn/dedicated/${serviceName}/domains`);
  return Promise.all(
    names.map((name) =>
      ovhGet<CdnDomain>(`/cdn/dedicated/${serviceName}/domains/${name}`)
    )
  );
}

export async function addDomain(
  serviceName: string,
  domain: string
): Promise<void> {
  return ovhPost<void>(`/cdn/dedicated/${serviceName}/domains`, { domain });
}

export async function deleteDomain(
  serviceName: string,
  domain: string
): Promise<void> {
  return ovhDelete<void>(`/cdn/dedicated/${serviceName}/domains/${domain}`);
}

export async function purgeDomain(
  serviceName: string,
  domain: string
): Promise<void> {
  return ovhPost<void>(
    `/cdn/dedicated/${serviceName}/domains/${domain}/cache`,
    { flush: true }
  );
}

export async function configureDomain(
  serviceName: string,
  domain: string,
  config: { ttl?: number }
): Promise<void> {
  return ovhPost<void>(
    `/cdn/dedicated/${serviceName}/domains/${domain}`,
    config
  );
}

// ==================== HELPERS (DUPLIQUÉS - ISOLATION) ====================

export function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    on: "badge-success",
    off: "badge-error",
    config: "badge-warning",
  };
  return classes[status] || "";
}

// ==================== SERVICE OBJECT ====================

export const domainsService = {
  getDomains,
  addDomain,
  deleteDomain,
  purgeDomain,
  configureDomain,
  getStatusBadgeClass,
};
