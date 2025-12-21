// ============================================================
// SERVICE: DNS Zones API - Gestion des zones DNS
// ============================================================

import { ovhGet, ovhPost, ovhPostNoBody, ovhPut, ovhDelete } from "./api";

// ============ TYPES ============

export interface DnsZone {
  name: string;
  hasDnsAnycast: boolean;
  dnssecSupported: boolean;
  lastUpdate: string;
  nameServers: string[];
}

export interface DnsRecord {
  id: number;
  fieldType: string;
  subDomain: string;
  target: string;
  ttl: number;
  zone: string;
}

export interface DnsRecordCreate {
  fieldType: string;
  subDomain: string;
  target: string;
  ttl?: number;
}

export interface DnssecStatus {
  status: "enabled" | "disabled" | "enableInProgress" | "disableInProgress";
}

// ============ SERVICE ============

class DnsZonesService {
  async listZones(): Promise<string[]> {
    return ovhGet<string[]>("/domain/zone");
  }

  async getZone(zone: string): Promise<DnsZone> {
    return ovhGet<DnsZone>(`/domain/zone/${zone}`);
  }

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

  async refreshZone(zone: string): Promise<void> {
    await ovhPost(`/domain/zone/${zone}/refresh`, {});
  }

  async getDnssecStatus(zone: string): Promise<DnssecStatus> {
    return ovhGet<DnssecStatus>(`/domain/zone/${zone}/dnssec`);
  }

  async enableDnssec(zone: string): Promise<void> {
    await ovhPostNoBody(`/domain/zone/${zone}/dnssec`);
  }

  async disableDnssec(zone: string): Promise<void> {
    await ovhDelete(`/domain/zone/${zone}/dnssec`);
  }

  async getHistory(zone: string): Promise<string[]> {
    return ovhGet<string[]>(`/domain/zone/${zone}/history`);
  }

  async restoreHistory(zone: string, creationDate: string): Promise<void> {
    await ovhPost(`/domain/zone/${zone}/history/${creationDate}/restore`, {});
  }

  async listRecordsDetailed(zone: string): Promise<DnsRecord[]> {
    try {
      const ids = await ovhGet<number[]>(`/domain/zone/${zone}/record`);
      if (ids.length === 0) return [];
      const records = await Promise.all(ids.slice(0, 100).map((id) => this.getRecord(zone, id)));
      return records;
    } catch {
      return [];
    }
  }
}

export const dnsZonesService = new DnsZonesService();
