// ============================================================
// EMAIL-PRO TYPES - Types partagés au niveau NAV2
// ============================================================

export interface EmailProService {
  domain: string;
  hostname: string;
  maxReceiveSize: number;
  maxSendSize: number;
  offer: string;
  spamAndVirusConfiguration: { checkDKIM: boolean; checkSPF: boolean };
  state: 'creating' | 'deleting' | 'inMaintenance' | 'ok' | 'reopening' | 'suspended' | 'suspending';
  taskPendingId: number | null;
  webUrl: string;
}

export interface EmailProServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}

export interface EmailProAccount {
  SAMAccountName: string | null;
  configured: boolean;
  creationDate: string;
  currentUsage: number | null;
  displayName: string;
  domain: string;
  expirationDate: string | null;
  expirationOutlookDate: string | null;
  firstName: string;
  id: number;
  initial: string;
  lastName: string;
  lastLogoffDate: string | null;
  lastLogonDate: string | null;
  login: string;
  passwordLastUpdate: string | null;
  primaryEmailAddress: string;
  quota: number;
  spamAndVirusConfiguration: { checkDKIM: boolean; checkSPF: boolean };
  spamDetected: boolean;
  spamTicketNumber: number | null;
  state: 'creating' | 'deleting' | 'ok' | 'suspended';
  taskPendingId: number | null;
}

export interface EmailProDomain {
  cnameToCheck: string | null;
  domainAliases: string[];
  domainValidated: boolean;
  isAliasDomain: boolean;
  mxIsValid: boolean;
  mxRecord: string[];
  mxRelay: string | null;
  name: string;
  srvIsValid: boolean;
  srvRecord: string[];
  state: 'creating' | 'deleting' | 'ok' | 'suspended';
  taskPendingId: number | null;
  type: 'authoritative' | 'nonAuthoritative';
}

export interface EmailProTask {
  id: number;
  function: string;
  status: 'cancelled' | 'doing' | 'done' | 'error' | 'todo';
  todoDate: string;
  finishDate: string | null;
}
