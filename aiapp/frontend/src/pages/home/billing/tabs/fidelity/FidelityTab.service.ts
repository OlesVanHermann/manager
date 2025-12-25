// ============================================================
// FIDELITY TAB SERVICE - Service ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { ovhGet } from "../../../../../services/api";

// ============ TYPES ============

export interface FidelityAccount {
  balance: number;
  canBeCredited: boolean;
  lastUpdate: string;
  openDate: string;
}

export interface FidelityMovement {
  movementId: number;
  amount: number;
  balance: number;
  date: string;
  description: string;
  operation: string;
  order?: number;
  previousBalance: number;
}

// ============ HELPERS ============

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export function formatPoints(points: number): string {
  return points.toLocaleString("fr-FR");
}

// ============ FIDELITY API ============

export async function getFidelityAccount(): Promise<FidelityAccount> {
  return ovhGet<FidelityAccount>("/me/fidelityAccount");
}

export async function getFidelityMovementIds(options?: { "date.from"?: string; "date.to"?: string }): Promise<number[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return ovhGet<number[]>(`/me/fidelityAccount/movements${query}`);
}

export async function getFidelityMovement(movementId: number): Promise<FidelityMovement> {
  return ovhGet<FidelityMovement>(`/me/fidelityAccount/movements/${movementId}`);
}

export async function getFidelityMovements(options?: { "date.from"?: string; "date.to"?: string }): Promise<FidelityMovement[]> {
  const ids = await getFidelityMovementIds(options);
  const movements = await Promise.all(ids.map((id) => getFidelityMovement(id).catch(() => null)));
  return movements.filter((m): m is FidelityMovement => m !== null).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
