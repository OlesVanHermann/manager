// ============================================================
// SERVICE ORCHESTRATEUR LOCAL - DomainsPage
// Remplace les imports des services monolithiques
// ============================================================

import { ovhGet, ovh2apiGet } from "../../../services/api";
import type { Domain, DomainServiceInfos, DnsZone } from "./domains.types";

// ============ TYPES 2API ============

export interface DomainsListResult {
  count: number;
  domains: Array<{
    name: string;
    displayName: string;
    expiration: string;
    dnssecEnabled: boolean;
    transferLockStatus: string;
    owo?: string[];
  }>;
}

// ============ SERVICE ============

class DomainsPageService {
  // -------- LISTES --------
  async listDomains(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/domain");
    } catch {
      return [];
    }
  }

  async listZones(): Promise<string[]> {
    try {
      return await ovhGet<string[]>("/domain/zone");
    } catch {
      return [];
    }
  }

  /**
   * Get domains list with details (2API aggregated)
   * GET /sws/domains - Identique old_manager Domains.getDomains()
   * Returns paginated list with domain details
   */
  async listDomainsAggregated(params?: {
    count?: number;
    offset?: number;
    search?: string;
  }): Promise<DomainsListResult> {
    const queryParams = new URLSearchParams();
    if (params?.count) queryParams.append("count", String(params.count));
    if (params?.offset) queryParams.append("offset", String(params.offset));
    if (params?.search) queryParams.append("search", params.search);

    const query = queryParams.toString();
    const path = `/sws/domains${query ? `?${query}` : ""}`;

    return ovh2apiGet<DomainsListResult>(path);
  }

  // -------- DETAILS --------
  async getDomain(domain: string): Promise<Domain> {
    return ovhGet<Domain>(`/domain/${domain}`);
  }

  async getServiceInfos(domain: string): Promise<DomainServiceInfos> {
    return ovhGet<DomainServiceInfos>(`/domain/${domain}/serviceInfos`);
  }

  async getZone(zone: string): Promise<DnsZone> {
    return ovhGet<DnsZone>(`/domain/zone/${zone}`);
  }
}

export const domainsPageService = new DomainsPageService();
