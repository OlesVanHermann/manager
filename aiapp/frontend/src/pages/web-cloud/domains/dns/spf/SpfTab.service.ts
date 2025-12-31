// ============================================================
// SPF SERVICE - SPF record management
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../services/api";

export interface SpfRecord {
  id: number;
  fieldType: string;
  subDomain: string;
  target: string;
  ttl: number;
}

export interface SpfConfig {
  includeOvh: boolean;
  includeMicrosoft: boolean;
  includeGoogle: boolean;
  includeCustom: string[];
  policy: "~all" | "-all" | "?all";
}

export const spfService = {
  /**
   * Get current SPF record
   */
  async getCurrentSpf(zoneName: string): Promise<SpfRecord | null> {
    try {
      const records = await ovhGet<SpfRecord[]>(`/domain/zone/${zoneName}/record?fieldType=TXT&subDomain=`);
      if (Array.isArray(records)) {
        return records.find((r) => r.target?.startsWith("v=spf1")) || null;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Create SPF record
   */
  async createSpf(zoneName: string, target: string): Promise<void> {
    await ovhPost(`/domain/zone/${zoneName}/record`, {
      fieldType: "TXT",
      subDomain: "",
      target,
      ttl: 3600,
    });
    await ovhPost(`/domain/zone/${zoneName}/refresh`, {});
  },

  /**
   * Update SPF record
   */
  async updateSpf(zoneName: string, recordId: number, target: string): Promise<void> {
    await ovhPut(`/domain/zone/${zoneName}/record/${recordId}`, { target });
    await ovhPost(`/domain/zone/${zoneName}/refresh`, {});
  },

  /**
   * Delete SPF record
   */
  async deleteSpf(zoneName: string, recordId: number): Promise<void> {
    await ovhDelete(`/domain/zone/${zoneName}/record/${recordId}`);
    await ovhPost(`/domain/zone/${zoneName}/refresh`, {});
  },

  /**
   * Parse SPF record into config
   */
  parseSpfRecord(target: string): SpfConfig {
    const config: SpfConfig = {
      includeOvh: false,
      includeMicrosoft: false,
      includeGoogle: false,
      includeCustom: [],
      policy: "~all",
    };

    if (!target) return config;

    // Check includes
    if (target.includes("mx.ovh.com") || target.includes("include:ovh")) {
      config.includeOvh = true;
    }
    if (target.includes("spf.protection.outlook.com")) {
      config.includeMicrosoft = true;
    }
    if (target.includes("_spf.google.com")) {
      config.includeGoogle = true;
    }

    // Check policy
    if (target.endsWith("-all")) config.policy = "-all";
    else if (target.endsWith("?all")) config.policy = "?all";
    else config.policy = "~all";

    return config;
  },

  /**
   * Generate SPF record from config
   */
  generateSpfRecord(config: SpfConfig): string {
    const parts: string[] = ["v=spf1"];

    if (config.includeOvh) {
      parts.push("include:mx.ovh.com");
    }
    if (config.includeMicrosoft) {
      parts.push("include:spf.protection.outlook.com");
    }
    if (config.includeGoogle) {
      parts.push("include:_spf.google.com");
    }
    for (const custom of config.includeCustom) {
      parts.push(`include:${custom}`);
    }

    parts.push(config.policy);
    return parts.join(" ");
  },
};
