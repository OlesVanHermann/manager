// ============================================================
// SERVICE ORCHESTRATEUR LOCAL - DomainsPage
// Remplace les imports des services monolithiques
// ============================================================

import { ovhGet } from "../../../services/api";
import type { Domain, DomainServiceInfos, DnsZone } from "./domains.types";

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
