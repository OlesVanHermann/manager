// ============================================================
// SERVICE DOMAINS - Gestion des domaines OVHcloud
// ============================================================

import { ovhApi } from './api';

// ============================================================
// TYPES
// ============================================================

export interface Domain {
  domain: string;
  nameServerType: 'hosted' | 'external';
  offer: string;
  transferLockStatus: 'locked' | 'locking' | 'unlocked' | 'unlocking';
  whoisOwner: string;
  owoSupported: boolean;
  parentService: { name: string; type: string } | null;
}

export interface DomainServiceInfos {
  domain: string;
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; forced: boolean; period: number | null };
}

export interface DnsServer {
  id: number;
  host: string;
  ip?: string;
  isUsed: boolean;
  toDelete: boolean;
}

export interface DnsRecord {
  id: number;
  fieldType: string;
  subDomain: string;
  target: string;
  ttl: number;
  zone: string;
}

export interface DomainTask {
  id: number;
  function: string;
  status: 'todo' | 'doing' | 'done' | 'error' | 'cancelled';
  creationDate: string;
  todoDate: string;
  lastUpdate: string;
  comment?: string;
  canCancel: boolean;
  canAccelerate: boolean;
  canRelaunch: boolean;
}

export interface Redirection {
  id: number;
  keywords?: string;
  description?: string;
  title?: string;
  target: string;
  subDomain: string;
  type: 'visible' | 'visiblePermanent' | 'invisible';
}

export interface GlueRecord {
  host: string;
  ips: string[];
}

export interface DynHostRecord {
  id: number;
  ip: string;
  subDomain: string;
  zone: string;
  login?: string;
}

// ============================================================
// SERVICE
// ============================================================

class DomainsService {
  /** Liste tous les domaines du compte. */
  async listDomains(): Promise<string[]> {
    return ovhApi.get<string[]>('/domain');
  }

  /** Recupere les details d'un domaine. */
  async getDomain(domain: string): Promise<Domain> {
    return ovhApi.get<Domain>(`/domain/${domain}`);
  }

  /** Recupere les infos de service d'un domaine. */
  async getServiceInfos(domain: string): Promise<DomainServiceInfos> {
    return ovhApi.get<DomainServiceInfos>(`/domain/${domain}/serviceInfos`);
  }

  // ---------- Transfer Lock ----------

  /** Verrouille le domaine contre les transferts. */
  async lockDomain(domain: string): Promise<void> {
    return ovhApi.post<void>(`/domain/${domain}/lock`, {});
  }

  /** Deverrouille le domaine pour permettre les transferts. */
  async unlockDomain(domain: string): Promise<void> {
    return ovhApi.delete<void>(`/domain/${domain}/lock`);
  }

  // ---------- DNS Servers ----------

  /** Liste les serveurs DNS d'un domaine. */
  async listDnsServers(domain: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/domain/${domain}/nameServer`);
  }

  /** Recupere un serveur DNS. */
  async getDnsServer(domain: string, id: number): Promise<DnsServer> {
    return ovhApi.get<DnsServer>(`/domain/${domain}/nameServer/${id}`);
  }

  // ---------- Zone DNS ----------

  /** Liste les IDs des records DNS d'une zone. */
  async listZoneRecords(zoneName: string, fieldType?: string, subDomain?: string): Promise<number[]> {
    let path = `/domain/zone/${zoneName}/record`;
    const params: string[] = [];
    if (fieldType) params.push(`fieldType=${fieldType}`);
    if (subDomain !== undefined) params.push(`subDomain=${subDomain}`);
    if (params.length) path += '?' + params.join('&');
    return ovhApi.get<number[]>(path);
  }

  /** Recupere un record DNS. */
  async getZoneRecord(zoneName: string, id: number): Promise<DnsRecord> {
    return ovhApi.get<DnsRecord>(`/domain/zone/${zoneName}/record/${id}`);
  }

  /** Cree un record DNS. */
  async createZoneRecord(zoneName: string, record: { fieldType: string; subDomain: string; target: string; ttl?: number }): Promise<DnsRecord> {
    return ovhApi.post<DnsRecord>(`/domain/zone/${zoneName}/record`, record);
  }

  /** Modifie un record DNS. */
  async updateZoneRecord(zoneName: string, id: number, record: { subDomain?: string; target?: string; ttl?: number }): Promise<void> {
    return ovhApi.put<void>(`/domain/zone/${zoneName}/record/${id}`, record);
  }

  /** Supprime un record DNS. */
  async deleteZoneRecord(zoneName: string, id: number): Promise<void> {
    return ovhApi.delete<void>(`/domain/zone/${zoneName}/record/${id}`);
  }

  /** Rafraichit la zone DNS. */
  async refreshZone(zoneName: string): Promise<void> {
    return ovhApi.post<void>(`/domain/zone/${zoneName}/refresh`, {});
  }

  // ---------- Redirections ----------

  /** Liste les redirections web. */
  async listRedirections(domain: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/domain/${domain}/redirection`);
  }

  /** Recupere une redirection. */
  async getRedirection(domain: string, id: number): Promise<Redirection> {
    return ovhApi.get<Redirection>(`/domain/${domain}/redirection/${id}`);
  }

  // ---------- DNSSEC ----------

  /** Recupere le statut DNSSEC. */
  async getDnssecStatus(domain: string): Promise<{ status: string }> {
    return ovhApi.get<{ status: string }>(`/domain/${domain}/dnssec`);
  }

  /** Active DNSSEC. */
  async enableDnssec(domain: string): Promise<void> {
    return ovhApi.post<void>(`/domain/${domain}/dnssec`, {});
  }

  /** Desactive DNSSEC. */
  async disableDnssec(domain: string): Promise<void> {
    return ovhApi.delete<void>(`/domain/${domain}/dnssec`);
  }

  // ---------- Glue Records ----------

  /** Liste les glue records. */
  async listGlueRecords(domain: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/domain/${domain}/glueRecord`);
  }

  /** Recupere un glue record. */
  async getGlueRecord(domain: string, host: string): Promise<GlueRecord> {
    return ovhApi.get<GlueRecord>(`/domain/${domain}/glueRecord/${host}`);
  }

  // ---------- DynHost ----------

  /** Liste les records DynHost. */
  async listDynHostRecords(zoneName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/domain/zone/${zoneName}/dynHost/record`);
  }

  /** Recupere un record DynHost. */
  async getDynHostRecord(zoneName: string, id: number): Promise<DynHostRecord> {
    return ovhApi.get<DynHostRecord>(`/domain/zone/${zoneName}/dynHost/record/${id}`);
  }

  // ---------- Tasks ----------

  /** Liste les taches en cours. */
  async listTasks(domain: string, status?: string): Promise<number[]> {
    let path = `/domain/${domain}/task`;
    if (status) path += `?status=${status}`;
    return ovhApi.get<number[]>(path);
  }

  /** Recupere une tache. */
  async getTask(domain: string, id: number): Promise<DomainTask> {
    return ovhApi.get<DomainTask>(`/domain/${domain}/task/${id}`);
  }
}

export const domainsService = new DomainsService();
