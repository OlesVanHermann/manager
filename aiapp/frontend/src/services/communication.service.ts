// ============================================================
// COMMUNICATION SERVICE - APIs v2 Notification
// Endpoints: /notification/contactMean, /notification/routing, /notification/history
// ============================================================

import { ovhDirectFetch } from "./api";

// Base URL pour API v2 via engine
const V2_BASE = "https://www.ovh.com/engine/apiv2";

// ============ TYPES ============

export type ContactMeanStatus = "DISABLED" | "ERROR" | "VALID" | "TO_VALIDATE";
export type ContactMeanType = "EMAIL";

export interface ContactMean {
  id: string;
  createdAt: string;
  default: boolean;
  description: string | null;
  email: string | null;
  error: string | null;
  status: ContactMeanStatus;
  type: ContactMeanType;
}

export interface NotificationRouting {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  rules: NotificationRoutingRule[];
}

export interface NotificationRoutingRule {
  continue: boolean;
  condition: {
    category: string[];
    priority: string[];
  };
  contactMeans: { id: string; email: string; status: string }[];
}

export interface NotificationReference {
  categories: { id: string; name: string }[];
  priorities: { id: string; name: string }[];
}

export interface NotificationHistory {
  id: string;
  createdAt: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  contentHtml?: string;
  contentText?: string;
}

// ============ API V2 FETCH ============

async function v2Fetch<T>(method: string, path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${V2_BASE}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    throw new Error("Non authentifié");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============ CONTACT MEANS ============

export async function getContactMeans(): Promise<ContactMean[]> {
  try {
    return await v2Fetch<ContactMean[]>("GET", "/notification/contactMean");
  } catch {
    return [];
  }
}

export async function getContactMean(id: string): Promise<ContactMean> {
  return v2Fetch<ContactMean>("GET", `/notification/contactMean/${id}`);
}

export async function createContactMean(data: { email: string; description?: string }): Promise<ContactMean> {
  return v2Fetch<ContactMean>("POST", "/notification/contactMean", {
    ...data,
    type: "EMAIL",
  });
}

export async function deleteContactMean(id: string): Promise<void> {
  await v2Fetch("DELETE", `/notification/contactMean/${id}`);
}

// ============ ROUTING RULES ============

export async function getRoutingRules(): Promise<NotificationRouting[]> {
  try {
    return await v2Fetch<NotificationRouting[]>("GET", "/notification/routing");
  } catch {
    return [];
  }
}

export async function getRoutingRule(id: string): Promise<NotificationRouting> {
  return v2Fetch<NotificationRouting>("GET", `/notification/routing/${id}`);
}

export async function createRoutingRule(data: {
  name: string;
  active: boolean;
  rules: NotificationRoutingRule[];
}): Promise<NotificationRouting> {
  return v2Fetch<NotificationRouting>("POST", "/notification/routing", data);
}

export async function updateRoutingRule(id: string, data: {
  name: string;
  active: boolean;
  rules: NotificationRoutingRule[];
}): Promise<NotificationRouting> {
  return v2Fetch<NotificationRouting>("PUT", `/notification/routing/${id}`, data);
}

export async function deleteRoutingRule(id: string): Promise<void> {
  await v2Fetch("DELETE", `/notification/routing/${id}`);
}

// ============ NOTIFICATION REFERENCE ============

export async function getNotificationReference(): Promise<NotificationReference> {
  try {
    return await v2Fetch<NotificationReference>("GET", "/notification/reference");
  } catch {
    return { categories: [], priorities: [] };
  }
}

// ============ NOTIFICATION HISTORY ============

export async function getNotificationHistory(limit = 20): Promise<NotificationHistory[]> {
  try {
    // L'API history peut nécessiter des paramètres de pagination
    const data = await v2Fetch<NotificationHistory[]>("GET", `/notification/history?size=${limit}`);
    return data;
  } catch {
    return [];
  }
}

export async function getNotification(id: string): Promise<NotificationHistory> {
  return v2Fetch<NotificationHistory>("GET", `/notification/history/${id}`);
}

// ============ MARKETING PREFERENCES (via API v6) ============

export interface MarketingPreferences {
  email: boolean;
  phone: boolean;
  sms: boolean;
  fax: boolean;
}

export async function getMarketingPreferences(): Promise<MarketingPreferences> {
  try {
    const data = await ovhDirectFetch<{ email: number; phone: number; sms: number; fax: number }>("GET", "/me/marketing");
    return {
      email: data.email === 1,
      phone: data.phone === 1,
      sms: data.sms === 1,
      fax: data.fax === 1,
    };
  } catch {
    return { email: false, phone: false, sms: false, fax: false };
  }
}

export async function updateMarketingPreferences(prefs: MarketingPreferences): Promise<void> {
  await ovhDirectFetch("PUT", "/me/marketing", {
    body: {
      email: prefs.email ? 1 : 0,
      phone: prefs.phone ? 1 : 0,
      sms: prefs.sms ? 1 : 0,
      fax: prefs.fax ? 1 : 0,
    },
  });
}
