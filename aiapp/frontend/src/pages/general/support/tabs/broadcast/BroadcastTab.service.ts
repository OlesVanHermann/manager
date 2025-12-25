// ============================================================
// BROADCAST TAB SERVICE - Marketing & Routing Preferences
// NAV1: general / NAV2: support / NAV3: broadcast
// ISOLÉ - Aucune dépendance vers d'autres tabs
// ============================================================

import { ovhDirectFetch } from "../../../../../services/api";
import type { MarketingPreferences, NotificationRouting, NotificationRoutingRule, NotificationReference } from "../../support.types";

const V2_BASE = "https://www.ovh.com/engine/apiv2";

// ============ RE-EXPORT TYPES ============

export type { MarketingPreferences, NotificationRouting, NotificationRoutingRule, NotificationReference };

// ============ CONSTANTS ============

export const SUPPORT_URLS = {
  comparison: "https://www.ovhcloud.com/fr/support-levels/",
  contact: "https://www.ovhcloud.com/fr/contact/",
  helpCenter: "https://help.ovhcloud.com/csm",
  createTicket: "https://help.ovhcloud.com/csm?id=csm_get_help",
  communicationSettings: "https://www.ovh.com/manager/#/dedicated/useraccount/emails",
};

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

// ============ MARKETING PREFERENCES API ============

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

// ============ ROUTING RULES API ============

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

export async function updateRoutingRule(
  id: string,
  data: {
    name: string;
    active: boolean;
    rules: NotificationRoutingRule[];
  }
): Promise<NotificationRouting> {
  return v2Fetch<NotificationRouting>("PUT", `/notification/routing/${id}`, data);
}

export async function deleteRoutingRule(id: string): Promise<void> {
  await v2Fetch("DELETE", `/notification/routing/${id}`);
}

// ============ NOTIFICATION REFERENCE API ============

export async function getNotificationReference(): Promise<NotificationReference> {
  try {
    return await v2Fetch<NotificationReference>("GET", "/notification/reference");
  } catch {
    return { categories: [], priorities: [] };
  }
}
