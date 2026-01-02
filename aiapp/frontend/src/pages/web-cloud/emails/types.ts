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

// ---------- SERVICE / PACK ----------

/** Type de service email */
export type EmailServiceType = "exchange" | "emailpro" | "mxplan" | "zimbra";

/** État d'un service */
export type ServiceState = "active" | "suspended" | "expired" | "inCreation";

/** Résumé d'un service email pour affichage */
export interface EmailServiceDisplay {
  id: string;
  name: string;
  displayName: string;
  type: EmailServiceType;
  offer: EmailOffer;
  offerDetail?: string;
  organization?: string;
  domain: string;
  state: ServiceState;
  accountsCount: number;
  totalAccounts?: number;
  renewalDate?: string;
}

// ---------- LICENCE / PACK ----------

/** Type de licence (Exchange) */
export type LicenseType = "basic" | "standard" | "enterprise";

/** Période de renouvellement */
export type RenewPeriod = "MONTHLY" | "YEARLY" | "DELETE_AT_EXPIRATION";

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

/** Informations de facturation d'un compte */
export interface AccountBillingInfo {
  email: string;
  displayName?: string;
  license: LicenseType;
  renewPeriod: RenewPeriod;
  deleteAtExpiration: boolean;
  expirationDate?: string;
  quota: number;
  usedQuota: number;
  state: "ok" | "suspended" | "deleting";
}

/** Historique local des licences (pour affichage) */
export interface LicenseHistoryEntry {
  id: string;
  date: string;
  action: "purchase" | "upgrade" | "downgrade" | "cancel" | "renew";
  license: string;
  amount: number;
  invoiceId?: string;
}

// ---------- COMMANDES ----------

/** Statut d'une commande */
export type OrderStatus = "notPaid" | "unpaid" | "paid" | "cancelled" | "refunded" | "expired";

/** Type d'événement historique */
export type HistoryEventType = "purchase" | "upgrade" | "downgrade" | "renewal" | "cancellation" | "migration" | "other";

/** Événement dans l'historique */
export interface HistoryEvent {
  id: string;
  type: HistoryEventType;
  description: string;
  offer?: EmailOffer;
  domain?: string;
  amount?: number;
  currency?: string;
  date: string;
  orderId?: number;
  status?: OrderStatus;
  pdfUrl?: string;
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

// ---------- NAV3 (LEFT PANEL) ----------

export type Nav3Mode = "general" | "packs";

// ---------- VUE TOGGLE (LEGACY - kept for compatibility) ----------

export type ViewMode = "domain" | "license";

// ---------- TABS NAV4 ----------

export type GeneralTab =
  | "accounts"
  | "redirections"
  | "responders"
  | "lists"
  | "security"
  | "advanced"
  | "tasks";

export type PacksTab = "packs" | "alacarte" | "history";

export type EmailTab = GeneralTab | PacksTab | "licenses";

// ---------- ÉTAT PAGE ----------

export interface EmailsPageState {
  nav3Mode: Nav3Mode;
  viewMode: ViewMode;
  selectedDomain?: string;
  selectedLicense?: string;
  activeTab: EmailTab;
  activeSubTab?: string;
}
