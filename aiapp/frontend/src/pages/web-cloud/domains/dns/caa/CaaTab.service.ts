// ============================================================
// CAA SERVICE - CAA record management
// Pattern N+1 identique old_manager: list IDs puis fetch details
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";

export interface CaaRecord {
  id: number;
  tag: string;
  value: string;
  target: string;
}

export const caaService = {
  /**
   * Get CAA records
   * Pattern N+1 identique old_manager:
   * 1. GET /domain/zone/{zone}/record?fieldType=CAA -> retourne IDs
   * 2. GET /domain/zone/{zone}/record/{id} pour chaque ID
   */
  async getCaaRecords(zoneName: string): Promise<CaaRecord[]> {
    try {
      // Step 1: Get record IDs (API returns number[], not objects)
      const ids = await ovhGet<number[]>(
        `/domain/zone/${zoneName}/record?fieldType=CAA`
      );
      if (!Array.isArray(ids) || ids.length === 0) {
        return [];
      }
      // Step 2: Fetch each record details (N+1 pattern like old_manager)
      const records = await Promise.all(
        ids.map((id) =>
          ovhGet<{ id: number; target: string }>(
            `/domain/zone/${zoneName}/record/${id}`
          )
        )
      );
      // Step 3: Parse CAA records
      return records.map((r) => {
        // Parse CAA target: "0 issue letsencrypt.org"
        const parts = r.target.match(/^(\d+)\s+(issue|issuewild|iodef)\s+"?([^"]+)"?$/);
        return {
          id: r.id,
          tag: parts?.[2] || "issue",
          value: parts?.[3] || r.target,
          target: r.target,
        };
      });
    } catch {
      return [];
    }
  },

  /**
   * Create CAA record
   * POST /domain/zone/{zone}/record - Identique old_manager
   */
  async createCaa(zoneName: string, tag: string, value: string): Promise<void> {
    const target = `0 ${tag} "${value}"`;
    await ovhPost(`/domain/zone/${zoneName}/record`, {
      fieldType: "CAA",
      subDomain: "",
      target,
      ttl: 3600,
    });
    await ovhPost(`/domain/zone/${zoneName}/refresh`, {});
  },

  /**
   * Delete CAA record
   * DELETE /domain/zone/{zone}/record/{id} - Identique old_manager
   */
  async deleteCaa(zoneName: string, recordId: number): Promise<void> {
    await ovhDelete(`/domain/zone/${zoneName}/record/${recordId}`);
    await ovhPost(`/domain/zone/${zoneName}/refresh`, {});
  },
};
