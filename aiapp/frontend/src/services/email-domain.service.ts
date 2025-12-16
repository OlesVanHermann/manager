// ============================================================
// SERVICE EMAIL DOMAIN - MX Plan OVHcloud
// ============================================================

import { ovhApi } from './api.service';

// ============================================================
// TYPES
// ============================================================

export interface EmailDomain {
  domain: string;
  allowedAccountSize: number[];
  creationDate: string;
  filerz: number;
  status: 'ok' | 'suspended';
  migratedMXPlanServiceName: string | null;
}

export interface EmailDomainServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
}

export interface EmailAccount {
  accountName: string;
  email: string;
  description: string;
  size: number;
  quota: number;
  isBlocked: boolean;
  domain: string;
}

export interface EmailRedirection {
  id: string;
  from: string;
  to: string;
  localCopy: boolean;
}

export interface EmailMailingList {
  id: number;
  name: string;
  nbSubscribers: number;
  nbSubscribersUpdateDate: string;
  language: string;
  options: { moderatorMessage: boolean; subscribeByEmail: boolean; usersPostOnly: boolean };
}

export interface EmailFilter {
  name: string;
  domain: string;
  action: 'accept' | 'redirect' | 'delete';
  actionParam: string;
  active: boolean;
  header: string;
  operand: string;
  value: string;
  priority: number;
  pop: string;
}

export interface EmailTask {
  id: number;
  action: string;
  date: string;
  domain: string;
  status: 'cancelled' | 'doing' | 'done' | 'error' | 'todo';
}

// ============================================================
// SERVICE
// ============================================================

class EmailDomainService {
  async listDomains(): Promise<string[]> {
    return ovhApi.get<string[]>('/email/domain');
  }

  async getDomain(domain: string): Promise<EmailDomain> {
    return ovhApi.get<EmailDomain>(`/email/domain/${domain}`);
  }

  async getServiceInfos(domain: string): Promise<EmailDomainServiceInfos> {
    return ovhApi.get<EmailDomainServiceInfos>(`/email/domain/${domain}/serviceInfos`);
  }

  // ---------- Accounts ----------
  async listAccounts(domain: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/email/domain/${domain}/account`);
  }

  async getAccount(domain: string, accountName: string): Promise<EmailAccount> {
    return ovhApi.get<EmailAccount>(`/email/domain/${domain}/account/${accountName}`);
  }

  async createAccount(domain: string, accountName: string, password: string, size?: number): Promise<void> {
    return ovhApi.post<void>(`/email/domain/${domain}/account`, { accountName, password, size });
  }

  async deleteAccount(domain: string, accountName: string): Promise<void> {
    return ovhApi.delete<void>(`/email/domain/${domain}/account/${accountName}`);
  }

  async changePassword(domain: string, accountName: string, password: string): Promise<void> {
    return ovhApi.post<void>(`/email/domain/${domain}/account/${accountName}/changePassword`, { password });
  }

  // ---------- Redirections ----------
  async listRedirections(domain: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/email/domain/${domain}/redirection`);
  }

  async getRedirection(domain: string, id: string): Promise<EmailRedirection> {
    return ovhApi.get<EmailRedirection>(`/email/domain/${domain}/redirection/${id}`);
  }

  async createRedirection(domain: string, from: string, to: string, localCopy: boolean): Promise<void> {
    return ovhApi.post<void>(`/email/domain/${domain}/redirection`, { from, to, localCopy });
  }

  async deleteRedirection(domain: string, id: string): Promise<void> {
    return ovhApi.delete<void>(`/email/domain/${domain}/redirection/${id}`);
  }

  // ---------- Mailing Lists ----------
  async listMailingLists(domain: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/email/domain/${domain}/mailingList`);
  }

  async getMailingList(domain: string, name: string): Promise<EmailMailingList> {
    return ovhApi.get<EmailMailingList>(`/email/domain/${domain}/mailingList/${name}`);
  }

  // ---------- Filters ----------
  async listFilters(domain: string, accountName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/email/domain/${domain}/account/${accountName}/filter`);
  }

  async getFilter(domain: string, accountName: string, name: string): Promise<EmailFilter> {
    return ovhApi.get<EmailFilter>(`/email/domain/${domain}/account/${accountName}/filter/${name}`);
  }

  // ---------- Tasks ----------
  async listTasks(domain: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/email/domain/${domain}/task`);
  }

  async getTask(domain: string, id: number): Promise<EmailTask> {
    return ovhApi.get<EmailTask>(`/email/domain/${domain}/task/${id}`);
  }
}

export const emailDomainService = new EmailDomainService();
