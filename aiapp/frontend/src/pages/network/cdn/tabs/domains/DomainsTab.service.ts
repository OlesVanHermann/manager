// ============================================================
// CDN Domains Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { CdnDomain } from "../../cdn.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

const formatDate = (d: string): string => {
  return new Date(d).toLocaleDateString("fr-FR");
};

function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    on: "cdn-domains-badge-success",
    off: "cdn-domains-badge-error",
    config: "cdn-domains-badge-warning",
  };
  return classes[status] || "";
}

// ==================== API CALLS ====================

async function getDomains(serviceName: string): Promise<CdnDomain[]> {
  const names = await ovhGet<string[]>(`/cdn/dedicated/${serviceName}/domains`);
  return Promise.all(
    names.map((name) =>
      ovhGet<CdnDomain>(`/cdn/dedicated/${serviceName}/domains/${name}`)
    )
  );
}

async function addDomain(
  serviceName: string,
  domain: string
): Promise<void> {
  return ovhPost<void>(`/cdn/dedicated/${serviceName}/domains`, { domain });
}

async function deleteDomain(
  serviceName: string,
  domain: string
): Promise<void> {
  return ovhDelete<void>(`/cdn/dedicated/${serviceName}/domains/${domain}`);
}

async function purgeDomain(
  serviceName: string,
  domain: string
): Promise<void> {
  return ovhPost<void>(
    `/cdn/dedicated/${serviceName}/domains/${domain}/cache`,
    { flush: true }
  );
}

async function configureDomain(
  serviceName: string,
  domain: string,
  config: { ttl?: number }
): Promise<void> {
  return ovhPost<void>(
    `/cdn/dedicated/${serviceName}/domains/${domain}`,
    config
  );
}

// ==================== SERVICE OBJECT ====================

export const cdnDomainsService = {
  getDomains,
  addDomain,
  deleteDomain,
  purgeDomain,
  configureDomain,
  getStatusBadgeClass,
  formatDate,
};
