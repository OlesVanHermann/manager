// ============================================================
// REFUNDS TAB SERVICE - Service ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { ovhGet } from "../../../../../services/api";

// ============ CONSTANTES ============

export const MIN_YEAR = 2020;
export const BATCH_SIZE = 10;
export const VALID_WINDOW_SIZES = [1, 2, 3, 4, 6, 12];

// ============ TYPES API ============

export interface Refund {
  refundId: string;
  date: string;
  orderId?: number;
  originalBillId?: string;
  pdfUrl: string;
  priceWithTax: { currencyCode: string; text: string; value: number };
  priceWithoutTax: { currencyCode: string; text: string; value: number };
  tax: { currencyCode: string; text: string; value: number };
  url: string;
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

export async function getRefundIds(options?: { "date.from"?: string; "date.to"?: string }): Promise<string[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return ovhGet<string[]>(`/me/refund${query}`);
}

export async function getRefund(refundId: string): Promise<Refund> {
  return ovhGet<Refund>(`/me/refund/${encodeURIComponent(refundId)}`);
}

export async function getRefunds(options?: { "date.from"?: string; "date.to"?: string; limit?: number }): Promise<Refund[]> {
  const refundIds = await getRefundIds(options);
  const idsToFetch = options?.limit ? refundIds.slice(0, options.limit) : refundIds;
  const refunds: Refund[] = [];
  for (let i = 0; i < idsToFetch.length; i += BATCH_SIZE) {
    const batch = idsToFetch.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map((id) => getRefund(id).catch(() => null)));
    refunds.push(...results.filter((r): r is Refund => r !== null));
  }
  return refunds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
