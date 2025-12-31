// ============================================================
// SERVICE ISOLÉ : DnssecTab - Gestion DNSSEC + DS Records
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { DnssecStatus } from "../../domains.types";

// ============ TYPES DS RECORD ============

export interface DsRecord {
  id: number;
  algorithm: number;
  flags: number;
  publicKey: string;
  tag: number;
  status?: string;
}

// ============ SERVICE ============

class DnssecService {
  // ----- ZONE DNSSEC STATUS -----
  async getDnssecStatus(zone: string): Promise<DnssecStatus> {
    return ovhGet<DnssecStatus>(`/domain/zone/${zone}/dnssec`);
  }

  async enableDnssec(zone: string): Promise<void> {
    await ovhPost(`/domain/zone/${zone}/dnssec`, {});
  }

  async disableDnssec(zone: string): Promise<void> {
    await ovhDelete(`/domain/zone/${zone}/dnssec`);
  }

  // ----- DOMAIN DS RECORDS -----
  async listDsRecords(domain: string): Promise<number[]> {
    try {
      return await ovhGet<number[]>(`/domain/${domain}/dsRecord`);
    } catch {
      return [];
    }
  }

  async getDsRecord(domain: string, id: number): Promise<DsRecord> {
    return ovhGet<DsRecord>(`/domain/${domain}/dsRecord/${id}`);
  }

  async createDsRecord(domain: string, data: { algorithm: number; flags: number; publicKey: string; tag: number }): Promise<DsRecord> {
    return ovhPost<DsRecord>(`/domain/${domain}/dsRecord`, data);
  }

  async deleteDsRecord(domain: string, id: number): Promise<void> {
    await ovhDelete(`/domain/${domain}/dsRecord/${id}`);
  }
}

export const dnssecService = new DnssecService();
