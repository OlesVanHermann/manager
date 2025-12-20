// ============================================================
// HOOK: useDomainZoneList - Fusion domaines + zones DNS
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { domainsService } from "../../../../services/web-cloud.domains";
import { dnsZonesService } from "../../../../services/web-cloud.dns-zones";

// ============ TYPES ============

export type ServiceEntryType = "domain-and-zone" | "domain-only" | "zone-only";

export interface DomainZoneEntry {
  id: string;
  type: ServiceEntryType;
  hasDomain: boolean;
  hasZone: boolean;
}

// ============ HOOK ============

/** Hook pour charger la liste unifiée domaines + zones DNS. */
export function useDomainZoneList() {
  const [entries, setEntries] = useState<DomainZoneEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [domains, zones] = await Promise.all([
        domainsService.listDomains().catch(() => [] as string[]),
        dnsZonesService.listZones().catch(() => [] as string[]),
      ]);

      const domainSet = new Set(domains);
      const zoneSet = new Set(zones);
      const allNames = new Set([...domains, ...zones]);

      const list: DomainZoneEntry[] = [];

      for (const name of allNames) {
        const hasDomain = domainSet.has(name);
        const hasZone = zoneSet.has(name);

        let type: ServiceEntryType;
        if (hasDomain && hasZone) type = "domain-and-zone";
        else if (hasDomain) type = "domain-only";
        else type = "zone-only";

        list.push({ id: name, type, hasDomain, hasZone });
      }

      list.sort((a, b) => a.id.localeCompare(b.id));
      setEntries(list);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  return { entries, loading, error, reload: loadList };
}
