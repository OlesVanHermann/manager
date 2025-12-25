// ============================================================
// GENERAL TAB SERVICE - Support Tickets
// NAV1: general / NAV2: support / NAV3: general
// ISOLÉ - Aucune dépendance vers d'autres tabs
// ============================================================

import type { OvhCredentials, SupportTicket, TicketMessage } from "../../support.types";

const API_BASE = "/api/ovh";
const STORAGE_KEY = "ovh_credentials";

// ============ RE-EXPORT TYPES ============

export type { SupportTicket, TicketMessage };

// ============ CONSTANTS ============

export const SUPPORT_URLS = {
  comparison: "https://www.ovhcloud.com/fr/support-levels/",
  contact: "https://www.ovhcloud.com/fr/contact/",
  helpCenter: "https://help.ovhcloud.com/csm",
  createTicket: "https://help.ovhcloud.com/csm?id=csm_get_help",
};

// ============ HELPERS ============

export function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============ API REQUEST ============

async function ovhRequest<T>(
  credentials: OvhCredentials,
  method: string,
  path: string
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Ovh-App-Key": credentials.appKey,
    "X-Ovh-App-Secret": credentials.appSecret,
  };

  if (credentials.consumerKey) {
    headers["X-Ovh-Consumer-Key"] = credentials.consumerKey;
  }

  const response = await fetch(url, { method, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============ TICKETS API ============

export async function getTicketIds(credentials: OvhCredentials): Promise<number[]> {
  return ovhRequest<number[]>(credentials, "GET", "/support/tickets");
}

export async function getTicket(credentials: OvhCredentials, ticketId: number): Promise<SupportTicket> {
  return ovhRequest<SupportTicket>(credentials, "GET", `/support/tickets/${ticketId}`);
}

export async function getTickets(
  credentials: OvhCredentials,
  filter?: "open" | "closed" | "all"
): Promise<SupportTicket[]> {
  const ids = await getTicketIds(credentials);
  const tickets = await Promise.all(
    ids.map((id) => getTicket(credentials, id).catch(() => null))
  );

  let filtered = tickets.filter((t): t is SupportTicket => t !== null);

  if (filter === "open") {
    filtered = filtered.filter((t) => t.state === "open");
  } else if (filter === "closed") {
    filtered = filtered.filter((t) => t.state === "closed");
  }

  return filtered.sort(
    (a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()
  );
}

export async function getTicketMessages(
  credentials: OvhCredentials,
  ticketId: number
): Promise<TicketMessage[]> {
  return ovhRequest<TicketMessage[]>(credentials, "GET", `/support/tickets/${ticketId}/messages`);
}
