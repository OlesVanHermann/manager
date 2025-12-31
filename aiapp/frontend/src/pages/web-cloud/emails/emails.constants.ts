// ============================================================
// CONSTANTS - Emails (Configuration des offres et tabs)
// ============================================================

import { EmailOffer, OfferConfig, EmailTab, Nav3Mode, GeneralTab, PacksTab } from "./types";

// ---------- NAV3 CONFIGURATION ----------

export interface Nav3Config {
  id: Nav3Mode;
  labelKey: string;
  icon: string;
}

export const NAV3_CONFIG: Nav3Config[] = [
  { id: "general", labelKey: "nav3.general", icon: "📧" },
  { id: "packs", labelKey: "nav3.packs", icon: "📦" },
];

export const DEFAULT_NAV3_MODE: Nav3Mode = "general";

// ---------- CONFIGURATION DES OFFRES ----------

export const OFFER_CONFIG: Record<EmailOffer, OfferConfig> = {
  exchange: {
    id: "exchange",
    label: "Exchange",
    color: "#F59E0B",
    icon: "🟠",
    quota: 50,
    features: ["calendar", "mfa", "resources", "audit", "delegation", "aliases", "archiving"],
  },
  "email-pro": {
    id: "email-pro",
    label: "Email Pro",
    color: "#3B82F6",
    icon: "🔵",
    quota: 10,
    features: ["aliases", "signature", "delegation", "archiving"],
  },
  zimbra: {
    id: "zimbra",
    label: "Zimbra",
    color: "#8B5CF6",
    icon: "🟣",
    quota: 10,
    features: ["collaboration", "webmail", "aliases", "calendar"],
  },
  "mx-plan": {
    id: "mx-plan",
    label: "MX Plan",
    color: "#6B7280",
    icon: "⚪",
    quota: 5,
    features: ["basic"],
  },
};

// ---------- TABS NAV4 (selon NAV3) ----------

export interface TabConfig {
  id: EmailTab;
  labelKey: string;
  offers: EmailOffer[] | "all";
  hasSubTabs: boolean;
}

// NAV3=General → 7 NAV4 tabs
export const GENERAL_TABS_CONFIG: TabConfig[] = [
  { id: "accounts", labelKey: "tabs.accounts", offers: "all", hasSubTabs: false },
  { id: "redirections", labelKey: "tabs.redirections", offers: "all", hasSubTabs: false },
  { id: "responders", labelKey: "tabs.responders", offers: "all", hasSubTabs: false },
  { id: "lists", labelKey: "tabs.lists", offers: ["mx-plan", "email-pro", "exchange"], hasSubTabs: false },
  { id: "security", labelKey: "tabs.security", offers: ["email-pro", "exchange", "zimbra"], hasSubTabs: true },
  { id: "advanced", labelKey: "tabs.advanced", offers: ["exchange"], hasSubTabs: true },
  { id: "tasks", labelKey: "tabs.tasks", offers: "all", hasSubTabs: false },
];

// NAV3=Packs → 3 NAV4 tabs
export const PACKS_TABS_CONFIG: TabConfig[] = [
  { id: "packs", labelKey: "tabs.packs", offers: "all", hasSubTabs: false },
  { id: "alacarte", labelKey: "tabs.alacarte", offers: "all", hasSubTabs: false },
  { id: "history", labelKey: "tabs.history", offers: "all", hasSubTabs: false },
];

// Legacy: all tabs (for backwards compatibility)
export const TABS_CONFIG: TabConfig[] = [
  ...GENERAL_TABS_CONFIG,
  { id: "licenses", labelKey: "tabs.licenses", offers: "all", hasSubTabs: true },
];

// ---------- SOUS-TABS NAV4 ----------

export interface SubTabConfig {
  id: string;
  parentTab: EmailTab;
  labelKey: string;
}

export const SUB_TABS_CONFIG: SubTabConfig[] = [
  // Security
  { id: "dns", parentTab: "security", labelKey: "security.dns" },
  { id: "antispam", parentTab: "security", labelKey: "security.antispam" },
  { id: "signature", parentTab: "security", labelKey: "security.signature" },
  // Advanced
  { id: "resources", parentTab: "advanced", labelKey: "advanced.resources" },
  { id: "contacts", parentTab: "advanced", labelKey: "advanced.contacts" },
  { id: "audit", parentTab: "advanced", labelKey: "advanced.audit" },
  { id: "devices", parentTab: "advanced", labelKey: "advanced.devices" },
  // Licenses
  { id: "packs", parentTab: "licenses", labelKey: "licenses.packs" },
  { id: "alacarte", parentTab: "licenses", labelKey: "licenses.alacarte" },
  { id: "history", parentTab: "licenses", labelKey: "licenses.history" },
];

// ---------- ACTIONS PAR OFFRE ----------

export type AccountAction = "edit" | "password" | "alias" | "delegation" | "mfa" | "archive" | "calendar" | "upgrade" | "downgrade" | "changePack" | "delete";

export const ACTIONS_BY_OFFER: Record<EmailOffer, AccountAction[]> = {
  exchange: ["edit", "password", "alias", "delegation", "mfa", "archive", "calendar", "downgrade", "changePack", "delete"],
  "email-pro": ["edit", "password", "alias", "delegation", "archive", "upgrade", "downgrade", "changePack", "delete"],
  zimbra: ["edit", "password", "alias", "calendar", "upgrade", "downgrade", "changePack", "delete"],
  "mx-plan": ["edit", "password", "upgrade", "changePack", "delete"],
};

// ---------- STATUTS ----------

export const STATUS_CONFIG = {
  ok: { label: "Actif", color: "#10B981", icon: "✓" },
  suspended: { label: "Suspendu", color: "#EF4444", icon: "⏸" },
  pending: { label: "En attente", color: "#F59E0B", icon: "⏳" },
  deleting: { label: "Suppression", color: "#6B7280", icon: "🗑" },
};

// ---------- DEFAULT VALUES ----------

export const DEFAULT_VIEW_MODE = "domain" as const;
export const DEFAULT_GENERAL_TAB = "accounts" as const;
export const DEFAULT_PACKS_TAB = "packs" as const;
export const DEFAULT_TAB = DEFAULT_GENERAL_TAB;

export const DEFAULT_SUB_TABS: Record<EmailTab, string> = {
  // General tabs
  accounts: "",
  redirections: "",
  responders: "",
  lists: "",
  security: "dns",
  advanced: "resources",
  tasks: "",
  // Packs tabs
  packs: "",
  alacarte: "",
  history: "",
  // Legacy
  licenses: "packs",
};
