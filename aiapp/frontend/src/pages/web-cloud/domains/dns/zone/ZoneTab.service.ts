// ============================================================
// SERVICE ISOLÉ : ZoneTab - Gestion Zone DNS
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../services/api";
import type { DnsZone, DnsRecord, DnsRecordCreate } from "../../domains.types";

// ============ HELPERS LOCAUX (DUPLIQUÉS) ============

const formatDateTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============ SERVICE ============

class ZoneService {
  // -------- ZONE INFO --------
  async getZone(zone: string): Promise<DnsZone> {
    return ovhGet<DnsZone>(`/domain/zone/${zone}`);
  }

  // -------- RECORDS --------
  async listRecords(zone: string, params?: { fieldType?: string; subDomain?: string }): Promise<number[]> {
    let path = `/domain/zone/${zone}/record`;
    const query: string[] = [];
    if (params?.fieldType) query.push(`fieldType=${params.fieldType}`);
    if (params?.subDomain) query.push(`subDomain=${params.subDomain}`);
    if (query.length) path += `?${query.join("&")}`;
    return ovhGet<number[]>(path);
  }

  async getRecord(zone: string, id: number): Promise<DnsRecord> {
    return ovhGet<DnsRecord>(`/domain/zone/${zone}/record/${id}`);
  }

  async createRecord(zone: string, data: DnsRecordCreate): Promise<DnsRecord> {
    return ovhPost<DnsRecord>(`/domain/zone/${zone}/record`, data);
  }

  async updateRecord(zone: string, id: number, data: Partial<DnsRecordCreate>): Promise<void> {
    await ovhPut(`/domain/zone/${zone}/record/${id}`, data);
  }

  async deleteRecord(zone: string, id: number): Promise<void> {
    await ovhDelete(`/domain/zone/${zone}/record/${id}`);
  }

  // -------- ZONE ACTIONS --------
  async refreshZone(zone: string): Promise<void> {
    await ovhPost(`/domain/zone/${zone}/refresh`, {});
  }

  // -------- HISTORY --------
  async getHistory(zone: string): Promise<string[]> {
    return ovhGet<string[]>(`/domain/zone/${zone}/history`);
  }

  async restoreHistory(zone: string, creationDate: string): Promise<void> {
    await ovhPost(`/domain/zone/${zone}/history/${creationDate}/restore`, {});
  }

  // -------- DETAILED LIST --------
  async listRecordsDetailed(zone: string): Promise<DnsRecord[]> {
    try {
      const ids = await ovhGet<number[]>(`/domain/zone/${zone}/record`);
      if (ids.length === 0) return [];
      const records = await Promise.all(
        ids.slice(0, 100).map((id) => this.getRecord(zone, id))
      );
      return records;
    } catch {
      return [];
    }
  }
}

export const zoneService = new ZoneService();
export { formatDateTime };
