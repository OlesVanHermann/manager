// ============================================================
// BIMI SERVICE - BIMI record management
// Pattern N+1 identique old_manager: list IDs puis fetch details
// ============================================================

import { ovhGet, ovhPost, ovhPut } from "../../../../../services/api";

export interface BimiRecord {
  id: number;
  target: string;
}

export interface BimiConfig {
  logoUrl: string;
  vmcUrl: string;
}

export const bimiService = {
  /**
   * Get current BIMI record
   * Pattern N+1 identique old_manager:
   * 1. GET /domain/zone/{zone}/record?fieldType=TXT&subDomain=default._bimi -> retourne IDs
   * 2. GET /domain/zone/{zone}/record/{id} pour le premier ID
   */
  async getCurrentBimi(zoneName: string): Promise<BimiRecord | null> {
    try {
      // Step 1: Get record IDs (API returns number[], not objects)
      const ids = await ovhGet<number[]>(
        `/domain/zone/${zoneName}/record?fieldType=TXT&subDomain=default._bimi`
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
   * Create BIMI record
   * POST /domain/zone/{zone}/record - Identique old_manager
   */
  async createBimi(zoneName: string, target: string): Promise<void> {
    await ovhPost(`/domain/zone/${zoneName}/record`, { fieldType: "TXT", subDomain: "default._bimi", target, ttl: 3600 });
    await ovhPost(`/domain/zone/${zoneName}/refresh`, {});
  },

  /**
   * Update BIMI record
   * PUT /domain/zone/{zone}/record/{id} - Identique old_manager
   */
  async updateBimi(zoneName: string, recordId: number, target: string): Promise<void> {
    await ovhPut(`/domain/zone/${zoneName}/record/${recordId}`, { target });
    await ovhPost(`/domain/zone/${zoneName}/refresh`, {});
  },

  parseBimiRecord(target: string): BimiConfig {
    const config: BimiConfig = { logoUrl: "", vmcUrl: "" };
    if (!target) return config;
    const lMatch = target.match(/l=([^;]+)/);
    if (lMatch) config.logoUrl = lMatch[1].trim();
    const aMatch = target.match(/a=([^;]+)/);
    if (aMatch) config.vmcUrl = aMatch[1].trim();
    return config;
  },

  generateBimiRecord(config: BimiConfig): string {
    const parts: string[] = ["v=BIMI1"];
    parts.push(`l=${config.logoUrl || ""}`);
    if (config.vmcUrl) parts.push(`a=${config.vmcUrl}`);
    return parts.join("; ");
  },
};
