// ============================================================
// SERVICE ISOLÉ : GlueTab - Gestion Glue Records
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { GlueRecord } from "../../domains.types";

// ============ SERVICE ============

class GlueService {
  async listGlueRecords(domain: string): Promise<string[]> {
    return ovhGet<string[]>(`/domain/${domain}/glueRecord`);
  }

  async getGlueRecord(domain: string, host: string): Promise<GlueRecord> {
    return ovhGet<GlueRecord>(`/domain/${domain}/glueRecord/${host}`);
  }

  async createGlueRecord(domain: string, data: GlueRecord): Promise<void> {
    await ovhPost(`/domain/${domain}/glueRecord`, data);
  }

  async updateGlueRecord(domain: string, host: string, ips: string[]): Promise<void> {
    // POST /domain/{domain}/glueRecord/{host}/update - Identique old_manager
    await ovhPost(`/domain/${domain}/glueRecord/${host}/update`, { ips });
  }

  async deleteGlueRecord(domain: string, host: string): Promise<void> {
    await ovhDelete(`/domain/${domain}/glueRecord/${host}`);
  }
}

export const glueService = new GlueService();
