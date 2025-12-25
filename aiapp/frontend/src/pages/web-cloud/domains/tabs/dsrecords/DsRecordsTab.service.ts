// ============================================================
// SERVICE ISOLÉ : DsRecordsTab - Gestion DS Records DNSSEC
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { DsRecord, DsRecordCreate } from "../../domains.types";

// ============ SERVICE ============

class DsRecordsService {
  async listDsRecords(domain: string): Promise<number[]> {
    return ovhGet<number[]>(`/domain/${domain}/dsRecord`);
  }

  async getDsRecord(domain: string, id: number): Promise<DsRecord> {
    return ovhGet<DsRecord>(`/domain/${domain}/dsRecord/${id}`);
  }

  async createDsRecord(domain: string, data: DsRecordCreate): Promise<DsRecord> {
    return ovhPost<DsRecord>(`/domain/${domain}/dsRecord`, data);
  }

  async deleteDsRecord(domain: string, id: number): Promise<void> {
    await ovhDelete(`/domain/${domain}/dsRecord/${id}`);
  }
}

export const dsRecordsService = new DsRecordsService();
