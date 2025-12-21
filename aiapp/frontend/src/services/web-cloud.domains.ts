// ============================================================
// SERVICE: Domains API - Gestion des noms de domaine
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "./api";

// ============ TYPES ============

export interface Domain {
  domain: string;
  nameServerType: "hosted" | "external";
  transferLockStatus: "locked" | "unlocked" | "locking" | "unlocking";
  offer?: string;
  owoSupported: boolean;
  whoisOwner?: string;
  dnssecSupported?: boolean;
}

export interface DomainServiceInfos {
  domain: string;
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    manualPayment: boolean;
    period: number;
  };
}

export interface DomainContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organisationName?: string;
  address?: { line1: string; city: string; zip: string; country: string };
}

// DNS Servers
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

// Redirections
export interface Redirection {
  id: number;
  subDomain: string;
  target: string;
  type: "visible" | "visiblePermanent" | "invisible";
  title?: string;
  keywords?: string;
  description?: string;
}

export interface RedirectionCreate {
  subDomain: string;
  target: string;
  type: "visible" | "visiblePermanent" | "invisible";
  title?: string;
  keywords?: string;
  description?: string;
}

// DynHost
export interface DynHostRecord {
  id: number;
  subDomain: string;
  ip: string;
  zone: string;
}

export interface DynHostLogin {
  login: string;
  subDomain: string;
  zone: string;
}

// Glue Records
export interface GlueRecord {
  host: string;
  ips: string[];
}

// ============ SERVICE ============

class DomainsService {
  // -------- DOMAIN BASIC --------
  async listDomains(): Promise<string[]> {
    return ovhGet<string[]>("/domain");
  }

  async getDomain(domain: string): Promise<Domain> {
    return ovhGet<Domain>(`/domain/${domain}`);
  }

  async getServiceInfos(domain: string): Promise<DomainServiceInfos> {
    return ovhGet<DomainServiceInfos>(`/domain/${domain}/serviceInfos`);
  }

  async lockDomain(domain: string): Promise<void> {
    await ovhPut(`/domain/${domain}`, { transferLockStatus: "locked" });
  }

  async unlockDomain(domain: string): Promise<void> {
    await ovhPut(`/domain/${domain}`, { transferLockStatus: "unlocked" });
  }

  async getAuthInfo(domain: string): Promise<string> {
    const response = await ovhPost<{ authInfo: string }>(`/domain/${domain}/authInfo`, {});
    return response.authInfo;
  }

  async hasEmailDomain(domain: string): Promise<boolean> {
    try {
      await ovhGet(`/email/domain/${domain}`);
      return true;
    } catch {
      return false;
    }
  }

  async getContact(nichandle: string): Promise<DomainContact> {
    return ovhGet<DomainContact>(`/me/contact/${nichandle}`);
  }

  // -------- DNS SERVERS --------
  async listDnsServers(domain: string): Promise<number[]> {
    return ovhGet<number[]>(`/domain/${domain}/nameServer`);
  }

  async getDnsServer(domain: string, id: number): Promise<DnsServer> {
    return ovhGet<DnsServer>(`/domain/${domain}/nameServer/${id}`);
  }

  async updateDnsServers(domain: string, servers: DnsServerInput[]): Promise<void> {
    await ovhPost(`/domain/${domain}/nameServers/update`, { nameServers: servers });
  }

  // -------- REDIRECTIONS --------
  async listRedirections(domain: string): Promise<number[]> {
    return ovhGet<number[]>(`/domain/${domain}/redirection`);
  }

  async getRedirection(domain: string, id: number): Promise<Redirection> {
    return ovhGet<Redirection>(`/domain/${domain}/redirection/${id}`);
  }

  async createRedirection(domain: string, data: RedirectionCreate): Promise<Redirection> {
    return ovhPost<Redirection>(`/domain/${domain}/redirection`, data);
  }

  async updateRedirection(domain: string, id: number, data: Partial<RedirectionCreate>): Promise<void> {
    await ovhPut(`/domain/${domain}/redirection/${id}`, data);
  }

  async deleteRedirection(domain: string, id: number): Promise<void> {
    await ovhDelete(`/domain/${domain}/redirection/${id}`);
  }

  // -------- DYNHOST RECORDS --------
  async listDynHostRecords(zone: string): Promise<number[]> {
    return ovhGet<number[]>(`/domain/zone/${zone}/dynHost/record`);
  }

  async getDynHostRecord(zone: string, id: number): Promise<DynHostRecord> {
    return ovhGet<DynHostRecord>(`/domain/zone/${zone}/dynHost/record/${id}`);
  }

  async createDynHostRecord(zone: string, data: { subDomain: string; ip: string }): Promise<DynHostRecord> {
    return ovhPost<DynHostRecord>(`/domain/zone/${zone}/dynHost/record`, data);
  }

  async updateDynHostRecord(zone: string, id: number, data: { ip: string; subDomain?: string }): Promise<void> {
    await ovhPut(`/domain/zone/${zone}/dynHost/record/${id}`, data);
  }

  async deleteDynHostRecord(zone: string, id: number): Promise<void> {
    await ovhDelete(`/domain/zone/${zone}/dynHost/record/${id}`);
  }

  // -------- DYNHOST LOGINS --------
  async listDynHostLogins(zone: string): Promise<string[]> {
    return ovhGet<string[]>(`/domain/zone/${zone}/dynHost/login`);
  }

  async getDynHostLogin(zone: string, login: string): Promise<DynHostLogin> {
    return ovhGet<DynHostLogin>(`/domain/zone/${zone}/dynHost/login/${login}`);
  }

  async createDynHostLogin(zone: string, data: { loginSuffix: string; password: string; subDomain: string }): Promise<void> {
    await ovhPost(`/domain/zone/${zone}/dynHost/login`, data);
  }

  async updateDynHostLogin(zone: string, login: string, data: { password?: string; subDomain?: string }): Promise<void> {
    await ovhPut(`/domain/zone/${zone}/dynHost/login/${login}`, data);
  }

  async deleteDynHostLogin(zone: string, login: string): Promise<void> {
    await ovhDelete(`/domain/zone/${zone}/dynHost/login/${login}`);
  }

  // -------- GLUE RECORDS --------
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
    await ovhPut(`/domain/${domain}/glueRecord/${host}`, { ips });
  }

  async deleteGlueRecord(domain: string, host: string): Promise<void> {
    await ovhDelete(`/domain/${domain}/glueRecord/${host}`);
  }
}

export const domainsService = new DomainsService();
