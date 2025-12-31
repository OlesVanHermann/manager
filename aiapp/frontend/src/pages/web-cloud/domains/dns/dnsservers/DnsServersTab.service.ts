// ============================================================
// SERVICE ISOLÉ : DnsServersTab - Gestion des serveurs DNS
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { DnsServer, DnsServerInput } from "../../domains.types";

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

  async terminateAnycast(domain: string): Promise<void> {
    await ovhDelete(`/domain/${domain}/option/dnsAnycast`);
  }
}

export const dnsServersService = new DnsServersService();
