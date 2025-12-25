// ============================================================
// INVOICES TAB SERVICE - Service ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { ovhGet } from "../../../../../services/api";

// ============ CONSTANTES ============

export const MIN_YEAR = 2020;
export const BATCH_SIZE = 10;
export const VALID_WINDOW_SIZES = [1, 2, 3, 4, 6, 12];

// ============ TYPES API ============

export interface Bill {
  billId: string;
  date: string;
  orderId: number;
  password: string;
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

export function getLastCompleteBlock(month: number, windowSize: number): [number, number] | null {
  const blocks = getBlocks(windowSize);
  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i][1] <= month) return blocks[i];
  }
  return null;
}

export function calculateAnchor(currentMonth: number, windowSize: number): { startMonth: number; endMonth: number } {
  const blocks = getBlocks(windowSize);
  const currentBlockIndex = blocks.findIndex(([s, e]) => s <= currentMonth && currentMonth <= e);
  const currentBlock = blocks[currentBlockIndex];
  if (currentBlock[1] <= currentMonth) return { startMonth: currentBlock[0], endMonth: currentBlock[1] };
  if (currentBlockIndex > 0) {
    const prevBlock = blocks[currentBlockIndex - 1];
    return { startMonth: prevBlock[0], endMonth: currentMonth };
  }
  return { startMonth: 0, endMonth: currentMonth };
}

export function getDateRange(year: number, startMonth: number, endMonth: number): { from: string; to: string } {
  const from = `${year}-${String(startMonth + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(year, endMonth + 1, 0).getDate();
  const to = `${year}-${String(endMonth + 1).padStart(2, "0")}-${lastDay}`;
  return { from, to };
}

// ============ HELPERS FORMATAGE ============

export const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export const formatDateISO = (d: string) => new Date(d).toISOString().split("T")[0];

export const formatAmount = (v: number, c: string) => {
  if (!c || c.toLowerCase() === "points") return `${v.toLocaleString("fr-FR")} pts`;
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: c }).format(v);
  } catch {
    return `${v.toLocaleString("fr-FR")} ${c}`;
  }
};

// ============ API ============

export async function getBillIds(options?: { "date.from"?: string; "date.to"?: string }): Promise<string[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return ovhGet<string[]>(`/me/bill${query}`);
}

export async function getBill(billId: string): Promise<Bill> {
  return ovhGet<Bill>(`/me/bill/${encodeURIComponent(billId)}`);
}

export async function getBills(options?: { "date.from"?: string; "date.to"?: string; limit?: number }): Promise<Bill[]> {
  const billIds = await getBillIds(options);
  const idsToFetch = options?.limit ? billIds.slice(0, options.limit) : billIds;
  const bills: Bill[] = [];
  for (let i = 0; i < idsToFetch.length; i += BATCH_SIZE) {
    const batch = idsToFetch.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map((id) => getBill(id).catch(() => null)));
    bills.push(...results.filter((b): b is Bill => b !== null));
  }
  return bills.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
