// ============================================================
// LAST BILL TILE SERVICE - Service ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { ovhGet } from "../../../../services/api";

// ============ TYPES ============

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

// ============ HELPERS ============

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export function formatAmount(amount: { text: string; value: number }): string {
  return amount.text || `${amount.value.toFixed(2)} €`;
}

// ============ BILLS API ============

export async function getLastBill(): Promise<Bill | null> {
  try {
    const billIds = await ovhGet<string[]>("/me/bill");
    if (!billIds || billIds.length === 0) return null;
    return await ovhGet<Bill>(`/me/bill/${encodeURIComponent(billIds[0])}`);
  } catch {
    return null;
  }
}

export async function getBills(options?: { limit?: number }): Promise<Bill[]> {
  try {
    const ids = await ovhGet<string[]>("/me/bill");
    const idsToFetch = options?.limit ? ids.slice(0, options.limit) : ids.slice(0, 5);
    const bills = await Promise.all(idsToFetch.map((id) => ovhGet<Bill>(`/me/bill/${encodeURIComponent(id)}`).catch(() => null)));
    return bills.filter((b): b is Bill => b !== null).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}
