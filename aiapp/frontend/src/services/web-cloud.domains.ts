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

export interface DnsServerInput {
  host: string;
  ip?: string;
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

export interface RedirectionCreate {
  subDomain: string;
  target: string;
  type: 'visible' | 'visiblePermanent' | 'invisible';
  title?: string;
  keywords?: string;
  description?: string;
}

export interface GlueRecord {
  host: string;
  ips: string[];
}

export interface GlueRecordCreate {
  host: string;
  ips: string[];
}

export interface DynHostRecord {
  id: number;
  ip: string;
  subDomain: string;
  zone: string;
}

export interface DynHostRecordCreate {
  ip: string;
  subDomain: string;
}

export interface DynHostLogin {
  login: string;
  subDomain: string;
  zone: string;
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

  /** Met a jour les serveurs DNS d'un domaine. */
  async updateDnsServers(domain: string, nameServers: DnsServerInput[]): Promise<DomainTask> {
    return ovhApi.post<DomainTask>(`/domain/${domain}/nameServers/update`, { nameServers });
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

  /** Liste les redirections web d'une zone. */
  async listRedirections(zoneName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/domain/zone/${zoneName}/redirection`);
  }

  /** Recupere une redirection. */
  async getRedirection(zoneName: string, id: number): Promise<Redirection> {
    return ovhApi.get<Redirection>(`/domain/zone/${zoneName}/redirection/${id}`);
  }

  /** Cree une redirection web. */
  async createRedirection(zoneName: string, data: RedirectionCreate): Promise<Redirection> {
    return ovhApi.post<Redirection>(`/domain/zone/${zoneName}/redirection`, data);
  }

  /** Modifie une redirection web. */
  async updateRedirection(zoneName: string, id: number, data: { target?: string; title?: string; keywords?: string; description?: string }): Promise<void> {
    return ovhApi.put<void>(`/domain/zone/${zoneName}/redirection/${id}`, data);
  }

  /** Supprime une redirection web. */
  async deleteRedirection(zoneName: string, id: number): Promise<void> {
    return ovhApi.delete<void>(`/domain/zone/${zoneName}/redirection/${id}`);
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

  /** Cree un glue record. */
  async createGlueRecord(domain: string, data: GlueRecordCreate): Promise<void> {
    return ovhApi.post<void>(`/domain/${domain}/glueRecord`, data);
  }

  /** Modifie un glue record. */
  async updateGlueRecord(domain: string, host: string, ips: string[]): Promise<void> {
    return ovhApi.put<void>(`/domain/${domain}/glueRecord/${host}`, { ips });
  }

  /** Supprime un glue record. */
  async deleteGlueRecord(domain: string, host: string): Promise<void> {
    return ovhApi.delete<void>(`/domain/${domain}/glueRecord/${host}`);
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

  /** Cree un record DynHost. */
  async createDynHostRecord(zoneName: string, data: DynHostRecordCreate): Promise<DynHostRecord> {
    return ovhApi.post<DynHostRecord>(`/domain/zone/${zoneName}/dynHost/record`, data);
  }

  /** Modifie un record DynHost. */
  async updateDynHostRecord(zoneName: string, id: number, data: { ip?: string; subDomain?: string }): Promise<void> {
    return ovhApi.put<void>(`/domain/zone/${zoneName}/dynHost/record/${id}`, data);
  }

  /** Supprime un record DynHost. */
  async deleteDynHostRecord(zoneName: string, id: number): Promise<void> {
    return ovhApi.delete<void>(`/domain/zone/${zoneName}/dynHost/record/${id}`);
  }

  /** Liste les logins DynHost. */
  async listDynHostLogins(zoneName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/domain/zone/${zoneName}/dynHost/login`);
  }

  /** Recupere un login DynHost. */
  async getDynHostLogin(zoneName: string, login: string): Promise<DynHostLogin> {
    return ovhApi.get<DynHostLogin>(`/domain/zone/${zoneName}/dynHost/login/${login}`);
  }

  /** Cree un login DynHost. */
  async createDynHostLogin(zoneName: string, data: { loginSuffix: string; password: string; subDomain: string }): Promise<void> {
    return ovhApi.post<void>(`/domain/zone/${zoneName}/dynHost/login`, data);
  }

  /** Change le mot de passe d'un login DynHost. */
  async changeDynHostPassword(zoneName: string, login: string, password: string): Promise<void> {
    return ovhApi.post<void>(`/domain/zone/${zoneName}/dynHost/login/${login}/changePassword`, { password });
  }

  /** Supprime un login DynHost. */
  async deleteDynHostLogin(zoneName: string, login: string): Promise<void> {
    return ovhApi.delete<void>(`/domain/zone/${zoneName}/dynHost/login/${login}`);
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

  /** Accelere une tache. */
  async accelerateTask(domain: string, id: number): Promise<void> {
    return ovhApi.post<void>(`/domain/${domain}/task/${id}/accelerate`, {});
  }

  /** Annule une tache. */
  async cancelTask(domain: string, id: number): Promise<void> {
    return ovhApi.post<void>(`/domain/${domain}/task/${id}/cancel`, {});
  }

  /** Relance une tache. */
  async relaunchTask(domain: string, id: number): Promise<void> {
    return ovhApi.post<void>(`/domain/${domain}/task/${id}/relaunch`, {});
  }
}

export const domainsService = new DomainsService();
