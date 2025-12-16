// ============================================================
// SERVICE EXCHANGE - Microsoft Exchange OVHcloud
// ============================================================

import { ovhApi } from './api.service';

// ============================================================
// TYPES
// ============================================================

export interface ExchangeService {
  domain: string;
  hostname: string;
  maxReceiveSize: number;
  maxSendSize: number;
  offer: 'dedicated' | 'dedicatedCluster' | 'hosted' | 'provider';
  spamAndVirusConfiguration: { checkDKIM: boolean; checkSPF: boolean };
  sslExpirationDate: string | null;
  state: 'creating' | 'deleting' | 'inMaintenance' | 'ok' | 'reopening' | 'suspended' | 'suspending';
  taskPendingId: number | null;
  webUrl: string;
}

export interface ExchangeServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}

export interface ExchangeAccount {
  SAMAccountName: string;
  configured: boolean;
  creationDate: string;
  currentUsage: number;
  displayName: string;
  domain: string;
  expirationDate: string | null;
  firstName: string;
  guid: string;
  hiddenFromGAL: boolean;
  id: number;
  initial: string;
  lastLogoffDate: string | null;
  lastLogonDate: string | null;
  lastName: string;
  litigation: boolean;
  litigationPeriod: number | null;
  login: string;
  mailingFilter: string[];
  numberOfAliases: number;
  outlookLicense: boolean;
  owaLimited: boolean;
  passwordLastUpdate: string | null;
  primaryEmailAddress: string;
  quota: number;
  spamAndVirusConfiguration: { checkDKIM: boolean; checkSPF: boolean };
  spamDetected: boolean;
  spamTicketNumber: number | null;
  state: 'creating' | 'deleting' | 'ok' | 'suspended';
  taskPendingId: number | null;
}

export interface ExchangeSharedAccount {
  creationDate: string;
  currentUsage: number;
  displayName: string;
  firstName: string;
  hiddenFromGAL: boolean;
  id: number;
  lastName: string;
  mailingFilter: string[];
  primaryEmailAddress: string;
  quota: number;
  state: 'creating' | 'deleting' | 'ok' | 'suspended';
  taskPendingId: number | null;
}

export interface ExchangeGroup {
  creationDate: string;
  currentUsage: number;
  displayName: string;
  hiddenFromGAL: boolean;
  id: number;
  joinRestriction: 'approvalRequired' | 'closed' | 'open';
  lastUpdateDate: string | null;
  leftRestriction: 'closed' | 'open';
  mailingListAddress: string;
  managedByAccount: string[];
  managersByAccount: string[];
  members: string[];
  senderAuthentification: boolean;
  spamAndVirusConfiguration: { checkDKIM: boolean; checkSPF: boolean };
  state: 'creating' | 'deleting' | 'ok' | 'suspended';
  taskPendingId: number | null;
}

export interface ExchangeResource {
  addOrganizerToSubject: boolean;
  allowConflict: boolean;
  bookingWindow: number;
  capacity: number;
  creationDate: string;
  deleteComments: boolean;
  deleteSubject: boolean;
  displayName: string;
  location: string;
  maximumDuration: number;
  resourceEmailAddress: string;
  showMeetingDetails: 'availabilityOnly' | 'limited' | 'full';
  state: 'creating' | 'deleting' | 'ok' | 'suspended';
  taskPendingId: number | null;
  type: 'equipment' | 'room';
}

export interface ExchangeDomain {
  cnameToCheck: string | null;
  domainAliases: string[];
  domainValidated: boolean;
  isAliasDomain: boolean;
  main: boolean;
  mxIsValid: boolean;
  mxRecord: string[];
  mxRelay: string | null;
  name: string;
  organization2010: string | null;
  srvIsValid: boolean;
  srvRecord: string[];
  state: 'creating' | 'deleting' | 'ok' | 'suspended';
  taskPendingId: number | null;
  type: 'authoritative' | 'nonAuthoritative';
}

export interface ExchangeTask {
  id: number;
  function: string;
  status: 'cancelled' | 'doing' | 'done' | 'error' | 'todo';
  todoDate: string;
  finishDate: string | null;
}

// ============================================================
// SERVICE
// ============================================================

class ExchangeService {
  async listServices(): Promise<string[]> {
    return ovhApi.get<string[]>('/email/exchange');
  }

  async getService(organizationName: string, exchangeService: string): Promise<ExchangeService> {
    return ovhApi.get<ExchangeService>(`/email/exchange/${organizationName}/service/${exchangeService}`);
  }

  async getServiceInfos(organizationName: string, exchangeService: string): Promise<ExchangeServiceInfos> {
    return ovhApi.get<ExchangeServiceInfos>(`/email/exchange/${organizationName}/service/${exchangeService}/serviceInfos`);
  }

  // ---------- Accounts ----------
  async listAccounts(organizationName: string, exchangeService: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/email/exchange/${organizationName}/service/${exchangeService}/account`);
  }

  async getAccount(organizationName: string, exchangeService: string, email: string): Promise<ExchangeAccount> {
    return ovhApi.get<ExchangeAccount>(`/email/exchange/${organizationName}/service/${exchangeService}/account/${email}`);
  }

  // ---------- Shared Accounts ----------
  async listSharedAccounts(organizationName: string, exchangeService: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/email/exchange/${organizationName}/service/${exchangeService}/sharedAccount`);
  }

  async getSharedAccount(organizationName: string, exchangeService: string, email: string): Promise<ExchangeSharedAccount> {
    return ovhApi.get<ExchangeSharedAccount>(`/email/exchange/${organizationName}/service/${exchangeService}/sharedAccount/${email}`);
  }

  // ---------- Groups ----------
  async listGroups(organizationName: string, exchangeService: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/email/exchange/${organizationName}/service/${exchangeService}/mailingList`);
  }

  async getGroup(organizationName: string, exchangeService: string, mailingListAddress: string): Promise<ExchangeGroup> {
    return ovhApi.get<ExchangeGroup>(`/email/exchange/${organizationName}/service/${exchangeService}/mailingList/${mailingListAddress}`);
  }

  // ---------- Resources ----------
  async listResources(organizationName: string, exchangeService: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/email/exchange/${organizationName}/service/${exchangeService}/resourceAccount`);
  }

  async getResource(organizationName: string, exchangeService: string, email: string): Promise<ExchangeResource> {
    return ovhApi.get<ExchangeResource>(`/email/exchange/${organizationName}/service/${exchangeService}/resourceAccount/${email}`);
  }

  // ---------- Domains ----------
  async listDomains(organizationName: string, exchangeService: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/email/exchange/${organizationName}/service/${exchangeService}/domain`);
  }

  async getDomain(organizationName: string, exchangeService: string, domainName: string): Promise<ExchangeDomain> {
    return ovhApi.get<ExchangeDomain>(`/email/exchange/${organizationName}/service/${exchangeService}/domain/${domainName}`);
  }

  // ---------- Tasks ----------
  async listTasks(organizationName: string, exchangeService: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/email/exchange/${organizationName}/service/${exchangeService}/task`);
  }

  async getTask(organizationName: string, exchangeService: string, id: number): Promise<ExchangeTask> {
    return ovhApi.get<ExchangeTask>(`/email/exchange/${organizationName}/service/${exchangeService}/task/${id}`);
  }
}

export const exchangeService = new ExchangeService();
