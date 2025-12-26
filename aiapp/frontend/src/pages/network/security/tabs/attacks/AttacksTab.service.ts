// ============================================================
// SECURITY Attacks Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { SecurityAttack } from "../../security.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("fr-FR");
}

function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

function getAttackIcon(ongoing: boolean): string {
  return ongoing ? "⚠️" : "✅";
}

// ==================== API CALLS ====================

async function getAttacks(ipBlock: string): Promise<SecurityAttack[]> {
  const ids = await ovhGet<number[]>(
    `/ip/${encodeURIComponent(ipBlock)}/mitigation`
  ).catch(() => []);

  const attacks: SecurityAttack[] = [];
  for (const id of ids) {
    const mitig = await ovhGet<{ ipOnMitigation: string; state: string }>(
      `/ip/${encodeURIComponent(ipBlock)}/mitigation/${id}`
    ).catch(() => null);

    if (mitig) {
      attacks.push({
        id: String(id),
        ipAttack: mitig.ipOnMitigation,
        type: "DDoS",
        startDate: new Date().toISOString(),
        endDate: mitig.state === "ok" ? new Date().toISOString() : undefined,
      });
    }
  }
  return attacks;
}

// ==================== SERVICE OBJECT ====================

export const securityAttacksService = {
  getAttacks,
  formatDate,
  formatDateShort,
  getAttackIcon,
};
