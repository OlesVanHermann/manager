// ============================================================
// SERVICE DNS ZONES - Gestion des zones DNS OVHcloud
// ============================================================

import { ovhApi } from './api.service';

// ============================================================
// TYPES
// ============================================================

export interface DnsZone {
  name: string;
  hasDnsAnycast: boolean;
  lastUpdate: string;
  dnssecSupported: boolean;
  nameServers: string[];
}

export interface DnsZoneServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
}

export interface DnsZoneRecord {
  id: number;
  fieldType: string;
  subDomain: string;
  target: string;
  ttl: number;
  zone: string;
}

export interface DnsZoneHistory {
  createdAt: string;
  zoneId: number;
}

export interface DnsZoneTask {
  id: number;
  function: string;
  status: 'cancelled' | 'doing' | 'done' | 'error' | 'todo';
  createdAt: string;
  doneAt: string | null;
  lastUpdateAt: string;
  comment: string | null;
}

export interface DnsZoneSoa {
  serial: number;
  ttl: number;
  email: string;
  nxDomainTtl: number;
  refresh: number;
  expire: number;
  server: string;
}

// ============================================================
// SERVICE
// ============================================================

class DnsZonesService {
  /** Liste toutes les zones DNS du compte. */
  async listZones(): Promise<string[]> {
    return ovhApi.get<string[]>('/domain/zone');
  }

  /** Recupere les details d'une zone DNS. */
  async getZone(zoneName: string): Promise<DnsZone> {
    return ovhApi.get<DnsZone>(`/domain/zone/${zoneName}`);
  }

  /** Recupere les infos de service. */
  async getServiceInfos(zoneName: string): Promise<DnsZoneServiceInfos> {
    return ovhApi.get<DnsZoneServiceInfos>(`/domain/zone/${zoneName}/serviceInfos`);
  }

  /** Recupere le SOA de la zone. */
  async getSoa(zoneName: string): Promise<DnsZoneSoa> {
    return ovhApi.get<DnsZoneSoa>(`/domain/zone/${zoneName}/soa`);
  }

  // ---------- Records ----------

  /** Liste les IDs des records. */
  async listRecords(zoneName: string, fieldType?: string, subDomain?: string): Promise<number[]> {
    let path = `/domain/zone/${zoneName}/record`;
    const params: string[] = [];
    if (fieldType) params.push(`fieldType=${fieldType}`);
    if (subDomain !== undefined) params.push(`subDomain=${subDomain}`);
    if (params.length) path += '?' + params.join('&');
    return ovhApi.get<number[]>(path);
  }

  /** Recupere un record. */
  async getRecord(zoneName: string, id: number): Promise<DnsZoneRecord> {
    return ovhApi.get<DnsZoneRecord>(`/domain/zone/${zoneName}/record/${id}`);
  }

  /** Cree un record. */
  async createRecord(zoneName: string, record: { fieldType: string; subDomain: string; target: string; ttl?: number }): Promise<DnsZoneRecord> {
    return ovhApi.post<DnsZoneRecord>(`/domain/zone/${zoneName}/record`, record);
  }

  /** Modifie un record. */
  async updateRecord(zoneName: string, id: number, record: { subDomain?: string; target?: string; ttl?: number }): Promise<void> {
    return ovhApi.put<void>(`/domain/zone/${zoneName}/record/${id}`, record);
  }

  /** Supprime un record. */
  async deleteRecord(zoneName: string, id: number): Promise<void> {
    return ovhApi.delete<void>(`/domain/zone/${zoneName}/record/${id}`);
  }

  /** Rafraichit la zone. */
  async refreshZone(zoneName: string): Promise<void> {
    return ovhApi.post<void>(`/domain/zone/${zoneName}/refresh`, {});
  }

  /** Reset la zone aux valeurs par defaut. */
  async resetZone(zoneName: string, minimized: boolean = false): Promise<void> {
    return ovhApi.post<void>(`/domain/zone/${zoneName}/reset`, { minimized });
  }

  // ---------- History ----------

  /** Liste l'historique de la zone. */
  async listHistory(zoneName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/domain/zone/${zoneName}/history`);
  }

  /** Recupere une version historique. */
  async getHistory(zoneName: string, createdAt: string): Promise<DnsZoneHistory> {
    return ovhApi.get<DnsZoneHistory>(`/domain/zone/${zoneName}/history/${createdAt}`);
  }

  /** Restaure une version historique. */
  async restoreHistory(zoneName: string, createdAt: string): Promise<void> {
    return ovhApi.post<void>(`/domain/zone/${zoneName}/history/${createdAt}/restore`, {});
  }

  // ---------- Tasks ----------

  /** Liste les taches. */
  async listTasks(zoneName: string, status?: string): Promise<number[]> {
    let path = `/domain/zone/${zoneName}/task`;
    if (status) path += `?status=${status}`;
    return ovhApi.get<number[]>(path);
  }

  /** Recupere une tache. */
  async getTask(zoneName: string, id: number): Promise<DnsZoneTask> {
    return ovhApi.get<DnsZoneTask>(`/domain/zone/${zoneName}/task/${id}`);
  }

  // ---------- Export/Import ----------

  /** Exporte la zone en format texte. */
  async exportZone(zoneName: string): Promise<string> {
    return ovhApi.get<string>(`/domain/zone/${zoneName}/export`);
  }

  /** Importe une zone depuis un format texte. */
  async importZone(zoneName: string, zoneFile: string): Promise<void> {
    return ovhApi.post<void>(`/domain/zone/${zoneName}/import`, { zoneFile });
  }
}

export const dnsZonesService = new DnsZonesService();
