// ============================================================
// SERVICE ISOLÉ : ZoneTab - Gestion Zone DNS
// Pattern identique old_manager avec 2API batch + N+1 fallback
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete, ovh2apiGet, ovh2apiDelete } from "../../../../../services/api";
import type { DnsZone, DnsRecord, DnsRecordCreate } from "../../domains.types";

// ============ TYPES SOA ============

export interface ZoneSoa {
  serial: number;
  refresh: number;
  retry: number;
  expire: number;
  ttl: number;
  server: string;
  email: string;
}

export interface ZoneStatus {
  isDeployed: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface ZoneResetOptions {
  minimized: boolean;
  DnsRecords?: Array<{ fieldType: string; target: string }>;
}

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

  // -------- DETAILED LIST (2API - OPTIMISÉ) --------
  // GET /sws/domain/{zone}/zone/records - Identique old_manager (agrégé)
  async listRecordsAggregated(zone: string): Promise<DnsRecord[]> {
    try {
      const result = await ovh2apiGet<{ data: DnsRecord[] }>(
        `/sws/domain/${zone}/zone/records`
      );
      return result.data || [];
    } catch {
      // Fallback vers méthode N+1 si 2api échoue
      return this.listRecordsDetailed(zone);
    }
  }

  // -------- DETAILED LIST (FALLBACK N+1) --------
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

  // -------- SOA (Identique old_manager) --------
  async getZoneSoa(zone: string): Promise<ZoneSoa> {
    // GET /domain/zone/{zone}/soa - Identique old_manager
    return ovhGet<ZoneSoa>(`/domain/zone/${zone}/soa`);
  }

  async updateZoneSoa(zone: string, data: Partial<ZoneSoa>): Promise<void> {
    // PUT /domain/zone/{zone}/soa - Identique old_manager
    await ovhPut(`/domain/zone/${zone}/soa`, data);
  }

  // -------- ZONE STATUS (Identique old_manager) --------
  async getZoneStatus(zone: string): Promise<ZoneStatus> {
    // GET /domain/zone/{zone}/status - Identique old_manager
    return ovhGet<ZoneStatus>(`/domain/zone/${zone}/status`);
  }

  // -------- ZONE SERVICE INFOS --------
  async getZoneServiceInfos(zone: string): Promise<{ expiration: string; creation: string }> {
    // GET /domain/zone/{zone}/serviceInfos - Identique old_manager
    return ovhGet(`/domain/zone/${zone}/serviceInfos`);
  }

  // -------- RESET ZONE (Identique old_manager) --------
  async resetZone(zone: string, options: ZoneResetOptions): Promise<void> {
    // POST /domain/zone/{zone}/reset - Identique old_manager
    await ovhPost(`/domain/zone/${zone}/reset`, {
      minimized: options.minimized,
      DnsRecords: options.DnsRecords || null,
    });
  }

  // -------- TERMINATE ZONE --------
  async terminateZone(zone: string): Promise<void> {
    // POST /domain/zone/{zone}/terminate - Identique old_manager
    await ovhPost(`/domain/zone/${zone}/terminate`, {});
  }

  // -------- EXPORT/IMPORT (Identique old_manager) --------
  async exportZone(zone: string): Promise<string> {
    // GET /domain/zone/{zone}/export - Identique old_manager
    // Retourne le contenu texte de la zone
    return ovhGet<string>(`/domain/zone/${zone}/export`);
  }

  async importZone(zone: string, zoneFile: string): Promise<void> {
    // POST /domain/zone/{zone}/import - Identique old_manager
    await ovhPost(`/domain/zone/${zone}/import`, { zoneFile });
  }

  // -------- HISTORY DETAILS (Identique old_manager) --------
  async getHistoryDetail(zone: string, creationDate: string): Promise<{ zoneFile: string }> {
    // GET /domain/zone/{zone}/history/{creationDate} - Identique old_manager
    return ovhGet(`/domain/zone/${zone}/history/${creationDate}`);
  }

  // -------- BATCH DELETE (2API - Identique old_manager) --------
  /**
   * Delete multiple DNS records in batch
   * DELETE /sws/domain/zone/{zone}/records - Identique old_manager (2API)
   * @param zone - Zone name
   * @param recordIds - Array of record IDs to delete
   */
  async deleteRecordsBatch(zone: string, recordIds: number[]): Promise<{ state: string }> {
    // 2API batch delete - identique old_manager deleteDnsEntry()
    const result = await ovh2apiDelete<{ state: string }>(
      `/sws/domain/zone/${encodeURIComponent(zone)}/records`,
      { records: recordIds }
    );
    if (result?.state && result.state !== "OK") {
      throw new Error(`Batch delete failed: ${result.state}`);
    }
    return result;
  }

  // -------- PAGINATED LIST (Identique old_manager) --------
  /**
   * List records with pagination using X-Pagination headers
   * Pattern identique old_manager getTabZoneDns()
   */
  async listRecordsPaginated(
    zone: string,
    options: {
      recordsCount?: number;
      offset?: number;
      search?: string;
      searchedType?: string;
    } = {}
  ): Promise<{
    paginatedZone: { records: { results: DnsRecord[]; count: number } };
  }> {
    // GET /sws/domain/{zone}/zone/records - Identique old_manager (2API avec params)
    const params = new URLSearchParams();
    if (options.recordsCount) params.append("recordsCount", String(options.recordsCount));
    if (options.offset) params.append("offset", String(options.offset));
    if (options.search) params.append("search", options.search.toLowerCase());
    if (options.searchedType) params.append("searchedType", options.searchedType);

    const queryString = params.toString();
    const path = `/sws/domain/${zone}/zone/records${queryString ? `?${queryString}` : ""}`;

    return ovh2apiGet(path);
  }
}

export const zoneService = new ZoneService();
export { formatDateTime };
