// ============================================================
// DNS INFO SERVICE - Dashboard DNS data
// ============================================================

import { ovh2apiGet } from "../../../../../services/api";

export interface DnsInfoSummary {
  lastRefresh: string;
  dnssecEnabled: boolean;
  nameServers: string[];
  recordCounts: Record<string, number>;
  hasSpf: boolean;
  hasDkim: boolean;
  hasDmarc: boolean;
  hasMx: boolean;
}

export const dnsInfoService = {
  /**
   * Get DNS zone summary
   */
  async getSummary(zoneName: string): Promise<DnsInfoSummary> {
    try {
      // Parallel API calls
      const [zone, records, dnssec] = await Promise.all([
        ovh2apiGet<{ lastUpdate?: string; nameServer?: string }>(`/domain/zone/${zoneName}`),
        ovh2apiGet<{ id: number; fieldType: string; subDomain: string; target: string }[]>(`/domain/zone/${zoneName}/record`),
        ovh2apiGet<{ status: string }>(`/domain/zone/${zoneName}/dnssec`).catch(() => ({ status: "disabled" })),
      ]);

      // Count records by type
      const recordCounts: Record<string, number> = {};
      let hasSpf = false;
      let hasDkim = false;
      let hasDmarc = false;
      let hasMx = false;

      if (Array.isArray(records)) {
        for (const record of records) {
          const type = record.fieldType || "UNKNOWN";
          recordCounts[type] = (recordCounts[type] || 0) + 1;

          // Check email config
          if (type === "MX") hasMx = true;
          if (type === "TXT" && record.target?.startsWith("v=spf1")) hasSpf = true;
          if (type === "TXT" && record.subDomain?.includes("._domainkey")) hasDkim = true;
          if (type === "TXT" && record.subDomain === "_dmarc") hasDmarc = true;
        }
      }

      // Get nameservers
      let nameServers: string[] = [];
      try {
        const ns = await ovh2apiGet<{ host: string }[]>(`/domain/${zoneName}/nameServer`);
        if (Array.isArray(ns)) {
          nameServers = ns.map((n) => n.host);
        }
      } catch {
        nameServers = ["ns1.ovh.net", "dns1.ovh.net"];
      }

      return {
        lastRefresh: zone.lastUpdate || new Date().toISOString(),
        dnssecEnabled: dnssec.status === "enabled",
        nameServers,
        recordCounts,
        hasSpf,
        hasDkim,
        hasDmarc,
        hasMx,
      };
    } catch (error) {
      console.error("Failed to get DNS summary:", error);
      throw error;
    }
  },
};
