// ============================================================
// DMARC SERVICE - DMARC record management
// ============================================================

import { ovhApi } from "../../../../../services/api";

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
  async getCurrentDmarc(zoneName: string): Promise<DmarcRecord | null> {
    try {
      const records = await ovhApi.get<{ id: number; subDomain: string; target: string }[]>(
        `/domain/zone/${zoneName}/record?fieldType=TXT&subDomain=_dmarc`
      );
      if (Array.isArray(records) && records.length > 0) {
        return { id: records[0].id, target: records[0].target };
      }
      return null;
    } catch {
      return null;
    }
  },

  async createDmarc(zoneName: string, target: string): Promise<void> {
    await ovhApi.post(`/domain/zone/${zoneName}/record`, { fieldType: "TXT", subDomain: "_dmarc", target, ttl: 3600 });
    await ovhApi.post(`/domain/zone/${zoneName}/refresh`, {});
  },

  async updateDmarc(zoneName: string, recordId: number, target: string): Promise<void> {
    await ovhApi.put(`/domain/zone/${zoneName}/record/${recordId}`, { target });
    await ovhApi.post(`/domain/zone/${zoneName}/refresh`, {});
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
