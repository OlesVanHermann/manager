// ============================================================
// SERVICE ISOLÉ : DnssecTab - Gestion DNSSEC + DS Records
// ============================================================

import { ovhGet, ovhPost, ovhDelete, ovh2apiPut } from "../../../../../services/api";
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

  async enableDnssec(domain: string): Promise<void> {
    // PUT /sws/domains/dnssec (2api) - Identique old_manager
    await ovh2apiPut("/sws/domains/dnssec", {
      domains: [domain],
      newState: true,
    });
  }

  async disableDnssec(domain: string): Promise<void> {
    // PUT /sws/domains/dnssec (2api) - Identique old_manager
    await ovh2apiPut("/sws/domains/dnssec", {
      domains: [domain],
      newState: false,
    });
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

  /**
   * Save DS Records list (batch create/update) - Identique old_manager saveDnssecList()
   * POST /domain/{domain}/dsRecord - avec keys array
   * @param domain - Domain name
   * @param keys - Array of DS records to save
   */
  async saveDsRecordsList(domain: string, keys: Array<{ algorithm: number; flags: number; publicKey: string; tag: number }>): Promise<void> {
    // POST /domain/{domain}/dsRecord - Identique old_manager
    // Accepts array of DS records in the keys parameter
    await ovhPost(`/domain/${domain}/dsRecord`, { keys });
  }

  /**
   * Get all DS records with details (N+1 pattern) - Identique old_manager
   */
  async listDsRecordsDetailed(domain: string): Promise<DsRecord[]> {
    const ids = await this.listDsRecords(domain);
    if (ids.length === 0) return [];
    const records = await Promise.all(ids.map(id => this.getDsRecord(domain, id)));
    return records;
  }
}

export const dnssecService = new DnssecService();
