// ============================================================
// PAYMENTS TAB SERVICE - Service ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { ovhGet } from "../../../../../services/api";

// ============ CONSTANTES ============

export const MIN_YEAR = 2020;
export const BATCH_SIZE = 10;
export const VALID_WINDOW_SIZES = [1, 2, 3, 4, 6, 12];

// ============ TYPES API ============

export interface Payment {
  paymentId: string;
  date: string;
  amount: { currencyCode: string; text: string; value: number };
  paymentType: string;
  status: "PAID" | "PENDING" | "CANCELLED" | "FAILED";
  billId?: string;
  orderId?: number;
}

// ============ HELPERS PÉRIODE ============

export function getWindowSizeFromRange(monthCount: number): number {
  for (let i = VALID_WINDOW_SIZES.length - 1; i >= 0; i--) {
    if (VALID_WINDOW_SIZES[i] <= monthCount) return VALID_WINDOW_SIZES[i];
  }
  return 1;
}

export function getBlocks(windowSize: number): [number, number][] {
  const blocks: [number, number][] = [];
  for (let i = 0; i < 12; i += windowSize) {
    blocks.push([i, Math.min(i + windowSize - 1, 11)]);
  }
  return blocks;
}

export function getDateRange(year: number, startMonth: number, endMonth: number): { from: string; to: string } {
  const from = `${year}-${String(startMonth + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(year, endMonth + 1, 0).getDate();
  const to = `${year}-${String(endMonth + 1).padStart(2, "0")}-${lastDay}`;
  return { from, to };
}

// ============ HELPERS FORMATAGE ============

export const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export const formatAmount = (v: number, c: string) => {
  if (!c || c.toLowerCase() === "points") return `${v.toLocaleString("fr-FR")} pts`;
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: c }).format(v);
  } catch {
    return `${v.toLocaleString("fr-FR")} ${c}`;
  }
};

// ============ API ============

export async function getPaymentIds(options?: { "date.from"?: string; "date.to"?: string }): Promise<string[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return ovhGet<string[]>(`/me/payment${query}`);
}

export async function getPayment(paymentId: string): Promise<Payment> {
  return ovhGet<Payment>(`/me/payment/${encodeURIComponent(paymentId)}`);
}

export async function getPayments(options?: { "date.from"?: string; "date.to"?: string; limit?: number }): Promise<Payment[]> {
  const paymentIds = await getPaymentIds(options);
  const idsToFetch = options?.limit ? paymentIds.slice(0, options.limit) : paymentIds;
  const payments: Payment[] = [];
  for (let i = 0; i < idsToFetch.length; i += BATCH_SIZE) {
    const batch = idsToFetch.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map((id) => getPayment(id).catch(() => null)));
    payments.push(...results.filter((p): p is Payment => p !== null));
  }
  return payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
