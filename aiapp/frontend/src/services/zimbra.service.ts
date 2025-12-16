// ============================================================
// SERVICE ZIMBRA - Email collaboratif OVHcloud
// ============================================================

import { ovhApi } from './api.service';

// ============================================================
// TYPES
// ============================================================

export interface ZimbraService {
  id: string;
  offer: string;
  status: 'creating' | 'deleting' | 'ok' | 'suspended';
  lastUpdate: string;
  numberOfDomains: number;
  numberOfAccounts: number;
  webmailUrl: string;
}

export interface ZimbraServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}

export interface ZimbraAccount {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  offer: string;
  quota: { used: number; available: number };
  status: 'creating' | 'deleting' | 'ok' | 'suspended';
  lastLogonDate: string | null;
  createdAt: string;
}

export interface ZimbraDomain {
  id: string;
  name: string;
  status: 'creating' | 'deleting' | 'ok' | 'suspended';
  cnameToCheck: string | null;
  mxRecords: string[];
  type: 'authoritative' | 'nonAuthoritative';
}

export interface ZimbraAlias {
  id: string;
  alias: string;
  targetAccountId: string;
  status: 'creating' | 'deleting' | 'ok';
}

export interface ZimbraTask {
  id: string;
  type: string;
  status: 'cancelled' | 'doing' | 'done' | 'error' | 'todo';
  createdAt: string;
  finishedAt: string | null;
  message: string | null;
}

// ============================================================
// SERVICE
// ============================================================

class ZimbraService {
  async listServices(): Promise<string[]> {
    return ovhApi.get<string[]>('/email/zimbra');
  }

  async getService(serviceId: string): Promise<ZimbraService> {
    return ovhApi.get<ZimbraService>(`/email/zimbra/${serviceId}`);
  }

  async getServiceInfos(serviceId: string): Promise<ZimbraServiceInfos> {
    return ovhApi.get<ZimbraServiceInfos>(`/email/zimbra/${serviceId}/serviceInfos`);
  }

  // ---------- Accounts ----------
  async listAccounts(serviceId: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/email/zimbra/${serviceId}/account`);
  }

  async getAccount(serviceId: string, accountId: string): Promise<ZimbraAccount> {
    return ovhApi.get<ZimbraAccount>(`/email/zimbra/${serviceId}/account/${accountId}`);
  }

  // ---------- Domains ----------
  async listDomains(serviceId: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/email/zimbra/${serviceId}/domain`);
  }

  async getDomain(serviceId: string, domainId: string): Promise<ZimbraDomain> {
    return ovhApi.get<ZimbraDomain>(`/email/zimbra/${serviceId}/domain/${domainId}`);
  }

  // ---------- Aliases ----------
  async listAliases(serviceId: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/email/zimbra/${serviceId}/alias`);
  }

  async getAlias(serviceId: string, aliasId: string): Promise<ZimbraAlias> {
    return ovhApi.get<ZimbraAlias>(`/email/zimbra/${serviceId}/alias/${aliasId}`);
  }

  // ---------- Tasks ----------
  async listTasks(serviceId: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/email/zimbra/${serviceId}/task`);
  }

  async getTask(serviceId: string, taskId: string): Promise<ZimbraTask> {
    return ovhApi.get<ZimbraTask>(`/email/zimbra/${serviceId}/task/${taskId}`);
  }
}

export const zimbraService = new ZimbraService();
