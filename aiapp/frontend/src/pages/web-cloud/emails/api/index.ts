// ============================================================
// API DISPATCHER - Routes vers l'implémentation par offre
// ============================================================

import { EmailOffer } from "../types";

// Import des API par offre
import * as mxplan from "./mxplan";           // MXPlan Legacy (/email/domain)
import * as mxplanModern from "./mxplan-modern"; // MXPlan Modern (/email/mxplan)
import * as exchange from "./exchange";
import * as emailpro from "./emailpro";
import * as zimbra from "./zimbra";

// Import du dispatcher de détection automatique
export * from "./dispatcher";
export {
  detectServiceType,
  getServiceInfo,
  isMXPlan,
  supportsMailingLists,
  supportsResources,
  supportsDevices,
  supportsExternalContacts,
  supportsDisclaimers,
  supportsAccountOrdering,
  clearCache,
  clearCacheFor,
  preloadServiceType,
} from "./dispatcher";
export type { EmailServiceType, EmailServiceInfo } from "./dispatcher";

// ---------- TYPES API COMMUNS ----------

export interface AccountsApi {
  list: (params: { domain?: string; serviceId?: string }) => Promise<any[]>;
  get: (id: string, serviceId?: string) => Promise<any>;
  create: (data: any) => Promise<any>;
  update: (id: string, serviceId: string, data: any) => Promise<any>;
  delete: (id: string, serviceId?: string) => Promise<void>;
  changePassword: (id: string, serviceId: string, password: string) => Promise<void>;
}

export interface RedirectionsApi {
  list: (domain: string) => Promise<any[]>;
  create: (domain: string, data: any) => Promise<any>;
  delete: (domain: string, id: string) => Promise<void>;
}

export interface ListsApi {
  list: (domain: string) => Promise<any[]>;
  get: (domain: string, id: string) => Promise<any>;
  create: (domain: string, data: any) => Promise<any>;
  delete: (domain: string, id: string) => Promise<void>;
  getMembers: (domain: string, id: string) => Promise<string[]>;
  addMember: (domain: string, id: string, email: string) => Promise<void>;
  removeMember: (domain: string, id: string, email: string) => Promise<void>;
}

export interface TasksApi {
  list: (domain: string) => Promise<any[]>;
  get: (domain: string, id: number) => Promise<any>;
}

export interface OrderApi {
  getAccountOptions: (serviceId: string, duration: string) => Promise<any>;
  orderAccounts: (serviceId: string, duration: string, data: any) => Promise<any>;
}

// ---------- DISPATCHER PAR OFFRE ----------

const API_MAP = {
  "mx-plan": mxplan,           // MXPlan Legacy (/email/domain)
  "exchange": exchange,
  "email-pro": emailpro,
  "zimbra": zimbra,
} as const;

export function getApi(offer: EmailOffer) {
  return API_MAP[offer];
}

export function getAccountsApi(offer: EmailOffer): AccountsApi {
  return API_MAP[offer].accounts;
}

export function getRedirectionsApi(offer: EmailOffer): RedirectionsApi {
  return API_MAP[offer].redirections;
}

export function getListsApi(offer: EmailOffer): ListsApi | null {
  const api = API_MAP[offer];
  return "lists" in api ? api.lists : null;
}

export function getTasksApi(offer: EmailOffer): TasksApi {
  return API_MAP[offer].tasks;
}

export function getOrderApi(offer: EmailOffer): OrderApi | null {
  const api = API_MAP[offer];
  return "order" in api ? api.order : null;
}

// ---------- EXPORTS ----------

export { mxplan, mxplanModern, exchange, emailpro, zimbra };

// Alias pour clarté
export { mxplan as mxplanLegacy };  // /email/domain
export { mxplanModern as mxplanNew }; // /email/mxplan
