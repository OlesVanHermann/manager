// ============================================================
// HOME SERVICE - Service ISOLÉ pour dashboard
// ============================================================

import { ovhGet, ovh2apiGet } from "../../services/api";

// ============ TYPES ============

export interface ServiceCount {
  type: string;
  count: number;
}

export interface ServiceSummary {
  total: number;
  types: ServiceCount[];
}

export interface Bill {
  billId: string;
  date: string;
  priceWithTax: { currencyCode: string; text: string; value: number };
}

export interface Notification {
  id: string;
  date: string;
  subject: string;
  status: string;
}

// ============ SERVICES SUMMARY ============

export async function getServicesSummary(): Promise<ServiceSummary> {
  try {
    const response = await ovh2apiGet<{ count: number; data: { serviceType: string }[] }>(
      "/billing/services",
      { count: 1000, offset: 0 },
      { skipAuthRedirect: true }
    );
    if (!response?.data) return { total: 0, types: [] };
    
    const typeCounts = new Map<string, number>();
    for (const s of response.data) {
      const type = s.serviceType || "AUTRE";
      typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
    }
    
    return {
      total: response.data.length,
      types: Array.from(typeCounts.entries()).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count),
    };
  } catch {
    return { total: 0, types: [] };
  }
}

// ============ LAST BILL ============

export async function getLastBill(): Promise<Bill | null> {
  try {
    const ids = await ovhGet<string[]>("/me/bill");
    if (!ids?.length) return null;
    return await ovhGet<Bill>(`/me/bill/${encodeURIComponent(ids[0])}`);
  } catch {
    return null;
  }
}

// ============ NOTIFICATIONS ============

export async function getNotifications(): Promise<Notification[]> {
  try {
    return await ovhGet<Notification[]>("/me/notification");
  } catch {
    return [];
  }
}

// ============ BILLS API ============

export async function getBills(options?: { limit?: number }): Promise<Bill[]> {
  try {
    const ids = await ovhGet<string[]>("/me/bill");
    const idsToFetch = options?.limit ? ids.slice(0, options.limit) : ids.slice(0, 10);
    const bills = await Promise.all(idsToFetch.map((id) => ovhGet<Bill>(`/me/bill/${encodeURIComponent(id)}`).catch(() => null)));
    return bills.filter((b): b is Bill => b !== null);
  } catch {
    return [];
  }
}

// ============ DEBT ACCOUNT API ============

export interface DebtAccount {
  active: boolean;
  dueAmount: { currencyCode: string; text: string; value: number };
  pendingAmount: { currencyCode: string; text: string; value: number };
  todoAmount: { currencyCode: string; text: string; value: number };
  unmaturedAmount: { currencyCode: string; text: string; value: number };
}

export async function getDebtAccount(): Promise<DebtAccount | null> {
  try {
    return await ovhGet<DebtAccount>("/me/debtAccount");
  } catch {
    return null;
  }
}

// ============ DASHBOARD ALERTS API ============

export interface DashboardAlert {
  id: string;
  level: "info" | "warning" | "error";
  message: string;
  date: string;
}

export async function getDashboardAlerts(): Promise<DashboardAlert[]> {
  try {
    return await ovhGet<DashboardAlert[]>("/me/notification");
  } catch {
    return [];
  }
}
