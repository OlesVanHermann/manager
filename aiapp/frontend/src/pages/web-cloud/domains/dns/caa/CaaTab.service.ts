// ============================================================
// CAA SERVICE - CAA record management
// ============================================================

import { ovhApi } from "../../../../../services/api";

export interface CaaRecord {
  id: number;
  tag: string;
  value: string;
  target: string;
}

export const caaService = {
  async getCaaRecords(zoneName: string): Promise<CaaRecord[]> {
    try {
      const records = await ovhApi.get<{ id: number; target: string }[]>(
        `/domain/zone/${zoneName}/record?fieldType=CAA`
      );
      if (Array.isArray(records)) {
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
      }
      return [];
    } catch {
      return [];
    }
  },

  async createCaa(zoneName: string, tag: string, value: string): Promise<void> {
    const target = `0 ${tag} "${value}"`;
    await ovhApi.post(`/domain/zone/${zoneName}/record`, {
      fieldType: "CAA",
      subDomain: "",
      target,
      ttl: 3600,
    });
    await ovhApi.post(`/domain/zone/${zoneName}/refresh`, {});
  },

  async deleteCaa(zoneName: string, recordId: number): Promise<void> {
    await ovhApi.delete(`/domain/zone/${zoneName}/record/${recordId}`);
    await ovhApi.post(`/domain/zone/${zoneName}/refresh`, {});
  },
};
