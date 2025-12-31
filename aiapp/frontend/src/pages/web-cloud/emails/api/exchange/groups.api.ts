// ============================================================
// API EXCHANGE - Groupes de distribution
// Endpoints: /email/exchange/{org}/service/{service}/mailingList/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/exchange";

// ---------- TYPES ----------

export interface ExchangeGroup {
  mailingListAddress: string;
  displayName?: string;
  hiddenFromGAL: boolean;
  joinRestriction: "open" | "closed" | "approvalRequired";
  departRestriction: "open" | "closed";
  maxReceiveSize?: number;
  maxSendSize?: number;
  senderAuthentification: boolean;
  state: "ok" | "deleting";
  taskPendingId?: number;
}

export interface CreateGroupParams {
  mailingListAddress: string;
  displayName?: string;
  hiddenFromGAL?: boolean;
  joinRestriction?: "open" | "closed" | "approvalRequired";
  departRestriction?: "open" | "closed";
  senderAuthentification?: boolean;
}

// ---------- HELPERS ----------

function getServicePath(serviceId: string): string {
  const [org, service] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE}/${org}/service/${service}`;
}

// ---------- API CALLS ----------

export async function list(domain: string, serviceId?: string): Promise<ExchangeGroup[]> {
  if (!serviceId) return [];

  const basePath = getServicePath(serviceId);
  const addresses = await apiFetch<string[]>(`${basePath}/mailingList`);

  const groups = await Promise.all(
    addresses.map(addr => get(domain, addr, serviceId))
  );

  return groups;
}

export async function get(domain: string, id: string, serviceId?: string): Promise<ExchangeGroup> {
  if (!serviceId) throw new Error("serviceId required");
  const basePath = getServicePath(serviceId);
  return apiFetch<ExchangeGroup>(`${basePath}/mailingList/${id}`);
}

export async function create(domain: string, data: CreateGroupParams, serviceId?: string): Promise<ExchangeGroup> {
  if (!serviceId) throw new Error("serviceId required");
  const basePath = getServicePath(serviceId);
  return apiFetch<ExchangeGroup>(`${basePath}/mailingList`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function remove(domain: string, id: string, serviceId?: string): Promise<void> {
  if (!serviceId) throw new Error("serviceId required");
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/mailingList/${id}`, {
    method: "DELETE",
  });
}

export { remove as delete };

// ---------- MEMBERS ----------

export async function getMembers(domain: string, id: string, serviceId?: string): Promise<string[]> {
  if (!serviceId) throw new Error("serviceId required");
  const basePath = getServicePath(serviceId);

  const members = await apiFetch<{ memberContactId?: number; memberAccountId?: number }[]>(
    `${basePath}/mailingList/${id}/member/contact`
  );

  // Simplified: return member IDs as strings
  return members.map(m => String(m.memberContactId || m.memberAccountId));
}

export async function addMember(domain: string, id: string, email: string, serviceId?: string): Promise<void> {
  if (!serviceId) throw new Error("serviceId required");
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/mailingList/${id}/member/account`, {
    method: "POST",
    body: JSON.stringify({ memberAccountId: email }),
  });
}

export async function removeMember(domain: string, id: string, email: string, serviceId?: string): Promise<void> {
  if (!serviceId) throw new Error("serviceId required");
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/mailingList/${id}/member/account/${email}`, {
    method: "DELETE",
  });
}
