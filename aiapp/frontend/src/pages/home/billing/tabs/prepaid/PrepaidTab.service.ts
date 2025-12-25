// ============================================================
// PREPAID TAB SERVICE - Service ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { ovhGet } from "../../../../../services/api";

// ============ TYPES ============

export interface OvhAccount {
  alertThreshold?: number;
  balance: { currencyCode: string; text: string; value: number };
  canBeCredited: boolean;
  isActive: boolean;
  lastUpdate: string;
  openDate: string;
}

export interface OvhAccountMovement {
  movementId: number;
  amount: { currencyCode: string; text: string; value: number };
  balance: { currencyCode: string; text: string; value: number };
  date: string;
  description: string;
  operation: string;
  order?: number;
  previousBalance: { currencyCode: string; text: string; value: number };
}

// ============ HELPERS ============

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export function formatAmount(amount: { text: string; value: number }): string {
  return amount.text || `${amount.value.toFixed(2)} €`;
}

// ============ OVH ACCOUNT API ============

export async function getOvhAccountIds(): Promise<string[]> {
  return ovhGet<string[]>("/me/ovhAccount");
}

export async function getOvhAccount(ovhAccountId: string): Promise<OvhAccount> {
  return ovhGet<OvhAccount>(`/me/ovhAccount/${encodeURIComponent(ovhAccountId)}`);
}

export async function getOvhAccountMovementIds(ovhAccountId: string, options?: { "date.from"?: string; "date.to"?: string }): Promise<number[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return ovhGet<number[]>(`/me/ovhAccount/${encodeURIComponent(ovhAccountId)}/movements${query}`);
}

export async function getOvhAccountMovement(ovhAccountId: string, movementId: number): Promise<OvhAccountMovement> {
  return ovhGet<OvhAccountMovement>(`/me/ovhAccount/${encodeURIComponent(ovhAccountId)}/movements/${movementId}`);
}

export async function getOvhAccountMovements(ovhAccountId: string, options?: { "date.from"?: string; "date.to"?: string }): Promise<OvhAccountMovement[]> {
  const movementIds = await getOvhAccountMovementIds(ovhAccountId, options);
  const movements = await Promise.all(
    movementIds.map((id) => getOvhAccountMovement(ovhAccountId, id).catch(() => null))
  );
  return movements.filter((m): m is OvhAccountMovement => m !== null).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
