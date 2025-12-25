// ============================================================
// SECURITY Attacks Tab - Service isolé
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { SecurityAttack } from "../../security.types";

export async function getAttacks(ipBlock: string): Promise<SecurityAttack[]> {
  const ids = await ovhGet<number[]>(`/ip/${encodeURIComponent(ipBlock)}/mitigation`).catch(() => []);
  const attacks: SecurityAttack[] = [];
  for (const id of ids) {
    const mitig = await ovhGet<{ ipOnMitigation: string; state: string }>(`/ip/${encodeURIComponent(ipBlock)}/mitigation/${id}`).catch(() => null);
    if (mitig) attacks.push({ id: String(id), ipAttack: mitig.ipOnMitigation, type: "DDoS", startDate: new Date().toISOString(), endDate: mitig.state === "ok" ? new Date().toISOString() : undefined });
  }
  return attacks;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("fr-FR");
}

export const attacksService = { getAttacks, formatDate };
