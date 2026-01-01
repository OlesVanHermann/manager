// ============================================================
// DMARC SERVICE - DMARC record management
// Pattern N+1 identique old_manager: list IDs puis fetch details
// ============================================================

import { ovhGet, ovhPost, ovhPut } from "../../../../../services/api";

export interface DmarcRecord {
  id: number;
  target: string;
}

export interface DmarcConfig {
  policy: "none" | "quarantine" | "reject";
  subdomainPolicy: "none" | "quarantine" | "reject";
  percentage: number;
  reportEmail: string;
  forensicEmail: string;
}

export const dmarcService = {
  /**
   * Get current DMARC record
   * Pattern N+1 identique old_manager:
   * 1. GET /domain/zone/{zone}/record?fieldType=TXT&subDomain=_dmarc -> retourne IDs
   * 2. GET /domain/zone/{zone}/record/{id} pour chaque ID
   */
  async getCurrentDmarc(zoneName: string): Promise<DmarcRecord | null> {
    try {
      // Step 1: Get record IDs (API returns number[], not objects)
      const ids = await ovhGet<number[]>(
        `/domain/zone/${zoneName}/record?fieldType=TXT&subDomain=_dmarc`
      );
      if (!Array.isArray(ids) || ids.length === 0) {
        return null;
      }
      // Step 2: Fetch first record details
      const record = await ovhGet<{ id: number; subDomain: string; target: string }>(
        `/domain/zone/${zoneName}/record/${ids[0]}`
      );
      return { id: record.id, target: record.target };
    } catch {
      return null;
    }
  },

  /**
   * Create DMARC record
   * POST /domain/zone/{zone}/record - Identique old_manager
   */
  async createDmarc(zoneName: string, target: string): Promise<void> {
    await ovhPost(`/domain/zone/${zoneName}/record`, { fieldType: "TXT", subDomain: "_dmarc", target, ttl: 3600 });
    await ovhPost(`/domain/zone/${zoneName}/refresh`, {});
  },

  /**
   * Update DMARC record
   * PUT /domain/zone/{zone}/record/{id} - Identique old_manager
   */
  async updateDmarc(zoneName: string, recordId: number, target: string): Promise<void> {
    await ovhPut(`/domain/zone/${zoneName}/record/${recordId}`, { target });
    await ovhPost(`/domain/zone/${zoneName}/refresh`, {});
  },

  parseDmarcRecord(target: string): DmarcConfig {
    const config: DmarcConfig = { policy: "none", subdomainPolicy: "none", percentage: 100, reportEmail: "", forensicEmail: "" };
    if (!target) return config;
    const pMatch = target.match(/p=(none|quarantine|reject)/);
    if (pMatch) config.policy = pMatch[1] as DmarcConfig["policy"];
    const spMatch = target.match(/sp=(none|quarantine|reject)/);
    if (spMatch) config.subdomainPolicy = spMatch[1] as DmarcConfig["subdomainPolicy"];
    const pctMatch = target.match(/pct=(\d+)/);
    if (pctMatch) config.percentage = parseInt(pctMatch[1], 10);
    const ruaMatch = target.match(/rua=mailto:([^;]+)/);
    if (ruaMatch) config.reportEmail = ruaMatch[1];
    const rufMatch = target.match(/ruf=mailto:([^;]+)/);
    if (rufMatch) config.forensicEmail = rufMatch[1];
    return config;
  },

  generateDmarcRecord(config: DmarcConfig): string {
    const parts: string[] = ["v=DMARC1", `p=${config.policy}`];
    if (config.subdomainPolicy !== config.policy) parts.push(`sp=${config.subdomainPolicy}`);
    if (config.percentage !== 100) parts.push(`pct=${config.percentage}`);
    if (config.reportEmail) parts.push(`rua=mailto:${config.reportEmail}`);
    if (config.forensicEmail) parts.push(`ruf=mailto:${config.forensicEmail}`);
    return parts.join("; ");
  },
};
