import type { OvhCredentials } from "../types/auth.types";

const API_BASE = "/api/ovh";

// ============ TYPES ============

export interface SupportTicket {
  ticketId: number;
  ticketNumber: number;
  serviceName?: string;
  subject: string;
  state: "closed" | "open" | "unknown";
  type: "assistance" | "billing" | "incident";
  creationDate: string;
  lastMessageFrom: "customer" | "support";
  updateDate: string;
  score?: string;
}

export interface TicketMessage {
  messageId: string;
  body: string;
  creationDate: string;
  from: "customer" | "support";
  updateDate: string;
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

// ============ TICKETS ============

export async function getTicketIds(credentials: OvhCredentials): Promise<number[]> {
  return ovhRequest<number[]>(credentials, "GET", "/support/tickets");
}

export async function getTicket(credentials: OvhCredentials, ticketId: number): Promise<SupportTicket> {
  return ovhRequest<SupportTicket>(credentials, "GET", `/support/tickets/${ticketId}`);
}

export async function getTickets(credentials: OvhCredentials, filter?: "open" | "closed" | "all"): Promise<SupportTicket[]> {
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
  
  return filtered.sort((a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime());
}

export async function getTicketMessages(credentials: OvhCredentials, ticketId: number): Promise<TicketMessage[]> {
  return ovhRequest<TicketMessage[]>(credentials, "GET", `/support/tickets/${ticketId}/messages`);
}
