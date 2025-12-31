// ============================================================
// API DISPATCHER - Routes vers l'implémentation par offre
// ============================================================

import { EmailOffer } from "../types";

// Import des API par offre
import * as mxplan from "./mxplan";
import * as exchange from "./exchange";
import * as emailpro from "./emailpro";
import * as zimbra from "./zimbra";

// ---------- TYPES API COMMUNS ----------

export interface AccountsApi {
  list: (params: { domain?: string; serviceId?: string }) => Promise<any[]>;
  get: (id: string) => Promise<any>;
  create: (data: any) => Promise<any>;
  update: (id: string, data: any) => Promise<any>;
  delete: (id: string) => Promise<void>;
  changePassword: (id: string, password: string) => Promise<void>;
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

// ---------- DISPATCHER ----------

const API_MAP = {
  "mx-plan": mxplan,
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

// ---------- EXPORTS ----------

export { mxplan, exchange, emailpro, zimbra };
