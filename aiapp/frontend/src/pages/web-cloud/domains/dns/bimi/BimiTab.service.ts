// ============================================================
// BIMI SERVICE - BIMI record management
// ============================================================

import { ovhApi } from "../../../../../services/api";

export interface BimiRecord {
  id: number;
  target: string;
}

export interface BimiConfig {
  logoUrl: string;
  vmcUrl: string;
}

export const bimiService = {
  async getCurrentBimi(zoneName: string): Promise<BimiRecord | null> {
    try {
      const records = await ovhApi.get<{ id: number; subDomain: string; target: string }[]>(
        `/domain/zone/${zoneName}/record?fieldType=TXT&subDomain=default._bimi`
      );
      if (Array.isArray(records) && records.length > 0) {
        return { id: records[0].id, target: records[0].target };
      }
      return null;
    } catch {
      return null;
    }
  },

  async createBimi(zoneName: string, target: string): Promise<void> {
    await ovhApi.post(`/domain/zone/${zoneName}/record`, { fieldType: "TXT", subDomain: "default._bimi", target, ttl: 3600 });
    await ovhApi.post(`/domain/zone/${zoneName}/refresh`, {});
  },

  async updateBimi(zoneName: string, recordId: number, target: string): Promise<void> {
    await ovhApi.put(`/domain/zone/${zoneName}/record/${recordId}`, { target });
    await ovhApi.post(`/domain/zone/${zoneName}/refresh`, {});
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
