// ============================================================
// COMMUNICATIONS TAB SERVICE - Service ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { ovhDirectFetch } from "../../../../../services/api";

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

// ============ CONSTANTS ============

export const SUPPORT_URLS = {
  comparison: "https://www.ovhcloud.com/fr/support-levels/",
  contact: "https://www.ovhcloud.com/fr/contact/",
  helpCenter: "https://help.ovhcloud.com/csm",
  createTicket: "https://help.ovhcloud.com/csm?id=csm_get_help",
};

// ============ HELPERS ============

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
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

// ============ CONTACT MEANS API ============

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

// ============ NOTIFICATION HISTORY API ============

export async function getNotificationHistory(limit = 20): Promise<NotificationHistory[]> {
  try {
    const data = await v2Fetch<NotificationHistory[]>("GET", `/notification/history?size=${limit}`);
    return data;
  } catch {
    return [];
  }
}

export async function getNotification(id: string): Promise<NotificationHistory> {
  return v2Fetch<NotificationHistory>("GET", `/notification/history/${id}`);
}
