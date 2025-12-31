// ============================================================
// DKIM SERVICE - DKIM record management
// ============================================================

import { ovhApi } from "../../../../../services/api";

export interface DkimRecord {
  id: number;
  selector: string;
  subDomain: string;
  target: string;
}

export const dkimService = {
  /**
   * Get DKIM records
   */
  async getDkimRecords(zoneName: string): Promise<DkimRecord[]> {
    try {
      const records = await ovhApi.get<{ id: number; fieldType: string; subDomain: string; target: string }[]>(
        `/domain/zone/${zoneName}/record?fieldType=TXT`
      );

      if (Array.isArray(records)) {
        return records
          .filter((r) => r.subDomain?.includes("._domainkey"))
          .map((r) => ({
            id: r.id,
            selector: r.subDomain.replace("._domainkey", ""),
            subDomain: r.subDomain,
            target: r.target,
          }));
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Create DKIM record
   */
  async createDkim(zoneName: string, selector: string, publicKey: string): Promise<void> {
    const target = `v=DKIM1; k=rsa; p=${publicKey}`;
    await ovhApi.post(`/domain/zone/${zoneName}/record`, {
      fieldType: "TXT",
      subDomain: `${selector}._domainkey`,
      target,
      ttl: 3600,
    });
    await ovhApi.post(`/domain/zone/${zoneName}/refresh`, {});
  },

  /**
   * Delete DKIM record
   */
  async deleteDkim(zoneName: string, recordId: number): Promise<void> {
    await ovhApi.delete(`/domain/zone/${zoneName}/record/${recordId}`);
    await ovhApi.post(`/domain/zone/${zoneName}/refresh`, {});
  },

  /**
   * Generate DKIM record value
   */
  generateDkimValue(publicKey: string): string {
    return `v=DKIM1; k=rsa; p=${publicKey}`;
  },
};
