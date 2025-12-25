// ============================================================
// VOUCHERS TAB SERVICE - Service ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { ovhGet } from "../../../../../services/api";

// ============ TYPES ============

export interface Voucher {
  balance: { currencyCode: string; text: string; value: number };
  bill?: string;
  creationDate: string;
  expirationDate: string;
  lastUpdate: string;
  productId?: string;
  usedAmount: { currencyCode: string; text: string; value: number };
  validity: string;
  voucherAccount: string;
}

// ============ HELPERS ============

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export function formatAmount(amount: { text: string; value: number }): string {
  return amount.text || `${amount.value.toFixed(2)} €`;
}

// ============ VOUCHERS API ============

export async function getVoucherAccountIds(): Promise<string[]> {
  return ovhGet<string[]>("/me/voucherAccount");
}

export async function getVoucherAccount(voucherId: string): Promise<Voucher> {
  return ovhGet<Voucher>(`/me/voucherAccount/${encodeURIComponent(voucherId)}`);
}

export async function getVouchers(): Promise<Voucher[]> {
  const ids = await getVoucherAccountIds();
  const vouchers = await Promise.all(ids.map((id) => getVoucherAccount(id).catch(() => null)));
  return vouchers.filter((v): v is Voucher => v !== null);
}

// ============ ALIAS ============

export async function getVoucherAccounts(): Promise<Voucher[]> {
  return getVouchers();
}
