// ============================================================
// SERVICE ISOLÉ : DnsServersTab - Gestion des serveurs DNS
// Pattern identique old_manager avec headers pagination
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete, ovhIceberg } from "../../../../../services/api";
import type { DnsServer, DnsServerInput } from "../../domains.types";

// ============ TYPES NAMESERVER STATUS ============

export interface NameServerStatus {
  state: "ok" | "ko";
  type: "hosted" | "external";
  usedSince?: string;
}

// ============ SERVICE ============

class DnsServersService {
  async listDnsServers(domain: string): Promise<number[]> {
    return ovhGet<number[]>(`/domain/${domain}/nameServer`);
  }

  async getDnsServer(domain: string, id: number): Promise<DnsServer> {
    return ovhGet<DnsServer>(`/domain/${domain}/nameServer/${id}`);
  }

  async updateDnsServers(domain: string, servers: DnsServerInput[]): Promise<void> {
    await ovhPost(`/domain/${domain}/nameServers/update`, { nameServers: servers });
  }

  // -------- ANYCAST --------
  async getAnycastStatus(domain: string): Promise<{ active: boolean }> {
    try {
      const options = await ovhGet<string[]>(`/domain/${domain}/option`);
      return { active: options.includes("dnsAnycast") };
    } catch {
      return { active: false };
    }
  }

  async activateAnycast(domain: string): Promise<void> {
    await ovhPost(`/domain/${domain}/option/dnsAnycast`, {});
  }

  async terminateAnycast(zone: string): Promise<void> {
    // PUT /domain/zone/{zone}/option/anycast/serviceInfos - Identique old_manager
    await ovhPut(`/domain/zone/${zone}/option/anycast/serviceInfos`, {
      renew: {
        automatic: false,
        deleteAtExpiration: true,
      },
    });
  }

  // -------- NAMESERVER STATUS (Identique old_manager) --------
  async getNameServerStatus(domain: string, id: number): Promise<NameServerStatus> {
    // GET /domain/{domain}/nameServer/{id}/status - Identique old_manager
    return ovhGet<NameServerStatus>(`/domain/${domain}/nameServer/${id}/status`);
  }

  // -------- ADD SINGLE NAMESERVER (Identique old_manager) --------
  async addDnsNameServer(domain: string, data: { host: string; ip?: string }): Promise<void> {
    // POST /domain/{domain}/nameServer - Identique old_manager
    // Note: old_manager wraps in array: { nameServer: [data] }
    const serverData = data.ip ? { host: data.host, ip: data.ip } : { host: data.host };
    await ovhPost(`/domain/${domain}/nameServer`, {
      nameServer: [serverData],
    });
  }

  // -------- DELETE NAMESERVER (Identique old_manager) --------
  async deleteDnsNameServer(domain: string, id: number): Promise<void> {
    // DELETE /domain/{domain}/nameServer/{id} - Identique old_manager
    await ovhDelete(`/domain/${domain}/nameServer/${id}`);
  }

  // -------- GET ALL NAMESERVERS WITH DETAILS --------
  async getAllNameServersWithDetails(domain: string): Promise<DnsServer[]> {
    // Pattern identique old_manager: list IDs puis fetch details
    const ids = await this.listDnsServers(domain);
    if (ids.length === 0) return [];
    return Promise.all(ids.map((id) => this.getDnsServer(domain, id)));
  }

  // -------- GET ALL NAMESERVERS WITH STATUS --------
  async getAllNameServersWithStatus(domain: string): Promise<Array<DnsServer & { status: NameServerStatus }>> {
    const servers = await this.getAllNameServersWithDetails(domain);
    const results = await Promise.all(
      servers.map(async (server) => {
        try {
          const status = await this.getNameServerStatus(domain, server.id);
          return { ...server, status };
        } catch {
          return { ...server, status: { state: "ko" as const, type: "external" as const } };
        }
      })
    );
    return results;
  }

  // -------- GET DNS LIST WITH PAGINATION (Identique old_manager) --------
  /**
   * Get DNS list with pagination headers
   * GET /domain/{domain}/nameServer with X-Pagination-Mode: CachedObjectList-Pages
   * Identique old_manager getDnsList()
   */
  async getDnsList(domain: string, forceRefresh: boolean = false): Promise<DnsServer[]> {
    // Use Iceberg pagination pattern like old_manager
    const result = await ovhIceberg<DnsServer>(`/domain/${domain}/nameServer`, {
      pageSize: 100,
    });
    return result.data;
  }

  // -------- UPDATE NAMESERVER TYPE (Identique old_manager) --------
  /**
   * Update nameserver type (hosted/external)
   * PUT /domain/{domain} - Identique old_manager
   */
  async updateNameServerType(domain: string, nameServerType: "hosted" | "external"): Promise<void> {
    await ovhPut(`/domain/${domain}`, { nameServerType });
  }
}

export const dnsServersService = new DnsServersService();
