// ============================================================
// DNS INFO SERVICE - Dashboard DNS data
// Utilise APIv6 signée (pas 2API) - gestion erreurs robuste
// ============================================================

import { ovhGet } from "../../../../../services/api";

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
   * Get DNS zone summary - utilise APIv6 signée
   */
  async getSummary(zoneName: string): Promise<DnsInfoSummary> {
    // Valeurs par défaut en cas d'erreur
    const defaultResult: DnsInfoSummary = {
      lastRefresh: new Date().toISOString(),
      dnssecEnabled: false,
      nameServers: [],
      recordCounts: {},
      hasSpf: false,
      hasDkim: false,
      hasDmarc: false,
      hasMx: false,
    };

    try {
      // Parallel API calls avec gestion erreurs individuelle
      const [zone, recordIds, dnssec, nameServerIds] = await Promise.all([
        ovhGet<{ lastUpdate?: string }>(`/domain/zone/${zoneName}`).catch(() => ({})),
        ovhGet<number[]>(`/domain/zone/${zoneName}/record`).catch(() => []),
        ovhGet<{ status: string }>(`/domain/zone/${zoneName}/dnssec`).catch(() => ({ status: "disabled" })),
        ovhGet<number[]>(`/domain/${zoneName}/nameServer`).catch(() => []),
      ]);

      // Fetch record details (pattern N+1) - limiter à 50 pour perf
      const limitedIds = Array.isArray(recordIds) ? recordIds.slice(0, 50) : [];
      const records = await Promise.all(
        limitedIds.map((id) =>
          ovhGet<{ id: number; fieldType: string; subDomain: string; target: string }>(
            `/domain/zone/${zoneName}/record/${id}`
          ).catch(() => null)
        )
      ).then((results) => results.filter(Boolean));

      // Fetch nameserver details
      const nsIds = Array.isArray(nameServerIds) ? nameServerIds : [];
      const nameServers = await Promise.all(
        nsIds.map((id) =>
          ovhGet<{ host: string }>(`/domain/${zoneName}/nameServer/${id}`).catch(() => null)
        )
      ).then((results) => results.filter(Boolean).map((ns) => ns!.host));

      // Count records by type
      const recordCounts: Record<string, number> = {};
      let hasSpf = false;
      let hasDkim = false;
      let hasDmarc = false;
      let hasMx = false;

      for (const record of records) {
        if (!record) continue;
        const type = record.fieldType || "UNKNOWN";
        recordCounts[type] = (recordCounts[type] || 0) + 1;

        if (type === "MX") hasMx = true;
        if (type === "TXT" && record.target?.startsWith("v=spf1")) hasSpf = true;
        if (type === "TXT" && record.subDomain?.includes("._domainkey")) hasDkim = true;
        if (type === "TXT" && record.subDomain === "_dmarc") hasDmarc = true;
      }

      return {
        lastRefresh: (zone as { lastUpdate?: string }).lastUpdate || new Date().toISOString(),
        dnssecEnabled: dnssec.status === "enabled",
        nameServers,
        recordCounts,
        hasSpf,
        hasDkim,
        hasDmarc,
        hasMx,
      };
    } catch {
      // En cas d'erreur globale, retourner les valeurs par défaut
      return defaultResult;
    }
  },
};
