// ============================================================
// SERVICE ISOLÉ : DnsServersTab - Gestion des serveurs DNS
// ============================================================

import { ovhGet, ovhPost } from "../../../../../services/api";
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
}

export const dnsServersService = new DnsServersService();
