// ============================================================
// TYPES UNIFIÉS - Emails (Vision unifiée multi-offres)
// ============================================================

// ---------- OFFRES ----------

export type EmailOffer = "exchange" | "email-pro" | "zimbra" | "mx-plan";

export interface OfferConfig {
  id: EmailOffer;
  label: string;
  color: string;
  icon: string;
  quota: number;
  features: string[];
}

// ---------- DOMAINE ----------

export interface EmailDomain {
  name: string;
  accounts: EmailAccountSummary[];
  totalAccounts: number;
  totalQuotaUsed: number;
  offers: EmailOffer[];
}

export interface EmailAccountSummary {
  email: string;
  offer: EmailOffer;
  licenseId?: string;
  packName?: string;
}

// ---------- COMPTE EMAIL ----------

export interface EmailAccount {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  offer: EmailOffer;
  domain: string;
  quota: number;
  quotaUsed: number;
  aliases: string[];
  mfaEnabled?: boolean;
  delegations?: string[];
  status: "ok" | "suspended" | "pending" | "deleting";
  createdAt?: string;
  lastLogin?: string;
  licenseId?: string;
  packName?: string;
  serviceId: string;
}

// ---------- REDIRECTION ----------

export interface EmailRedirection {
  id: string;
  from: string;
  to: string;
  type: "local" | "external";
  keepCopy: boolean;
  createdAt: string;
  domain: string;
  /** @deprecated Use keepCopy instead */
  localCopy?: boolean;
}

// ---------- RÉPONDEUR ----------

export interface EmailResponder {
  id: string;
  email: string;
  content: string;
  startDate: string;
  endDate: string | null;
  active: boolean;
  createdAt: string;
  domain: string;
  /** @deprecated Use startDate instead */
  from?: string;
  /** @deprecated Use endDate instead */
  to?: string;
  /** @deprecated Use active instead */
  enabled?: boolean;
}

// ---------- LISTE / GROUPE ----------

export interface EmailList {
  id: string;
  name: string;
  email: string;
  type: "mailinglist" | "distribution-group";
  membersCount: number;
  moderationType: "open" | "moderated" | "closed";
  createdAt: string;
  moderatorsCount?: number;
  domain: string;
  offer: EmailOffer;
}

// ---------- LICENCE / PACK ----------

export interface EmailLicense {
  id: string;
  offer: EmailOffer;
  type: "pack" | "alacarte" | "included";
  name: string;
  scope: "multi-domain" | "single-domain";
  scopeDomain?: string;
  totalLicenses: number;
  usedLicenses: number;
  pricePerMonth: number;
  accounts: string[];
  serviceId: string;
}

export interface LicenseHistory {
  id: string;
  date: string;
  action: "purchase" | "upgrade" | "downgrade" | "cancel" | "renew";
  license: string;
  amount: number;
  invoiceId?: string;
}

// ---------- SÉCURITÉ ----------

export interface DnsRecord {
  type: "MX" | "SPF" | "DKIM" | "DMARC" | "SRV" | "CNAME";
  name: string;
  value: string;
  status: "ok" | "warning" | "error" | "missing";
  expected?: string;
}

export interface AntispamRule {
  id: string;
  type: "whitelist" | "blacklist" | "header" | "content";
  value: string;
  action: "allow" | "block" | "quarantine";
}

export interface EmailSignature {
  id: string;
  name: string;
  content: string;
  html: boolean;
  appliedTo: string[];
}

// ---------- AVANCÉ (EXCHANGE) ----------

export interface ExchangeResource {
  id: string;
  email: string;
  displayName: string;
  type: "room" | "equipment";
  capacity?: number;
  location?: string;
}

export interface ExchangeExternalContact {
  id: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  company?: string;
}

export interface ExchangeAuditLog {
  id: string;
  date: string;
  user: string;
  action: string;
  target?: string;
  ip?: string;
  userAgent?: string;
}

export interface ExchangeDevice {
  id: string;
  deviceId: string;
  deviceType: string;
  deviceModel?: string;
  user: string;
  lastSync: string;
  status: "allowed" | "blocked" | "quarantine";
}

// ---------- TÂCHE ----------

export interface EmailTask {
  id: number;
  function: string;
  status: "todo" | "doing" | "done" | "error";
  domain?: string;
  account?: string;
  todoDate?: string;
  doneDate?: string;
  lastUpdate?: string;
}

// ---------- VUE TOGGLE ----------

export type ViewMode = "domain" | "license";

// ---------- ÉTAT PAGE ----------

export interface EmailsPageState {
  viewMode: ViewMode;
  selectedDomain?: string;
  selectedLicense?: string;
  activeTab: EmailTab;
  activeSubTab?: string;
}

export type EmailTab =
  | "accounts"
  | "redirections"
  | "responders"
  | "lists"
  | "security"
  | "advanced"
  | "licenses"
  | "tasks";
