// ============================================================
// EMAIL-DOMAIN TYPES - Types partagés au niveau NAV2
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

export interface EmailTask {
  id: number;
  action: string;
  date: string;
  domain: string;
  status: 'cancelled' | 'doing' | 'done' | 'error' | 'todo';
}
