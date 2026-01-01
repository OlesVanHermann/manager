// ============================================================
// DKIM SERVICE - DKIM record management
// Pattern N+1 identique old_manager: list IDs puis fetch details
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";

export interface DkimRecord {
  id: number;
  selector: string;
  subDomain: string;
  target: string;
}

export const dkimService = {
  /**
   * Get DKIM records
   * Pattern N+1 identique old_manager:
   * 1. GET /domain/zone/{zone}/record?fieldType=TXT -> retourne IDs
   * 2. GET /domain/zone/{zone}/record/{id} pour chaque ID
   * 3. Filter ceux qui ont _domainkey dans subDomain
   */
  async getDkimRecords(zoneName: string): Promise<DkimRecord[]> {
    try {
      // Step 1: Get record IDs (API returns number[], not objects)
      const ids = await ovhGet<number[]>(
        `/domain/zone/${zoneName}/record?fieldType=TXT`
      );
      if (!Array.isArray(ids) || ids.length === 0) {
        return [];
      }
      // Step 2: Fetch each record details (N+1 pattern like old_manager)
      const records = await Promise.all(
        ids.map((id) =>
          ovhGet<{ id: number; fieldType: string; subDomain: string; target: string }>(
            `/domain/zone/${zoneName}/record/${id}`
          )
        )
      );
      // Step 3: Filter DKIM records and map
      return records
        .filter((r) => r.subDomain?.includes("._domainkey"))
        .map((r) => ({
          id: r.id,
          selector: r.subDomain.replace("._domainkey", ""),
          subDomain: r.subDomain,
          target: r.target,
        }));
    } catch {
      return [];
    }
  },

  /**
   * Create DKIM record
   * POST /domain/zone/{zone}/record - Identique old_manager
   * POST /domain/zone/{zone}/refresh - Identique old_manager
   */
  async createDkim(zoneName: string, selector: string, publicKey: string): Promise<void> {
    const target = `v=DKIM1; k=rsa; p=${publicKey}`;
    await ovhPost(`/domain/zone/${zoneName}/record`, {
      fieldType: "TXT",
      subDomain: `${selector}._domainkey`,
      target,
      ttl: 3600,
    });
    await ovhPost(`/domain/zone/${zoneName}/refresh`, {});
  },

  /**
   * Delete DKIM record
   * DELETE /domain/zone/{zone}/record/{id} - Identique old_manager
   * POST /domain/zone/{zone}/refresh - Identique old_manager
   */
  async deleteDkim(zoneName: string, recordId: number): Promise<void> {
    await ovhDelete(`/domain/zone/${zoneName}/record/${recordId}`);
    await ovhPost(`/domain/zone/${zoneName}/refresh`, {});
  },

  /**
   * Generate DKIM record value
   */
  generateDkimValue(publicKey: string): string {
    return `v=DKIM1; k=rsa; p=${publicKey}`;
  },
};
