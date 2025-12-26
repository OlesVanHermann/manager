// ============================================================
// ACCOUNT TYPES - Types partagés entre les tabs account
// SEUL fichier partagé autorisé au niveau NAV2
// Types AUTONOMES - Pas d'import externe
// ============================================================

// ============ CREDENTIALS (internalisé) ============

export interface OvhCredentials {
  nichandle: string;
  password: string;
}

export interface OvhUser {
  nichandle: string;
  email: string;
  firstname: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
  country: string;
  language: string;
  currency?: { code: string; symbol: string };
  legalform?: "individual" | "corporation" | "association" | "other";
  ovhSubsidiary?: string;
  ovhCompany?: string;
  state?: "complete" | "incomplete";
  customerCode?: string;
  supportLevel?: { level: string };
}

// ============ TAB PROPS ============

export interface TabProps {
  credentials: OvhCredentials;
  user?: OvhUser | null;
}

// ============ USER / ME ============

export interface UserInfo {
  nichandle: string;
  email: string;
  firstname: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
  country: string;
  language: string;
  currency: { code: string; symbol: string };
  legalform: "individual" | "corporation" | "association" | "other";
  companyNationalIdentificationNumber?: string;
  vat?: string;
  ovhSubsidiary: string;
  ovhCompany: string;
  state: "complete" | "incomplete";
  customerCode?: string;
  birthDay?: string;
  birthCity?: string;
  nationalIdentificationNumber?: string;
  spareEmail?: string;
  phoneCountry?: string;
  area?: string;
  corporationType?: string;
  organisation?: string;
}

// ============ CONTACTS ============

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    zip: string;
    country: string;
  };
  language: string;
  legalForm: "individual" | "corporation" | "association" | "other";
  organisationName?: string;
  organisationType?: string;
}

export interface ContactChange {
  id: number;
  contactId: number;
  type: "owner" | "admin" | "tech" | "billing";
  status: "todo" | "doing" | "done" | "refused" | "aborted";
  askingAccount: string;
  creationDate: string;
  lastUpdate: string;
}

export interface ServiceContact {
  serviceName: string;
  serviceType: string;
  admin: Contact;
  tech: Contact;
  billing: Contact;
}

// ============ KYC ============

export type KycStatus = "ok" | "required" | "pending" | "refused";

export interface KycDocument {
  id: string;
  type: "identity" | "company" | "address" | "other";
  status: KycStatus;
  creationDate: string;
  expirationDate?: string;
  refusedReason?: string;
}

export interface KycProcedure {
  id: string;
  status: KycStatus;
  creationDate: string;
  documents: KycDocument[];
  finalizationDate?: string;
}

// ============ PRIVACY / GDPR ============

export interface GdprRequest {
  id: number;
  type: "access" | "rectification" | "erasure" | "portability";
  status: "pending" | "processing" | "done" | "refused";
  creationDate: string;
  lastUpdate: string;
  downloadUrl?: string;
}

export interface ConsentHistory {
  id: string;
  type: string;
  campaign?: string;
  value: boolean;
  date: string;
}

// ============ ADVANCED ============

export interface SshKey {
  keyName: string;
  key: string;
  default: boolean;
}

export interface ApiCredential {
  credentialId: number;
  applicationId: number;
  creation: string;
  expiration?: string;
  lastUse?: string;
  status: "validated" | "pendingValidation" | "expired" | "refused";
  rules: Array<{ method: string; path: string }>;
}

export interface ApiApplication {
  applicationId: number;
  applicationKey: string;
  name: string;
  description: string;
  status: "active" | "blocked";
}

// ============ SECURITY ============

export interface SecurityInfo {
  lastPasswordChangeDate?: string;
  lastLoginDate?: string;
  permanentCookies: boolean;
}

export interface TotpStatus {
  isTotpEnabled: boolean;
  backupCodesGenerated?: boolean;
  lastModificationDate?: string;
}

export interface U2fKey {
  id: string;
  label: string;
  creationDate: string;
  lastUseDate?: string;
}

export interface IpRestriction {
  id: number;
  ip: string;
  rule: "accept" | "deny";
  warning: boolean;
}

export interface SessionInfo {
  sessionId: string;
  creationDate: string;
  lastActivity: string;
  userAgent: string;
  ip: string;
  current: boolean;
}
