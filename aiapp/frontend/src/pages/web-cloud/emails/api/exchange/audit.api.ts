// ============================================================
// API EXCHANGE - Audit logs
// Exchange ONLY feature
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/exchange";

// ---------- TYPES ----------

export interface ExchangeAuditLog {
  date: string;
  action: string;
  user: string;
  target?: string;
  targetType?: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

export interface AuditFilter {
  startDate?: string;
  endDate?: string;
  action?: string;
  user?: string;
}

// ---------- HELPERS ----------

function getServicePath(serviceId: string): string {
  const [org, service] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE}/${org}/service/${service}`;
}

// ---------- API CALLS ----------

export async function list(serviceId: string, filter?: AuditFilter): Promise<ExchangeAuditLog[]> {
  const basePath = getServicePath(serviceId);

  // Build query params
  const params = new URLSearchParams();
  if (filter?.startDate) params.append("startDate", filter.startDate);
  if (filter?.endDate) params.append("endDate", filter.endDate);
  if (filter?.action) params.append("action", filter.action);
  if (filter?.user) params.append("user", filter.user);

  const query = params.toString() ? `?${params.toString()}` : "";

  // Note: OVH API may not have a direct audit endpoint
  // This is a placeholder for when such endpoint exists
  try {
    return await apiFetch<ExchangeAuditLog[]>(`${basePath}/audit${query}`);
  } catch {
    // Fallback: return empty array if audit not available
    return [];
  }
}

export async function getActions(serviceId: string): Promise<string[]> {
  // Return list of possible audit actions
  return [
    "account.create",
    "account.delete",
    "account.update",
    "account.changePassword",
    "group.create",
    "group.delete",
    "group.addMember",
    "group.removeMember",
    "resource.create",
    "resource.delete",
    "service.update",
  ];
}

export async function exportCsv(serviceId: string, filter?: AuditFilter): Promise<Blob> {
  const logs = await list(serviceId, filter);

  const headers = ["Date", "Action", "User", "Target", "IP"];
  const rows = logs.map(log => [
    log.date,
    log.action,
    log.user,
    log.target || "",
    log.ip || "",
  ]);

  const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
  return new Blob([csv], { type: "text/csv" });
}
