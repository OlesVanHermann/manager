// ============================================================
// ZIMBRA TYPES - Types partagés au niveau NAV2
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
