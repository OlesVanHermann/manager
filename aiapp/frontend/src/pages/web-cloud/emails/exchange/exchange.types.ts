// ============================================================
// EXCHANGE TYPES - Types partagés au niveau NAV2
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
  memberCount?: number;
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
