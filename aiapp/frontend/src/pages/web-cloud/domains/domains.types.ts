// ============================================================
// TYPES PARTAGÉS - Domains (SEUL fichier partagé autorisé)
// ============================================================

// ============ DOMAIN TYPES ============

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

// ============ DNS SERVER TYPES ============

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

// ============ REDIRECTION TYPES ============

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

// ============ DYNHOST TYPES ============

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

// ============ GLUE TYPES ============

export interface GlueRecord {
  host: string;
  ips: string[];
}

// ============ DS RECORD TYPES ============

export interface DsRecord {
  id: number;
  algorithm: number;
  flags: number;
  publicKey: string;
  tag: number;
  status: string;
}

export interface DsRecordCreate {
  algorithm: number;
  flags: number;
  publicKey: string;
  tag: number;
}

// ============ DNS ZONE TYPES ============

export interface DnsZone {
  name: string;
  hasDnsAnycast: boolean;
  dnssecSupported: boolean;
  lastUpdate: string;
  nameServers: string[];
}

export interface DnsRecord {
  id: number;
  fieldType: string;
  subDomain: string;
  target: string;
  ttl: number;
  zone: string;
}

export interface DnsRecordCreate {
  fieldType: string;
  subDomain: string;
  target: string;
  ttl?: number;
}

export interface DnssecStatus {
  status: "enabled" | "disabled" | "enableInProgress" | "disableInProgress";
}

// ============ TASK TYPES ============

export interface DomainTask {
  id: number;
  function: string;
  status: "cancelled" | "doing" | "done" | "error" | "init" | "todo";
  comment?: string;
  creationDate?: string;
  doneDate?: string;
  lastUpdate?: string;
}

export interface ZoneTask {
  id: number;
  function: string;
  status: string;
  comment?: string;
  creationDate?: string;
  lastUpdate?: string;
}

// ============================================================
// ALLDOM TYPES
// ============================================================

export type AllDomType = "FRENCH" | "FRENCH+INTERNATIONAL" | "INTERNATIONAL";
export type RenewMode = "automatic" | "manual";
export type RegistrationStatus = "REGISTERED" | "UNREGISTERED";

export interface AllDomDomain {
  name: string;
  registrationStatus: RegistrationStatus;
  expiresAt?: string;
  extension?: string;
}

export interface AllDomPack {
  name: string;
  type: AllDomType;
  domains: AllDomDomain[];
  extensions: string[];
}

export interface AllDomServiceInfo {
  serviceId: number;
  serviceName: string;
  creation: string;
  expiration: string;
  renewMode: RenewMode | null;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  isTerminating: boolean;
}

export interface AllDomEntry {
  serviceName: string;
  pack: AllDomPack;
  serviceInfo: AllDomServiceInfo | null;
}
